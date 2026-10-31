<script setup lang="ts">
import { X, ArrowUpRight } from '@lucide/vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { SourceRecord } from '../../types/data'
import { dateLabel, rightsLabel, verificationLabel } from '../../services/labels'
const props = defineProps<{ source: SourceRecord | null }>()
const emit = defineEmits<{ close: [] }>()
const drawer = ref<HTMLDialogElement | null>(null)
// 原生dialog负责焦点限制与还原；关闭后仍由父组件管理选中来源。
watch(() => props.source, async value => { await nextTick(); if (value && !drawer.value?.open) drawer.value?.showModal(); else if (!value && drawer.value?.open) drawer.value.close() }, { immediate: true })
function closeOnBackdrop(event: MouseEvent) {
  if (event.target !== drawer.value || !drawer.value) return
  const box = drawer.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) emit('close')
}
onBeforeUnmount(() => drawer.value?.close())
</script>
<template>
  <dialog ref="drawer" class="source-drawer" aria-labelledby="source-dialog-title" @cancel.prevent="emit('close')" @click="closeOnBackdrop">
    <template v-if="source"><div class="drawer-heading"><span>来源详情</span><button type="button" aria-label="关闭来源详情" autofocus @click="emit('close')"><X :size="20" aria-hidden="true" /></button></div><span class="tag derived">{{ verificationLabel(source.verification_status) }}</span><h2 id="source-dialog-title">{{ source.title }}</h2><p class="source-publisher">{{ source.publisher }}</p>
    <dl><dt>发布日期</dt><dd>{{ dateLabel(source.published_at) }}</dd><dt>资料截至</dt><dd>{{ dateLabel(source.as_of_date) }}</dd><dt>获取时间</dt><dd>{{ dateLabel(source.retrieved_at, true) }}</dd><dt>归档状态</dt><dd>{{ verificationLabel(source.verification_status) }}</dd></dl>
    <a v-if="source.url" class="primary-btn source-external" :href="source.url" target="_blank" rel="noreferrer">打开原始来源 <ArrowUpRight :size="16" aria-hidden="true" /></a>
    <details class="source-technical"><summary>来源指纹与使用说明</summary><dl><dt>来源编号</dt><dd><code>{{ source.source_id }}</code></dd><dt>SHA-256</dt><dd><code>{{ source.sha256 || '未记录' }}</code></dd><dt>权利记录</dt><dd>{{ rightsLabel(source.rights) }}</dd><dt>原始文献外发</dt><dd>{{ source.external_export_allowed ? '允许' : '未完成权利复核' }}</dd></dl><p class="muted">事实引用与原始文献外发范围以保存的来源记录为准。</p></details><p class="drawer-help">按 Esc 或点击右上角关闭，返回原来的证据位置。</p></template>
  </dialog>
</template>
<style scoped>
.source-drawer{position:fixed;inset:0 0 0 auto;margin:0;width:min(490px,94vw);max-width:94vw;height:100dvh;max-height:100dvh;padding:26px;border:0;border-left:1px solid var(--line);color:var(--text);background:#fff;overflow:auto;overscroll-behavior:contain;box-shadow:-18px 0 60px #17344428;z-index:100}.source-drawer:not([open]){display:none}.source-drawer::backdrop{background:#102d4152}.drawer-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;color:var(--cyan);font-weight:700}.drawer-heading button{width:44px;height:44px;display:grid;place-items:center;background:#eef5f6;border:1px solid var(--line);border-radius:10px;font-size:24px;color:var(--text)}.source-drawer h2{font-size:23px;line-height:1.5;margin:18px 0 8px;overflow-wrap:anywhere}.source-publisher{color:var(--muted);line-height:1.6}.source-drawer dl{display:grid;grid-template-columns:90px minmax(0,1fr);gap:17px 14px;margin:26px 0;font-size:14px;line-height:1.6}.source-drawer dt{color:var(--muted)}.source-drawer dd{margin:0;overflow-wrap:anywhere}.source-external{display:inline-flex;text-decoration:none;margin:0 0 26px}.source-technical{padding:16px;background:#f3f8f8;border:1px solid var(--line);border-radius:10px}.source-technical summary{font-weight:600}.source-technical dl{font-size:13px}.source-technical code{font-size:12px}.drawer-help{font-size:12px;line-height:1.6;color:var(--muted);margin-top:25px}
@media(max-width:760px){.source-drawer{padding:20px}.source-drawer h2{font-size:21px}}
</style>
