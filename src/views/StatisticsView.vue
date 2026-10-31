<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { computed, ref } from 'vue'
import BsrSummary from '../components/statistics/BsrSummary.vue'
import BsrDetailTable from '../components/statistics/BsrDetailTable.vue'
import SimpleBarChart from '../components/statistics/SimpleBarChart.vue'
import SourceDrawer from '../components/evidence/SourceDrawer.vue'
import { bsrByComponent, topBsrByAcres } from '../services/statistics'
import { useDataStore } from '../stores/data'
import { dateLabel, organizationLabel } from '../services/labels'
import { organizationStyle, mapServices } from '../services/mapMarkers'
import type { SourceRecord } from '../types/data'
const data = useDataStore(); const source = ref<SourceRecord | null>(null)
const selectedComponent = ref<string | null>(null)
// 图表分组和明细使用源表机构值，避免把相似名称的机构合并。
const components = computed(() => bsrByComponent(data.bsrRows).map(item => ({ ...item, id: item.label, label: organizationLabel(item.label), color: organizationStyle(item.label).color })))
const detailRows = computed(() => selectedComponent.value === null ? data.bsrRows : data.bsrRows.filter(row => (row.component || 'Unknown') === selectedComponent.value))
const topAcres = computed(() => topBsrByAcres(data.bsrRows))
const format = (value: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 }).format(value)
const legend = computed(() => mapServices.filter(service => data.bsrRows.some(row => organizationStyle(row.component).id === service.id)))
function openSource() { source.value = data.sourceRegistry?.sources[data.meta!.bsr.source_id] ?? null }
function selectComponent(value: string) { selectedComponent.value = value; document.getElementById('bsr-detail')?.scrollIntoView() }
</script>
<template><div class="page statistics-page"><div class="page-intro"><div><span class="eyebrow cyan">FY2024 / {{ data.meta?.bsr.source_sheet }}</span><h2>基础设施统计</h2><p>独立BSR数据集的规模与分布，按源表机构分类汇总。</p></div><div class="page-total"><strong>{{ data.bsrRows.length.toLocaleString() }}</strong><span>条记录</span></div></div><div class="statistics-scope"><div><strong>数据截至 {{ dateLabel(data.meta!.bsr.as_of_date) }}</strong><span>统计口径：Federal DoD Main Report · FY2024</span></div><button type="button" class="secondary-btn" @click="openSource">查看BSR原表来源 <ArrowUpRight :size="15" aria-hidden="true" /></button></div><BsrSummary :rows="data.bsrRows" /><div class="stats-grid"><section class="panel"><div class="panel-heading"><div><h3>按机构统计记录数</h3><small>全部 {{ components.length }} 类 · 点击机构查看明细</small></div></div><div class="stats-legend"><span v-for="item in legend" :key="item.id"><i :style="{ background: item.color }" />{{ item.label }}</span></div><SimpleBarChart :items="components" label="全部机构记录数" selectable :selected="selectedComponent" @select="selectComponent" /></section><section class="panel"><div class="panel-heading"><div><h3>总面积前10名</h3><small>全部机构 · 按源表总面积排序 · 单位：英亩</small></div></div><SimpleBarChart :items="topAcres" :format="format" label="总面积前10名" /><p class="ranking-note">名称沿用源表记录，面积为原表统计值。</p></section></div><BsrDetailTable :rows="detailRows" :selected="selectedComponent" @clear="selectedComponent = null" /><p class="data-footnote">汇总卡片和面积排行为全部机构；明细可按机构筛选。BSR与66条CRS参考站点保持独立口径。厂房重置价值单位为百万美元，原始数值和截至日期保留源表语义。</p><SourceDrawer :source="source" @close="source = null" /></div></template>
<style scoped>
.statistics-scope{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 20px;background:#eaf4f4;border:1px solid #c9dfdf;border-radius:11px;margin-bottom:20px}.statistics-scope>div{display:grid;gap:6px}.statistics-scope strong{font-size:15px}.statistics-scope span{font-size:12px;color:var(--muted)}.statistics-scope button{font-size:13px}.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.stats-grid h3{font-size:19px;margin:0}.stats-legend{display:flex;gap:11px;flex-wrap:wrap;font-size:12px;color:var(--muted);margin:0 0 22px}.stats-legend span{display:flex;align-items:center;gap:5px}.stats-legend i{width:9px;height:9px;border-radius:50%;border:1px solid #17344422}.ranking-note{border-top:1px solid var(--line);padding-top:16px;margin-top:21px;font-size:12px;color:var(--muted)}
@media(max-width:1000px){.stats-grid{grid-template-columns:1fr}}@media(max-width:760px){.statistics-scope{display:grid;padding:16px}.statistics-scope button{justify-self:start}.stats-grid h3{font-size:18px}}
</style>
