<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ items: Array<{ label: string; value: number; color?: string }>; format?: (value: number) => string; label: string }>()
const maximum = computed(() => Math.max(...props.items.map(item => item.value), 1))
</script>
<template><ol class="bars" :aria-label="label"><li v-for="item in items" :key="item.label" class="bar-row"><span>{{ item.label }}</span><b>{{ format ? format(item.value) : item.value.toLocaleString() }}</b><div class="bar-track" aria-hidden="true"><i :style="{ width: (item.value / maximum) * 100 + '%', background: item.color ?? 'var(--cyan)' }" /></div></li></ol></template>
<style scoped>
.bars{display:grid;gap:17px;list-style:none;margin:0;padding:0}.bar-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 16px;align-items:start;font-size:14px;line-height:1.55}.bar-row>span{color:#486774;overflow-wrap:anywhere}.bar-row>b{font-size:14px;text-align:right;font-variant-numeric:tabular-nums;font-weight:650}.bar-track{grid-column:1/-1;height:8px;border-radius:9px;overflow:hidden;background:#e8eff1}.bar-track i{display:block;height:100%;border-radius:inherit;border:1px solid #17344422;min-width:1px}
@media(max-width:760px){.bar-row{font-size:13px;gap:7px 10px}.bar-row>b{font-size:13px}.bars{gap:17px}}
</style>
