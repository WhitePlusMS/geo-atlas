<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import type { EvidenceRow } from '../../types/data'
import { factLevelLabel, fieldLabel } from '../../services/labels'
import { useDataStore } from '../../stores/data'
const props = defineProps<{ rows: EvidenceRow[] }>()
const emit = defineEmits<{ source: [id: string] }>()
const data = useDataStore()
const query = ref(''); const page = ref(1); const showAll = ref(false)
const pageSize = 12
const titleFor = (row: EvidenceRow) => data.sourceRegistry?.sources[row.source_id]?.title ?? row.source_id
const componentNames = computed(() => new Map(data.profiles.flatMap(profile => profile.components.map(component => [component.component_id, component.name] as const))))
const fieldTitle = (row: EvidenceRow) => {
  const name = componentNames.value.get(row.field_name.replace(/::location$/, ''))
  return fieldLabel(row.field_name) + (name ? ' · ' + name : '')
}
const filtered = computed(() => props.rows.filter(row => (fieldTitle(row) + ' ' + row.value + ' ' + titleFor(row)).toLowerCase().includes(query.value.trim().toLowerCase())))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const visible = computed(() => showAll.value ? filtered.value : filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch([query, () => props.rows], () => { page.value = 1; showAll.value = false })
</script>
<template>
  <div class="evidence-browser">
    <div class="evidence-toolbar"><label>查找字段证据<input v-model="query" type="search" placeholder="字段、内容或来源…" autocomplete="off" /></label><span class="muted" role="status">已展示 {{ visible.length }} / {{ filtered.length }} 条<span v-if="query"> · 全部 {{ rows.length }} 条</span></span></div>
    <div v-if="!filtered.length" class="empty-message"><strong>没有匹配的字段证据</strong><p>试试其他关键词，或清空搜索查看全部记录。</p><button v-if="query" type="button" class="secondary-btn" @click="query = ''">清空搜索</button></div>
    <!-- 分页只限制当前视图；每一条正式证据都能展开查看。 -->
    <div v-else class="evidence-list"><article v-for="row in visible" :key="row.evidence_id" class="evidence-record"><div class="evidence-field"><span class="tag" :class="row.fact_level === 'SOURCE_FACT' ? 'source' : 'derived'">{{ factLevelLabel(row.fact_level) }}</span><strong>{{ fieldTitle(row) }}</strong></div><p class="evidence-value">{{ row.value || '该字段未提供值' }}</p><div class="evidence-reference"><button type="button" class="source-link" @click="emit('source', row.source_id)">{{ titleFor(row) }} <ArrowUpRight :size="14" aria-hidden="true" /></button><small>定位：{{ row.source_page_or_sheet || '来源记录' }} · {{ row.source_row_or_section || '原始条目' }}</small></div><details><summary>原始记录信息</summary><code>{{ row.evidence_id }}</code><p v-if="row.notes" class="muted">{{ row.notes }}</p></details></article></div>
    <div v-if="filtered.length > pageSize" class="evidence-pagination"><div v-if="!showAll" class="page-buttons"><button type="button" class="secondary-btn" :disabled="page <= 1" @click="page--">上一页证据</button><span aria-live="polite">{{ page }} / {{ pageCount }} 页</span><button type="button" class="secondary-btn" :disabled="page >= pageCount" @click="page++">下一页证据</button></div><button type="button" class="secondary-btn" :aria-expanded="showAll" @click="showAll = !showAll; page = 1">{{ showAll ? '收起为分页' : '显示全部 ' + filtered.length + ' 条证据' }}</button></div>
  </div>
</template>
<style scoped>
.evidence-toolbar{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:18px;flex-wrap:wrap}.evidence-toolbar label{display:grid;gap:7px;font-size:13px;min-width:min(300px,100%)}.evidence-toolbar input{width:100%}.evidence-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.evidence-record{min-width:0;padding:17px;border:1px solid var(--line);border-radius:10px;background:#f9fcfc;content-visibility:auto;contain-intrinsic-size:auto 210px}.evidence-field{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.evidence-value{line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow:auto;margin:12px 0}.evidence-reference{display:grid;gap:7px}.evidence-reference small{line-height:1.6;overflow-wrap:anywhere;color:var(--muted)}.source-link{color:var(--cyan);background:none;border:0;padding:4px 0;text-align:left;font-size:13px;line-height:1.7;overflow-wrap:anywhere}.evidence-record details{font-size:12px;margin-top:12px;color:var(--muted)}.evidence-record code{display:block;margin-top:10px;overflow-wrap:anywhere}.evidence-pagination,.page-buttons{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.evidence-pagination{margin-top:20px}.page-buttons{font-size:13px}
@media(max-width:760px){.evidence-list{grid-template-columns:1fr}.evidence-toolbar label{width:100%}.evidence-record{padding:14px}.page-buttons{width:100%}}
</style>
