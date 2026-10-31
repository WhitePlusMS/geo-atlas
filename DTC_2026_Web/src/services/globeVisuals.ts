import * as THREE from 'three'
import { latLonToVector3 } from './geo'

export const earthRadius = 3
export interface ReferenceCollection {
  type: 'FeatureCollection'
  features: Array<{ geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } | null }>
}

export interface GlobeVisuals {
  group: THREE.Group
  applyGeography: (collection: ReferenceCollection) => void
  update: (seconds: number, cameraPosition: THREE.Vector3, animated: boolean) => void
  dispose: () => void
}

interface GeographicBounds { west: number; east: number; south: number; north: number }
const worldBounds: GeographicBounds = { west: -180, east: 180, south: -90, north: 90 }

/** 纹理由已归档的Natural Earth几何绘制，不下载在线瓦片或生成虚构地形。 */
function geographicTexture(collection: ReferenceCollection, renderer: THREE.WebGLRenderer, bounds: GeographicBounds, size: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = Math.min(size, renderer.capabilities.maxTextureSize)
  canvas.height = Math.round(canvas.width * (bounds.north - bounds.south) / (bounds.east - bounds.west))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('无法生成地理参考纹理')
  const yAtLatitude = (latitude: number) => (bounds.north - latitude) / (bounds.north - bounds.south) * canvas.height
  const center = (bounds.west + bounds.east) / 2
  const xAtLongitude = (longitude: number) => {
    const normalized = bounds.east - bounds.west === 360 ? longitude : center + ((longitude - center + 180) % 360 + 360) % 360 - 180
    return (normalized - bounds.west) / (bounds.east - bounds.west) * canvas.width
  }
  const ocean = context.createLinearGradient(0, yAtLatitude(90), 0, yAtLatitude(-90))
  ocean.addColorStop(0, '#18364c'); ocean.addColorStop(0.45, '#0d2940'); ocean.addColorStop(1, '#102b42')
  context.fillStyle = ocean
  context.fillRect(0, 0, canvas.width, canvas.height)
  const land = context.createLinearGradient(0, yAtLatitude(90), 0, yAtLatitude(-90))
  land.addColorStop(0, '#739899'); land.addColorStop(0.52, '#547f85'); land.addColorStop(1, '#496d7e')
  context.fillStyle = land
  context.strokeStyle = '#9cc2bf'
  context.lineWidth = 0.85
  context.lineJoin = 'round'
  for (const feature of collection.features) {
    const geometry = feature.geometry
    if (!geometry) continue
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][]
    for (const polygon of polygons) {
      const path = new Path2D()
      // 来源已在日期变更线处分割。保留内环，湖泊不被陆地填满；南极的
      // 全经度多边形也可按原始经纬度直接绘制，避免旧球面三角形穿入球内。
      for (const ring of polygon) {
        ring.forEach(([longitude, latitude], index) => {
          const x = xAtLongitude(longitude!)
          const y = yAtLatitude(latitude!)
          if (index === 0) path.moveTo(x, y)
          else path.lineTo(x, y)
        })
        path.closePath()
      }
      context.fill(path, 'evenodd')
      context.stroke(path)
    }
  }
  context.strokeStyle = 'rgba(177, 215, 227, 0.12)'
  context.lineWidth = 0.7
  for (let longitude = -180; longitude <= 180; longitude += 30) {
    const x = xAtLongitude(longitude)
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke()
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const y = yAtLatitude(latitude)
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = bounds === worldBounds ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
  // SphereGeometry的u=0位于经度-90°，与项目经纬度向量保持同一方向。
  texture.offset.x = bounds === worldBounds ? 0.25 : 0
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  return texture
}

/** 局部纹理铺在同一经纬度球面，使用相同原几何；无需在线地图或预存地块。 */
function geographicPatch(bounds: GeographicBounds): THREE.BufferGeometry {
  const steps = 96
  const positions: number[] = []; const uv: number[] = []; const indices: number[] = []
  for (let row = 0; row <= steps; row++) for (let column = 0; column <= steps; column++) {
    const latitude = bounds.north - (bounds.north - bounds.south) * row / steps
    const longitude = bounds.west + (bounds.east - bounds.west) * column / steps
    const point = latLonToVector3(latitude, longitude, 3.00008)
    positions.push(point.x, point.y, point.z); uv.push(column / steps, 1 - row / steps)
  }
  for (let row = 0; row < steps; row++) for (let column = 0; column < steps; column++) {
    const first = row * (steps + 1) + column
    const next = first + steps + 1
    indices.push(first, next, first + 1, first + 1, next, next + 1)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geometry.setIndex(indices); geometry.computeVertexNormals()
  return geometry
}

function atmosphere(): THREE.Mesh {
  return new THREE.Mesh(new THREE.SphereGeometry(3.045, 96, 64), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vNormal; varying vec3 vView; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=-p.xyz; gl_Position=projectionMatrix*p; }',
    fragmentShader: 'varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.2); gl_FragColor=vec4(0.21,0.57,0.88,rim*0.52); }',
  }))
}

