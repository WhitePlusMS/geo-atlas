<script setup lang="ts">
import { Plus, Minus, Crosshair, X, ArrowUpRight } from '@lucide/vue'
import * as THREE from 'three'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { latLonToVector3 } from '../../services/geo'
import { loadJson } from '../../services/dataLoader'
import { coordinateSemanticsLabel, locationLabel } from '../../services/labels'
import { createGlobeVisuals, earthRadius, type GlobeVisuals, type ReferenceCollection } from '../../services/globeVisuals'
import { globeAreas, globeMinDistance, globeSpatialFocus, globeZoomDirection, projectGlobeAreas } from '../../services/globeSpatial'
import { expandScreenPoints, groupScreenPoints, mapMarkerShape, mapService, placeMarkerLabels, rectsOverlap, surfacePointVisible, type MarkerLabel, type ScreenPoint } from '../../services/mapMarkers'
import { separateScreenPoints, spatialAnchors, type ProjectedAnchor } from '../../services/spatialMap'
import type { BaseProfile, SiteFeature } from '../../types/data'

interface DisplayMarker extends ScreenPoint {
  id: string
  members: SiteFeature[]
  color: string
  colors: string
  shape: string
  spread: boolean
  anchorX: number
  anchorY: number
}
interface FocusTransition { start: number; duration: number; from: THREE.Vector3; rotation: THREE.Quaternion; fromDistance: number; toDistance: number }
const props = defineProps<{ sites: SiteFeature[]; selectedSiteId?: string; profile?: BaseProfile }>()
const emit = defineEmits<{ select: [site: SiteFeature]; clear: []; source: [id: string]; details: [site: SiteFeature] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const viewport = ref<HTMLDivElement | null>(null)
const markers = ref<DisplayMarker[]>([])
const labels = ref<MarkerLabel[]>([])
const facilityMarkers = ref<ProjectedAnchor[]>([])
const facilityAreas = ref<ReturnType<typeof projectGlobeAreas>>([])
const selectedAnchorId = ref('main')
const anchors = computed(() => props.profile ? spatialAnchors(props.profile) : [])
const areas = computed(() => globeAreas(anchors.value))
const hasSpatialDetails = computed(() => anchors.value.length > 1 || areas.value.length > 0)
const areaCount = computed(() => anchors.value.filter(anchor => anchor.location && anchor.location.geometry.type !== 'Point').length)
const selectedAnchor = computed(() => anchors.value.find(anchor => anchor.id === selectedAnchorId.value) ?? anchors.value[0])
const selectedSite = computed(() => props.sites.find(site => site.properties.site_id === props.selectedSiteId))
const popupOpen = ref(false)
const popupKind = ref<'site' | 'facility'>('site')
const hoveredSite = ref<SiteFeature | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const expandedIds = ref<string[]>([])
const expandedMembers = computed(() => props.sites.filter((site) => expandedIds.value.includes(site.properties.site_id)))
const distance = ref(9.6)
const visibleCount = ref(0)
const geographyReady = ref(false)
const sceneError = ref('')
const motionEnabled = ref(true)
const rotating = ref(false)
const activePreset = ref('overview')
const presets = [
  { id: 'overview', label: '印太总览', latitude: 22, longitude: 164, distance: 9.6 },
  { id: 'japan', label: '日本 · 韩国', latitude: 34, longitude: 133, distance: 4.8 },
  { id: 'okinawa', label: '冲绳密集区', latitude: 26.4, longitude: 127.8, distance: 3.22 },
  { id: 'america', label: '美国西岸', latitude: 38, longitude: -122, distance: 5.25 },
  { id: 'islands', label: '西太平洋', latitude: 12, longitude: 144, distance: 5.6 },
  { id: 'australia', label: '澳大利亚', latitude: -19, longitude: 130, distance: 5.2 },
]
const minDistance = globeMinDistance
const maxDistance = 14
const minAltitude = minDistance - earthRadius
const zoomProgress = computed(() => Math.round(Math.log((maxDistance - earthRadius) / Math.max(distance.value - earthRadius, minAltitude)) / Math.log((maxDistance - earthRadius) / minAltitude) * 100))
const viewMode = computed(() => distance.value > 7 ? '全球总览' : distance.value > 3.8 ? '区域观察' : '近景查看')
const spreadMarkers = computed(() => markers.value.filter(marker => Math.hypot(marker.x - marker.anchorX, marker.y - marker.anchorY) > 2))
const popupMarker = computed(() => {
  if (!popupOpen.value || !selectedSite.value) return undefined
  if (hasSpatialDetails.value) return facilityMarkers.value.find(marker => marker.id === (popupKind.value === 'facility' ? selectedAnchorId.value : 'main'))
  return markers.value.find(marker => marker.members.length === 1 && marker.site.properties.site_id === props.selectedSiteId)
})
const popupPosition = computed(() => {
  const marker = popupMarker.value
  if (!marker) return undefined
  const popupWidth = Math.min(width <= 480 ? 230 : 270, Math.max(150, width - 24)); const popupHeight = Math.min(160, height - 70)
  const clampX = (x: number) => Math.max(8, Math.min(width - popupWidth - 8, x))
  const clampY = (y: number) => Math.max(38, Math.min(height - popupHeight - 8, y))
  const candidates = [
    { x: marker.x + 26, y: marker.y - popupHeight / 2 },
    { x: marker.x - popupWidth - 26, y: marker.y - popupHeight / 2 },
    { x: marker.x - popupWidth / 2, y: marker.y + 26 },
    { x: marker.x - popupWidth / 2, y: marker.y - popupHeight - 26 },
    { x: marker.x + 26, y: marker.y - popupHeight - 26 },
    { x: marker.x + 26, y: marker.y + 26 },
    { x: marker.x - popupWidth - 26, y: marker.y - popupHeight - 26 },
    { x: marker.x - popupWidth - 26, y: marker.y + 26 },
    { x: marker.x - popupWidth / 2, y: marker.y + 70 },
    { x: marker.x - popupWidth / 2, y: marker.y - popupHeight - 70 },
    { x: 8, y: 38 }, { x: width - popupWidth - 8, y: 38 },
    { x: 8, y: height - popupHeight - 8 }, { x: width - popupWidth - 8, y: height - popupHeight - 8 },
  ].map(candidate => ({ x: clampX(candidate.x), y: clampY(candidate.y), width: popupWidth, height: popupHeight }))
  const obstacles = [...markers.value, ...facilityMarkers.value].map(item => ({ x: item.x - 22, y: item.y - 22, width: 44, height: 44 }))
  obstacles.push({ x: width - 60, y: 0, width: 60, height: 250 })
  obstacles.push({ x: 0, y: height - 60, width: 170, height: 60 })
  // 无法完全避开时，优先选择遮挡面积更小的位置，保留更多可点击区域。
  const overlap = (candidate: typeof candidates[number]) => obstacles.reduce((total, item) => {
    if (!rectsOverlap(candidate, item, 2)) return total
    const x = Math.max(0, Math.min(candidate.x + candidate.width, item.x + item.width) - Math.max(candidate.x, item.x))
    const y = Math.max(0, Math.min(candidate.y + candidate.height, item.y + item.height) - Math.max(candidate.y, item.y))
    return total + x * y
  }, 0)
  const best = candidates.sort((a, b) => overlap(a) - overlap(b))[0]!
  return { left: `${best.x}px`, top: `${best.y}px`, width: `${popupWidth}px` }
})
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let visuals: GlobeVisuals | null = null
let observer: ResizeObserver | null = null
let keyLight: THREE.DirectionalLight | null = null
let transition: FocusTransition | null = null
let animation = 0
let disposed = false
let projectionDirty = true
let lastProjection = 0
let elapsed = 0
let previousFrame = 0
let width = 800
let height = 650

function clusterColors(members: SiteFeature[]): string {
  const counts = new Map<string, number>()
  members.forEach((site) => { const color = mapService(site).color; counts.set(color, (counts.get(color) ?? 0) + 1) })
  let progress = 0
  const stops = [...counts].map(([color, count]) => { const start = progress; progress += count / members.length * 100; return `${color} ${start}% ${progress}%` })
  return `conic-gradient(${stops.join(', ')})`
}

function displayPoint(point: ScreenPoint, spread = false, anchorX = point.x, anchorY = point.y): DisplayMarker {
  return { ...point, id: point.site.properties.site_id, members: [point.site], color: mapService(point.site).color, colors: '', shape: mapMarkerShape(point.site), spread, anchorX, anchorY }
}

function projectMarkers() {
  if (!camera) return
  camera.updateMatrixWorld()
  const points: ScreenPoint[] = []
  for (const site of props.sites) {
    const position = latLonToVector3(Number(site.properties.latitude), Number(site.properties.longitude), earthRadius)
    if (!surfacePointVisible(position, camera.position)) continue
    const projected = position.project(camera)
    const x = (projected.x + 1) * width / 2
    const y = (1 - projected.y) * height / 2
    if (projected.z < -1 || projected.z > 1 || x < 22 || x > width - 22 || y < 44 || y > height - 38) continue
    points.push({ site, x, y })
  }
  visibleCount.value = points.length
  // 设施视角使用同一站点的总览锚点，避免与原站点标记重叠。
  const displayPoints = hasSpatialDetails.value ? points.filter(point => point.site.properties.site_id !== props.selectedSiteId) : points
  const expanded = displayPoints.filter((point) => expandedIds.value.includes(point.site.properties.site_id))
  const grouped = groupScreenPoints(displayPoints.filter((point) => !expandedIds.value.includes(point.site.properties.site_id)))
  const result: DisplayMarker[] = grouped.map((group) => group.points.length === 1 ? displayPoint(group.points[0]!) : {
    ...group.points[0]!, id: group.id, x: group.x, y: group.y, members: group.points.map((point) => point.site),
    color: '#d4e7f2', colors: clusterColors(group.points.map((point) => point.site)), shape: 'cluster', spread: false, anchorX: group.x, anchorY: group.y,
  })
  if (expanded.length) {
    // 空间已足够时回到各自真实投影；只有仍然相撞时才展开并画指示线。
    const crowded = expanded.some((point, index) => expanded.some((other, otherIndex) => index !== otherIndex && Math.hypot(point.x - other.x, point.y - other.y) < 44))
    const spread = crowded ? expandScreenPoints(expanded, width, height) : expanded.map((point) => ({ ...point, anchorX: point.x, anchorY: point.y }))
    result.push(...spread.map((point) => displayPoint(point, crowded, point.anchorX, point.anchorY)))
  }
  const projected = hasSpatialDetails.value ? anchors.value.flatMap(anchor => {
    const position = latLonToVector3(anchor.latitude, anchor.longitude, earthRadius)
    if (!surfacePointVisible(position, camera!.position)) return []
    const point = position.project(camera!)
    const x = (point.x + 1) * width / 2; const y = (1 - point.y) * height / 2
    if (point.z < -1 || point.z > 1 || x < 0 || x > width || y < 0 || y > height) return []
    return [{ ...anchor, x, y, anchorX: x, anchorY: y }]
  }) : []
  type LayerPoint = { kind: 'site'; marker: DisplayMarker; x: number; y: number; anchorX: number; anchorY: number }
    | { kind: 'facility'; anchor: ProjectedAnchor; x: number; y: number; anchorX: number; anchorY: number }
  const layers: LayerPoint[] = [
    ...result.map(marker => ({ kind: 'site' as const, marker, x: marker.x, y: marker.y, anchorX: marker.anchorX, anchorY: marker.anchorY })),
    ...projected.map(anchor => ({ kind: 'facility' as const, anchor, x: anchor.x, y: anchor.y, anchorX: anchor.anchorX, anchorY: anchor.anchorY })),
  ]
  // 两个图层共同避让，但保留各自的身份、数据与原始投影。
  const spaced = separateScreenPoints(layers, width, height)
  markers.value = spaced.flatMap(point => point.kind === 'site' ? [{ ...point.marker, x: point.x, y: point.y }] : [])
  facilityMarkers.value = spaced.flatMap(point => point.kind === 'facility' ? [{ ...point.anchor, x: point.x, y: point.y }] : [])
  // 相机移动可能直接移除悬停元素，此时不会收到 pointerleave。
  if (hoveredSite.value && !markers.value.some(marker => marker.members.length === 1 && marker.site.properties.site_id === hoveredSite.value?.properties.site_id)) hoveredSite.value = null
  facilityAreas.value = hasSpatialDetails.value ? projectGlobeAreas(areas.value, camera, width, height) : []
  const singles = markers.value.filter((marker) => marker.members.length === 1)
  const priorities = singles.filter((marker) => marker.site.properties.site_id === props.selectedSiteId || marker.site.properties.site_id === hoveredSite.value?.properties.site_id)
  const nearLabels = distance.value < 5.4 ? singles.filter((marker) => !priorities.includes(marker)).sort((a, b) => Math.hypot(a.x - width / 2, a.y - height / 2) - Math.hypot(b.x - width / 2, b.y - height / 2)).slice(0, 7) : []
  const obstacles = [...markers.value, ...facilityMarkers.value].map(marker => ({ x: marker.x - 22, y: marker.y - 22, width: 44, height: 44 }))
  labels.value = placeMarkerLabels([...priorities, ...nearLabels], obstacles, width, height)
  distance.value = camera.position.length()
  projectionDirty = false
}

function clearExpansion() { expandedIds.value = []; projectionDirty = true }

function focusOn(normal: THREE.Vector3, targetDistance: number, duration = 650) {
  if (!camera || !controls) return
  controls.autoRotate = false
  rotating.value = false
  // 清空旋转阻尼，防止相机定位与上一手势的残留角度互相抢位置。
  controls.enableDamping = false
  controls.update()
  controls.enabled = false
  const from = camera.position.clone().normalize()
  transition = { start: performance.now(), duration, from, rotation: new THREE.Quaternion().setFromUnitVectors(from, normal.clone().normalize()), fromDistance: camera.position.length(), toDistance: THREE.MathUtils.clamp(targetDistance, minDistance, maxDistance) }
  hoveredSite.value = null
}

function usePreset(id: string) {
  const preset = presets.find((item) => item.id === id)
  if (!preset) return
  activePreset.value = id
  clearExpansion()
  emit('clear')
  focusOn(latLonToVector3(preset.latitude, preset.longitude, 1), preset.distance)
}

async function selectSite(site: SiteFeature) {
  const containingGroup = markers.value.find((marker) => marker.members.some((member) => member.properties.site_id === site.properties.site_id))
  // 选择展开成员后保持分散状态；定位下拉框也会展开目标所在的密集组。
  // 不能一边显示“已选站点”，一边又把它藏回聚合数字里。
  if (!expandedIds.value.includes(site.properties.site_id)) {
    expandedIds.value = containingGroup && containingGroup.members.length > 1 ? containingGroup.members.map((member) => member.properties.site_id) : []
  }
  popupKind.value = 'site'; popupOpen.value = true
  emit('select', site)
  projectionDirty = true
  activePreset.value = ''
  // 等父组件按 site_id 找到画像，避免先使用上一个站点的设施范围。
  await nextTick()
  if (props.selectedSiteId !== site.properties.site_id) return
  selectedAnchorId.value = 'main'
  if (hasSpatialDetails.value) focusFacilities()
  else focusOn(latLonToVector3(Number(site.properties.latitude), Number(site.properties.longitude), 1), Math.max(3.075, Math.min(distance.value, 4.1)))
}
defineExpose({ selectSite })

function focusFacilities(selectedOnly = false) {
  if (!camera) return
  const selected = selectedAnchor.value
  const target = globeSpatialFocus(selectedOnly && selected ? [selected] : anchors.value, camera)
  // 单点默认保留周边地理上下文，但不强制放远用户已经拉近的视角。
  const singlePoint = selectedOnly && selected && (!selected.location || selected.location.geometry.type === 'Point')
  if (target) focusOn(target.normal, singlePoint ? Math.min(distance.value, 3.075) : target.distance)
}

function selectAnchor(id: string) { selectedAnchorId.value = id; popupKind.value = 'facility'; popupOpen.value = true; projectionDirty = true }
function showAnchorSource() {
  if (selectedAnchor.value && props.profile) emit('source', selectedAnchor.value.location?.source_id ?? props.profile.location_evidence.source_id)
}
function showPopupSource() {
  if (popupKind.value === 'facility') showAnchorSource()
  else if (selectedSite.value) emit('source', selectedSite.value.properties.coordinate_source_id)
}

function activateMarker(marker: DisplayMarker) {
  if (marker.members.length === 1) { selectSite(marker.site); return }
  expandedIds.value = marker.members.map((site) => site.properties.site_id)
  projectionDirty = true
  // 聚合圈表示视图聚合，成员位置仍各自投影；一键拉近后继续分解。
  const normal = marker.members.reduce((sum, site) => sum.add(latLonToVector3(Number(site.properties.latitude), Number(site.properties.longitude), 1)), new THREE.Vector3()).normalize()
  activePreset.value = ''
  focusOn(normal, Math.max(3.12, earthRadius + (distance.value - earthRadius) * 0.42), 550)
}

function zoomTo(targetDistance: number) {
  if (!camera) return
  const selected = props.sites.find((site) => site.properties.site_id === props.selectedSiteId)
  const anchor = hasSpatialDetails.value ? selectedAnchor.value : undefined
  const normal = anchor ? latLonToVector3(anchor.latitude, anchor.longitude, 1)
    : selected ? latLonToVector3(Number(selected.properties.latitude), Number(selected.properties.longitude), 1)
      : camera.position.clone().normalize()
  focusOn(normal, targetDistance, 280)
}
function zoomBy(direction: number) { zoomTo(earthRadius + (distance.value - earthRadius) * (direction > 0 ? 0.72 : 1 / 0.72)) }
function inputZoom(event: Event) {
  const progress = Number((event.target as HTMLInputElement).value) / 100
  zoomTo(earthRadius + (maxDistance - earthRadius) * Math.pow(minAltitude / (maxDistance - earthRadius), progress))
}
function wheelZoom(event: WheelEvent) {
  if (!camera || !viewport.value || !event.deltaY) return
  if (event.target instanceof Element && event.target.closest('.globe-zoom, .selection-popover')) return
  event.preventDefault(); event.stopPropagation()
  const rect = viewport.value.getBoundingClientRect()
  const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1)
  const targetDistance = THREE.MathUtils.clamp(earthRadius + (camera.position.length() - earthRadius) * Math.exp(THREE.MathUtils.clamp(delta * 0.0015, -0.9, 0.9)), minDistance, maxDistance)
  if (Math.abs(targetDistance - camera.position.length()) < 1e-9) return
  camera.updateMatrixWorld()
  const pointer = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2)
  const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(pointer, camera)
  const point = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(), earthRadius), new THREE.Vector3())
  const normal = point ? globeZoomDirection(camera.position, point, targetDistance) : camera.position.clone().normalize()
  activePreset.value = ''
  focusOn(normal, targetDistance, 180)
}
function chooseSite(event: Event) {
  const id = (event.target as HTMLSelectElement).value
  const site = props.sites.find((item) => item.properties.site_id === id)
  if (site) selectSite(site)
}
function toggleRotation() { rotating.value = !rotating.value; if (controls) controls.autoRotate = rotating.value }
function showHover(marker: DisplayMarker) {
  if (marker.members.length !== 1) return
  hoveredSite.value = marker.site
  tooltipPosition.value = { x: Math.min(width - 244, Math.max(10, marker.x + 18)), y: Math.min(height - 105, Math.max(48, marker.y + 18)) }
  projectionDirty = true
}
function hideHover() { hoveredSite.value = null; projectionDirty = true }
function controlsChanged() { projectionDirty = true }
function controlsStarted() { hideHover(); activePreset.value = '' }
// 近地面逐渐降低旋转速度；远景仍使用原来的操作速度。
function movementScale(cameraDistance: number) {
  const altitude = Math.max(minAltitude, cameraDistance - earthRadius)
  return Math.min(1, altitude * (0.1 + 0.9 * Math.min(1, altitude)))
}
function handleKey(event: KeyboardEvent) {
  if (!camera) return
  if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomBy(1) }
  else if (event.key === '-') { event.preventDefault(); zoomBy(-1) }
  else if (event.key === 'Home') { event.preventDefault(); usePreset('overview') }
  else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault()
    const latitude = THREE.MathUtils.radToDeg(Math.asin(camera.position.y / camera.position.length()))
    const longitude = THREE.MathUtils.radToDeg(Math.atan2(camera.position.x, camera.position.z))
    // 近景按视距缩小方向键步长，避免一次跳过整个设施。
    const step = movementScale(camera.position.length())
    focusOn(latLonToVector3(THREE.MathUtils.clamp(latitude + (event.key === 'ArrowUp' ? 4 * step : event.key === 'ArrowDown' ? -4 * step : 0), -85, 85), longitude + (event.key === 'ArrowLeft' ? -5 * step : event.key === 'ArrowRight' ? 5 * step : 0), 1), camera.position.length(), 180)
  }
}
function resize() {
  if (!viewport.value || !renderer || !camera) return
  const rect = viewport.value.getBoundingClientRect()
  width = Math.max(1, rect.width); height = Math.max(1, rect.height)
  camera.aspect = width / height
  // 竖屏维持同一水平视场，不能用桌面的垂直视场把地球两侧裁掉。
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(39 / 2)) / Math.min(camera.aspect, 1)))
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  projectionDirty = true
}

