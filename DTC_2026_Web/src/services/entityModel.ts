import type { BaseProfile, SiteFeature } from '../types/data'
export const modelViews = [{ id: 'attributes', label: '属性', detail: '有出处的描述' }, { id: 'space', label: '空间', detail: '锚点与来源范围' }, { id: 'relations', label: '关系', detail: '具名设施与组织' }, { id: 'evidence', label: '证据', detail: '字段、来源与版本' }] as const
export type ModelViewId = typeof modelViews[number]['id']
/** 展示与下载共用一个模型，全部字段直接引用已审核快照。 */
export function createEntityModel(profile: BaseProfile, site: SiteFeature, versions: Record<string, string>) {
  return {
    schema_version: 'dtc-level1-entity-model-1', scope: 'LEVEL1_PUBLIC_INFRASTRUCTURE_DESCRIPTION',
    entity: { id: profile.site_id, source_record_no: profile.source_record_no, name: profile.canonical_name, source_name: profile.source_name, identity_relation: profile.identity_relation },
    properties: profile.profile_facts.filter(fact => !fact.field.startsWith('description_')),
    spatial: { overview: site.geometry, semantics: site.properties.coordinate_semantics, evidence: profile.location_evidence, extent: profile.spatial_extent },
    relations: profile.components, provenance: profile.evidence_documents, review: profile.review_record, source_versions: versions,
  }
}