/** 合并为一个描边绘制对象，近景仍保留清晰的岛屿轮廓而不增大纹理。 */
function geographicOutlines(collection: ReferenceCollection): THREE.LineSegments {
  const positions: number[] = []
  for (const feature of collection.features) {
    if (!feature.geometry) continue
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][]
    for (const polygon of polygons) for (const ring of polygon) {
      for (let index = 1; index < ring.length; index++) {
        const start = ring[index - 1]!
        const end = ring[index]!
        let longitudeStep = end[0]! - start[0]!
        if (longitudeStep > 180) longitudeStep -= 360
        if (longitudeStep < -180) longitudeStep += 360
        const latitudeStep = end[1]! - start[1]!
        // 长边细分后贴合球面，不能用穿过球体内部的直弦画海岸线。
        const steps = Math.max(1, Math.ceil(Math.max(Math.abs(longitudeStep), Math.abs(latitudeStep)) / 0.3))
        for (let step = 0; step < steps; step++) for (const progress of [step / steps, (step + 1) / steps]) {
          const position = latLonToVector3(start[1]! + latitudeStep * progress, start[0]! + longitudeStep * progress, 3.00012)
          positions.push(position.x, position.y, position.z)
        }
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x98bebd, transparent: true, opacity: 0.42, depthWrite: false }))
}

function starField(): THREE.Points {
  const positions: number[] = []
  let seed = 2026
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  for (let index = 0; index < 520; index++) {
    const direction = new THREE.Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize().multiplyScalar(22 + random() * 16)
    positions.push(direction.x, direction.y, direction.z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xa6c5e0, size: 1.1, sizeAttenuation: false, transparent: true, opacity: 0.5, depthWrite: false }))
}

function aircraftModel(): THREE.Group {
  const model = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xe5edf4, roughness: 0.32, metalness: 0.35, side: THREE.DoubleSide })
  const dark = new THREE.MeshStandardMaterial({ color: 0x344e6a, roughness: 0.25, metalness: 0.6 })
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), white)
  body.scale.set(0.036, 0.028, 0.185)
  model.add(body)
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), dark)
  canopy.scale.set(0.025, 0.018, 0.055); canopy.position.set(0, 0.023, 0.067)
  model.add(canopy)
  const wing = (width: number, depth: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(-width, -depth); shape.lineTo(-0.026, depth * 0.34); shape.lineTo(0.026, depth * 0.34)
    shape.lineTo(width, -depth); shape.lineTo(width * 0.78, -depth * 1.2)
    shape.lineTo(0.022, -depth * 0.32); shape.lineTo(-0.022, -depth * 0.32); shape.lineTo(-width * 0.78, -depth * 1.2); shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.006, bevelEnabled: false })
    geometry.rotateX(Math.PI / 2)
    return new THREE.Mesh(geometry, white)
  }
  const wings = wing(0.215, 0.07); wings.position.y = 0.007; model.add(wings)
  const tail = wing(0.075, 0.026); tail.position.set(0, 0.013, -0.134); model.add(tail)
  const finGeometry = new THREE.BufferGeometry()
  finGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.01, -0.09, 0, 0.067, -0.15, 0, 0.015, -0.187], 3)); finGeometry.computeVertexNormals()
  model.add(new THREE.Mesh(finGeometry, white))
  for (const side of [-1, 1]) {
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.064, 12), dark)
    engine.rotation.x = Math.PI / 2; engine.position.set(side * 0.055, -0.022, -0.064); model.add(engine)
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 6), new THREE.MeshBasicMaterial({ color: side < 0 ? 0xff8d7e : 0x8fffd2 }))
    light.position.set(side * 0.197, 0.012, -0.07); model.add(light)
  }
  return model
}

function satelliteModel(): THREE.Group {
  const model = new THREE.Group()
  const gold = new THREE.MeshStandardMaterial({ color: 0xc7ac78, metalness: 0.7, roughness: 0.38 })
  const silver = new THREE.MeshStandardMaterial({ color: 0xd3e2ee, metalness: 0.8, roughness: 0.25, side: THREE.DoubleSide })
  model.add(new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.072, 0.08), gold))
  const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 64
  const context = canvas.getContext('2d')
  if (context) {
    context.fillStyle = '#234d89'; context.fillRect(0, 0, 128, 64)
    context.strokeStyle = '#83b7de'; context.lineWidth = 1
    for (let x = 0; x <= 128; x += 16) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 64); context.stroke() }
    for (let y = 0; y <= 64; y += 16) { context.beginPath(); context.moveTo(0, y); context.lineTo(128, y); context.stroke() }
  }
  const panelTexture = new THREE.CanvasTexture(canvas); panelTexture.colorSpace = THREE.SRGBColorSpace
  const panels = new THREE.MeshStandardMaterial({ map: panelTexture, roughness: 0.36, metalness: 0.35, emissive: 0x142c53, emissiveIntensity: 0.35 })
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.006), panels)
    panel.position.x = side * 0.155; model.add(panel)
  }
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.35, 8), silver)
  boom.rotation.z = Math.PI / 2; model.add(boom)
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 12, 0, Math.PI * 2, 0, 0.8), silver)
  dish.rotation.x = Math.PI / 2; dish.position.z = 0.045; model.add(dish)
  return model
}

