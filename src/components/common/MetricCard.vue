<script setup lang="ts">
defineProps<{ label: string; value: string | number; hint?: string }>()
</script>
<template><div class="metric-card"><span>{{ label }}</span><strong>{{ value }}</strong><small v-if="hint">{{ hint }}</small></div></template>
