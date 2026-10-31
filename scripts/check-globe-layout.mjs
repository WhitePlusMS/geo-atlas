// 对实际生产布局函数作边界检查；不启动服务、不改正式站点数据。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expandScreenPoints, groupScreenPoints, mapService, mapMarkerShape, placeMarkerLabels, rectsOverlap, surfacePointVisible } from '../src/services/mapMarkers.ts'
import { separateScreenPoints } from '../src/services/spatialMap.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sites = JSON.parse(readFileSync(resolve(root, 'public/data/sites.geojson'), 'utf8')).features
const fingerprint = JSON.stringify(sites)
const checks = []
function check(name, run) { run(); checks.push(name) }

check('all 66 source records have an explicit display category', () => {
  assert.equal(sites.length, 66)
  assert.equal(new Set(sites.map(site => mapService(site).id)).size, 7)
  assert.equal(sites.filter(site => mapMarkerShape(site) === 'multi').length, 16)
  assert.equal(sites.filter(site => mapMarkerShape(site) === 'edca').length, 9)
  assert.equal(sites.filter(site => mapMarkerShape(site) === 'locality').length, 1)
})
check('isolated points remain independently selectable', () => {
  const input = sites.slice(0, 4).map((site, index) => ({ site, x: 80 + index * 120, y: 200 }))
  assert.equal(groupScreenPoints(input).length, 4)
})
check('coincident points are grouped without losing records', () => {
  const input = sites.map(site => ({ site, x: 180, y: 240 }))
  const groups = groupScreenPoints(input)
  assert.equal(groups.length, 1)
  assert.equal(new Set(groups[0].points.map(point => point.site.properties.site_id)).size, 66)
})
check('merged centers cannot collide with neighboring groups', () => {
  const input = sites.slice(0, 12).map((site, index) => ({ site, x: 100 + index * 17, y: 180 + index % 3 * 9 }))
  const groups = groupScreenPoints(input)
  assert.equal(groups.reduce((sum, group) => sum + group.points.length, 0), input.length)
  for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) assert.ok(Math.hypot(groups[i].x - groups[j].x, groups[i].y - groups[j].y) >= 44)
})
check('zooming separates and re-groups nearby original points', () => {
  const point = (index, x) => ({ site: sites[index], x, y: 160 })
  assert.equal(groupScreenPoints([point(0, 100), point(1, 140)]).length, 1)
  assert.equal(groupScreenPoints([point(0, 100), point(1, 150)]).length, 2)
  assert.equal(groupScreenPoints([point(0, 100), point(1, 140)]).length, 1)
})
check('expanded small groups have distinct hit targets and original anchors', () => {
  const input = sites.slice(0, 12).map(site => ({ site, x: 200, y: 220 }))
  const output = expandScreenPoints(input, 800, 600)
  for (const point of output) { assert.equal(point.anchorX, 200); assert.equal(point.anchorY, 220) }
  for (let i = 0; i < output.length; i++) for (let j = i + 1; j < output.length; j++) assert.ok(Math.hypot(output[i].x - output[j].x, output[i].y - output[j].y) >= 43.8)
})
check('even 66 coincident records can be expanded within a mobile viewport', () => {
  const output = expandScreenPoints(sites.map(site => ({ site, x: 20, y: 50 })), 375, 540)
  for (const point of output) assert.ok(point.x >= 16 && point.x <= 359 && point.y >= 44 && point.y <= 502)
  assert.equal(output.length, 66)
  for (let i = 0; i < output.length; i++) for (let j = i + 1; j < output.length; j++) assert.ok(Math.hypot(output[i].x - output[j].x, output[i].y - output[j].y) >= 43.8)
})
check('different layers at the same coordinate remain independently selectable', () => {
  const input = [{ kind: 'site', id: '44', x: 180, y: 200, anchorX: 180, anchorY: 200 }, { kind: 'facility', id: 'family', x: 180, y: 200, anchorX: 180, anchorY: 200 }]
  const output = separateScreenPoints(input, 375, 540)
  assert.deepEqual(output.map(point => point.id), ['44', 'family'])
  assert.ok(Math.hypot(output[0].x - output[1].x, output[0].y - output[1].y) >= 43.8)
  assert.ok(output.every(point => point.anchorX === 180 && point.anchorY === 200))
  assert.ok(input.every(point => point.x === 180 && point.y === 200))
})
check('labels can appear without covering markers, each other or viewport edges', () => {
  const input = sites.slice(0, 6).map((site, index) => ({ site, x: 110 + index % 3 * 160, y: 140 + Math.floor(index / 3) * 150 }))
  const obstacles = input.map(point => ({ x: point.x - 18, y: point.y - 18, width: 36, height: 36 }))
  const labels = placeMarkerLabels(input, obstacles, 640, 460)
  assert.ok(labels.length >= 3)
  for (const label of labels) {
    assert.ok(label.x >= 8 && label.y >= 48 && label.x + label.width <= 632 && label.y + label.height <= 422)
    assert.ok(obstacles.every(obstacle => !rectsOverlap(label, obstacle)))
  }
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) assert.equal(rectsOverlap(labels[i], labels[j]), false)
})
check('backside and limb points are occluded, front points remain visible', () => {
  assert.equal(surfacePointVisible({ x: 0, y: 0, z: 3 }, { x: 0, y: 0, z: 9.6 }), true)
  assert.equal(surfacePointVisible({ x: 0, y: 0, z: -3 }, { x: 0, y: 0, z: 9.6 }), false)
  assert.equal(surfacePointVisible({ x: 3, y: 0, z: 0 }, { x: 0, y: 0, z: 9.6 }), false)
})
check('layout does not mutate approved source records or coordinates', () => assert.equal(JSON.stringify(sites), fingerprint))
console.log(JSON.stringify({ passed: checks.length, checks }, null, 2))
