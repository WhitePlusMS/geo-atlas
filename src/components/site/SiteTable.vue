<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink, useRouter, type LocationQueryRaw } from 'vue-router'
import type { BaseProfile, SiteFeature } from '../../types/data'
import ServiceBadge from '../common/ServiceBadge.vue'
import { coordinateSemanticsLabel, locationLabel, profileReviewLabel } from '../../services/labels'
const props = defineProps<{ sites: SiteFeature[]; profiles: BaseProfile[]; query: LocationQueryRaw }>()
const router = useRouter()
const reviews = computed(() => new Map(props.profiles.map(profile => [profile.site_id, profile.review_status])))
const detailRoute = (site: SiteFeature) => ({ path: '/sites/' + site.properties.site_id, query: props.query })
const mapRoute = (site: SiteFeature) => ({ path: '/map', query: { ...props.query, site: site.properties.site_id } })
function openRow(event: MouseEvent, site: SiteFeature) {
  // 名称链接保留新标签及键盘行为；点击行的空白处也能进入详情。
  if ((event.target as Element).closest('a, button')) return
  void router.push(detailRoute(site))
}
</script>
<template><div class="table-wrap"><table class="sites-table"><caption class="sr-only">已审核参考站点目录</caption><thead><tr><th scope="col">记录</th><th scope="col">站点</th><th scope="col">地区</th><th scope="col">机构</th><th scope="col">位置类型</th><th scope="col">画像审核</th><th scope="col">地图</th></tr></thead><tbody><tr v-for="site in sites" :key="site.properties.site_id" @click="openRow($event, site)"><td class="record-number" data-label="CRS">{{ String(site.properties.source_record_no).padStart(2, '0') }}</td><td class="site-name"><RouterLink :to="detailRoute(site)">{{ site.properties.display_name }}</RouterLink><small v-if="site.properties.display_name !== site.properties.source_name">原名：{{ site.properties.source_name }}</small></td><td data-label="地区">{{ locationLabel(site.properties.location_label) }}</td><td data-label="机构"><ServiceBadge :value="site.properties.service_component" /></td><td data-label="位置类型"><span class="semantic">{{ coordinateSemanticsLabel(site.properties.coordinate_semantics) }}</span></td><td data-label="画像审核"><span class="review-label" :class="{ approved: reviews.get(site.properties.site_id) === 'APPROVED' }"><Check v-if="reviews.get(site.properties.site_id) === 'APPROVED'" :size="15" aria-hidden="true" />{{ reviews.get(site.properties.site_id) === 'APPROVED' ? '来源审核通过' : profileReviewLabel(reviews.get(site.properties.site_id)!) }}</span></td><td data-label="地图"><RouterLink class="map-link" :to="mapRoute(site)" :aria-label="`在地图中查看 ${site.properties.display_name}`">地图定位</RouterLink></td></tr></tbody></table></div></template>
<style scoped>
.table-wrap{overflow:visible;max-height:none}.sites-table{width:100%;border-collapse:collapse;font-size:14px}.sites-table th{white-space:nowrap;font-size:12px;color:var(--muted);padding:16px 11px;font-weight:500;text-align:left;border-bottom:1px solid var(--line)}.sites-table td{padding:16px 11px;line-height:1.6;border-bottom:1px solid #e2ecee;vertical-align:middle}.sites-table tbody tr{cursor:pointer}.sites-table tbody tr:hover{background:#eff8f7}.site-name{width:31%}.site-name a{font-weight:650;color:var(--text);text-decoration:none}.site-name a:hover{color:var(--cyan);text-decoration:underline}.site-name small{display:block;color:var(--muted);font-size:12px;overflow-wrap:anywhere;margin-top:4px}.record-number{color:var(--muted);font-variant-numeric:tabular-nums}.review-label{display:inline-flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;color:var(--amber)}.review-label.approved{color:var(--cyan)}
.map-link{white-space:nowrap;text-decoration:none;font-size:12px}.map-link:hover{text-decoration:underline}
@media(max-width:760px){.sites-table,.sites-table tbody{display:block}.sites-table thead{display:none}.sites-table tr{display:grid;grid-template-columns:38px minmax(0,1fr);padding:16px 0;border-bottom:1px solid var(--line)}.sites-table td{display:flex;align-items:center;gap:10px;padding:5px 0;border:0;grid-column:2;font-size:13px;min-width:0}.sites-table td::before{content:attr(data-label);flex:0 0 52px;color:var(--muted);font-size:12px}.sites-table .record-number{grid-column:1;grid-row:1/6;display:block;font-size:17px;padding-top:5px}.record-number::before,.sites-table .site-name::before{display:none}.site-name{display:block!important;width:auto;font-size:15px!important;overflow-wrap:anywhere}.sites-table th:nth-child(n),.sites-table td:nth-child(n){min-width:0}.sites-table td:nth-child(4),.sites-table td:nth-child(5){display:flex}}
</style>
