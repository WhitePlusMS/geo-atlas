<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed, toRef } from 'vue'
import SiteFilters from '../components/site/SiteFilters.vue'
import SiteTable from '../components/site/SiteTable.vue'
import { useSiteFilters } from '../services/siteFilters'
import { useDataStore } from '../stores/data'
const data = useDataStore()
const { query, service, region, shape, filterQuery, filtered, reset } = useSiteFilters(toRef(data, 'sites'))
const approved = computed(() => data.profiles.filter(profile => profile.review_status === 'APPROVED').length)
</script>
<template><div class="page catalog-page"><div class="page-intro"><div><span class="eyebrow cyan">CRS表A-1 / 来源审核结果</span><h2>参考站点目录</h2><p>按机构、地区和位置类型查找；每条记录均可进入画像、组成地图和字段证据。</p><RouterLink class="back-link" :to="{ path: '/map', query: filterQuery }">在地图查看筛选结果 →</RouterLink></div><div class="page-total" role="status"><strong>{{ filtered.length }}</strong><span>/ {{ data.sites.length }} 条</span></div></div><div class="catalog-proof"><span><Check :size="15" aria-hidden="true" /> {{ approved }} 条画像来源审核通过</span><span>{{ data.meta?.spatial_review.multi_site_mapped_count }} 个多设施对象</span><span>{{ data.meta?.spatial_review.component_location_count }} 处成员独立定位</span></div><section class="panel table-panel"><SiteFilters v-model:query="query" v-model:service="service" v-model:region="region" v-model:shape="shape" :sites="data.sites" @reset="reset" /><SiteTable v-if="filtered.length" :sites="filtered" :profiles="data.profiles" :query="filterQuery" /><div v-else class="empty-message"><strong>没有找到匹配的站点</strong><p>可以换一个名称、地区或记录号，也可以重置筛选。</p><button type="button" class="secondary-btn" @click="reset">查看全部站点</button></div></section></div></template>
<style scoped>
.catalog-proof{display:flex;gap:20px;flex-wrap:wrap;padding:0 0 23px;font-size:13px;color:var(--muted)}.catalog-proof span:first-child{color:var(--cyan)}.table-panel{padding:23px}
@media(max-width:760px){.catalog-proof{gap:8px 16px;padding-bottom:18px}.table-panel{padding:17px}}
</style>
