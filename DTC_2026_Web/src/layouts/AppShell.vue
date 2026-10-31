<script setup lang="ts">
import { LayoutDashboard, Globe2, MapPin, Network, ChartNoAxesCombined, Menu, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BoundaryBanner from '../components/common/BoundaryBanner.vue'
import LoadingState from '../components/common/LoadingState.vue'
import { useDataStore } from '../stores/data'
const route = useRoute(); const data = useDataStore()
const mainContent = ref<HTMLElement | null>(null)
const navigation = ref<HTMLDialogElement | null>(null)
const navigationOpen = ref(false)
// 使用原生 dialog 管理焦点与 Esc；关闭时浏览器将焦点还给菜单按钮。
function openNavigation() { if (!navigation.value?.open) { navigation.value?.showModal(); navigationOpen.value = true } }
function closeNavigation() { navigation.value?.close(); navigationOpen.value = false }
function closeOnBackdrop(event: MouseEvent) {
  if (event.target !== navigation.value || !navigation.value) return
  const box = navigation.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeNavigation()
}
const links = [{ path: '/', label: '概览', icon: LayoutDashboard }, { path: '/map', label: '代表点地图', icon: Globe2 }, { path: '/sites', label: '参考站点', icon: MapPin }, { path: '/model', label: '开放系统模型', icon: Network }, { path: '/statistics', label: 'BSR 统计', icon: ChartNoAxesCombined }]
const title = computed(() => route.path.startsWith('/sites/') ? '站点详情' : links.find((link) => route.path === link.path)?.label ?? '基础资料')
const loadingStatus = computed(() => data.loading ? '数据加载中' : data.error ? '数据加载失败' : data.coreReady ? '数据已加载' : '等待加载')
const boundaryText = computed(() => {
  if (route.path === '/') return '公开补充数据与组委会原始资料分层管理；代表位置不等同于正式竞赛坐标或设施边界。'
  if (route.path === '/map') return '当前地图展示公开来源补充代表点，坐标来源的审核结果见下方及站点详情。'
  if (route.path === '/sites') return '参考站点名称、地区和机构来自 CRS Table A-1；代表位置为公开来源补充。'
  if (route.path.startsWith('/sites/')) return '本页代表位置来自公开来源补充，不等同于组委会正式竞赛坐标或设施边界。'
  if (route.path === '/statistics') return 'BSR 为独立 FY2024 统计数据集，不与 66 条 CRS 参考站点按名称强行关联。'
  if (route.path === '/model') return '本页用真实一级数据展示实体、属性、空间、关系和来源更新；概念映射为本项目解释。'
  return undefined
})
</script>
<template>
  <div class="app-shell">
    <button type="button" class="skip-link" @click="mainContent?.focus()">跳到主要内容</button>
    <dialog id="main-navigation" ref="navigation" class="sidebar" aria-label="主要页面导航" @click="closeOnBackdrop" @close="navigationOpen = false">
      <div class="sidebar-header"><div class="brand-mark">DTC<span>26</span></div><button type="button" class="nav-close" aria-label="关闭导航" autofocus @click="closeNavigation"><X :size="20" aria-hidden="true" /></button></div>
      <div class="brand-copy"><b>基础设施态势参考系统</b></div>
      <nav class="sidebar-nav" aria-label="主要页面"><RouterLink v-for="link in links" :key="link.path" :to="link.path" :aria-label="link.label" @click="closeNavigation" :class="{ active: route.path === link.path || (link.path !== '/' && route.path.startsWith(link.path)) }"><component :is="link.icon" class="nav-icon" :size="18" aria-hidden="true" /><span class="nav-label">{{ link.label }}</span></RouterLink></nav>
      <div class="sidebar-foot"><span class="live-dot" />本地数据集<br /><small>一级基础数据</small></div>
    </dialog>
    <main id="main-content" ref="mainContent" tabindex="-1" :class="['main-shell', { 'map-shell': route.path === '/map' }]">
      <header class="topbar">
        <div class="topbar-title"><button type="button" class="nav-toggle" aria-label="打开导航" aria-controls="main-navigation" :aria-expanded="navigationOpen" @click="openNavigation"><Menu :size="21" aria-hidden="true" /></button><h1>{{ title }}</h1></div>
        <div class="header-status"><span class="status-pill" :class="{ 'status-error': data.error }" role="status">● {{ loadingStatus }}</span></div>
      </header>
      <BoundaryBanner :text="boundaryText" />
      <section v-if="data.error" class="global-error" role="alert"><span>{{ data.error }}</span><button type="button" class="secondary-btn" :disabled="data.loading" @click="data.loadCore()">重新加载</button></section>
      <!-- 核心数据全部就绪后再展示页面，避免失败时出现写死的成果计数。 -->
      <LoadingState v-if="!data.coreReady && !data.error" />
      <slot v-else-if="data.coreReady" />
    </main>
  </div>
</template>

<style scoped>
.status-error { color: #9b2637; background: #fff0f2; border-color: #dea2ac; }
.global-error { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
.global-error button { padding: 7px 12px; border-radius: 5px; }
</style>