/** 飞行器与轨道属于明确标注的视觉演示，不加入站点/位置证据数据。 */
export function createGlobeVisuals(renderer: THREE.WebGLRenderer): GlobeVisuals {
  const group = new THREE.Group()
  const oceanMaterial = new THREE.MeshStandardMaterial({ color: 0x21475e, roughness: 0.9, metalness: 0.06, emissive: 0x102c40, emissiveIntensity: 0.35 })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 128, 96), oceanMaterial))
  group.add(atmosphere()); group.add(starField())
  const demonstrations = new THREE.Group(); group.add(demonstrations)
  const craft = [aircraftModel(), satelliteModel(), satelliteModel()]
  const axes = [new THREE.Vector3(0.2, 0.94, -0.28), new THREE.Vector3(-0.6, 0.75, 0.26), new THREE.Vector3(0.4, 0.62, 0.68)].map((axis) => axis.normalize())
  const starts = [latLonToVector3(18, 146, 1), latLonToVector3(35, 153, 1), latLonToVector3(-12, 116, 1)]
    .map((start, index) => start.addScaledVector(axes[index]!, -start.dot(axes[index]!)).normalize())
  const radii = [3.2, 3.48, 3.72]
  craft.forEach((model, index) => {
    demonstrations.add(model)
    if (index === 0) return
    const points = Array.from({ length: 181 }, (_, step) => starts[index]!.clone().applyAxisAngle(axes[index]!, step / 180 * Math.PI * 2).multiplyScalar(radii[index]!))
    const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: index === 1 ? 0x567fa2 : 0x547c81, transparent: true, opacity: 0.23, depthWrite: false }))
    demonstrations.add(orbit)
  })
  let texture: THREE.CanvasTexture | null = null
  let outlines: THREE.LineSegments | null = null
  let geography: ReferenceCollection | null = null
  let localPatch: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null = null
  let patchKey = ''
  let patchCreatedAt = 0
  return {
    group,
    applyGeography(collection) {
      texture?.dispose()
      geography = collection
      texture = geographicTexture(collection, renderer, worldBounds, 4096)
      oceanMaterial.map = texture; oceanMaterial.color.set(0xffffff); oceanMaterial.needsUpdate = true
      if (outlines) { group.remove(outlines); outlines.geometry.dispose(); (outlines.material as THREE.Material).dispose() }
      outlines = geographicOutlines(collection); group.add(outlines)
    },
    update(seconds, cameraPosition, animated) {
      const distance = cameraPosition.length()
      if (localPatch) localPatch.visible = distance < 4.8
      if (distance < 4.8 && geography) {
        const longitude = Math.round(THREE.MathUtils.radToDeg(Math.atan2(cameraPosition.x, cameraPosition.z)) / 8) * 8
        const latitude = Math.round(THREE.MathUtils.radToDeg(Math.asin(cameraPosition.y / distance)) / 6) * 6
        const key = `${longitude}:${latitude}`
        const now = performance.now()
        // 地区移动超过分块后才重绘，复用局部层；限制重建频率以免拖动时反复分配。
        if (key !== patchKey && now - patchCreatedAt > 400) {
          const bounds = { west: longitude - 12, east: longitude + 12, south: Math.max(-89.5, latitude - 10), north: Math.min(89.5, latitude + 10) }
          const map = geographicTexture(geography, renderer, bounds, 2048)
          const material = oceanMaterial.clone(); material.map = map
          const patch = new THREE.Mesh(geographicPatch(bounds), material)
          if (localPatch) { group.remove(localPatch); localPatch.geometry.dispose(); localPatch.material.map?.dispose(); localPatch.material.dispose() }
          localPatch = patch; patchKey = key; patchCreatedAt = now; group.add(patch)
        }
      }
      demonstrations.visible = animated && distance > 4.6
      if (!demonstrations.visible) return
      craft.forEach((model, index) => {
        const normal = starts[index]!.clone().applyAxisAngle(axes[index]!, seconds * (index === 0 ? 0.036 : 0.023) + index * 0.08)
        model.position.copy(normal.clone().multiplyScalar(radii[index]!))
        // 演示模型也随视距补偿，拉近地球时不能变成遮住站点的大飞机。
        model.scale.setScalar(THREE.MathUtils.clamp((distance - radii[index]!) / 6.4, 0.14, 1.25))
        if (index === 0) {
          const forward = axes[index]!.clone().cross(normal).normalize()
          const right = normal.clone().cross(forward).normalize()
          model.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, normal, forward))
        } else model.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().negate())
      })
    },
    dispose() {
      // 材质/几何可能被多个模型复用，只释放一次；同时释放Canvas纹理。
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      const textures = new Set<THREE.Texture>()
      group.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) geometries.add(mesh.geometry)
        for (const material of Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []) {
          materials.add(material)
          const mapped = material as THREE.MeshStandardMaterial
          if (mapped.map) textures.add(mapped.map)
        }
      })
      geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose()); textures.forEach((item) => item.dispose())
    },
  }
}
