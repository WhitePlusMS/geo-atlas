// 使用真实资料检查地球定位、范围及屏幕避让；不修改输入数据。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { build } from 'esbuild'
import * as THREE from 'three'
import { separateProjectedAnchors, spatialAnchors } from '../src/services/spatialMap.ts'

const result = await build({ entryPoints: ['src/services/globeSpatial.ts'], bundle: true, platform: 'node', format: 'esm', write: false })
const { globeAreas, globeMinDistance, globeSpatialFocus, globeZoomDirection, projectGlobeAreas } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].contents).toString('base64'))
const profiles = JSON.parse(readFileSync(new URL('../public/data/profiles.json', import.meta.url), 'utf8')).profiles
const before = JSON.stringify(profiles)
let cases = 0
let withDetails = 0

for (const profile of profiles) {
  const anchors = spatialAnchors(profile)
  const areas = globeAreas(anchors)
  if (anchors.length > 1 || areas.length) withDetails++
  const expectedPolygons = anchors.reduce((count, anchor) => {
    const geometry = anchor.location?.geometry
    return count + (!geometry || geometry.type === 'Point' ? 0 : geometry.type === 'Polygon' ? 1 : geometry.coordinates.length)
  }, 0)
  assert.equal(areas.length, expectedPolygons, profile.site_id)
  for (const [width, height] of [[985, 570], [375, 540], [305, 540]]) {
    const aspect = width / height
    const fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(39 / 2)) / Math.min(aspect, 1)))
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.00005, 100)
    const focus = globeSpatialFocus(anchors, camera)
    assert.ok(focus && Number.isFinite(focus.distance) && focus.distance >= globeMinDistance, profile.site_id)
    camera.position.copy(focus.normal).multiplyScalar(focus.distance)
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); camera.updateMatrixWorld()
    for (const anchor of anchors) {
      const lat = THREE.MathUtils.degToRad(anchor.latitude); const lon = THREE.MathUtils.degToRad(anchor.longitude)
      const point = new THREE.Vector3(3 * Math.cos(lat) * Math.sin(lon), 3 * Math.sin(lat), 3 * Math.cos(lat) * Math.cos(lon)).project(camera)
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y) && Math.abs(point.x) <= .71 && Math.abs(point.y) <= .71, `${profile.site_id}: anchor outside focus`)
    }
    const paths = projectGlobeAreas(areas, camera, width, height)
    assert.equal(paths.length, areas.length, `${profile.site_id}: area hidden in focus`)
    paths.forEach((path, index) => assert.equal((path.path.match(/M/g) ?? []).length, areas[index].rings.length, `${profile.site_id}: polygon hole lost`))
    for (const area of areas) for (const ring of area.rings) for (const vertex of ring) {
      const point = vertex.clone().project(camera)
      assert.ok(Math.abs(point.x) <= .71 && Math.abs(point.y) <= .71, `${profile.site_id}: area vertex outside focus`)
    }
    cases++
  }
}

const crossing = [179.9, -179.9].map((longitude, index) => ({ id: String(index), label: String(index), name: String(index), longitude, latitude: 0, location: null }))
const camera = new THREE.PerspectiveCamera(39, 1, 0.0005, 100)
const focus = globeSpatialFocus(crossing, camera)
assert.ok(focus && focus.distance < 3.1, 'date line focus should follow the short arc')
// 以球面上的真实指向点测试缩放前后位置，避免仅验证镜头距离。
const zoomCamera = new THREE.PerspectiveCamera(39, 1.5, 0.00005, 100)
zoomCamera.position.set(2, 1, 4).normalize().multiplyScalar(4.8)
zoomCamera.lookAt(0, 0, 0); zoomCamera.updateProjectionMatrix(); zoomCamera.updateMatrixWorld()
const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(new THREE.Vector2(.4, .2), zoomCamera)
const pointOnGlobe = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(), 3), new THREE.Vector3())
assert.ok(pointOnGlobe)
const beforeZoom = pointOnGlobe.clone().project(zoomCamera)
zoomCamera.position.copy(globeZoomDirection(zoomCamera.position, pointOnGlobe, 3.8)).multiplyScalar(3.8)
zoomCamera.lookAt(0, 0, 0); zoomCamera.updateMatrixWorld()
const afterZoom = pointOnGlobe.clone().project(zoomCamera)
assert.ok(Math.abs(afterZoom.x - beforeZoom.x) < .04 && Math.abs(afterZoom.y - beforeZoom.y) < .04, 'cursor focus should remain near its original screen position')
const sample = spatialAnchors(profiles.find(profile => profile.source_record_no === 8))
const projected = sample.map((anchor, index) => ({ ...anchor, x: 100 + index, y: 100, anchorX: 100 + index, anchorY: 100 }))
const separated = separateProjectedAnchors(projected, 375, 540)
assert.deepEqual(separated.map(point => [point.anchorX, point.anchorY]), projected.map(point => [point.anchorX, point.anchorY]))
for (let a = 0; a < separated.length; a++) for (let b = a + 1; b < separated.length; b++) assert.ok(Math.hypot(separated[a].x - separated[b].x, separated[a].y - separated[b].y) >= 43.8)
assert.equal(JSON.stringify(profiles), before, 'source data mutated')
console.log(JSON.stringify({ profiles: profiles.length, profilesWithSpatialDetails: withDetails, viewCases: cases, dateLine: 'passed', cursorZoom: 'passed', markerSeparation: 'passed', sourceData: 'unchanged' }, null, 2))
