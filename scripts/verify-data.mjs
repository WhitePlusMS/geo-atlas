import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import Papa from 'papaparse'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const readJson = (file) => JSON.parse(readFileSync(resolve(dataRoot, file), 'utf8'))
// 按 CSV 记录解析，正文中的换行不能计作额外记录。
const readCsv = (file) => {
  const result = Papa.parse(readFileSync(resolve(dataRoot, file), 'utf8'), { header: true, skipEmptyLines: true })
  if (result.errors.length) throw new Error(`${file} CSV parsing failed`)
  return result.data
}
const csvRows = (file) => readCsv(file).length
const sites = readJson('sites.geojson')
const meta = readJson('frontend_meta.json')
const registry = readJson('source_registry.json')
const profiles = readJson('profiles.json')

if (sites.type !== 'FeatureCollection' || sites.features.length !== 66) throw new Error('sites.geojson must contain 66 features')
const ids = new Set()
for (const feature of sites.features) {
  const props = feature.properties ?? {}
  if (ids.has(props.site_id)) throw new Error(`duplicate site_id: ${props.site_id}`)
  ids.add(props.site_id)
  if (feature.geometry?.type !== 'Point') throw new Error(`site is not a Point: ${props.site_id}`)
  if (props.coordinate_status !== 'AGENT_VERIFIED_REPRESENTATIVE') throw new Error(`coordinate status failed: ${props.site_id}`)
  if (!props.coordinate_semantics) throw new Error(`coordinate semantics missing: ${props.site_id}`)
  if (!registry.sources?.[props.coordinate_source_id]) throw new Error(`coordinate source missing: ${props.site_id}`)
  const [longitude, latitude] = feature.geometry.coordinates
  if (Number(longitude) !== Number(props.longitude) || Number(latitude) !== Number(props.latitude)) throw new Error(`point parity failed: ${props.site_id}`)
}
// 画像与目录必须一一对应，所有说明和字段来源都必须能回到登记表。
if (profiles.profile_count !== sites.features.length || profiles.profiles?.length !== sites.features.length) throw new Error('profile count failed')
const profileIds = new Set()
const siteById = new Map(sites.features.map((feature) => [feature.properties.site_id, feature]))
const componentIds = new Set()
// 组件位置必须有独立证据；组织关系可以没有几何，不能复制父点补数。
function verifyAnchor(anchor, profile) {
  if (!anchor || !registry.sources[anchor.source_id] || !profile.profile_source_ids.includes(anchor.source_id) || !anchor.source_record_id || !anchor.selection_reason || !anchor.accuracy_note || !/^[a-f0-9]{64}$/.test(anchor.sha256)) throw new Error(`spatial provenance failed: ${profile.site_id}`)
  if (![anchor.longitude, anchor.latitude].every(Number.isFinite) || Math.abs(anchor.longitude) > 180 || Math.abs(anchor.latitude) > 90 || !['Point', 'Polygon', 'MultiPolygon'].includes(anchor.geometry?.type) || !anchor.geometry.coordinates.length) throw new Error(`spatial geometry failed: ${profile.site_id}`)
}
for (const profile of profiles.profiles) {
  if (!ids.has(profile.site_id) || profileIds.has(profile.site_id)) throw new Error(`profile site_id failed: ${profile.site_id}`)
  profileIds.add(profile.site_id)
  if (typeof profile.description_short !== 'string' || profile.description_short.trim().length < 20 || typeof profile.description_long !== 'string' || profile.description_long.trim().length < 40) throw new Error(`profile description failed: ${profile.site_id}`)
  if (!['AGENT_DRAFT', 'FACT_CHECKED', 'APPROVED', 'CHANGES_REQUIRED', 'REJECTED'].includes(profile.review_status)) throw new Error(`profile review status failed: ${profile.site_id}`)
  if (profile.review_status !== 'AGENT_DRAFT' && (!profile.review_record || profile.review_record.reviewer_type !== 'AI_AGENT' || !/^[a-f0-9]{64}$/.test(profile.review_record.input_sha256))) throw new Error(`profile review record failed: ${profile.site_id}`)
  if (profile.review_status === 'CHANGES_REQUIRED' && !profile.review_record.findings.length) throw new Error(`profile review findings missing: ${profile.site_id}`)
  if (profile.review_status === 'APPROVED' && profile.review_record.findings.length) throw new Error(`approved profile still has findings: ${profile.site_id}`)
  if (!Array.isArray(profile.profile_source_ids) || profile.profile_source_ids.length < 2 || profile.profile_source_ids.some((id) => !registry.sources[id])) throw new Error(`profile source failed: ${profile.site_id}`)
  if (!Array.isArray(profile.profile_facts) || profile.profile_facts.length < 6 || profile.profile_facts.some((fact) => !Array.isArray(fact.source_ids) || !fact.source_ids.length || fact.source_ids.some((id) => !registry.sources[id]))) throw new Error(`profile fact source failed: ${profile.site_id}`)
  if (!profile.location_audit || profile.location_audit.main_geometry_promotion_allowed !== false) throw new Error(`profile geometry gate failed: ${profile.site_id}`)
  const location = profile.location_evidence
  const props = siteById.get(profile.site_id).properties
  if (!location || !registry.sources[location.source_id] || !/^[a-f0-9]{64}$/.test(location.sha256) || [location.longitude, location.latitude].some((value) => !Number.isFinite(value)) || location.longitude !== Number(props.longitude) || location.latitude !== Number(props.latitude) || location.source_id !== props.coordinate_source_id) throw new Error(`profile location evidence failed: ${profile.site_id}`)
  const traceability = location.method.startsWith('GIS_') ? 'GIS_SNAPSHOT_TRACEABLE' : location.method.startsWith('OFFICIAL_') ? 'OFFICIAL_MAP_TRACEABLE' : 'LOOKUP_RESPONSE_ARCHIVED'
  if (profile.review_record && profile.review_record.coordinate_traceability !== traceability) throw new Error(`profile location review failed: ${profile.site_id}`)
  if (!profile.evidence_documents?.length || profile.evidence_documents.some((document) => !registry.sources[document.source_id] || !/^[a-f0-9]{64}$/i.test(registry.sources[document.source_id].sha256 ?? '') || document.sha256.toLowerCase() !== registry.sources[document.source_id].sha256.toLowerCase() || !document.section || !document.evidence_path)) throw new Error(`profile archived documents failed: ${profile.site_id}`)
  if (!Array.isArray(profile.components) || profile.components.some((component) => !component.name || !component.relationship || !component.source_ids.length || component.source_ids.some((id) => !profile.evidence_documents.some((document) => document.source_id === id)))) throw new Error(`profile related facilities failed: ${profile.site_id}`)
  if (!Array.isArray(profile.description_sections) || profile.description_sections.length < 3 || profile.description_sections.some((section) => !section.title || section.text.trim().length < 40 || section.fact_level !== 'DERIVED' || !section.source_ids.length || section.source_ids.some((id) => !profile.evidence_documents.some((document) => document.source_id === id))) || profile.description_long !== profile.description_sections.map((section) => `${section.title}\n${section.text}`).join('\n\n')) throw new Error(`profile sections failed: ${profile.site_id}`)
  for (const component of profile.components) {
    if (!component.component_id || componentIds.has(component.component_id)) throw new Error(`component identity failed: ${profile.site_id}`)
    componentIds.add(component.component_id)
    if (component.location !== null) verifyAnchor(component.location, profile)
  }
  if (profile.spatial_extent !== null) verifyAnchor(profile.spatial_extent, profile)
  if (profile.identity_relation === 'UMBRELLA_MULTI_SITE' && profile.components.filter((component) => component.location).length < 2) throw new Error(`multi-site spatial coverage failed: ${profile.site_id}`)
  if (props.coordinate_semantics === 'MULTI_SITE_NO_SINGLE_POINT' && !profile.components.length) throw new Error(`multi-site relations missing: ${profile.site_id}`)
  if (props.coordinate_semantics === 'LOCALITY_ANCHOR' && location.anchor_scope !== 'LOCALITY') throw new Error(`locality scope failed: ${profile.site_id}`)
}
if (meta.profiles?.profile_count !== profiles.profiles.length || meta.profiles.agent_draft_count !== profiles.profiles.filter((profile) => profile.review_status === 'AGENT_DRAFT').length || meta.profiles.approved_count !== profiles.profiles.filter((profile) => profile.review_status === 'APPROVED').length) throw new Error('profile review metrics failed')
const reviewRecords = profiles.profiles.filter((profile) => profile.review_record)
if (meta.review?.reviewed_count !== reviewRecords.length || meta.review.approved_count !== profiles.profiles.filter((profile) => profile.review_status === 'APPROVED').length || meta.review.changes_required_count !== profiles.profiles.filter((profile) => profile.review_status === 'CHANGES_REQUIRED').length || meta.review.gis_snapshot_traceable_count !== profiles.profiles.filter((profile) => profile.location_evidence.method.startsWith('GIS_')).length || meta.review.official_map_traceable_count !== profiles.profiles.filter((profile) => profile.location_evidence.method.startsWith('OFFICIAL_')).length || meta.review.lookup_response_archived_count !== profiles.profiles.filter((profile) => ['OSM_NAMED_FEATURE', 'GNIS_NAMED_FEATURE'].includes(profile.location_evidence.method)).length || meta.review.lookup_record_missing_count !== 0 || meta.review.locality_anchor_count !== sites.features.filter((site) => site.properties.coordinate_semantics === 'LOCALITY_ANCHOR').length || meta.review.multi_site_count !== sites.features.filter((site) => site.properties.coordinate_semantics === 'MULTI_SITE_NO_SINGLE_POINT').length) throw new Error('source review metrics failed')
const components = profiles.profiles.flatMap((profile) => profile.components)
const anchors = [...components.map((component) => component.location), ...profiles.profiles.map((profile) => profile.spatial_extent)].filter(Boolean)
if (meta.spatial_review.component_count !== components.length || meta.spatial_review.component_location_count !== components.filter((component) => component.location).length || meta.spatial_review.area_count !== anchors.filter((anchor) => anchor.geometry.type !== 'Point').length || meta.spatial_review.multi_site_mapped_count !== 16) throw new Error('spatial review metrics failed')
const model = meta.open_system_model
if (!model.scope || model.concepts.length < 4 || !model.source_ids.length || model.source_ids.some((id) => !registry.sources[id]) || model.concepts.some((concept) => !concept.title || !concept.explanation || !concept.implementation || !concept.source_ids.length || concept.source_ids.some((id) => !model.source_ids.includes(id)))) throw new Error('open model source mapping failed')
if (!['crs_table', 'disdi_snapshot', 'site_research', 'location_evidence', 'spatial_evidence'].every((key) => /^[a-f0-9]{64}$/i.test(meta.review_source_hashes[key] ?? ''))) throw new Error('model source versions failed')
// The production build is a Level 1 delivery: a draft rebuild must be reviewed
// before it can advertise readiness. The Python collector never self-approves.
if (meta.level1_ready !== true || meta.review.approved_count !== 66) throw new Error('Level 1 source review is incomplete')
if (meta.site_count !== 66 || meta.display_geometry_count !== 66) throw new Error('frontend_meta site metrics failed')
if (meta.formal_spatial_layer_ready !== false || meta.human_confirmed_geometry_count !== 0) throw new Error('formal spatial boundary failed')
if (csvRows('bsr.csv') !== 1626) throw new Error('bsr row count failed')
const evidence = readCsv('evidence.csv')
if (evidence.length !== meta.evidence_row_count || evidence.some((row) => !registry.sources[row.source_id])) throw new Error('evidence row count/provenance failed')
for (const id of ids) {
  const fields = new Set(evidence.filter((row) => row.entity_id === id).map((row) => row.field_name))
  if (['canonical_name', 'official_locality', 'installation_type', 'public_service_component', 'description_short', 'description_long'].some((field) => !fields.has(field))) throw new Error(`profile field evidence missing: ${id}`)
}
const checksums = readJson('.checksums.json')
for (const file of ['sites.geojson', 'profiles.json', 'bsr.csv', 'evidence.csv', 'source_registry.json', 'frontend_meta.json']) {
  const actual = createHash('sha256').update(readFileSync(resolve(dataRoot, file))).digest('hex')
  if (actual !== checksums[file]) throw new Error(`data checksum failed: ${file}`)
}
console.log(`data verification passed: sites=66, profiles=66, bsr=1626, evidence=${evidence.length}, reviewed=${meta.review.reviewed_count}, approved=${meta.review.approved_count}, coordinate_evidence=${meta.review.gis_snapshot_traceable_count}+${meta.review.official_map_traceable_count}+${meta.review.lookup_response_archived_count}, locality=${meta.review.locality_anchor_count}, multi_site_mapped=${meta.spatial_review.multi_site_mapped_count}, mapped_components=${meta.spatial_review.component_location_count}, areas=${meta.spatial_review.area_count}`)
