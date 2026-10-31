<script setup lang="ts">
import { Shield, Anchor, Plane, Ship, Orbit, Users, Building2 } from '@lucide/vue'
import { computed } from 'vue'
import { organizationStyle } from '../../services/mapMarkers'
import { organizationLabel } from '../../services/labels'
const props = defineProps<{ value: string }>()
const icons = { army: Shield, navy: Anchor, air: Plane, marine: Ship, space: Orbit, joint: Users, other: Building2 } as const
// 图标仅辅助识别机构分类，名称仍来自数据，不代表官方徽章。
const icon = computed(() => icons[organizationStyle(props.value).id])
</script>
<template><span class="service-badge"><component :is="icon" :size="17" :stroke-width="1.8" aria-hidden="true" />{{ organizationLabel(value) }}</span></template>
<style scoped>
.service-badge{display:inline-flex;align-items:center;gap:7px;font-size:13px;line-height:1.5;color:var(--text)}.service-badge svg{flex-shrink:0;color:var(--cyan)}
</style>
