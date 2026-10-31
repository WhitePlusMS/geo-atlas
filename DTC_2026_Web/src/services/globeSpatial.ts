import * as THREE from 'three'
import { earthRadius } from './globeVisuals'
import { latLonToVector3 } from './geo'
import { surfacePointVisible } from './mapMarkers'
import type { SpatialMapAnchor } from './spatialMap'

export const globeMinDistance = earthRadius + 0.0004

export interface GlobeArea {
  id: string
  anchorId: string
  name: string
  rings: THREE.Vector3[][]
}

/** 以地球球面上的指向点为参考，尽量保持该点缩放前后的屏幕位置。 */
export function globeZoomDirection(cameraPosition: THREE.Vector3, surfacePoint: THREE.Vector3, targetDistance: number): THREE.Vector3 {
  const normal = cameraPosition.clone().normalize()
  const pointNormal = surfacePoint.clone().normalize()
  const angle = normal.angleTo(pointNormal)
  const axis = normal.clone().cross(pointNormal)
  if (axis.lengthSq() < 1e-16) return normal
  const screenAngle = Math.atan2(earthRadius * Math.sin(angle), cameraPosition.length() - earthRadius * Math.cos(angle))
  const targetSine = targetDistance * Math.sin(screenAngle) / earthRadius
  // 拉远后光线可能不再与球面相交；此时保持当前方向，不虚构地面位置。
  if (targetSine > 1 || targetSine < -1) return normal
  const targetAngle = Math.asin(targetSine) - screenAngle
  return normal.applyAxisAngle(axis.normalize(), angle - targetAngle).normalize()
}

/** 将原始多边形和内环转换为球面向量；不修改源坐标。 */
export function globeAreas(anchors: readonly SpatialMapAnchor[]): GlobeArea[] {
  return anchors.flatMap(anchor => {
    const geometry = anchor.location?.geometry
    if (!geometry || geometry.type === 'Point') return []
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
    return polygons.map((polygon, index) => ({
      id: `${anchor.id}:${index}`,
      anchorId: anchor.id,
      name: anchor.name,
      rings: polygon.map(ring => ring.map(([longitude, latitude]) => latLonToVector3(latitude!, longitude!, earthRadius))),
    }))
  })
}

/** 根据全部原始顶点和锚点计算视角，留出屏幕标记及控制按钮空间。 */
export function globeSpatialFocus(anchors: readonly SpatialMapAnchor[], camera: THREE.PerspectiveCamera) {
  const positions: Array<[number, number]> = []
  for (const anchor of anchors) {
    positions.push([anchor.longitude, anchor.latitude])
    const geometry = anchor.location?.geometry
    if (!geometry || geometry.type === 'Point') continue
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
    for (const polygon of polygons) for (const ring of polygon) for (const point of ring) positions.push([point[0]!, point[1]!])
  }
  if (!positions.length) return null
  const reference = positions[0]![0]
  const longitudes = positions.map(([longitude]) => reference + ((longitude - reference + 540) % 360) - 180)
  const latitudes = positions.map(([, latitude]) => latitude)
  const longitude = (Math.min(...longitudes) + Math.max(...longitudes)) / 2
  const latitude = (Math.min(...latitudes) + Math.max(...latitudes)) / 2
  const lat = THREE.MathUtils.degToRad(latitude); const lon = THREE.MathUtils.degToRad(longitude)
  const normal = latLonToVector3(latitude, longitude, 1)
  const east = new THREE.Vector3(Math.cos(lon), 0, -Math.sin(lon))
  const north = new THREE.Vector3(-Math.sin(lat) * Math.sin(lon), Math.cos(lat), -Math.sin(lat) * Math.cos(lon))
  const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.7
  const horizontal = vertical * camera.aspect
  let distance = globeMinDistance
  for (const [pointLongitude, pointLatitude] of positions) {
    const point = latLonToVector3(pointLatitude, pointLongitude, earthRadius)
    distance = Math.max(distance, point.dot(normal) + Math.max(Math.abs(point.dot(east)) / horizontal, Math.abs(point.dot(north)) / vertical))
  }
  return { normal, distance: Math.max(globeMinDistance, distance) }
}

/** 仅显示完整位于可见球面的多边形；内环用 even-odd 填充规则保留。 */
export function projectGlobeAreas(areas: readonly GlobeArea[], camera: THREE.PerspectiveCamera, width: number, height: number) {
  const projected: Array<{ id: string; anchorId: string; name: string; path: string }> = []
  for (const area of areas) {
    if (area.rings.some(ring => ring.some(point => !surfacePointVisible(point, camera.position)))) continue
    const paths: string[] = []
    let valid = true
    for (const ring of area.rings) {
      const points = ring.map(point => point.clone().project(camera))
      if (points.some(point => !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.z < -1 || point.z > 1)) { valid = false; break }
      paths.push(points.map((point, index) => `${index ? 'L' : 'M'}${((point.x + 1) * width / 2).toFixed(2)},${((1 - point.y) * height / 2).toFixed(2)}`).join(' ') + ' Z')
    }
    if (valid && paths.length) projected.push({ id: area.id, anchorId: area.anchorId, name: area.name, path: paths.join(' ') })
  }
  return projected
}
