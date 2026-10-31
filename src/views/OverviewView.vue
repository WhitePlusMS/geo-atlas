<script setup lang="ts">
import { ArrowRight, Expand } from '@lucide/vue'
import { useRouter } from 'vue-router'
import GlobeScene from '../components/map/GlobeScene.vue'
import { useDataStore } from '../stores/data'
import type { SiteFeature } from '../types/data'

const data = useDataStore()
const router = useRouter()
let pointerStart: { id: number; x: number; y: number } | null = null

// 点击地球进入地图，拖动地球时不跳转；标记选择保留目标站点。
function beginPreview(event: PointerEvent) {
  const target = event.target
  pointerStart = target instanceof HTMLCanvasElement || (target instanceof Element && target.closest('.globe-marker.cluster')) ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null
}
function openPreview(event: PointerEvent) {
  if (pointerStart?.id === event.pointerId && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 6) void router.push('/map')
  pointerStart = null
}
function openSite(site: SiteFeature) { void router.push({ path: '/map', query: { site: site.properties.site_id } }) }
</script>

<template>
  <div class="page home-page">
    <section class="home-intro">
      <span class="home-eyebrow">DTC 2026 · 基础设施参考态势</span>
      <h2>从空间出发<br /><em>认识每一个站点</em></h2>
      <p>浏览参考位置、站点画像和来源证据，在同一张地图上理解设施与地点之间的关系。</p>
      <div class="home-actions"><RouterLink to="/map" class="primary-btn">进入代表点地图 <ArrowRight :size="17" aria-hidden="true" /></RouterLink><RouterLink to="/sites" class="home-link">浏览参考站点</RouterLink></div>
      <div class="home-numbers" aria-label="数据概览"><div><strong>{{ data.sites.length }}</strong><span>参考站点</span></div><div><strong>{{ data.meta?.spatial_review.multi_site_mapped_count }}</strong><span>多设施对象</span></div><div><strong>{{ data.meta?.spatial_review.component_location_count }}</strong><span>独立定位地点</span></div></div>
      <small class="home-note">位置与范围依据公开资料，仅供参考。</small>
    </section>
    <section class="home-map" aria-label="三维地图预览" @pointerdown.capture="beginPreview" @pointerup.capture="openPreview">
      <div class="preview-label"><i /> 交互式地理参考 <span>拖动地球 · 点击进入</span></div>
      <GlobeScene preview :sites="data.sites" @select="openSite" />
      <RouterLink to="/map" class="preview-expand"><Expand :size="16" aria-hidden="true" /> 展开地图</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home-page{display:grid;grid-template-columns:minmax(300px,.8fr) minmax(0,1.4fr);min-height:calc(100dvh - 118px);gap:clamp(24px,3vw,56px);align-items:stretch}
.home-intro{display:flex;flex-direction:column;justify-content:center;padding:30px 0 36px 2vw;min-width:0}.home-eyebrow{font-size:12px;letter-spacing:.14em;color:#087f7a;font-weight:650}.home-intro h2{font-size:clamp(38px,3.5vw,62px);line-height:1.18;letter-spacing:-.035em;margin:22px 0}.home-intro h2 em{font-style:normal;color:#087f7a}.home-intro p{max-width:34em;color:var(--muted);font-size:16px;margin:0;line-height:1.9}.home-actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:32px}.home-link{font-size:14px;text-decoration:none;font-weight:600}.home-numbers{display:flex;gap:clamp(20px,3vw,45px);margin-top:clamp(40px,7vh,78px);padding-top:24px;border-top:1px solid var(--line)}.home-numbers div{display:grid;gap:3px}.home-numbers strong{font-size:30px;color:#173e4a}.home-numbers span,.home-note{font-size:12px;color:var(--muted)}.home-note{margin-top:30px}.home-map{position:relative;min-height:540px;border-radius:18px;overflow:hidden;background:#081222;box-shadow:0 18px 50px #173b4d22}.preview-label{position:absolute;top:23px;left:25px;z-index:5;display:flex;align-items:center;gap:9px;color:#d5e7ed;font-size:12px;pointer-events:none}.preview-label i{width:7px;height:7px;border-radius:50%;background:#75dbc8}.preview-label span{color:#85a2b7;font-size:11px;margin-left:8px}.preview-expand{position:absolute;right:22px;bottom:22px;z-index:8;display:flex;align-items:center;gap:8px;padding:11px 15px;color:#d9f7ef;background:#153b43e8;border:1px solid #538e87;border-radius:8px;text-decoration:none;font-size:13px}.preview-expand:hover{background:#205258}
@media(max-width:1000px){.home-page{grid-template-columns:1fr;gap:22px}.home-intro{padding:20px 4px 0}.home-intro h2{margin:14px 0}.home-numbers{margin-top:30px}.home-note{margin-top:16px}.home-map{min-height:480px;height:55dvh}}
@media(max-width:600px){.home-intro h2{font-size:36px}.home-intro p{font-size:14px}.home-actions{gap:16px;margin-top:22px}.home-numbers{gap:24px}.home-numbers strong{font-size:25px}.home-map{min-height:360px;height:48dvh;border-radius:12px}.preview-label{top:16px;left:16px}.preview-label span{display:none}.preview-expand{right:14px;bottom:14px}}
</style>
