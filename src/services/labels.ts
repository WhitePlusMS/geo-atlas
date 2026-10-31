import type { CoordinateSemantics, FactLevel, ProfileReviewStatus } from '../types/data'

const organizationLabels: Record<string, string> = {
  Army: '陆军',
  Navy: '海军',
  'Air Force': '空军',
  'Marine Corps': '海军陆战队',
  'Space Force': '太空军',
  'Joint (Army and Air Force)': '陆军与空军联合',
  'Joint (Navy and Air Force)': '海军与空军联合',
  'Air National Guard': '空军国民警卫队',
  Joint: '联合机构',
  'Washington Headquarters Services': '总部勤务机构（Washington Headquarters Services）',
  'N/A': '未说明',
}

const locationLabels: Record<string, string> = {
  Alaska: '阿拉斯加',
  Washington: '华盛顿州',
  California: '加利福尼亚州',
  Hawaii: '夏威夷',
  'Wake Island': '威克岛',
  Guam: '关岛',
  'Republic of the Marshall Islands': '马绍尔群岛共和国',
  'Japan (Mainland)': '日本本土',
  'Japan (Okinawa)': '日本冲绳',
  'Republic of Korea': '韩国',
  'The Philippines': '菲律宾',
  Singapore: '新加坡',
  Australia: '澳大利亚',
  'British Indian Ocean Territory (Diego Garcia)': '英属印度洋领地（迪戈加西亚）',
}

const semanticLabels: Record<CoordinateSemantics, string> = {
  OFFICIAL_ADDRESS: '官方地址',
  REPRESENTATIVE_POINT: '代表位置',
  GNIS_APPROX_CENTER: 'GNIS 近似中心',
  GNS_FINDING_POINT: 'GNS 查询点',
  MULTI_SITE_NO_SINGLE_POINT: '多设施代表点',
  EDCA_AGREED_LOCATION: 'EDCA 约定位置',
  LOCALITY_ANCHOR: '地区锚点',
}

const factLevelLabels: Record<FactLevel, string> = {
  SOURCE_FACT: '来源事实',
  DERIVED: '派生信息',
  CANDIDATE: '候选信息',
  UNKNOWN: '未知',
}

const profileReviewLabels: Record<ProfileReviewStatus, string> = {
  AGENT_DRAFT: '画像尚无来源审核记录',
  FACT_CHECKED: '来源事实已核查',
  APPROVED: '画像来源审核通过',
  CHANGES_REQUIRED: '已审核，需补充说明',
  REJECTED: '画像已驳回',
}

const fieldLabels: Record<string, string> = {
  description_short: '画像摘要', description_long: '详细画像', installation_type: '设施类型',
  public_service_component: '公开机构说明', public_reference_extent: '公共参考范围',
  site_id: '站点编号', source_record_no: '原始记录号', display_name: '展示名称', source_name: '原始名称',
  location_label: '地区', service_component: '机构', us_territory_flag: '美国属地标记', dod_operated_raw: 'DoD 原始运营信息',
  latitude: '纬度', longitude: '经度', coordinate_status: '坐标状态', coordinate_source_id: '坐标来源编号',
  coordinate_precision: '坐标精度', coordinate_semantics: '位置语义', contest_record_id: '比赛记录编号',
  geometry_status: '几何状态', geometry_source_id: '几何来源编号', geometry_note: '几何说明', source_layer: '来源层级',
  source_id: '来源编号', source_page: '来源页码', review_status: '复核状态',
  geometry_candidate: '几何候选', canonical_name: '标准名称', official_locality: '官方地名',
}

const verificationLabels: Record<string, string> = {
  SHA256_COMPUTED: 'SHA-256 已计算',
  HTTP_AND_METADATA_REVIEWED: '网页与元数据已核验',
  REMOTE_QUERY_NOT_ARCHIVED: '远程查询，未归档',
  REMOTE_WEB_PAGES_NOT_ARCHIVED: '远程网页，未归档',
  REMOTE_WEB_PAGE_REVIEWED: '远程网页已核验',
  REMOTE_LINK_REGISTERED: '仅登记来源链接',
  HTTP_RESPONSE_ARCHIVED: '原网页或 PDF 已归档',
  OFFICIAL_TEXT_EXCERPT_ARCHIVED: '官方正文节选已归档',
  INDEXED_OFFICIAL_TEXT_EXCERPT_ARCHIVED: '官方索引正文节选已归档',
  INDEXED_OFFICIAL_EXCERPT_ARCHIVED: '官方索引节选已归档',
  OFFICIAL_BODY_EXCERPT_ARCHIVED: '官方正文节选已归档',
  LOCATION_RESPONSE_ARCHIVED: '原始定位响应已归档',
  OFFICIAL_MAP_DERIVATION_ARCHIVED: '官方图面派生记录已归档',
  LOOKUP_RESPONSE_ARCHIVED: '原始定位响应已归档',
}

const rightLabels: Record<string, string> = {
  'GNIS_PUBLIC_DOMAIN; CONTEST_SCOPE_STILL_APPLIES': 'GNIS公共领域资料，赛事范围约束仍适用',
  ORGANIZER_TERMS_NOT_ARCHIVED: '组委会条款未归档',
  RAND_PUBLICATION_TERMS_APPLY: '适用 RAND 出版条款',
  otherRestrictions: '存在其他限制',
  FACT_EXTRACTION_WITH_ATTRIBUTION_AND_RIGHTS_REVIEW: '可提取事实，需署名并复核权利',
  DO_NOT_EXTERNAL_EXPORT_WITHOUT_REVIEW: '未经复核不得对外导出',
  PUBLIC_SNAPSHOT_VERIFY_BEFORE_REDISTRIBUTION: '公开快照，外发前需复核',
}

