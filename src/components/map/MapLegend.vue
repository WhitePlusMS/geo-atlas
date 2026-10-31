<script setup lang="ts">
import { computed } from 'vue'
import { mapService, mapServices, type MapServiceId } from '../../services/mapMarkers'
import type { SiteFeature } from '../../types/data'
const props = defineProps<{ sites: SiteFeature[]; modelValue: MapServiceId | 'all' }>()
const emit = defineEmits<{ 'update:modelValue': [value: MapServiceId | 'all'] }>()
const counts = computed(() => Object.fromEntries(mapServices.map((service) => [service.id, props.sites.filter((site) => mapService(site).id === service.id).length])))
</script>
<template>
  <div class="map-key">
    <div class="service-key" role="group" aria-label="按机构筛选站点">
      <button type="button" :aria-pressed="modelValue === 'all'" @click="emit('update:modelValue', 'all')">全部 <b>{{ sites.length }}</b></button>
      <button v-for="service in mapServices" :key="service.id" type="button" :aria-pressed="modelValue === service.id" :style="{ '--service-color': service.color }" @click="emit('update:modelValue', service.id)"><i />{{ service.label }} <b>{{ counts[service.id] }}</b></button>
    </div>
    <div class="shape-key" aria-label="标记形状说明"><span>颜色区分机构 · 形状区分位置</span><span><i class="shape-point" />代表点</span><span><i class="shape-multi" />多设施对象</span><span><i class="shape-edca" />EDCA位置</span><span><i class="shape-locality" />地区参考</span><span><i class="shape-cluster">n</i>视图聚合</span></div>
  </div>
</template>
<style scoped>
.map-key{padding:15px 18px;background:#0b192a;color:#a3b8cb;border-top:1px solid #2a3c52}
.service-key{display:flex;flex-wrap:wrap;align-items:center;gap:7px}.service-key button{display:flex;align-items:center;gap:7px;border:1px solid #2b4056;border-radius:6px;background:#0e2034;color:#a6bdd1;padding:7px 10px;font-size:11px}.service-key i{width:7px;height:7px;border-radius:50%;background:var(--service-color);box-shadow:0 0 8px color-mix(in srgb,var(--service-color),transparent 75%)}.service-key b{font-size:10px;color:#6f8ba3;font-weight:500}.service-key button[aria-pressed=true]{color:white;border-color:#6f9aa9;background:#193746}.service-key button[aria-pressed=true] b{color:#bededc}
.shape-key{display:flex;flex-wrap:wrap;gap:10px 17px;font-size:10px;margin-top:14px;color:#829ab1}.shape-key span{display:flex;align-items:center;gap:6px}.shape-key span:first-child{color:#c1d2e1;margin-right:5px}.shape-key i{display:inline-block;width:8px;height:8px;background:#bdcedc;border-radius:50%;font-style:normal}.shape-key .shape-multi{background:none;border:1px solid #b9e6dc;border-radius:2px}.shape-key .shape-edca{background:#eabb6f;border-radius:0;transform:rotate(45deg)}.shape-key .shape-locality{background:none;border:1px dashed #ce9aff}.shape-key .shape-cluster{width:13px;height:13px;border:1px solid #95c7d3;color:#c7dce9;text-align:center;font-size:9px;line-height:11px;background:#142a40}
@media(max-width:760px){.map-key{padding:13px 12px}.service-key{gap:6px}.service-key button{font-size:10px;padding:6px 8px}.shape-key{font-size:9px;gap:9px 12px}}
</style>
