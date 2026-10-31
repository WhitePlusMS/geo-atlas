<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BsrRow } from '../../types/data'
import { organizationLabel } from '../../services/labels'
const props = defineProps<{ rows: BsrRow[]; selected: string | null }>()
const emit = defineEmits<{ clear: [] }>()
const page = ref(1); const pageSize = 20
const pageCount = computed(() => Math.max(1, Math.ceil(props.rows.length / pageSize)))
const visible = computed(() => props.rows.slice((page.value - 1) * pageSize, page.value * pageSize))
watch(() => props.selected, () => { page.value = 1 })
</script>
<template>
  <section id="bsr-detail" class="panel bsr-detail" aria-label="BSR 原表明细">
    <div class="detail-heading"><div><h3>BSR 原表明细</h3><p role="status">{{ selected === null ? '全部机构' : organizationLabel(selected) }} · {{ rows.length.toLocaleString() }} 条</p></div><button v-if="selected !== null" type="button" class="secondary-btn" @click="emit('clear')">清除机构筛选</button></div>
    <p class="scroll-hint">左右滑动查看完整字段</p><div class="table-wrap" tabindex="0" role="region" aria-label="BSR 明细表，可横向滚动"><table><caption class="sr-only">BSR 原表明细，保留源表行号和原始数值</caption><thead><tr><th scope="col">源表行号</th><th scope="col">站点</th><th scope="col">州 / 国家</th><th scope="col">最近城市</th><th scope="col">机构</th><th scope="col">面积（英亩）</th><th scope="col">自有建筑（栋）</th><th scope="col">厂房重置价值（百万美元）</th></tr></thead><tbody><tr v-for="row in visible" :key="row.source_sheet + ':' + row.source_row"><td>{{ row.source_row }}</td><td>{{ row.site || '—' }}</td><td>{{ row.country_state || '—' }}</td><td>{{ row.name_nearest_city || '—' }}</td><td>{{ organizationLabel(row.component) || '未说明' }}</td><td>{{ row.total_acres || '—' }}</td><td>{{ row.building_owned_count || '—' }}</td><td>{{ row.plant_replacement_value_usd_m_raw || '—' }}</td></tr></tbody></table></div>
    <div class="pagination"><button type="button" class="secondary-btn" :disabled="page <= 1" @click="page--">上一页</button><span aria-live="polite">{{ page }} / {{ pageCount }} 页</span><button type="button" class="secondary-btn" :disabled="page >= pageCount" @click="page++">下一页</button></div>
  </section>
</template>
<style scoped>
.bsr-detail{margin-top:20px;scroll-margin-top:96px}.detail-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.detail-heading h3{margin:0}.detail-heading p{font-size:13px;color:var(--muted)}.table-wrap{overflow-x:auto}table{width:100%;min-width:1000px;border-collapse:collapse;font-size:13px}th,td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;line-height:1.5}th{color:var(--muted);white-space:nowrap}td{overflow-wrap:anywhere}.pagination{display:flex;align-items:center;gap:14px;margin-top:18px;font-size:13px}
.scroll-hint{display:none}@media(max-width:1050px){.scroll-hint{display:block;color:var(--muted);font-size:12px}}
</style>
