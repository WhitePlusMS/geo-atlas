import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { spatialAnchors, spatialBounds, regionalSpatialBounds, projectSpatialPoint, separateSpatialMarkers } from '../src/services/spatialMap.ts'
import { createEntityModel } from '../src/services/entityModel.ts'
import { dateLabel, verificationLabel } from '../src/services/labels.ts'
const json = name => JSON.parse(readFileSync(new URL('../public/data/' + name, import.meta.url), 'utf8').replace(/^\uFEFF/, ''))
const profiles = json('profiles.json').profiles
const sites = json('sites.geojson').features
const meta = json('frontend_meta.json')
const registry = json('source_registry.json').sources
const world = json('world_reference.geojson').features
const checks = []
function check(name, action) { action(); checks.push(name) }
function freeze(value) { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.values(value).forEach(freeze) } }
freeze(profiles); freeze(sites); freeze(world)
let views = 0
check('all 66 entities retain one overview and their independently located members', () => {
  assert.equal(profiles.length, 66)
  assert.equal(profiles.reduce((sum, profile) => sum + spatialAnchors(profile).length - 1, 0), 51)
  for (const profile of profiles) assert.equal(spatialAnchors(profile).length, 1 + profile.components.filter(item => item.location).length)
})
check('all approved overview/member views have finite projections and separated visible markers', () => {
  for (const profile of profiles) for (const [width,height] of [[301,350],[720,420],[1040,420]]) {
    const anchors = spatialAnchors(profile); const bounds = spatialBounds(anchors,width,height)
    for (const zoom of [1,2,6,12]) {
      const points = separateSpatialMarkers(anchors,bounds,zoom)
      if (zoom === 1) assert.equal(points.length, anchors.length)
      for (const point of points) {
        const truePoint = projectSpatialPoint(point.longitude,point.latitude,bounds,zoom)
        assert.equal(point.anchorX,truePoint.x); assert.equal(point.anchorY,truePoint.y)
        assert(Number.isFinite(point.x) && Number.isFinite(point.y))
        assert(point.x >= 25 && point.x <= width-25 && point.y >= 42 && point.y <= height-42)
      }
      for (let a=0;a<points.length;a++) for(let b=a+1;b<points.length;b++) assert(Math.hypot(points[a].x-points[b].x,points[a].y-points[b].y) >= 43.8, profile.site_id+' markers overlap')
      views++
    }
  }
})
check('all single-point entities have a centered regional view across viewport sizes', () => {
  let count = 0
  for (const profile of profiles) {
    const anchors = spatialAnchors(profile)
    if (anchors.length !== 1 || (anchors[0].location && anchors[0].location.geometry.type !== 'Point')) continue
    count++
    for (const [width, height] of [[301,350],[720,420],[1040,420]]) {
      const bounds = regionalSpatialBounds(anchors[0], width, height, world)
      const projected = projectSpatialPoint(anchors[0].longitude, anchors[0].latitude, bounds)
      assert.equal(projected.x, width / 2); assert.equal(projected.y, height / 2)
      assert(bounds.unit * (width - 70) >= 30 - 1e-9); assert(bounds.unit * (height - 100) >= 18 - 1e-9)
      assert.equal(separateSpatialMarkers(anchors, bounds).length, 1)
    }
  }
  assert.equal(count, 47)
})
check('isolated Pacific points expand to a wider offline context', () => {
  const view = record => regionalSpatialBounds(spatialAnchors(profiles.find(item => item.source_record_no === record))[0], 720, 420, world)
  assert(view(27).unit > view(1).unit)
  assert(view(31).unit > view(1).unit)
  assert(view(66).unit > view(1).unit)
})
check('seven coincident markers remain distinct in a narrow viewport', () => {
  const anchors = Array.from({length:7},(_,index)=>({id:String(index),label:String(index),name:'coincident',longitude:120,latitude:30,location:null}))
  const result = separateSpatialMarkers(anchors,spatialBounds(anchors,301,350))
  assert.equal(result.length,7)
  for(let a=0;a<result.length;a++) for(let b=a+1;b<result.length;b++) assert(Math.hypot(result[a].x-result[b].x,result[a].y-result[b].y)>=43.8)
})
check('Kitsap overview and Bangor member retain their real projections after separation', () => {
  const profile=profiles.find(item=>item.source_record_no===8); const anchors=spatialAnchors(profile); const result=separateSpatialMarkers(anchors,spatialBounds(anchors,301,350))
  assert.equal(result.length,5); assert(result.some(point=>Math.hypot(point.x-point.anchorX,point.y-point.anchorY)>2))
  assert.equal(result.find(point=>point.id==='main').longitude,profile.location_evidence.longitude)
})
check('layout and model construction work with deeply frozen approved inputs', () => {
  for(const profile of profiles) { const site=sites.find(item=>item.properties.site_id===profile.site_id); const model=createEntityModel(profile,site,meta.review_source_hashes); assert.equal(model.entity.id,profile.site_id); assert.equal(model.relations.length,profile.components.length) }
})
check('structured model preserves complete spatial evidence and provenance', () => {
  const profile=profiles.find(item=>item.source_record_no===8); const site=sites.find(item=>item.properties.site_id===profile.site_id)
  const restored=JSON.parse(JSON.stringify(createEntityModel(profile,site,meta.review_source_hashes)))
  assert.deepEqual(restored.relations,profile.components); assert.deepEqual(restored.spatial.evidence,profile.location_evidence); assert.deepEqual(restored.review,profile.review_record)
})
check('all actual archived source states have readable labels', () => {
  for(const source of Object.values(registry)) assert.notEqual(verificationLabel(source.verification_status),source.verification_status)
  for(const profile of profiles) for(const document of profile.evidence_documents) assert.notEqual(verificationLabel(document.verification_status),document.verification_status)
})
check('partial and unknown dates are not converted into invented complete dates', () => {
  assert.equal(dateLabel('UNKNOWN'),'未标注'); assert.equal(dateLabel('2024'),'2024'); assert(dateLabel('2023-09-30').includes('2023'))
})
console.log(JSON.stringify({passed:checks.length,checks,real_view_cases:views,source_entities:profiles.length},null,2))
