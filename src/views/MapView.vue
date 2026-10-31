<script setup lang="ts">
import { X, Check, ArrowRight, Maximize2, Minimize2 } from '@lucide/vue'
import { computed, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GlobeScene from '../components/map/GlobeScene.vue'
import MapLegend from '../components/map/MapLegend.vue'
import SourceDrawer from '../components/evidence/SourceDrawer.vue'
import { coordinateSemanticsLabel, locationLabel, organizationLabel } from '../services/labels'
import { useSiteFilters } from '../services/siteFilters'
import LoadingState from '../components/common/LoadingState.vue'
import { useDataStore } from '../stores/data'
import type { SiteFeature, SourceRecord } from '../types/data'
const data = useDataStore()
const router = useRouter()
const route = useRoute()
const globe = ref<InstanceType<typeof GlobeScene> | null>(null)
const selected = ref<SiteFeature | null>(null)
const source = ref<SourceRecord | null>(null)
const { service: activeService, filterQuery, matchingOtherFilters, filtered: filteredSites } = useSiteFilters(toRef(data, 'sites'))
const presentation = ref(false)
const stage = ref<HTMLElement | null>(null)
const selectedProfile = computed(() => data.profiles.find((profile) => profile.site_id === selected.value?.properties.site_id))
const memberCount = computed(() => selectedProfile.value?.components.filter((component) => component.location !== null).length ?? 0)
function openSource(id: string) { source.value = data.sourceRegistry?.sources[id] ?? null }
watch(filteredSites, () => { if (selected.value && !filteredSites.value.some((site) => site.properties.site_id === selected.value?.properties.site_id)) selected.value = null })
// 从详情页进入地图时，复用已有的选站与聚焦流程。
watch([globe, () => route.query.site, filteredSites], ([scene, id, sites]) => {
  if (!scene || typeof id !== 'string') return
  const target = sites.find(site => site.properties.site_id === id)
  if (target && selected.value?.properties.site_id !== id) void scene.selectSite(target)
}, { immediate: true, flush: 'post' })
function togglePresentation() { presentation.value = !presentation.value; if (presentation.value) requestAnimationFrame(() => stage.value?.focus()) }
function escapePresentation(event: KeyboardEvent) { if (event.key === 'Escape') presentation.value = false }
window.addEventListener('keydown', escapePresentation)
onBeforeUnmount(() => window.removeEventListener('keydown', escapePresentation))
</script>
<template>
  <LoadingState v-if="data.loading && !data.coreReady" />
  <div v-else class="page map-page">
    <section ref="stage" tabindex="-1" class="panel globe-panel map-stage" :class="{ presentation }" :role="presentation ? 'dialog' : 'region'" :aria-modal="presentation || undefined" aria-label="三维GIS展示">
      <div class="map-stage-heading"><span><i />三维空间浏览 <small>已审核公开参考位置</small></span><button type="button" :aria-label="presentation ? '退出大屏演示' : '开启大屏演示'" @click="togglePresentation"><component :is="presentation ? Minimize2 : Maximize2" :size="15" aria-hidden="true" /> {{ presentation ? '退出大屏 · Esc' : '大屏演示' }}</button></div>
      <div class="map-filter-summary"><span>筛选结果 {{ filteredSites.length }} / {{ data.sites.length }} 站点</span><RouterLink :to="{ path: '/sites', query: filterQuery }">查看或修改筛选列表 <ArrowRight :size="14" aria-hidden="true" /></RouterLink></div>
      <GlobeScene ref="globe" :sites="filteredSites" :selected-site-id="selected?.properties.site_id" :profile="selectedProfile" @select="selected = $event" @clear="selected = null" @source="openSource" @details="router.push({ path: `/sites/${$event.properties.site_id}`, query: filterQuery })" />
      <aside v-if="selected" class="map-detail" aria-label="已选站点审核结果">
        <div class="detail-caption"><span>CRS {{ String(selected.properties.source_record_no).padStart(2, '0') }}</span><button type="button" aria-label="关闭站点卡片" @click="selected = null"><X :size="18" aria-hidden="true" /></button></div>
        <h3>{{ selected.properties.display_name }}</h3>
        <p>{{ locationLabel(selected.properties.location_label) }} · {{ organizationLabel(selected.properties.service_component) }}</p>
        <span class="review-proof"><Check :size="15" aria-hidden="true" /> 画像来源审核通过</span>
        <div class="detail-coordinates"><span>公开参考位置</span><strong>{{ Number(selected.properties.latitude).toFixed(selected.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 4) }}°, {{ Number(selected.properties.longitude).toFixed(selected.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 4) }}°</strong></div>
        <span class="detail-semantic">{{ coordinateSemanticsLabel(selected.properties.coordinate_semantics) }}</span>
        <p class="detail-note">{{ selected.properties.geometry_note }}</p>
        <small v-if="memberCount">{{ memberCount }} 处组成地点已在地球图中展示，也可在详细画像查看。</small>
        <button type="button" class="primary-btn" @click="router.push({ path: `/sites/${selected.properties.site_id}`, query: filterQuery })">查看画像、地图与证据 <ArrowRight :size="16" aria-hidden="true" /></button>
      </aside>
      <MapLegend v-model="activeService" :sites="matchingOtherFilters" />
      <footer class="map-sources"><span>定位依据：GIS {{ data.meta?.review.gis_snapshot_traceable_count }} · 官方图表 {{ data.meta?.review.official_map_traceable_count }} · 归档地名查询 {{ data.meta?.review.lookup_response_archived_count }}</span><span>地理参考：<a href="https://cloudcenter.tianditu.gov.cn/administrativeDivision/" target="_blank" rel="noreferrer">天地图</a> / <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL 1.0</a></span></footer>
    </section>
    <SourceDrawer :source="source" @close="source = null" />
  </div>
</template>
<style scoped>
.map-stage{padding:0;min-height:0;position:relative;border:1px solid #31465c;border-radius:14px;background:#081222;overflow:hidden;outline:none;box-shadow:0 14px 36px #163a4814}
.map-stage-heading{display:flex;justify-content:space-between;align-items:center;padding:13px 18px;background:#0b192a;border-bottom:1px solid #223850;color:#b9cedf;font-size:12px}.map-stage-heading>span{display:flex;align-items:center;gap:9px}.map-stage-heading i{width:6px;height:6px;background:#7ddfc9;box-shadow:0 0 10px #7ddfc980;border-radius:50%}.map-stage-heading small{font-size:11px;color:#9ab5c9;margin-left:8px}.map-stage-heading>button{padding:6px 9px;color:#8ed2c8;background:#102b37;border:1px solid #31595e;border-radius:5px;font-size:12px}
.map-filter-summary{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:9px 18px;color:#c1d2e1;background:#0b192a;font-size:12px}.map-filter-summary a{display:inline-flex;align-items:center;gap:5px;color:#8ed2c8}
.map-detail{position:relative;width:auto;color:#203e4d;background:rgba(249,253,254,.96);border:0;border-top:1px solid #617988;border-radius:0;padding:18px}.detail-caption{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#52838b;letter-spacing:.6px}.detail-caption button{background:none;border:0;color:#617f8b;font-size:20px;padding:0 2px}.map-detail h3{font-size:19px;line-height:1.4;margin:12px 0 7px;overflow-wrap:anywhere}.map-detail p{font-size:11px;color:#627c86;line-height:1.7;margin:8px 0}.review-proof{display:inline-block;padding:5px 8px;background:#e0f4ed;color:#287767;font-size:10px;border-radius:4px;margin-top:8px}.detail-coordinates{padding:12px;margin:16px 0 10px;border-left:2px solid #61b9a8;background:#eef6f7}.detail-coordinates span,.detail-coordinates strong{display:block}.detail-coordinates span{font-size:10px;color:#637e8c}.detail-coordinates strong{font-size:15px;line-height:1.5;margin-top:4px}.detail-semantic{font-size:10px;color:#598792}.map-detail .detail-note{font-size:10px;margin:10px 0 12px;max-height:100px;overflow:auto}.map-detail>small{font-size:10px;line-height:1.7;color:#5c7b87;display:block}.map-detail .primary-btn{font-size:11px;width:100%;margin-top:14px;padding:10px}
.map-sources{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:11px 18px;color:#9ab5c9;font-size:11px;line-height:1.7;background:#0a1728}.map-sources a{color:#8caebe;text-decoration:none}.map-sources a:hover{text-decoration:underline}
.map-stage.presentation{position:fixed;inset:0;z-index:30;border:0;border-radius:0;overflow:auto}.map-stage.presentation :deep(.globe-viewport){height:calc(100dvh - 254px);min-height:440px}.map-stage.presentation .map-stage-heading{padding:16px 22px}
@media(max-width:760px){.map-stage-heading{padding:11px 12px}.map-stage-heading small{display:none}.map-detail{position:relative;right:auto;top:auto;width:auto;margin:0;border:0;border-top:1px solid #617988;border-radius:0;padding:18px;box-shadow:none}.map-detail .detail-note{max-height:none}.map-sources{padding:10px 12px;font-size:11px}.map-stage.presentation :deep(.globe-viewport){height:calc(100dvh - 330px);min-height:400px}}
</style>