export const organizationLabel = (value: string): string => {
  if (organizationLabels[value]) return organizationLabels[value]
  if (value === 'NG Army Guard') return '陆军国民警卫队'
  const suffixes: Record<string, string> = { Active: '现役', Reserve: '预备役', 'National Guard': '国民警卫队', Guard: '国民警卫队' }
  for (const [suffix, label] of Object.entries(suffixes)) {
    if (value.endsWith(` ${suffix}`)) return `${organizationLabel(value.slice(0, -suffix.length - 1))}${label}`
  }
  return value
}
export const locationLabel = (value: string) => locationLabels[value] ?? value
export const coordinateSemanticsLabel = (value: CoordinateSemantics) => semanticLabels[value] ?? value
export const factLevelLabel = (value: FactLevel) => factLevelLabels[value] ?? value
export const profileReviewLabel = (value: ProfileReviewStatus) => profileReviewLabels[value]
export function fieldLabel(value: string): string {
  if (value.startsWith('public_fact_')) return '公开画像事实'
  if (value.startsWith('description_section_')) return '画像章节 ' + value.slice('description_section_'.length)
  if (value.includes('::component::')) return value.endsWith('::location') ? '成员定位证据' : '组成与关联关系'
  return fieldLabels[value] ?? value
}
export const locationMethodLabel = (value: string) => ({ GIS_VERTEX_AVERAGE: 'GIS 面内顶点均值', GIS_TRIANGLE_INTERIOR: 'GIS 面内三角形中心', GNIS_NAMED_FEATURE: 'USGS GNIS 命名要素', OSM_NAMED_FEATURE: 'OpenStreetMap 命名要素', OFFICIAL_MAP_GEOREFERENCE: '官方图面配准参考点', OFFICIAL_COORDINATE_TABLE: '官方报告角点转换' })[value] ?? value
export const verificationLabel = (value: string) => verificationLabels[value] ?? value
export const rightsLabel = (value: string) => rightLabels[value] ?? value
export const yesNoLabel = (value: string) => value === 'Yes' ? '是' : value === 'No' ? '否' : value

export const geometryNoteLabel = (value: string) => value
  .replaceAll('EDCA Agreed Location context', 'EDCA 约定位置背景')
  .replaceAll('Public installation point for ', '公开设施位置：')
  .replaceAll('Public airfield point for ', '公开机场位置：')
  .replaceAll('Public airfield/installation point for ', '公开机场/设施位置：')
  .replaceAll('Public naval installation point for ', '公开海军设施位置：')
  .replaceAll('Public installation point for Commander Fleet Activities Yokosuka.', '公开设施位置：Commander Fleet Activities Yokosuka。')
  .replaceAll('Public installation point for Naval Air Facility Atsugi.', '公开设施位置：Naval Air Facility Atsugi。')
  .replaceAll('Public locality/installation point for ', '公开地名/设施位置：')
  .replaceAll('Public Tsugaru/Shariki locality point; the communications site boundary is not asserted.', '公开津轻/Shariki 地名位置；不主张通信站点边界。')
  .replaceAll('Public Kyogamisaki cape/locality point; the communications site boundary is not asserted.', '公开经之岬海角/地名位置；不主张通信站点边界。')
  .replaceAll('Public Sembawang naval locality point for the Navy Region Center Singapore context.', '新加坡海军区域中心背景下的公开三巴旺海军地名位置。')
  .replaceAll('Public Darwin airfield/defence locality point.', '公开达尔文机场/国防地名位置。')
  .replaceAll('Public Sasebo naval installation locality point.', '公开佐世保海军设施地名位置。')
  .replaceAll('Public Iwakuni airfield/installation point.', '公开岩国机场/设施位置。')
  .replaceAll('Public Dededo, Guam representative point for the Camp Blaz installation context; exact boundary is not asserted.', 'Camp Blaz 设施背景下的关岛德德多公开代表位置；不主张精确边界。')
  .replaceAll('DISDI public footprint representative point; not an official contest coordinate or confirmed facility boundary.', 'DISDI 公共范围代表位置；不是正式比赛坐标，也不是已确认的设施边界。')
  .replaceAll('the DISDI footprint spans a much larger training-area context, so its vertex average is not used.', 'DISDI 范围覆盖更大的训练区背景，因此不使用其顶点平均值。')
  .replaceAll('the DISDI footprint includes a much larger training-area context, so its vertex average is not used.', 'DISDI 范围包含更大的训练区背景，因此不使用其顶点平均值。')
  .replaceAll('is used as the representative public point.', '用作公开代表位置。')
  .replaceAll('is used only as an umbrella representative point.', '仅用作汇总代表位置。')
  .replaceAll('a public central representative point is used.', '使用公开中心代表位置。')
  .replaceAll('a midpoint is used only as an umbrella representative point.', '仅使用中点作为汇总代表位置。')
  .replaceAll('not relabeled as a U.S. military base.', '不重新标注为美国军事基地。')
  .replaceAll('the communications site boundary is not asserted.', '不主张通信站点边界。')
  .replaceAll('exact range boundary is not asserted.', '不主张精确靶场边界。')
  .replaceAll('exact boundary is not asserted.', '不主张精确边界。')
  .replaceAll('representative only.', '仅作为代表位置。')

/** 只格式化完整ISO日期，不能把仅有年份的记录猜成某月某日。 */
export function dateLabel(value: string, includeTime = false): string {
  if (!value || value === 'UNKNOWN') return '未标注'
  if (!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: value.length === 10 ? 'UTC' : 'Asia/Shanghai', ...(includeTime && value.length > 10 ? { hour: '2-digit', minute: '2-digit' } as const : {}) }).format(date) + (includeTime && value.length > 10 ? '（北京时间）' : '')
}
