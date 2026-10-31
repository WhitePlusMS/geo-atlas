<script setup lang="ts">
import { Plus, Minus, ArrowUpRight } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { loadJson } from '../../services/dataLoader'
import { coordinateSemanticsLabel, locationLabel } from '../../services/labels'
import { rectsOverlap } from '../../services/mapMarkers'
import { geometryRings, mercatorLatitude, projectSpatialPoint, regionalSpatialBounds, separateSpatialMarkers, spatialAnchors, spatialBounds, spatialPath } from '../../services/spatialMap'
import type { BaseProfile, SiteFeature, SpatialGeometry } from '../../types/data'
const props = defineProps<{ profile: BaseProfile; site: SiteFeature; selectedId: string }>()
const emit = defineEmits<{ source: [id: string]; 'update:selectedId': [id: string] }>()
const viewport = ref<HTMLElement | null>(null); const width = ref(800); const height = ref(420)
const zoom = ref(1); const pan = ref({ x: 0, y: 0 }); const reference = ref<Array<{ geometry: SpatialGeometry | null }>>([])
const southChinaSeaLines = ref<number[][][]>([])
const referenceLoading = ref(true); const referenceError = ref(false)
const anchors = computed(() => spatialAnchors(props.profile))
const singlePointOnly = computed(() => anchors.value.length === 1 && (!anchors.value[0]!.location || anchors.value[0]!.location.geometry.type === 'Point'))
const regionView = ref(false)
const regional = computed(() => singlePointOnly.value || regionView.value)
const bounds = computed(() => regional.value ? regionalSpatialBounds(anchors.value[0]!, width.value, height.value, reference.value) : spatialBounds(anchors.value, width.value, height.value))
const active = computed(() => anchors.value.find(anchor => anchor.id === props.selectedId) ?? anchors.value[0]!)
const areas = computed(() => anchors.value.flatMap(anchor => anchor.location && anchor.location.geometry.type !== 'Point' ? [{ id: anchor.id, path: spatialPath(anchor.location.geometry, bounds.value), name: anchor.name }] : []))
const markers = computed(() => separateSpatialMarkers(anchors.value, bounds.value, zoom.value, pan.value))
const transform = computed(() => 'translate(' + pan.value.x + ',' + pan.value.y + ') translate(' + width.value / 2 + ',' + height.value / 2 + ') scale(' + zoom.value + ') translate(' + -width.value / 2 + ',' + -height.value / 2 + ')')
// 轮廓路径仅在源数据或容器尺寸变化时计算；平移/缩放使用SVG变换。
const coastlines = computed(() => reference.value.flatMap(feature => {
  if (!feature.geometry || feature.geometry.type === 'Point') return []
  const box = bounds.value; const spanX = box.unit * width.value; const spanY = box.unit * height.value
  return geometryRings(feature.geometry).flatMap(ring => {
    const xs = ring.map(point => point[0]!); const ys = ring.map(point => mercatorLatitude(point[1]!))
    const west = Math.min(...xs); const east = Math.max(...xs)
    if (east - west >= 180 || Math.max(...ys) < box.centerY - spanY || Math.min(...ys) > box.centerY + spanY) return []
    // 将日期变更线另一侧的轮廓平移到当前视野，原始数据不变。
    const shift = Math.round((box.centerX - (west + east) / 2) / 360) * 360
    if (east + shift < box.centerX - spanX || west + shift > box.centerX + spanX) return []
    return [spatialPath({ type: 'Polygon', coordinates: [ring.map(point => [point[0]! + shift, point[1]!])] }, box)]
  })
}))
// 南海断续线保持开放线段，不使用会自动闭合的面路径。
const seaLines = computed(() => southChinaSeaLines.value.map(line => line.map((point, index) => {
  const position = projectSpatialPoint(point[0]!, point[1]!, bounds.value)
  return `${index ? 'L' : 'M'}${position.x.toFixed(2)},${position.y.toFixed(2)}`
}).join(' ')))
// 只给选中地点显示长名称；其余编号由具名列表解释。
const activeLabel = computed(() => {
  const point = markers.value.find(item => item.id === active.value.id)
  if (!point) return null
  const text = point.name.length > 28 ? point.name.slice(0, 27) + '…' : point.name
  const labelWidth = Math.min(width.value - 38, Math.max(110, Math.min(230, text.length * 6.7 + 20)))
  const candidates = [{ x: point.x + 27, y: point.y - 15 }, { x: point.x - labelWidth - 27, y: point.y - 15 }, { x: point.x - labelWidth / 2, y: point.y - 55 }, { x: point.x - labelWidth / 2, y: point.y + 29 }]
  const obstacles = markers.value.map(item => ({ x: item.x - 23, y: item.y - 23, width: 46, height: 46 }))
  const position = candidates.find(candidate => candidate.x >= 12 && candidate.x + labelWidth <= width.value - 12 && candidate.y >= 34 && candidate.y + 30 <= height.value - 32 && !obstacles.some(obstacle => rectsOverlap({ ...candidate, width: labelWidth, height: 30 }, obstacle, 2)))
  return position ? { ...position, width: labelWidth, text } : null
})
function reset() { zoom.value = 1; pan.value = { x: 0, y: 0 } }
function toggleRegion() { regionView.value = !regionView.value; reset() }
function changeZoom(factor: number) { const next = Math.max(1, Math.min(12, zoom.value * factor)); const ratio = next / zoom.value; pan.value = { x: pan.value.x * ratio, y: pan.value.y * ratio }; zoom.value = next }
function focusActive() {
  const point = projectSpatialPoint(active.value.longitude, active.value.latitude, bounds.value)
  const location = active.value.location
  const focused = location && location.geometry.type !== 'Point' ? spatialBounds([active.value], width.value, height.value) : null
  zoom.value = focused ? Math.max(1, Math.min(12, bounds.value.unit / focused.unit)) : singlePointOnly.value ? zoom.value : 3
  pan.value = focused
    ? { x: -(focused.centerX - bounds.value.centerX) / bounds.value.unit * zoom.value, y: (focused.centerY - bounds.value.centerY) / bounds.value.unit * zoom.value }
    : { x: -(point.x - width.value / 2) * zoom.value, y: -(point.y - height.value / 2) * zoom.value }
}
let drag: { id: number; x: number; y: number; panX: number; panY: number } | null = null
function pointerDown(event: PointerEvent) {
  if ((event.target as Element).closest('.map-anchor') || event.button !== 0) return
  viewport.value?.focus(); viewport.value?.setPointerCapture(event.pointerId)
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.value.x, panY: pan.value.y }
}
function pointerMove(event: PointerEvent) { if (drag?.id === event.pointerId) pan.value = { x: drag.panX + event.clientX - drag.x, y: drag.panY + event.clientY - drag.y } }
function pointerEnd() { drag = null }
function keyboard(event: KeyboardEvent) {
  const moves: Record<string, [number, number]> = { ArrowLeft: [35, 0], ArrowRight: [-35, 0], ArrowUp: [0, 35], ArrowDown: [0, -35] }
  const move = moves[event.key]
  if (move) { event.preventDefault(); pan.value = { x: pan.value.x + move[0], y: pan.value.y + move[1] } }
  else if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1.4) }
  else if (event.key === '-') { event.preventDefault(); changeZoom(1 / 1.4) }
  else if (event.key === 'Home') { event.preventDefault(); reset() }
}
function sourceForActive() { emit('source', active.value.location?.source_id ?? props.profile.location_evidence.source_id) }
watch(() => props.profile.site_id, () => { regionView.value = false; reset() })
// 点位视图完全缺少陆地轮廓时先给出区域位置，仍允许切回设施视图。
watch([() => props.profile.site_id, reference], () => {
  if (reference.value.length && !singlePointOnly.value && !areas.value.length && !coastlines.value.length) regionView.value = true
}, { flush: 'post' })
let observer: ResizeObserver | undefined; let alive = true
onMounted(async () => {
  observer = new ResizeObserver(entries => { const box = entries[0]?.contentRect; if (box) { width.value = Math.max(220, box.width); height.value = box.height } })
  if (viewport.value) observer.observe(viewport.value)
  try { const result = await loadJson<{ features: Array<{ geometry: SpatialGeometry | null }>; southChinaSeaLines: number[][][] }>('world_reference.geojson'); if (alive) { reference.value = result.features; southChinaSeaLines.value = result.southChinaSeaLines } }
  catch (cause) { if (alive) { referenceError.value = true; console.warn('[DTC 地区地图]', cause instanceof Error ? cause.message : cause) } }
  finally { if (alive) referenceLoading.value = false }
})
onBeforeUnmount(() => { alive = false; observer?.disconnect(); drag = null })
</script>
<template>
  <section class="spatial-detail" aria-label="设施与地区GIS分布"><div class="spatial-heading"><div><h3>设施与地区 GIS 分布</h3><p class="muted">{{ singlePointOnly ? '仅有公开参考点 · 区域定位' : `${anchors.length - 1} 处独立成员定位 · ${areas.length} 个公共参考范围` }}</p></div><div class="map-controls"><button type="button" aria-label="放大设施地图" :disabled="zoom >= 12" @click="changeZoom(1.4)"><Plus :size="17" aria-hidden="true" /></button><span aria-live="polite">{{ zoom.toFixed(1) }}×</span><button type="button" aria-label="缩小设施地图" :disabled="zoom <= 1" @click="changeZoom(1 / 1.4)"><Minus :size="17" aria-hidden="true" /></button><button type="button" @click="reset">全图</button><button type="button" @click="focusActive">聚焦所选</button><button v-if="!singlePointOnly" type="button" @click="toggleRegion">{{ regionView ? '设施视图' : '区域位置' }}</button></div></div>
  <div ref="viewport" class="map-viewport" tabindex="0" role="region" aria-label="设施地图，方向键移动，加减键缩放，Home复位" @keydown="keyboard" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerEnd" @pointercancel="pointerEnd" @lostpointercapture="pointerEnd">
    <svg :viewBox="'0 0 ' + width + ' ' + height" role="img" :aria-label="profile.canonical_name + '组成设施与参考范围地图'"><defs><clipPath :id="'clip-' + profile.site_id"><rect x="12" y="30" :width="width - 24" :height="height - 60" rx="7" /></clipPath></defs><rect width="100%" height="100%" fill="#eaf3f7" />
    <g :clip-path="'url(#clip-' + profile.site_id + ')'"><g :transform="transform"><path v-for="(coast, index) in coastlines" :key="index" :d="coast" class="reference-land" fill-rule="evenodd" /><path v-for="(line, index) in seaLines" :key="'sea-' + index" :d="line" class="reference-sea-line" /><path v-for="area in areas" :key="area.id" :d="area.path" class="reference-area" :class="{ active: area.id === active.id }" fill-rule="evenodd"><title>{{ area.name }}：公开来源参考范围</title></path></g><g class="grid-lines"><line v-for="index in [1,2,3,4]" :key="'x'+index" :x1="width * index / 5" y1="30" :x2="width * index / 5" :y2="height - 30" /><line v-for="index in [1,2,3]" :key="'y'+index" x1="12" :y1="height * index / 4" :x2="width - 12" :y2="height * index / 4" /></g>
    <g v-for="point in markers" :key="point.id"><line v-if="Math.hypot(point.x-point.anchorX, point.y-point.anchorY) > 2" :x1="point.anchorX" :y1="point.anchorY" :x2="point.x" :y2="point.y" class="marker-leader" /><circle v-if="Math.hypot(point.x-point.anchorX, point.y-point.anchorY) > 2" :cx="point.anchorX" :cy="point.anchorY" r="2.5" fill="#31586d" /><g class="map-anchor" :class="{ selected: active.id === point.id, main: point.id === 'main' }" :transform="'translate('+point.x+','+point.y+')'" role="button" tabindex="0" :aria-label="'选择' + point.name" :aria-pressed="active.id === point.id" @click="emit('update:selectedId', point.id)" @keydown.enter="emit('update:selectedId', point.id)" @keydown.space.prevent="emit('update:selectedId', point.id)"><rect x="-22" y="-22" width="44" height="44" fill="transparent" /><rect v-if="point.id === 'main'" x="-9" y="-9" width="18" height="18" rx="3" transform="rotate(45)" class="marker-core" /><circle v-else r="10" class="marker-core" /><text x="0" y="4" text-anchor="middle">{{ point.label }}</text><title>{{ point.name }}</title></g></g>
    <g v-if="activeLabel" class="active-name"><rect :x="activeLabel.x" :y="activeLabel.y" :width="activeLabel.width" height="30" rx="6" /><text :x="activeLabel.x+10" :y="activeLabel.y+20">{{ activeLabel.text }}</text></g></g><text x="16" y="21" class="axis-label">北 ↑ · Web墨卡托投影</text><text x="16" :y="height - 10" class="axis-label">{{ referenceLoading ? '地理参考加载中…' : referenceError ? '地理参考加载失败；设施证据仍可查看' : '地理参考：天地图 / Natural Earth' }}</text><text :x="width-16" :y="height-10" text-anchor="end" class="axis-label">经纬度未因避让而改变</text></svg>
  </div><div v-if="regional" class="regional-context"><div><strong>{{ locationLabel(site.properties.location_label) }}</strong><span>{{ profile.locality }}</span></div><div><span>{{ coordinateSemanticsLabel(site.properties.coordinate_semantics) }} · {{ Number(site.properties.latitude).toFixed(site.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 5) }}°, {{ Number(site.properties.longitude).toFixed(site.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 5) }}°</span><small>该点不表示完整设施边界；离线底图不含道路和建筑。</small></div></div><div class="map-key"><span><i class="key-main" />总览锚点</span><span v-if="!singlePointOnly"><i />组成地点</span><span v-if="areas.length"><i class="key-area" />公共参考范围</span><span v-if="areas.length"><i class="key-active" />所选范围</span></div><p class="map-help">拖动平移 · 按钮或加减键缩放 · 接近的标记用引线指回真实位置 <RouterLink :to="{ path: '/map', query: { site: profile.site_id } }">在地球图查看 <ArrowUpRight :size="14" aria-hidden="true" /></RouterLink></p>
  <div class="anchor-list"><button v-for="anchor in anchors" :key="anchor.id" type="button" :aria-pressed="active.id === anchor.id" @click="emit('update:selectedId', anchor.id)"><b>{{ anchor.label }}</b><span>{{ anchor.name }}</span></button></div><div class="anchor-detail"><div><strong>{{ active.name }}</strong><button type="button" class="secondary-btn" @click="sourceForActive">查看地图依据 <ArrowUpRight :size="14" aria-hidden="true" /></button></div><p>{{ active.location?.selection_reason ?? profile.location_evidence.selection_reason }}</p><p class="muted">{{ active.location?.accuracy_note ?? '总览位置按该条定位记录的对象与范围解释。' }}</p></div><p class="spatial-note">填色表示来源注明的公共参考范围；名称关系不表示相同场址或实际运输线路。地理参考：<a href="https://cloudcenter.tianditu.gov.cn/administrativeDivision/" target="_blank" rel="noreferrer">天地图</a> / <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a>；命名地点：<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL 1.0</a>。</p></section>
