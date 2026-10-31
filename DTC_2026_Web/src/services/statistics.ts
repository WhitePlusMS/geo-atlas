import type { BsrRow, SiteFeature } from '../types/data'

export function countBy<T>(items: T[], key: (item: T) => string): Array<{ label: string; value: number }> {
  const counts = new Map<string, number>()
  items.forEach((item) => counts.set(key(item) || 'Unknown', (counts.get(key(item) || 'Unknown') ?? 0) + 1))
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
}

export const sitesByService = (sites: SiteFeature[]) => countBy(sites, (site) => site.properties.service_component)
export const bsrByComponent = (rows: BsrRow[]) => countBy(rows, (row) => row.component)
export const topBsrByAcres = (rows: BsrRow[]) => rows.map((row) => ({ label: row.site || 'Unknown', value: Number(row.total_acres) || 0 })).sort((a, b) => b.value - a.value).slice(0, 10)
export const sumBsr = (rows: BsrRow[], field: keyof BsrRow) => rows.reduce((total, row) => total + (Number(row[field]) || 0), 0)