async function loadGeography() {
  try {
    const reference = await loadJson<ReferenceCollection>('world_reference.geojson')
    if (disposed || !visuals) return
    visuals.applyGeography(reference)
    geographyReady.value = true
  } catch (cause) {
    if (disposed) return
    sceneError.value = '地理参考层加载失败，请重新加载页面。'
    console.warn('[DTC 地理参考层]', cause instanceof Error ? cause.message : cause)
  }
}

onMounted(() => {
  if (!canvas.value || !viewport.value) return
  try {
    motionEnabled.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x060e1d)
    camera = new THREE.PerspectiveCamera(39, 1, 0.00005, 100)
    camera.position.copy(latLonToVector3(22, 164, 9.6)); camera.lookAt(0, 0, 0)
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.22
    scene.add(new THREE.AmbientLight(0xbcd6eb, 1.05))
    keyLight = new THREE.DirectionalLight(0xfff3df, 2.35); scene.add(keyLight)
    scene.add(new THREE.HemisphereLight(0xcdeaff, 0x172f4d, 0.75))
    visuals = createGlobeVisuals(renderer); scene.add(visuals.group)
    controls = new OrbitControls(camera, canvas.value)
    controls.enableDamping = true; controls.dampingFactor = 0.075; controls.enablePan = false
    controls.minDistance = minDistance; controls.maxDistance = maxDistance; controls.zoomSpeed = 0.65; controls.rotateSpeed = 0.58
    controls.autoRotateSpeed = 0.28
    controls.addEventListener('change', controlsChanged); controls.addEventListener('start', controlsStarted)
    observer = new ResizeObserver(resize); observer.observe(viewport.value)
    resize(); void loadGeography()
    console.info('[DTC 三维地图]', `${props.sites.length}条站点；屏幕标记与地理位置分层绘制`)
    const frame = (now: number) => {
      if (disposed || !renderer || !scene || !camera) return
      const delta = previousFrame ? Math.min((now - previousFrame) / 1000, 0.1) : 0
      previousFrame = now
      if (motionEnabled.value) elapsed += delta
      if (transition && controls) {
        const progress = Math.min(1, (now - transition.start) / transition.duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        const orientation = new THREE.Quaternion().slerp(transition.rotation, eased)
        camera.position.copy(transition.from).applyQuaternion(orientation).multiplyScalar(THREE.MathUtils.lerp(transition.fromDistance, transition.toDistance, eased))
        camera.lookAt(0, 0, 0); projectionDirty = true
        if (progress === 1) { transition = null; controls.enabled = true; controls.enableDamping = true; controls.update() }
      } else controls?.update()
      // 近裁剪面随地表距离收放，避免固定极小值降低远距离的深度精度。
      // 留出局部地图和海岸线高于球面的余量，贴近地面时仍不裁掉它们。
      const near = Math.min(0.1, Math.max(0.00001, (camera.position.length() - earthRadius - 0.00012) * 0.25))
      if (camera.near !== near) { camera.near = near; camera.updateProjectionMatrix() }
      // OrbitControls围绕地心旋转；贴近地表时同步缩小拖动幅度。
      if (controls) controls.rotateSpeed = 0.58 * movementScale(camera.position.length())
      if (projectionDirty && now - lastProjection >= 32) { projectMarkers(); lastProjection = now }
      visuals?.update(elapsed, camera.position, motionEnabled.value)
      // 展示照明随视角保持侧上方主光，不把当前视窗画成不可辨认的黑夜。
      keyLight?.position.copy(camera.position).add(new THREE.Vector3(-4, 5, 2))
      renderer.render(scene, camera)
      animation = requestAnimationFrame(frame)
    }
    animation = requestAnimationFrame(frame)
  } catch (cause) {
    sceneError.value = '三维场景未能初始化，请确认浏览器已开启WebGL。'
    console.error('[DTC 三维地图]', cause instanceof Error ? cause.message : cause)
  }
})
watch(() => props.sites, () => { clearExpansion(); hideHover(); projectionDirty = true })
watch(() => props.selectedSiteId, id => { selectedAnchorId.value = 'main'; if (!id) popupOpen.value = false; projectionDirty = true })
watch(() => props.profile, () => { projectionDirty = true })
onBeforeUnmount(() => {
  disposed = true; cancelAnimationFrame(animation); observer?.disconnect()
  controls?.removeEventListener('change', controlsChanged); controls?.removeEventListener('start', controlsStarted)
  controls?.dispose(); visuals?.dispose(); renderer?.dispose()
  visuals = null; renderer = null; scene = null; camera = null; controls = null
})
</script>

