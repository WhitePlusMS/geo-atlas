import * as THREE from 'three'

export function latLonToVector3(latitude: number, longitude: number, radius = 3.05): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  return new THREE.Vector3(radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.cos(lon))
}

export function sampledRing(points: number[][], max = 180): THREE.Vector3[] {
  const step = Math.max(1, Math.ceil(points.length / max))
  return points.filter((point, index) => index % step === 0 && Number.isFinite(point[0]) && Number.isFinite(point[1])).map(([lon, lat]) => latLonToVector3(lat, lon))
}
