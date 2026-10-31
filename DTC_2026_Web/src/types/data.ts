export type CoordinateSemantics =
  | 'OFFICIAL_ADDRESS'
  | 'REPRESENTATIVE_POINT'
  | 'GNIS_APPROX_CENTER'
  | 'GNS_FINDING_POINT'
  | 'MULTI_SITE_NO_SINGLE_POINT'
  | 'EDCA_AGREED_LOCATION'
  | 'LOCALITY_ANCHOR'

export type FactLevel = 'SOURCE_FACT' | 'DERIVED' | 'CANDIDATE' | 'UNKNOWN'

export type LocationMethod = 'GIS_VERTEX_AVERAGE' | 'GIS_TRIANGLE_INTERIOR' | 'GNIS_NAMED_FEATURE' | 'OSM_NAMED_FEATURE' | 'OFFICIAL_MAP_GEOREFERENCE' | 'OFFICIAL_COORDINATE_TABLE'
export type SpatialGeometry = { type: 'Point'; coordinates: [number, number] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

// 每个地理组成对象使用自己的原始定位证据，不能继承父对象坐标。
export interface SpatialAnchor {
  anchor_name: string
  anchor_scope: 'PUBLIC_FOOTPRINT' | 'LOCALITY' | 'COMPONENT' | 'NAMED_FEATURE'
  source_id: string
  source_record_id: string
  record_path: string
  sha256: string
  longitude: number
  latitude: number
  method: LocationMethod
  geometry: SpatialGeometry
  geometry_scope: string
  accuracy_note: string
  selection_reason: string
}

export interface SiteProperties {
  site_id: string
  source_record_no: number
  display_name: string
  source_name: string
  location_label: string
  service_component: string
  us_territory_flag: string
  dod_operated_raw: string
  latitude: string
  longitude: string
  coordinate_status: string
  coordinate_source_id: string
  coordinate_precision: string
  coordinate_semantics: CoordinateSemantics
  contest_record_id: string
  geometry_status: string
  geometry_source_id: string
  geometry_note: string
  source_layer: string
  source_id: string
  source_page: string
  review_status: string
}

export interface SiteFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: SiteProperties
}

export interface SiteCollection {
  type: 'FeatureCollection'
  features: SiteFeature[]
}

export type ProfileReviewStatus = 'AGENT_DRAFT' | 'FACT_CHECKED' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED'

export interface ProfileReviewRecord {
  reviewer: string
  reviewer_type: 'AI_AGENT'
  reviewed_at: string
  input_sha256: string
  source_fields_result: 'MATCHES_ARCHIVED_CRS'
  coordinate_traceability: 'GIS_SNAPSHOT_TRACEABLE' | 'LOOKUP_RESPONSE_ARCHIVED' | 'OFFICIAL_MAP_TRACEABLE' | 'LOOKUP_RECORD_MISSING'
  findings: string[]
}

