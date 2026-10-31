<script setup lang="ts">
import { coordinateSemanticsLabel } from '../../services/labels'
import type { CoordinateSemantics } from '../../types/data'
defineProps<{ value: string }>()
</script>
<template><span class="badge" :class="value.toLowerCase().replaceAll('_', '-')">{{ coordinateSemanticsLabel(value as CoordinateSemantics) }}</span></template>
