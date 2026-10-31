<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteFilters from '../components/site/SiteFilters.vue'
import SiteTable from '../components/site/SiteTable.vue'
import { mapMarkerShape, mapService, type MapServiceId, type MapMarkerShape } from '../services/mapMarkers'
import { locationLabel } from '../services/labels'
import { useDataStore } from '../stores/data'
const data = useDataStore(); const route = useRoute(); const router = useRouter()
const textQuery = (key: string) => typeof route.query[key] === 'string' ? route.query[key] as string : ''
function updateQuery(key: string, value: string) { void router.replace({ query: { ...route.query, [key]: value && value !== 'all' ? value : undefined } }) }
// URL是筛选条件的唯一来源；浏览器返回与详情返回均能还原条件。
const query = computed({ get: () => textQuery('q'), set: value => updateQuery('q', value) })
const service = computed({ get: () => (textQuery('service') || 'all') as MapServiceId | 'all', set: value => updateQuery('service', value) })
const region = computed({ get: () => textQuery('region'), set: value => updateQuery('region', value) })
const shape = computed({ get: () => (textQuery('shape') || 'all') as MapMarkerShape | 'all', set: value => updateQuery('shape', value) })
const filtered = computed(() => data.sites.filter(site => {
  const p = site.properties
  const text = [p.display_name, p.source_name, p.location_label, locationLabel(p.location_label), String(p.source_record_no), String(p.source_record_no).padStart(2, '0')].join(' ').toLowerCase()
  return text.includes(query.value.trim().toLowerCase()) && (service.value === 'all' || mapService(site).id === service.value) && (!region.value || p.location_label === region.value) && (shape.value === 'all' || mapMarkerShape(site) === shape.value)
}))
const approved = computed(() => data.profiles.filter(profile => profile.review_status === 'APPROVED').length)
function reset() { void router.replace({ query: {} }) }
</script>
<template><div class="page catalog-page"><div class="page-intro"><div><span class="eyebrow cyan">CRS表A-1 / 来源审核结果</span><h2>参考站点目录</h2><p>按机构、地区和位置类型查找；每条记录均可进入画像、组成地图和字段证据。</p></div><div class="page-total" role="status"><strong>{{ filtered.length }}</strong><span>/ {{ data.sites.length }} 条</span></div></div><div class="catalog-proof"><span><Check :size="15" aria-hidden="true" /> {{ approved }} 条画像来源审核通过</span><span>{{ data.meta?.spatial_review.multi_site_mapped_count }} 个多设施对象</span><span>{{ data.meta?.spatial_review.component_location_count }} 处成员独立定位</span></div><section class="panel table-panel"><SiteFilters v-model:query="query" v-model:service="service" v-model:region="region" v-model:shape="shape" :sites="data.sites" @reset="reset" /><SiteTable v-if="filtered.length" :sites="filtered" :profiles="data.profiles" :query="route.query" /><div v-else class="empty-message"><strong>没有找到匹配的站点</strong><p>可以换一个名称、地区或记录号，也可以重置筛选。</p><button type="button" class="secondary-btn" @click="reset">查看全部站点</button></div></section></div></template>
<style scoped>
.catalog-proof{display:flex;gap:20px;flex-wrap:wrap;padding:0 0 23px;font-size:13px;color:var(--muted)}.catalog-proof span:first-child{color:var(--cyan)}.table-panel{padding:23px}
@media(max-width:760px){.catalog-proof{gap:8px 16px;padding-bottom:18px}.table-panel{padding:17px}}
</style>