<template>
  <section class="globe-explorer" aria-label="交互式三维地图">
    <div class="globe-toolbar">
      <div class="region-presets" role="group" aria-label="地图区域定位">
        <button v-for="preset in presets" :key="preset.id" type="button" :aria-pressed="activePreset === preset.id" @click="usePreset(preset.id)">{{ preset.label }}</button>
      </div>
      <select aria-label="地图定位站点" :value="selectedSiteId ?? ''" @change="chooseSite">
        <option value="">定位一个站点</option>
        <option v-for="site in sites" :key="site.properties.site_id" :value="site.properties.site_id">{{ String(site.properties.source_record_no).padStart(2, '0') }} · {{ site.properties.display_name }}</option>
      </select>
    </div>
    <div ref="viewport" class="globe-viewport" @pointerleave="hideHover" @wheel.capture="wheelZoom">
      <canvas ref="canvas" tabindex="0" aria-label="DTC 2026 三维地球：拖动旋转、滚轮缩放，方向键旋转" @keydown="handleKey" />
      <div v-if="sceneError" class="globe-error" role="alert">{{ sceneError }}</div>
      <div class="view-status"><i />{{ geographyReady ? viewMode : '加载地理底图' }}<span>{{ visibleCount }} / {{ sites.length }} 站点在视窗中</span></div>
      <svg class="marker-leaders" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
        <path v-for="area in facilityAreas" :key="area.id" :d="area.path" class="facility-area" :class="{ active: area.anchorId === selectedAnchorId }" fill-rule="evenodd" />
        <g v-for="marker in spreadMarkers" :key="marker.id">
          <line :x1="marker.anchorX" :y1="marker.anchorY" :x2="marker.x" :y2="marker.y" :stroke="marker.color" />
          <circle :cx="marker.anchorX" :cy="marker.anchorY" r="2.5" :fill="marker.color" />
        </g>
        <g v-for="marker in facilityMarkers" :key="marker.id">
          <line v-if="Math.hypot(marker.x-marker.anchorX, marker.y-marker.anchorY) > 2" :x1="marker.anchorX" :y1="marker.anchorY" :x2="marker.x" :y2="marker.y" stroke="#a8e8dc" />
          <circle v-if="Math.hypot(marker.x-marker.anchorX, marker.y-marker.anchorY) > 2" :cx="marker.anchorX" :cy="marker.anchorY" r="2.5" fill="#a8e8dc" />
        </g>
      </svg>
      <div class="globe-marker-layer">
        <button v-for="marker in markers" :key="marker.id" type="button" class="globe-marker" :class="[marker.shape, { selected: marker.members.some((site) => site.properties.site_id === selectedSiteId), expanded: marker.spread }]" :style="{ left: `${marker.x}px`, top: `${marker.y}px`, '--marker-color': marker.color, '--cluster-colors': marker.colors }" :aria-label="marker.members.length > 1 ? `展开 ${marker.members.length} 个站点：${marker.members.map((site) => site.properties.display_name).join('、')}` : `选择 ${marker.site.properties.source_record_no} ${marker.site.properties.display_name}`" :data-record-no="marker.members.length === 1 ? marker.site.properties.source_record_no : undefined" :data-marker-shape="marker.shape" @click.stop="activateMarker(marker)" @pointerenter="showHover(marker)" @pointerleave="hideHover" @focus="showHover(marker)" @blur="hideHover">
          <span class="marker-core">{{ marker.members.length > 1 ? marker.members.length : String(marker.site.properties.source_record_no).padStart(2, '0') }}</span>
        </button>
        <button v-for="marker in facilityMarkers" :key="'facility-' + marker.id" type="button" class="facility-marker" :class="{ main: marker.id === 'main', selected: selectedAnchorId === marker.id }" :style="{ left: `${marker.x}px`, top: `${marker.y}px` }" :aria-label="`选择设施 ${marker.name}`" :aria-pressed="selectedAnchorId === marker.id" @click.stop="selectAnchor(marker.id)"><span>{{ marker.label }}</span></button>
        <span v-for="label in labels" :key="label.siteId" class="marker-label" :style="{ left: `${label.x}px`, top: `${label.y}px`, width: `${label.width}px` }">{{ label.text }}</span>
      </div>
      <aside v-if="popupMarker && popupPosition && selectedSite" class="selection-popover" :style="popupPosition" aria-label="所选点位信息" @pointerdown.stop>
        <div class="selection-heading"><span>{{ popupKind === 'facility' ? '组成地点' : '参考站点' }}</span><button type="button" aria-label="关闭点位信息" @click="popupOpen = false"><X :size="18" aria-hidden="true" /></button></div>
        <strong>{{ popupKind === 'facility' && selectedAnchor ? selectedAnchor.name : selectedSite.properties.display_name }}</strong>
        <p v-if="popupKind === 'facility'">{{ selectedSite.properties.display_name }} · 公开参考位置</p>
        <p v-else>{{ locationLabel(selectedSite.properties.location_label) }} · {{ mapService(selectedSite).label }} · {{ coordinateSemanticsLabel(selectedSite.properties.coordinate_semantics) }}</p>
        <small v-if="popupKind === 'facility' && selectedAnchor">{{ selectedAnchor.latitude.toFixed(5) }}°, {{ selectedAnchor.longitude.toFixed(5) }}°</small>
        <small v-else>{{ Number(selectedSite.properties.latitude).toFixed(selectedSite.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 4) }}°, {{ Number(selectedSite.properties.longitude).toFixed(selectedSite.properties.coordinate_semantics === 'LOCALITY_ANCHOR' ? 2 : 4) }}°</small>
        <div class="selection-actions"><button type="button" @click="showPopupSource">查看来源</button><button type="button" @click="emit('details', selectedSite)">查看画像</button></div>
      </aside>
      <div v-if="hoveredSite" class="map-hover-card" role="tooltip" :style="{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }">
        <strong>{{ hoveredSite.properties.display_name }}</strong><span>{{ locationLabel(hoveredSite.properties.location_label) }} · {{ mapService(hoveredSite).label }}</span><small>{{ coordinateSemanticsLabel(hoveredSite.properties.coordinate_semantics) }}</small>
      </div>
      <div class="globe-zoom" aria-label="地图视图控制">
        <button type="button" aria-label="放大地图" @click="zoomBy(1)"><Plus :size="18" aria-hidden="true" /></button>
        <input type="range" min="0" max="100" :value="zoomProgress" aria-label="地图缩放" @input="inputZoom" />
        <button type="button" aria-label="缩小地图" @click="zoomBy(-1)"><Minus :size="18" aria-hidden="true" /></button>
        <button type="button" class="reset-view" aria-label="恢复印太总览" @click="usePreset('overview')"><Crosshair :size="18" aria-hidden="true" /></button>
      </div>
      <div class="scene-options"><button type="button" :aria-pressed="motionEnabled" @click="motionEnabled = !motionEnabled">飞机 / 卫星</button><button type="button" :aria-pressed="rotating" @click="toggleRotation">自动旋转</button></div>
      <span class="demonstration-note">飞行器与轨道为演示动画</span>
    </div>
    <section v-if="hasSpatialDetails && selectedAnchor && profile" class="facility-panel" aria-label="地球上的设施与参考范围">
      <div class="facility-heading"><div><strong>设施与地区 GIS 分布</strong><small>{{ anchors.length - 1 }} 处独立成员定位 · {{ areaCount }} 个公共参考范围</small></div><div class="facility-controls"><button type="button" @click="focusFacilities()">查看全部</button><button type="button" @click="focusFacilities(true)">聚焦所选</button></div></div>
      <div class="facility-list" role="group" aria-label="选择组成地点"><button v-for="anchor in anchors" :key="anchor.id" type="button" :aria-pressed="selectedAnchor.id === anchor.id" @click="selectAnchor(anchor.id)"><b>{{ anchor.label }}</b><span>{{ anchor.name }}</span></button></div>
      <div class="facility-selection"><strong>{{ selectedAnchor.name }}</strong><button type="button" @click="showAnchorSource">查看地图依据 <ArrowUpRight :size="14" aria-hidden="true" /></button><p>{{ selectedAnchor.location?.selection_reason ?? profile.location_evidence.selection_reason }}</p><small>{{ selectedAnchor.location?.accuracy_note ?? '总览位置按该条定位记录的对象与范围解释。' }}</small></div>
      <p class="facility-note">填色表示公开来源参考范围，并非正式设施边界；避让引线指回原始位置。</p>
    </section>
    <div v-if="expandedIds.length" class="expanded-group" aria-label="密集区域站点列表">
      <div><strong>已展开 {{ expandedMembers.length }} 个站点</strong><button type="button" aria-label="收起聚合站点" @click="clearExpansion"><X :size="18" aria-hidden="true" /></button></div>
      <small>避让连线指回原位置；屏幕空间不足时可从列表选择</small>
      <button v-for="site in expandedMembers" :key="site.properties.site_id" type="button" @click="selectSite(site)"><i :style="{ background: mapService(site).color }" />{{ String(site.properties.source_record_no).padStart(2, '0') }} · {{ site.properties.display_name }}</button>
    </div>
    <div class="globe-instructions"><span>拖动旋转 · 滚轮围绕指向位置缩放 · 点击数字聚合展开</span><span>离线底图不含道路或卫星影像；避让连线指回原位置</span></div>
  </section>
