<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppShell from './layouts/AppShell.vue'
import { useDataStore } from './stores/data'

const data = useDataStore()
onMounted(() => data.loadCore())
</script>

<template>
  <AppShell>
    <RouterView />
  </AppShell>
</template>
