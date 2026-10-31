import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ShapeUtils, Vector2 } from 'three'
import Papa from 'papaparse'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = resolve(root, 'DTC_2026_Level1_资料包')
const read = (path) => readFileSync(resolve(packageRoot, path))
const layer = JSON.parse(read('data/site_match_candidates.geojson'))
const sites = JSON.parse(read('data/reference_site_catalog.geojson'))
const manifest = Papa.parse(read('manifest/source_manifest.csv').toString('utf8'), { header: true, skipEmptyLines: true }).data
const source = manifest.find((row) => row.source_id === 'public-disdi-ntad-military-bases-2025-11-11')

// A mean can fall outside a concave polygon, a hole, or a disjoint component.
// The independent containment check includes holes and all polygon components.
function ringContains([x, y], ring) {
  let inside = false
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i - 1]; const b = ring[i]
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside
  }
  return inside
}
function polygons(geometry) { return geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates] }
function contains(point, geometry) {
  return polygons(geometry).some((rings) => ringContains(point, rings[0]) && !rings.slice(1).some((hole) => ringContains(point, hole)))
}
function interiorPoint(geometry) {
  let best = null
  for (const rings of polygons(geometry)) {
    const vectors = rings.map((ring) => ring.map(([x, y]) => new Vector2(x, y)))
    const faces = ShapeUtils.triangulateShape(vectors[0], vectors.slice(1))
    const points = vectors.flat()
    for (const face of faces) {
      const [a, b, c] = face.map((index) => points[index])
      const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y))
      const point = [(a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3]
      if (area > 0 && (!best || area > best.area) && contains(point, geometry)) best = { area, point }
    }
  }
  if (!best) throw new Error('No verifiable interior point in GIS feature')
  return best.point
}

const records = sites.features.filter((site) => site.properties.coordinate_source_id === source.source_id).map((site) => {
  const candidate = layer.features.find((feature) => feature.properties.site_id === site.properties.site_id)
  if (!candidate) throw new Error(`GIS source feature missing: ${site.properties.site_id}`)
  const positions = []
  function collect(value) {
    if (Array.isArray(value) && [2, 3].includes(value.length) && value.every(Number.isFinite)) positions.push(value.slice(0, 2))
    else if (Array.isArray(value)) value.forEach(collect)
  }
  collect(candidate.geometry.coordinates)
  const original = [0, 1].map((axis) => positions.reduce((sum, position) => sum + position[axis], 0) / positions.length)
  const meanInside = contains(original, candidate.geometry)
  const point = meanInside ? original : interiorPoint(candidate.geometry)
  return { record_no: site.properties.source_record_no, source_id: source.source_id, source_file: source.file_path,
    source_sha256: source.sha256, source_record_id: candidate.properties.source_feature_id,
    method: meanInside ? 'GIS_VERTEX_AVERAGE' : 'GIS_TRIANGLE_INTERIOR', original_point: original,
    longitude: point[0], latitude: point[1], inside_published_polygon: contains(point, candidate.geometry),
    candidate_geometry_sha256: createHash('sha256').update(JSON.stringify(candidate.geometry)).digest('hex') }
})
writeFileSync(resolve(packageRoot, 'sources/public_enrichment/gis_point_derivation.json'), JSON.stringify({ algorithm: 'Existing mean if inside; otherwise centroid of largest contained Earcut triangle', records }, null, 2) + '\n')
console.log(JSON.stringify({ total: records.length, corrected: records.filter((row) => row.method === 'GIS_TRIANGLE_INTERIOR').map((row) => row.record_no), inside: records.filter((row) => row.inside_published_polygon).length }))
