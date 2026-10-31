<script setup lang="ts">
import { Search, RotateCcw } from '@lucide/vue'
import { computed } from 'vue'
import { mapServices, mapService, type MapServiceId, type MapMarkerShape } from '../../services/mapMarkers'
import { locationLabel } from '../../services/labels'
import type { SiteFeature } from '../../types/data'
const props = defineProps<{ query: string; service: MapServiceId | 'all'; region: string; shape: MapMarkerShape | 'all'; sites: SiteFeature[] }>()
const emit = defineEmits<{ 'update:query': [value: string]; 'update:service': [value: MapServiceId | 'all']; 'update:region': [value: string]; 'update:shape': [value: MapMarkerShape | 'all']; reset: [] }>()
const regions = computed(() => [...new Set(props.sites.map(site => site.properties.location_label))])
const services = computed(() => mapServices.map(service => ({ ...service, count: props.sites.filter(site => mapService(site).id === service.id).length })))
</script>
<template><div class="catalog-filters"><label class="catalog-search">搜索站点<span class="search-field"><Search :size="17" aria-hidden="true" /><input :value="query" type="search" name="site-search" autocomplete="off" placeholder="名称、地区或记录号…" @input="emit('update:query', ($event.target as HTMLInputElement).value)" /></span></label><label>机构<select :value="service" @change="emit('update:service', ($event.target as HTMLSelectElement).value as MapServiceId | 'all')"><option value="all">全部机构</option><option v-for="item in services" :key="item.id" :value="item.id">{{ item.label }} · {{ item.count }}</option></select></label><label>地区<select :value="region" @change="emit('update:region', ($event.target as HTMLSelectElement).value)"><option value="">全部地区</option><option v-for="item in regions" :key="item" :value="item">{{ locationLabel(item) }}</option></select></label><label>位置类型<select :value="shape" @change="emit('update:shape', ($event.target as HTMLSelectElement).value as MapMarkerShape | 'all')"><option value="all">全部位置类型</option><option value="point">单点参考</option><option value="multi">多设施对象</option><option value="edca">EDCA约定位置</option><option value="locality">地区锚点</option></select></label><button type="button" class="secondary-btn filter-reset" @click="emit('reset')"><RotateCcw :size="16" aria-hidden="true" />重置筛选</button></div></template>
<style scoped>
.catalog-filters{display:flex;align-items:end;gap:12px;flex-wrap:wrap}.catalog-filters label{display:grid;gap:7px;font-size:13px;flex:1;min-width:130px}.catalog-filters .catalog-search{flex:2;min-width:230px}.catalog-filters input,.catalog-filters select{width:100%;min-width:0}.search-field{position:relative;display:block}.search-field svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}.catalog-filters .search-field input{padding-left:38px}.filter-reset{min-height:42px}
@media(max-width:760px){.catalog-filters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.catalog-filters label{min-width:0}.catalog-filters .catalog-search{grid-column:1/-1;min-width:0}.filter-reset{grid-column:1/-1}}
</style>
