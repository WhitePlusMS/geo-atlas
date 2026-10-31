<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { computed, ref, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GlobeScene from '../components/map/GlobeScene.vue'
import MapLegend from '../components/map/MapLegend.vue'
import SourceDrawer from '../components/evidence/SourceDrawer.vue'
import { useSiteFilters } from '../services/siteFilters'
import { useDataStore } from '../stores/data'
import type { SiteFeature, SourceRecord } from '../types/data'

const data = useDataStore()
const router = useRouter()
const route = useRoute()
const globe = ref<InstanceType<typeof GlobeScene> | null>(null)
const selected = ref<SiteFeature | null>(null)
const source = ref<SourceRecord | null>(null)
const { service, filterQuery, matchingOtherFilters, filtered } = useSiteFilters(toRef(data, 'sites'))
const selectedProfile = computed(() => data.profiles.find(profile => profile.site_id === selected.value?.properties.site_id))
const hasFilters = computed(() => Object.values(filterQuery.value).some(Boolean))
function openSource(id: string) { source.value = data.sourceRegistry?.sources[id] ?? null }
function clearFilters() { void router.replace({ path: '/map', query: { site: typeof route.query.site === 'string' ? route.query.site : undefined } }) }
watch(filtered, () => { if (selected.value && !filtered.value.some(site => site.properties.site_id === selected.value?.properties.site_id)) selected.value = null })
// 目录和画像可通过 URL 带入站点，沿用地球组件的选中与聚焦行为。
watch([globe, () => route.query.site, filtered], ([scene, id, sites]) => {
  if (!scene || typeof id !== 'string') return
  const target = sites.find(site => site.properties.site_id === id)
  if (target && selected.value?.properties.site_id !== id) void scene.selectSite(target)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div class="map-page">
    <section class="map-stage" aria-label="代表点地图">
      <RouterLink class="map-home" to="/"><ArrowLeft :size="15" aria-hidden="true" /> 概览</RouterLink>
      <GlobeScene ref="globe" :sites="filtered" :selected-site-id="selected?.properties.site_id" :profile="selectedProfile" @select="selected = $event" @clear="selected = null" @source="openSource" @details="router.push({ path: `/sites/${$event.properties.site_id}`, query: filterQuery })">
        <template #filters><MapLegend v-model="service" :sites="matchingOtherFilters" /></template>
      </GlobeScene>
      <div v-if="hasFilters" class="map-active-filters" role="status"><span>筛选 {{ filtered.length }} / {{ data.sites.length }}</span><RouterLink :to="{ path: '/sites', query: filterQuery }">修改</RouterLink><button type="button" @click="clearFilters">清除</button></div>
      <details class="map-help"><summary>地图说明与来源</summary><div><p>拖动旋转，滚轮缩放；点击聚合数字展开站点。公开参考位置不等同于正式设施边界。</p><p>定位依据：GIS {{ data.meta?.review.gis_snapshot_traceable_count }} · 官方图表 {{ data.meta?.review.official_map_traceable_count }} · 归档地名查询 {{ data.meta?.review.lookup_response_archived_count }}</p><p>地理参考：<a href="https://cloudcenter.tianditu.gov.cn/administrativeDivision/" target="_blank" rel="noreferrer">天地图</a> / <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL 1.0</a></p><RouterLink :to="{ path: '/sites', query: filterQuery }">查看当前筛选列表</RouterLink></div></details>
    </section>
    <SourceDrawer :source="source" @close="source = null" />
  </div>
</template>

<style scoped>
.map-page,.map-stage{width:100%;height:100dvh;min-height:0}.map-stage{position:relative;overflow:hidden;background:#081222}.map-home{position:absolute;z-index:20;top:12px;left:14px;display:flex;align-items:center;gap:7px;min-height:42px;padding:8px 12px;color:#d5e8ef;background:#0d2034e8;border:1px solid #35576a;border-radius:8px;text-decoration:none;font-size:12px}.map-home:hover{background:#1b4050}.map-stage :deep(.view-status){top:64px}.map-help{position:absolute;z-index:18;right:14px;bottom:68px;color:#b8d0df;font-size:11px}.map-help summary{padding:7px 10px;background:#0d2034e8;border:1px solid #35576a;border-radius:6px;cursor:pointer}.map-help>div{position:absolute;right:0;bottom:42px;width:min(330px,calc(100vw - 28px));padding:12px 15px;background:#102438;border:1px solid #405d70;border-radius:8px;box-shadow:0 8px 25px #0007}.map-help p{line-height:1.6;margin:6px 0}.map-help a{color:#9ce4d5}
.map-active-filters{position:absolute;z-index:18;left:14px;top:96px;display:flex;align-items:center;gap:9px;padding:7px 10px;color:#d9e9ee;background:#0d2034ed;border:1px solid #35576a;border-radius:6px;font-size:11px}.map-active-filters a,.map-active-filters button{color:#9ce4d5}.map-active-filters button{border:0;background:transparent;padding:2px}
@media(max-width:760px){.map-home{left:10px;top:10px}.map-help{right:10px;bottom:60px}.map-stage :deep(.view-status){top:62px}}
@media(max-width:600px){.map-stage :deep(.view-status){top:112px}.map-active-filters{top:145px}}
</style>
