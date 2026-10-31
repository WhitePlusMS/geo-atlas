import { computed, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { locationLabel } from './labels'
import { mapMarkerShape, mapService, type MapMarkerShape, type MapServiceId } from './mapMarkers'
import type { SiteFeature } from '../types/data'

/** 地图与目录使用相同的 URL 条件和同一套过滤规则。 */
export function useSiteFilters(sites: Ref<SiteFeature[]>) {
  const route = useRoute(); const router = useRouter()
  const text = (key: string) => typeof route.query[key] === 'string' ? route.query[key] as string : ''
  const update = (key: string, value: string) => { void router.replace({ query: { ...route.query, [key]: value && value !== 'all' ? value : undefined } }) }
  const query = computed({ get: () => text('q'), set: value => update('q', value) })
  const service = computed({ get: () => (text('service') || 'all') as MapServiceId | 'all', set: value => update('service', value) })
  const region = computed({ get: () => text('region'), set: value => update('region', value) })
  const shape = computed({ get: () => (text('shape') || 'all') as MapMarkerShape | 'all', set: value => update('shape', value) })
  const filterQuery = computed(() => ({ q: query.value || undefined, service: service.value === 'all' ? undefined : service.value, region: region.value || undefined, shape: shape.value === 'all' ? undefined : shape.value }))
  const matchingOtherFilters = computed(() => sites.value.filter(site => {
    const p = site.properties
    const searchable = [p.display_name, p.source_name, p.location_label, locationLabel(p.location_label), String(p.source_record_no), String(p.source_record_no).padStart(2, '0')].join(' ').toLowerCase()
    return searchable.includes(query.value.trim().toLowerCase()) && (!region.value || p.location_label === region.value) && (shape.value === 'all' || mapMarkerShape(site) === shape.value)
  }))
  const filtered = computed(() => matchingOtherFilters.value.filter(site => service.value === 'all' || mapService(site).id === service.value))
  function reset() { void router.replace({ query: {} }) }
  return { query, service, region, shape, filterQuery, matchingOtherFilters, filtered, reset }
}
