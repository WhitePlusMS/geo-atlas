<script setup lang="ts">
withDefaults(defineProps<{ text?: string | null }>(), {
  text: '公开资料补充的代表位置，具体来源与审核结论以各站点记录为准。',
})
</script>

<template>
  <div v-if="text" class="boundary-banner"><span class="status-dot" />{{ text }}</div>
</template>
