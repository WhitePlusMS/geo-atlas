<script setup lang="ts">
import { computed } from 'vue'
import type { BsrRow } from '../../types/data'
import { sumBsr } from '../../services/statistics'
import MetricCard from '../common/MetricCard.vue'
const props = defineProps<{ rows: BsrRow[] }>()
const format = (value: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 }).format(value)
const metrics = computed(() => [
  { label: '数据记录', value: format(props.rows.length), hint: '源表统计行' },
  { label: '总面积', value: format(sumBsr(props.rows, 'total_acres')), hint: '英亩' },
  { label: '自有建筑数量', value: format(sumBsr(props.rows, 'building_owned_count')), hint: '栋' },
  { label: '厂房重置价值', value: format(sumBsr(props.rows, 'plant_replacement_value_usd_m_raw')), hint: '百万美元 · 保留原始单位' },
])
</script>
<template><div class="bsr-summary"><MetricCard v-for="item in metrics" :key="item.label" v-bind="item" /></div></template>
<style scoped>
.bsr-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:20px}.bsr-summary :deep(.metric-card){min-width:0;padding:18px}.bsr-summary :deep(strong){font-size:22px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.bsr-summary :deep(span){font-size:13px}.bsr-summary :deep(small){font-size:12px}
@media(max-width:1100px){.bsr-summary{grid-template-columns:1fr 1fr}}@media(max-width:760px){.bsr-summary{gap:10px}.bsr-summary :deep(.metric-card){padding:14px}.bsr-summary :deep(strong){font-size:18px}.bsr-summary :deep(span){font-size:12px}.bsr-summary :deep(small){font-size:12px}}
</style>