</template>
<style scoped>
.reference-sea-line{fill:none;stroke:#7d9f9a;stroke-width:1;vector-effect:non-scaling-stroke}
.spatial-detail{min-width:0}.spatial-heading{display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap;margin-bottom:16px}.spatial-heading h3{margin:0;font-size:20px}.spatial-heading p{font-size:13px;margin:6px 0 0}.map-controls{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.map-controls button{border:1px solid #bbd0d7;background:#f4f9fa;color:var(--text);min-width:42px;min-height:42px;border-radius:8px;padding:7px 11px;font-size:13px}.map-controls button:hover{background:#e1efef}.map-controls>span{font-size:12px;min-width:35px;text-align:center}.map-viewport{height:420px;overflow:hidden;border:1px solid #c6dbe1;border-radius:12px;touch-action:none;cursor:grab;user-select:none}.map-viewport:active{cursor:grabbing}.map-viewport svg{width:100%;height:100%;display:block}.reference-land{fill:#dce8df;stroke:#a5bfb1;stroke-width:1;vector-effect:non-scaling-stroke}.reference-area{fill:#bdc6e86b;stroke:#717eaf;stroke-width:1.5;vector-effect:non-scaling-stroke}.reference-area.active{fill:#72cec082;stroke:#087f7a;stroke-width:2.5}.grid-lines{stroke:#75919a;stroke-width:.6;stroke-opacity:.17}.marker-core{fill:#0b827b;stroke:#fff;stroke-width:2}.main .marker-core{fill:#356fa8}.selected .marker-core{fill:#b4651b;stroke:#fff;stroke-width:3}.map-anchor{cursor:pointer}.map-anchor:focus-visible{outline:none}.map-anchor:focus-visible .marker-core{stroke:#2244b6;stroke-width:4}.map-anchor text{fill:#fff;font-size:11px;font-weight:750;pointer-events:none}.marker-leader{stroke:#486a7a;stroke-width:1.2;stroke-dasharray:3 3}.active-name rect{fill:#ffffffed;stroke:#b2cbd3}.active-name text{fill:#244958;font-size:12px}.axis-label{fill:#587584;font-size:11px}.map-key{display:flex;gap:15px;flex-wrap:wrap;margin:14px 0 0;font-size:12px;color:var(--muted)}.map-key span{display:flex;align-items:center;gap:6px}.map-key i{width:10px;height:10px;background:#0b827b;border-radius:50%}.map-key .key-main{background:#356fa8;border-radius:2px;transform:rotate(45deg)}.map-key .key-area{background:#bdc6e8;border:1px solid #717eaf;border-radius:2px}.map-key .key-active{background:#72cec0;border:1px solid #087f7a;border-radius:2px}.map-help{font-size:12px;color:var(--muted);margin:9px 0 17px}.anchor-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:15px}.anchor-list button{display:flex;align-items:center;gap:9px;text-align:left;padding:10px;background:#f5f9fa;border:1px solid var(--line);border-radius:8px;color:var(--text);font-size:13px;min-height:45px}.anchor-list button b{font-size:12px;border-radius:5px;background:#e1edef;padding:4px 7px;flex-shrink:0}.anchor-list button span{overflow-wrap:anywhere}.anchor-list button[aria-pressed=true]{border-color:#087f7a;background:#e7f5f1}.anchor-detail{padding:16px;background:#f0f8f6;border-left:3px solid #087f7a;border-radius:0 8px 8px 0;overflow-wrap:anywhere}.anchor-detail>div{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.anchor-detail p{font-size:13px;line-height:1.8;margin:11px 0 0}.anchor-detail button{font-size:12px;padding:7px 10px;min-height:36px}.spatial-note{font-size:12px;color:var(--muted);line-height:1.8;margin:16px 0 0}
.regional-context{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:13px 15px;background:#eef7f5;border:1px solid #c8e2dc;border-radius:8px;margin-top:12px}.regional-context>div{display:grid;gap:4px;min-width:0}.regional-context strong{color:#176c69;font-size:14px}.regional-context span,.regional-context small{font-size:12px;line-height:1.5;color:#4b6977;overflow-wrap:anywhere}.map-help a{color:#087f7a;white-space:nowrap;margin-left:8px}
@media(max-width:760px){.spatial-heading h3{font-size:18px}.map-viewport{height:350px}.anchor-list{grid-template-columns:1fr 1fr}.anchor-list button{font-size:12px;padding:10px}.map-key{gap:10px}.axis-label{font-size:10px}.axis-label:last-child{display:none}.spatial-heading{gap:12px}}
</style>
