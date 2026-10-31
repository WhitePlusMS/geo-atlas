// Verify the actual offline map, including the regions that motivated this repair.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const world = JSON.parse(readFileSync(new URL('../public/data/world_reference.geojson', import.meta.url), 'utf8'))
const inRing = (ring, x, y) => {
  let inside = false
  for (let i = 0, previous = ring.length - 1; i < ring.length; previous = i++) {
    const [ax, ay] = ring[i]; const [bx, by] = ring[previous]
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside
  }
  return inside
}
const contains = (geometry, x, y) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polygons.some(polygon => inRing(polygon[0], x, y) && !polygon.slice(1).some(ring => inRing(ring, x, y)))
}
const membership = (x, y) => world.features.filter(feature => contains(feature.geometry, x, y)).map(feature => feature.properties.name)
for (const [name, x, y] of [['Tawang', 91.87, 27.49], ['Eastern Zangnan', 95, 28], ['Taipei', 121.56, 25.03], ['Aksai Chin', 79.8, 35], ['Yongxing Island', 112.338, 16.835], ['Diaoyu Island', 123.47, 25.745]]) {
  assert.deepEqual(membership(x, y), ['China'], name)
}
for (const [name, x, y] of [['India', 77.21, 28.61], ['Nepal', 85.32, 27.72], ['Vietnam', 105.85, 21.03]]) {
  assert.deepEqual(membership(x, y), [name], name)
}
assert.equal(world.features.filter(feature => feature.properties.name === 'China').length, 1)
assert.equal(world.features.some(feature => ['Taiwan', 'Hong Kong', 'Macao'].includes(feature.properties.name)), false)
assert.equal(world.southChinaSeaLines.length, 10)
assert(world.southChinaSeaLines.every(line => line.length >= 2 && line.some(point => point[0] !== line[0][0] || point[1] !== line[0][1])))
assert.equal(world.source.china.sha256, '3af8294f9ad61cc2bf84c1bb7e4bbf86a6336c68d754b699a0e6ddc33ef81486')
console.log('Offline map: China and neighboring locations, ten South China Sea line segments, and source fingerprint verified.')