// 画像保持独立合同，对应 Level1/contracts/base_profile.schema.json。
export interface BaseProfile {
  site_id: string
  source_record_no: number
  source_name: string
  canonical_name: string
  identity_relation: 'EXACT_INSTALLATION' | 'CANONICAL_NAME_VARIANT' | 'PARENT_CHILD_RELATION' | 'UMBRELLA_MULTI_SITE' | 'HOST_NATION_EDCA_LOCATION' | 'ASSOCIATED_FACILITY' | 'UNRESOLVED'
  country_or_region: string
  locality: string
  installation_type: string
  public_service_component: string
  profile_facts: Array<{
    field: string
    value: string
    fact_level: FactLevel
    source_layer: 'OFFICIAL_REFERENCE_CONTEXT' | 'PUBLIC_ENRICHMENT' | 'DERIVED_OUTPUT'
    source_ids: string[]
  }>
  description_short: string
  description_long: string
  description_sections: Array<{ title: string; text: string; fact_level: 'DERIVED'; source_ids: string[] }>
  profile_source_ids: string[]
  evidence_documents: Array<{
    source_id: string
    section: string
    date_note: string
    evidence_path: string
    sha256: string
    verification_status: string
  }>
  components: Array<{ component_id: string; name: string; relationship: string; source_ids: string[]; location: SpatialAnchor | null }>
  spatial_extent: SpatialAnchor | null
  location_evidence: {
    source_id: string
    source_record_id: string
    method: LocationMethod
    anchor_name: string
    anchor_scope: 'PUBLIC_FOOTPRINT' | 'LOCALITY' | 'COMPONENT' | 'NAMED_FEATURE'
    selection_reason: string
    record_path: string
    sha256: string
    longitude: number
    latitude: number
  }
  source_coverage: 'LIMITED' | 'STRONG'
  agent_generated: true
  agent_service: string
  generated_at: string
  review_status: ProfileReviewStatus
  review_record: ProfileReviewRecord | null
  location_audit: {
    identity_status: 'SOURCE_ONLY' | 'PUBLIC_IDENTITY_CONFIRMED' | 'RELATION_CONFIRMED' | 'CONFLICT_FOUND' | 'UNRESOLVED'
    locality_status: 'PUBLIC_LOCALITY_FOUND' | 'REFERENCE_LOCATION_ONLY' | 'UNKNOWN'
    selected_point_candidate_id: string
    coordinate_semantics: CoordinateSemantics | 'UNKNOWN' | 'DISDI_BOUNDARY'
    coordinate_review_status: 'REVIEW_REQUIRED' | 'AGENT_VERIFIED' | 'HUMAN_CONFIRMED' | 'CONFLICT_FOUND' | 'UNRESOLVED'
    main_geometry_promotion_allowed: false
    review_notes: string
  }
  unknown_items: string[]
}

export interface ProfileCollection {
  schema_version: string
  generated_at: string
  profile_count: number
  profiles: BaseProfile[]
}

export interface FrontendMeta {
  generated_at: string
  level1_ready: boolean
  evidence_row_count: number
  site_count: number
  display_geometry_count: number
  human_confirmed_geometry_count: number
  candidate_polygon_count: number
  geometry_no_candidate_count: number
  formal_spatial_layer_ready: boolean
  exact_name_match_count: number
  candidate_review_row_count: number
  bsr: { record_count: number; prv_unit: string; source_id: string; source_sheet: string; as_of_date: string }
  location_review: { agent_verified_representative_point_count: number }
  review: {
    reviewed_count: number
    approved_count: number
    changes_required_count: number
    gis_snapshot_traceable_count: number
    official_map_traceable_count: number
    lookup_record_missing_count: number
    lookup_response_archived_count: number
    locality_anchor_count: number
    multi_site_count: number
  }
  spatial_review: { component_count: number; component_location_count: number; multi_site_mapped_count: number; area_count: number }
  open_system_model: {
    scope: string
    source_ids: string[]
    concepts: Array<{ title: string; explanation: string; implementation: string; source_ids: string[] }>
  }
  review_source_hashes: Record<string, string>
}

export interface EvidenceRow {
  evidence_id: string
  entity_id: string
  field_name: string
  value: string
  source_id: string
  source_page_or_sheet: string
  source_row_or_section: string
  evidence_type: string
  fact_level: FactLevel
  review_status: string
  notes: string
}

export interface BsrRow {
  source_sheet: string
  source_row: string
  source_criteria: string
  country_state: string
  site: string
  component: string
  name_nearest_city: string
  building_owned_count: string
  total_acres: string
  plant_replacement_value_usd_m_raw: string
}

export interface SourceRecord {
  source_id: string
  title: string
  publisher: string
  published_at: string
  as_of_date: string
  retrieved_at: string
  url: string
  sha256?: string
  verification_status: string
  license: string
  access_level: string
  rights: string
  attribution: string
  redistribution_status: string
  external_export_allowed: boolean
  requires_rights_review: boolean
}

export interface SourceRegistry { sources: Record<string, SourceRecord> }

