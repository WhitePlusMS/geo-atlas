import type { SiteFeature } from '../types/data'

export const mapServices = [
  { id: 'army', label: '陆军', color: '#ff927e' },
  { id: 'navy', label: '海军', color: '#58d5e8' },
  { id: 'air', label: '空军', color: '#91aaff' },
  { id: 'marine', label: '海军陆战队', color: '#ffc16f' },
  { id: 'space', label: '太空军', color: '#ce9aff' },
  { id: 'joint', label: '联合机构', color: '#79dfb2' },
  { id: 'other', label: '其他机构', color: '#c4cfdf' },
] as const

export type MapServiceId = typeof mapServices[number]['id']
export type MapMarkerShape = 'point' | 'multi' | 'edca' | 'locality'
export interface ScreenPoint { site: SiteFeature; x: number; y: number }
export interface ScreenGroup { id: string; points: ScreenPoint[]; x: number; y: number }
export interface ScreenRect { x: number; y: number; width: number; height: number }
export interface MarkerLabel extends ScreenRect { siteId: string; text: string }
export interface ExpandedPoint extends ScreenPoint { anchorX: number; anchorY: number }

/** 目录和统计共用同一机构色彩；原始机构名称仍由来源字段显示。 */
export function organizationStyle(value: string) {
  const id: MapServiceId = value.startsWith('Joint') ? 'joint'
    : value.startsWith('Army') || value === 'NG Army Guard' ? 'army'
      : value.startsWith('Navy') ? 'navy' : value.startsWith('Air Force') || value === 'Air National Guard' ? 'air'
        : value.startsWith('Marine Corps') ? 'marine' : value.startsWith('Space Force') ? 'space' : 'other'
  return mapServices.find(service => service.id === id)!
}
export function mapService(site: SiteFeature) { return organizationStyle(site.properties.service_component) }

export function mapMarkerShape(site: SiteFeature): MapMarkerShape {
  const semantics = site.properties.coordinate_semantics
  return semantics === 'MULTI_SITE_NO_SINGLE_POINT' ? 'multi'
    : semantics === 'EDCA_AGREED_LOCATION' ? 'edca'
      : semantics === 'LOCALITY_ANCHOR' ? 'locality' : 'point'
}

/** 屏幕聚合只改变绘制方式；点的经纬度与正式数据对象始终不改。 */
export function groupScreenPoints(points: readonly ScreenPoint[], gap = 44): ScreenGroup[] {
  const groups: ScreenGroup[] = points.map((point) => ({ id: point.site.properties.site_id, points: [point], x: point.x, y: point.y }))
  // 按原记录号处理，让同一视图的聚合顺序可复现。合并后再次检查中心距离，
  // 避免新中心挤入相邻标记，造成“明明聚合了仍重叠”。66条记录无需空间索引。
  let changed = true
  while (changed) {
    changed = false
    for (let first = 0; first < groups.length && !changed; first++) {
      for (let second = first + 1; second < groups.length; second++) {
        const left = groups[first]!
        const right = groups[second]!
        if (Math.hypot(left.x - right.x, left.y - right.y) >= gap) continue
        const merged = [...left.points, ...right.points].sort((a, b) => a.site.properties.source_record_no - b.site.properties.source_record_no)
        groups[first] = {
          id: merged.map((point) => point.site.properties.site_id).join('|'), points: merged,
          x: merged.reduce((sum, point) => sum + point.x, 0) / merged.length,
          y: merged.reduce((sum, point) => sum + point.y, 0) / merged.length,
        }
        groups.splice(second, 1)
        changed = true
        break
      }
    }
  }
  return groups
}

/** 密集点展开为独立的可点击标记；细线指回各自真实屏幕投影。 */
export function expandScreenPoints(points: readonly ScreenPoint[], width: number, height: number): ExpandedPoint[] {
  if (points.length < 2) return points.map((point) => ({ ...point, anchorX: point.x, anchorY: point.y }))
  const sorted = [...points].sort((a, b) => a.site.properties.source_record_no - b.site.properties.source_record_no)
  const gap = 44
  const radius = Math.max(52, gap / (2 * Math.sin(Math.PI / sorted.length)))
  if (radius * 2 + 50 > width || radius * 2 + 100 > height) {
    // 标记的点击区为44px；屏幕装不下时只显示有限点，完整成员仍在列表中。
    const columns = Math.max(1, Math.min(Math.ceil(Math.sqrt(sorted.length)), Math.floor((width - 50) / gap) + 1))
    const maxRows = Math.max(1, Math.floor((height - 94) / gap) + 1)
    const visible = sorted.slice(0, columns * maxRows)
    const rows = Math.ceil(visible.length / columns)
    const startX = (width - (columns - 1) * gap) / 2
    const startY = Math.max(50, Math.min((height - (rows - 1) * gap) / 2, height - 44 - (rows - 1) * gap))
    return visible.map((point, index) => ({ ...point, anchorX: point.x, anchorY: point.y, x: startX + index % columns * gap, y: startY + Math.floor(index / columns) * gap }))
  }
  const centerX = Math.min(width - radius - 25, Math.max(radius + 25, sorted.reduce((sum, point) => sum + point.x, 0) / sorted.length))
  const centerY = Math.min(height - radius - 44, Math.max(radius + 50, sorted.reduce((sum, point) => sum + point.y, 0) / sorted.length))
  return sorted.map((point, index) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / sorted.length
    return { ...point, anchorX: point.x, anchorY: point.y, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
  })
}

export function rectsOverlap(left: ScreenRect, right: ScreenRect, padding = 4): boolean {
  return left.x < right.x + right.width + padding && left.x + left.width + padding > right.x
    && left.y < right.y + right.height + padding && left.y + left.height + padding > right.y
}

/** 优先显示选中/悬停名称，其他标签在可用空位绘制，不覆盖点或彼此。 */
export function placeMarkerLabels(points: readonly ScreenPoint[], obstacles: readonly ScreenRect[], width: number, height: number): MarkerLabel[] {
  const labels: MarkerLabel[] = []
  for (const point of points) {
    const name = point.site.properties.display_name
    const text = name.length > 24 ? `${name.slice(0, 23)}…` : name
    const labelWidth = Math.min(182, Math.max(74, [...text].reduce((sum, char) => sum + (/[^\x00-\x7F]/.test(char) ? 11 : 6.3), 0) + 16))
    const candidates = [
      { x: point.x + 24, y: point.y - 12 }, { x: point.x - labelWidth - 24, y: point.y - 12 },
      { x: point.x - labelWidth / 2, y: point.y - 50 }, { x: point.x - labelWidth / 2, y: point.y + 26 },
    ]
    const placed = candidates.map((candidate) => ({ ...candidate, width: labelWidth, height: 25 }))
      .find((candidate) => candidate.x >= 8 && candidate.y >= 48 && candidate.x + candidate.width <= width - 8
        && candidate.y + candidate.height <= height - 38 && ![...obstacles, ...labels].some((item) => rectsOverlap(candidate, item)))
    if (placed) labels.push({ ...placed, siteId: point.site.properties.site_id, text })
  }
  return labels
}

export function surfacePointVisible(point: { x: number; y: number; z: number }, camera: { x: number; y: number; z: number }, radius = 3): boolean {
  // 球面切线判定：背面和地平线外的点不穿透地球显示，也不可误选。
  return point.x * camera.x + point.y * camera.y + point.z * camera.z > radius * radius
}
