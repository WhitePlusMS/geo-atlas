import Papa from 'papaparse'
import type { BsrRow, EvidenceRow, FrontendMeta, ProfileCollection, SiteCollection, SourceRegistry } from '../types/data'

declare global {
  interface Window {
    // 提交版在HTML中内嵌已审核数据；网页部署仍加载同一套文件。
    __DTC_EMBEDDED_DATA__?: Record<string, string>
  }
}

async function getText(path: string): Promise<string> {
  const embedded = window.__DTC_EMBEDDED_DATA__
  if (embedded) {
    if (typeof embedded[path] !== 'string') throw new Error(`离线提交版缺少 ${path}`)
    return embedded[path]
  }
  // 跟随 Vite 的应用基路径，hash 路由下也支持域名子目录部署。
  const response = await fetch(`${import.meta.env.BASE_URL}data/${path}`)
  if (!response.ok) throw new Error(`无法读取 ${path}`)
  return response.text()
}

export async function loadJson<T>(path: string): Promise<T> {
  return JSON.parse(await getText(path)) as T
}

export async function loadCsv<T>(path: string): Promise<T[]> {
  const result = Papa.parse<T>(await getText(path), { header: true, skipEmptyLines: true })
  if (result.errors.length) throw new Error(`${path} 数据格式错误`)
  return result.data
}

export const loadMeta = () => loadJson<FrontendMeta>('frontend_meta.json')
export const loadSites = () => loadJson<SiteCollection>('sites.geojson')
export const loadProfiles = () => loadJson<ProfileCollection>('profiles.json')
export const loadBsr = () => loadCsv<BsrRow>('bsr.csv')
export const loadEvidence = () => loadCsv<EvidenceRow>('evidence.csv')
export const loadSources = () => loadJson<SourceRegistry>('source_registry.json')
