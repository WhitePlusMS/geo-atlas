import type { BaseProfile, SpatialAnchor, SpatialGeometry } from '../types/data'

export interface SpatialMapAnchor { id: string; label: string; name: string; longitude: number; latitude: number; location: SpatialAnchor | null }
export interface SpatialMapBounds { centerX: number; centerY: number; unit: number; width: number; height: number }
export interface ProjectedAnchor extends SpatialMapAnchor { x: number; y: number; anchorX: number; anchorY: number }
export const geometryRings = (geometry: SpatialGeometry): number[][][] => geometry.type === 'Point' ? [] : geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat()
export const mercatorLatitude = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, latitude)) * Math.PI / 360)) * 180 / Math.PI

export function spatialAnchors(profile: BaseProfile): SpatialMapAnchor[] {
  return [{ id: 'main', label: '总', name: profile.location_evidence.anchor_name, longitude: profile.location_evidence.longitude, latitude: profile.location_evidence.latitude, location: profile.spatial_extent }, ...profile.components.flatMap((component, index) => component.location ? [{ id: component.component_id, label: String(index + 1), name: component.name, longitude: component.location.longitude, latitude: component.location.latitude, location: component.location }] : [])]
}
export function spatialBounds(anchors: readonly SpatialMapAnchor[], width: number, height: number): SpatialMapBounds {
  const positions = anchors.map(anchor => [anchor.longitude, mercatorLatitude(anchor.latitude)])
  for (const anchor of anchors) if (anchor.location) for (const ring of geometryRings(anchor.location.geometry)) for (const point of ring) positions.push([point[0]!, mercatorLatitude(point[1]!)])
  const west = Math.min(...positions.map(point => point[0]!)); const east = Math.max(...positions.map(point => point[0]!))
  const south = Math.min(...positions.map(point => point[1]!)); const north = Math.max(...positions.map(point => point[1]!))
  return { centerX: (west + east) / 2, centerY: (south + north) / 2, unit: Math.max(Math.max(east - west, .025) / Math.max(width - 70, 1), Math.max(north - south, .025) / Math.max(height - 100, 1)) * 1.15, width, height }
}
/** 判断区域视野中是否有足够长的离线陆地轮廓。 */
function hasRegionalOutline(reference: readonly { geometry: SpatialGeometry | null }[], bounds: SpatialMapBounds): boolean {
  for (const feature of reference) {
    if (!feature.geometry) continue
    for (const ring of geometryRings(feature.geometry)) {
      let visibleLength = 0
      const xs = ring.map(point => point[0]!); const west = Math.min(...xs); const east = Math.max(...xs)
      if (east - west >= 180) continue
      const shift = Math.round((bounds.centerX - (west + east) / 2) / 360) * 360
      if (east + shift < bounds.centerX - bounds.unit * bounds.width / 2 || west + shift > bounds.centerX + bounds.unit * bounds.width / 2) continue
      for (let index = 1; index < ring.length; index++) {
        const a = ring[index - 1]!; const b = ring[index]!
        const start = projectSpatialPoint(a[0]! + shift, a[1]!, bounds); const end = projectSpatialPoint(b[0]! + shift, b[1]!, bounds)
        const dx = end.x - start.x; const dy = end.y - start.y
        let low = 0; let high = 1
        // Liang–Barsky 裁剪只统计视口内的真实线段长度。
        for (const [p, q] of [[-dx, start.x - 12], [dx, bounds.width - 12 - start.x], [-dy, start.y - 30], [dy, bounds.height - 30 - start.y]]) {
          if (p === 0) { if (q < 0) { high = -1; break } }
          else if (p! < 0) low = Math.max(low, q! / p!)
          else high = Math.min(high, q! / p!)
        }
        if (high >= low) visibleLength += Math.hypot(dx, dy) * (high - low)
        if (visibleLength >= 80) return true
      }
    }
  }
  return false
}

/** 单点优先显示有地理轮廓的区域；离线资料不足时保留最宽视野。 */
export function regionalSpatialBounds(anchor: SpatialMapAnchor, width: number, height: number, reference: readonly { geometry: SpatialGeometry | null }[]): SpatialMapBounds {
  let bounds: SpatialMapBounds = { centerX: anchor.longitude, centerY: mercatorLatitude(anchor.latitude), unit: 0, width, height }
  for (const span of [30, 60, 120]) {
    bounds = { ...bounds, unit: Math.max(span / Math.max(width - 70, 1), span * .6 / Math.max(height - 100, 1)) }
    if (!reference.length || hasRegionalOutline(reference, bounds)) break
  }
  return bounds
}
export function projectSpatialPoint(longitude: number, latitude: number, bounds: SpatialMapBounds, zoom = 1, pan = { x: 0, y: 0 }) {
  return { x: bounds.width / 2 + (longitude - bounds.centerX) / bounds.unit * zoom + pan.x, y: bounds.height / 2 - (mercatorLatitude(latitude) - bounds.centerY) / bounds.unit * zoom + pan.y }
}
export function spatialPath(geometry: SpatialGeometry, bounds: SpatialMapBounds): string {
  return geometryRings(geometry).map(ring => ring.map((point, index) => { const projected = projectSpatialPoint(point[0]!, point[1]!, bounds); return (index ? 'L' : 'M') + projected.x.toFixed(2) + ',' + projected.y.toFixed(2) }).join(' ') + ' Z').join(' ')
}
/** 少量设施标记在像素空间最小位移避让；引线仍指向未经修改的真实投影。 */
export function separateSpatialMarkers(anchors: readonly SpatialMapAnchor[], bounds: SpatialMapBounds, zoom = 1, pan = { x: 0, y: 0 }): ProjectedAnchor[] {
  const points = anchors.map(anchor => { const point = projectSpatialPoint(anchor.longitude, anchor.latitude, bounds, zoom, pan); return { ...anchor, ...point, anchorX: point.x, anchorY: point.y } }).filter(point => point.x >= 0 && point.x <= bounds.width && point.y >= 0 && point.y <= bounds.height)
  return separateProjectedAnchors(points, bounds.width, bounds.height)
}

/** 二维地图和地球共用同一屏幕避让规则，始终保留真实投影用于引线。 */
export function separateProjectedAnchors(projected: readonly ProjectedAnchor[], width: number, height: number): ProjectedAnchor[] {
  return separateScreenPoints(projected, width, height)
}

/** 不同类型的标记可共同避让；保留各自的数据和未移动的屏幕投影。 */
export function separateScreenPoints<T extends { x: number; y: number; anchorX: number; anchorY: number }>(projected: readonly T[], width: number, height: number): T[] {
  const points = projected.map(point => ({ ...point }))
  const clamp = (point: T) => { point.x = Math.min(width - 25, Math.max(25, point.x)); point.y = Math.min(height - 42, Math.max(42, point.y)) }
  points.forEach(clamp)
  for (let iteration = 0; iteration < 100; iteration++) {
    let moved = false
    for (let left = 0; left < points.length; left++) for (let right = left + 1; right < points.length; right++) {
      const a = points[left]!; const b = points[right]!; const distance = Math.hypot(b.x - a.x, b.y - a.y)
      if (distance >= 44 - .1) continue
      const angle = distance > .01 ? Math.atan2(b.y - a.y, b.x - a.x) : (left + right) * 2.399963
      const shift = (44 - distance) / 2 + .15
      a.x -= Math.cos(angle) * shift; a.y -= Math.sin(angle) * shift; b.x += Math.cos(angle) * shift; b.y += Math.sin(angle) * shift
      clamp(a); clamp(b); moved = true
    }
    if (!moved) break
  }
  return points
}