</template>

<style scoped>
.globe-explorer{background:#081222;color:#d9e7f3;overflow:hidden;border-radius:13px}
.globe-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;border-bottom:1px solid #1c324a;background:#0a1729}
.region-presets{display:flex;flex-wrap:wrap;gap:5px}
.globe-toolbar button,.scene-options button{border:1px solid transparent;background:transparent;color:#9bb0c8;padding:7px 10px;border-radius:6px;font-size:11px}
.globe-toolbar button:hover,.globe-toolbar button[aria-pressed=true]{color:#c0f5ee;background:#143337;border-color:#285052}
.globe-toolbar select{max-width:210px;min-width:130px;color:#b9cedf;background:#0d2034;border:1px solid #29415a;border-radius:6px;padding:8px;font-size:11px}
.globe-viewport{height:clamp(420px,calc(100dvh - 247px),1200px);min-height:420px;position:relative;overflow:hidden;isolation:isolate}
.globe-viewport>canvas{width:100%;height:100%;display:block;touch-action:none;outline:none;cursor:grab}
.globe-viewport>canvas:active{cursor:grabbing}.globe-viewport>canvas:focus-visible{outline:2px solid #72d9c5;outline-offset:-3px}
.view-status{position:absolute;left:18px;top:15px;display:flex;align-items:center;gap:9px;color:#d6e5f5;font-size:11px;pointer-events:none}
.view-status i{width:5px;height:5px;border-radius:50%;background:#75dbc8;box-shadow:0 0 10px #63bbba}.view-status span{color:#829ab4;font-size:10px;border-left:1px solid #344962;padding-left:10px}
.marker-leaders,.globe-marker-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.marker-leaders line{stroke-width:1;opacity:.7}.marker-leaders circle{opacity:.9}
.facility-area{fill:#a9bbef;fill-opacity:.35;stroke:#c5d1ff;stroke-width:1.5;vector-effect:non-scaling-stroke}.facility-area.active{fill:#72d9c5;fill-opacity:.48;stroke:#9bf5df;stroke-width:2}
.facility-marker{position:absolute;transform:translate(-50%,-50%);width:44px;height:44px;padding:0;border:0;background:transparent;display:grid;place-items:center;pointer-events:auto;z-index:5}.facility-marker span{display:grid;place-items:center;width:22px;height:22px;border:2px solid #fff;border-radius:50%;background:#087f7a;color:#fff;font-size:11px;font-weight:700;box-shadow:0 2px 8px #0009}.facility-marker.main span{background:#2f66a4;border-radius:5px}.facility-marker.selected span{background:#a7611a}.facility-marker:focus-visible{outline:2px solid #9bf5df;outline-offset:-3px;border-radius:50%}
.selection-popover{position:absolute;z-index:10;padding:10px 12px;border:1px solid #6b96a3;border-radius:9px;background:#f8fcfdec;color:#173444;box-shadow:0 8px 24px #0005;max-height:min(160px,calc(100% - 54px));overflow:auto;overscroll-behavior:contain}.selection-heading{padding-right:36px;color:#087f7a;font-size:11px}.selection-heading button{position:absolute;right:0;top:0;width:44px;height:44px;border:0;border-radius:6px;background:transparent;color:#365869;font-size:22px}.selection-popover>strong{display:block;line-height:1.35;font-size:15px;overflow-wrap:anywhere}.selection-popover p{margin:4px 0;font-size:12px;line-height:1.4;color:#536b76}.selection-popover small{display:block;font-size:12px;color:#365869}.selection-actions{display:flex;gap:7px;margin-top:6px}.selection-actions button{min-height:44px;padding:7px 10px;border:1px solid #9cc5c0;border-radius:6px;background:#e7f5f1;color:#145c59;font-size:12px}.selection-actions button:hover{background:#d4eae7}
.facility-panel{padding:18px;background:#0d2030;border-top:1px solid #315061}.facility-heading{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}.facility-heading strong,.facility-heading small{display:block}.facility-heading small{color:#abc3cd;margin-top:5px}.facility-controls{display:flex;gap:8px}.facility-controls button,.facility-selection button{border:1px solid #527d83;background:#173944;color:#d9f6ef;border-radius:6px;padding:8px 11px;min-height:38px}.facility-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:15px}.facility-list button{display:flex;align-items:center;gap:8px;min-width:0;min-height:44px;padding:8px;text-align:left;border:1px solid #365769;border-radius:7px;color:#d5e8ee;background:#102a3a}.facility-list button[aria-pressed=true]{border-color:#7ddfc9;background:#1c4949}.facility-list b{display:grid;place-items:center;min-width:24px;height:24px;border-radius:5px;background:#255365}.facility-list span{overflow-wrap:anywhere}.facility-selection{margin-top:13px;padding:12px 14px;border-left:3px solid #72d9c5;background:#132e3c}.facility-selection strong{margin-right:12px}.facility-selection p,.facility-selection small,.facility-note{color:#b7cdd5;font-size:12px;line-height:1.7}.facility-selection p{margin:8px 0 3px}.facility-note{margin:10px 0 0}
.globe-marker{position:absolute;transform:translate(-50%,-50%);width:44px;height:44px;padding:4px;border:0;border-radius:50%;color:#061321;background:transparent;pointer-events:auto;display:grid;place-items:center;z-index:2;transition:box-shadow .15s;touch-action:manipulation}
.marker-core{width:20px;height:20px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.6);background:var(--marker-color);border-radius:50%;font:700 9px/1 "Segoe UI",sans-serif;box-shadow:0 2px 10px #0008}
.globe-marker.multi .marker-core{border-radius:6px;border:2px solid #efffff;box-shadow:0 0 0 2px var(--marker-color),0 2px 10px #0008;background:#0a2132;color:var(--marker-color)}
.globe-marker.edca .marker-core{border-radius:3px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);width:25px;height:25px;color:#061321;background:#eabb6f;border:0;font-size:9px}
.globe-marker.locality .marker-core{background:#132337;color:#d3afff;border:2px dashed #ce9aff}
.globe-marker.cluster{width:44px;height:44px;padding:7px;background:var(--cluster-colors);border:1px solid #b3d5e54d;box-shadow:0 3px 16px #0007}
.globe-marker.cluster .marker-core{width:28px;height:28px;background:#0d2033;color:#eaf6ff;border:0;font-size:12px}
.globe-marker.selected,.globe-marker:focus-visible{outline:2px solid #f0ffff;outline-offset:3px;z-index:4}.globe-marker:hover{outline:1px solid #dffbff;outline-offset:2px;z-index:5}
.marker-label{position:absolute;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:25px;padding:0 8px;font-size:10px;border:1px solid #446179;background:rgba(8,22,38,.89);color:#dbeaf9;border-radius:4px;z-index:1}
.map-hover-card{position:absolute;z-index:9;width:235px;padding:12px 14px;border:1px solid #6b96a3;background:rgba(8,22,38,.97);border-radius:8px;box-shadow:0 8px 24px #0005;pointer-events:none}
.map-hover-card strong,.map-hover-card span,.map-hover-card small{display:block}.map-hover-card strong{font-size:12px;line-height:1.5}.map-hover-card span{color:#a1b9d0;font-size:11px;margin-top:6px}.map-hover-card small{color:#77d5c6;font-size:10px;margin-top:7px}
.globe-zoom{position:absolute;right:15px;top:15px;width:38px;display:grid;justify-items:center;gap:7px;padding:5px;background:#0b1d32d9;border:1px solid #344a63;border-radius:9px;z-index:7}
.globe-zoom button{background:transparent;color:#cfe4f8;border:0;font-size:21px;width:28px;height:30px;border-radius:5px}.globe-zoom button:hover{background:#24445d}.globe-zoom input{writing-mode:vertical-lr;direction:rtl;width:22px;height:98px;accent-color:#73d9c6;cursor:pointer}.globe-zoom .reset-view{border-top:1px solid #344a63;font-size:20px}
.scene-options{position:absolute;left:15px;bottom:14px;display:flex;gap:5px}.scene-options button{background:#0d2034cc;border-color:#2b435c;padding:7px 9px;font-size:10px}.scene-options button[aria-pressed=true]{color:#93decf;border-color:#3a685f}
.demonstration-note{position:absolute;right:16px;bottom:21px;color:#8097b2;font-size:10px;pointer-events:none}
.expanded-group{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 18px;width:auto;padding:13px;background:rgba(9,25,42,.96);border:1px solid #446179;border-radius:9px;z-index:8;box-shadow:0 8px 25px #0004}
.expanded-group>div{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center}.expanded-group>div strong{font-size:12px}.expanded-group>div button{background:none;color:#a8c2d9;border:0;font-size:20px}.expanded-group>small{grid-column:1/-1;display:block;color:#829ab4;font-size:10px;margin-bottom:8px}.expanded-group>button{display:flex;align-items:center;gap:7px;width:100%;text-align:left;color:#c3d7e9;border:0;border-top:1px solid #243b51;background:none;padding:8px 0;font-size:10px;line-height:1.5}.expanded-group>button:hover{color:white}.expanded-group i{width:5px;height:5px;border-radius:50%;flex-shrink:0}.expanded-group{max-height:260px;overflow:auto;border-radius:0;border-left:0;border-right:0}
.globe-instructions{display:flex;justify-content:space-between;gap:12px;padding:12px 17px;background:#0a1729;border-top:1px solid #203349;color:#8fa7bf;font-size:10px;line-height:1.7}
.globe-error{position:absolute;top:80px;left:20px;right:65px;background:#412433;color:#ffd6d6;border:1px solid #795468;padding:14px;border-radius:8px;z-index:10;font-size:12px}
@media(max-width:760px){.globe-toolbar{display:block;padding:12px}.region-presets{gap:4px}.globe-toolbar button{padding:6px 8px;font-size:10px}.globe-toolbar select{margin-top:10px;width:100%;max-width:none}.globe-viewport{height:clamp(400px,calc(100dvh - 330px),900px);min-height:400px}.view-status{left:12px;top:15px;font-size:10px;gap:6px}.view-status span{font-size:9px;padding-left:7px}.globe-zoom{right:10px;top:47px;width:34px}.facility-panel{padding:15px 12px}.facility-list{grid-template-columns:repeat(2,minmax(0,1fr))}.facility-list button{font-size:12px}.expanded-group{grid-template-columns:1fr;max-height:230px}.demonstration-note{left:15px;right:auto;bottom:50px;font-size:9px}.scene-options{bottom:13px}.globe-instructions{display:block;padding:10px 12px;font-size:9px}.globe-instructions span{display:block}.map-hover-card{width:220px}.marker-label{font-size:9px}}
</style>
