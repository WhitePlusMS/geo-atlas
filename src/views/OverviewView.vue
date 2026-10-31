<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Check } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import LoadingState from '../components/common/LoadingState.vue'
import { countBy } from '../services/statistics'
import { useDataStore } from '../stores/data'

const data = useDataStore()

const regionFor = (label: string) => {
  if (label === 'Alaska' || label === 'Washington' || label === 'California') return '美国西部与阿拉斯加'
  if (label === 'Hawaii' || label === 'Wake Island') return '夏威夷与中太平洋'
  if (label.includes('Japan')) return '日本'
  if (label === 'Republic of Korea') return '韩国'
  if (label === 'The Philippines') return '菲律宾'
  if (label === 'Australia' || label.includes('Singapore') || label.includes('Indian Ocean')) return '东南亚与澳大利亚'
  return '其他岛屿区域'
}

const regionCounts = computed(() => countBy(data.sites, (site) => regionFor(site.properties.location_label)))
const maxRegionCount = computed(() => Math.max(...regionCounts.value.map((item) => item.value), 1))
const reviewedProfileCount = computed(() => data.profiles.filter((profile) => profile.review_record !== null).length)
const chapterCount = computed(() => data.profiles.reduce((count, profile) => count + profile.description_sections.length, 0))
</script>

<template>
  <LoadingState v-if="data.loading && !data.coreReady" />
  <div v-else class="page overview-page">
    <section class="overview-hero">
      <div class="overview-hero-copy">
        <span class="eyebrow cyan">DTC 2026 / 初赛资料成果</span>
        <h2>把 66 条参考记录<br /><em>变成可追溯的空间底座</em></h2>
        <p>基于组委会初赛资料，整理 CRS 参考站点、公开代表位置、站点说明与 BSR 数据，并把每一条信息连回来源证据。</p>
        <div class="overview-actions"><RouterLink to="/map" class="primary-btn">进入代表点地图</RouterLink></div>
      </div>
      <div class="hero-proof" aria-label="项目成果摘要">
        <div><strong>{{ data.meta?.review.approved_count }}</strong><span>画像来源审核通过</span><small>Codex · AI代理逐条复核</small></div>
        <div><strong>{{ data.meta?.spatial_review.multi_site_mapped_count }}</strong><span>多设施对象</span><small>分地点表达组成关系</small></div>
        <div><strong>{{ data.meta?.spatial_review.component_location_count }}</strong><span>成员独立定位</span><small>保留各自证据与来源范围</small></div>
      </div>
    </section>

    <div class="overview-kpis"><div class="overview-kpi"><span>画像章节</span><strong>{{ chapterCount }}</strong><small>身份、背景、用途与设施关系</small></div><div class="overview-kpi"><span>字段证据</span><strong>{{ data.evidenceRows.length.toLocaleString() }}</strong><small>全部记录可以查看与复核</small></div><div class="overview-kpi"><span>具名关系</span><strong>{{ data.meta?.spatial_review.component_count }}</strong><small>地理地点与文字关系分别保留</small></div></div>
    <section class="panel demo-path" aria-label="答辩演示路径"><div class="panel-heading"><div><h3>沿着一个真实案例演示</h3></div></div><div class="demo-steps"><RouterLink to="/map"><b>01</b><strong>看空间总览</strong><span>分类、聚合与密集点展开</span><ArrowUpRight class="demo-arrow" :size="16" aria-hidden="true" /></RouterLink><RouterLink to="/sites/crs-r47589-008"><b>02</b><strong>看多设施画像</strong><span>Kitsap组成地点与公开参考范围</span><ArrowUpRight class="demo-arrow" :size="16" aria-hidden="true" /></RouterLink><RouterLink :to="{ path: '/model', query: { site: 'crs-r47589-008', view: 'relations' } }"><b>03</b><strong>解释模型运用</strong><span>实体、属性、空间与具名关系</span><ArrowUpRight class="demo-arrow" :size="16" aria-hidden="true" /></RouterLink><RouterLink :to="{ path: '/sites/crs-r47589-008', hash: '#field-evidence' }"><b>04</b><strong>追溯字段证据</strong><span>实际值、出处、记录定位与审核</span><ArrowUpRight class="demo-arrow" :size="16" aria-hidden="true" /></RouterLink></div></section>
    <details class="data-chain panel"><summary>官方资料如何形成可追溯成果</summary>
      <div class="panel-heading"><RouterLink to="/sites">查看目录 <ArrowRight :size="14" aria-hidden="true" /></RouterLink></div>
      <div class="chain-flow">
        <div><b>01</b><strong>初赛资料</strong><small>3 个 PDF + 1 个表格</small></div><span class="chain-arrow"><ArrowRight :size="16" aria-hidden="true" /></span>
        <div><b>02</b><strong>站点目录</strong><small>66 条 CRS 记录</small></div><span class="chain-arrow"><ArrowRight :size="16" aria-hidden="true" /></span>
        <div><b>03</b><strong>公开补充</strong><small>代表位置与说明</small></div><span class="chain-arrow"><ArrowRight :size="16" aria-hidden="true" /></span>
        <div><b>04</b><strong>证据链</strong><small>字段级来源引用</small></div><span class="chain-arrow"><ArrowRight :size="16" aria-hidden="true" /></span>
        <div><b>05</b><strong>前端应用</strong><small>地图 · 详情 · 统计</small></div>
      </div>
    </details>

    <div class="overview-grid">
      <section class="panel overview-status">
        <div class="panel-heading"><div><span>当前交付范围</span><small>已完成内容与明确边界</small></div><RouterLink to="/sites">查看审核结果 <ArrowRight :size="14" aria-hidden="true" /></RouterLink></div>
        <div class="status-lines">
          <div><span class="big-check"><Check :size="16" aria-hidden="true" /></span><div><b>来源审核</b><small>Codex 已审核 {{ reviewedProfileCount }}/{{ data.profiles.length }} 条；逐条结论见详情</small></div><strong class="ok-text">{{ reviewedProfileCount === data.profiles.length ? '已完成' : '未完成' }}</strong></div>
          <div><span class="big-check"><Check :size="16" aria-hidden="true" /></span><div><b>一级详细说明</b><small>{{ data.meta?.review.approved_count }}/{{ data.profiles.length }} 条来源审核通过；站点背景、公开功能与设施关系已写入画像</small></div><strong :class="data.meta?.level1_ready ? 'ok-text' : 'warn-text'">{{ data.meta?.level1_ready ? '已完成' : '待完成' }}</strong></div>
          <div><span class="big-check"><Check :size="16" aria-hidden="true" /></span><div><b>定位证据与设施关系</b><small>GIS {{ data.meta?.review.gis_snapshot_traceable_count }} 条 · 官方图表 {{ data.meta?.review.official_map_traceable_count }} 条 · 地名查询 {{ data.meta?.review.lookup_response_archived_count }} 条；{{ data.meta?.spatial_review.multi_site_mapped_count }} 个多设施对象、{{ data.meta?.spatial_review.component_location_count }} 个具名关联地点已独立绘图</small></div><strong class="ok-text">可追溯</strong></div>
          <div><span class="big-check"><Check :size="16" aria-hidden="true" /></span><div><b>开放系统模型运用</b><small>实际实体、属性、空间关系与证据版本共同呈现</small><RouterLink to="/model">查看模型与实例 <ArrowRight :size="14" aria-hidden="true" /></RouterLink></div><strong class="ok-text">已接入</strong></div>
        </div>
      </section>

      <section class="panel overview-regions">
        <div class="panel-heading"><div><span>参考站点区域分布</span><small>按公开位置标签归并</small></div><RouterLink to="/map">打开地图 <ArrowRight :size="14" aria-hidden="true" /></RouterLink></div>
        <div class="region-bars"><div v-for="item in regionCounts" :key="item.label"><span>{{ item.label }}</span><i><b :style="{ width: `${(item.value / maxRegionCount) * 100}%` }" /></i><strong>{{ item.value }}</strong></div></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-path{margin:16px 0}.demo-path h3{font-size:20px;margin:0}.demo-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.demo-steps a{position:relative;display:grid;gap:9px;padding:18px;background:#f2f8f8;border:1px solid #cddfe0;border-radius:10px;text-decoration:none;min-width:0}.demo-steps a:hover{background:#e6f4f0;border-color:#8bb9b0}.demo-steps b{font-size:12px;color:#508780}.demo-steps strong{font-size:16px;color:var(--text)}.demo-steps span{font-size:12px;line-height:1.8;color:var(--muted)}.demo-steps .demo-arrow{position:absolute;right:16px;top:16px;color:var(--cyan)}.data-chain summary{font-size:16px;font-weight:600}.data-chain .panel-heading{margin-top:20px}
@media(max-width:1200px){.demo-steps{grid-template-columns:1fr 1fr}}@media(max-width:760px){.demo-path h3{font-size:18px}.demo-steps{grid-template-columns:1fr}.demo-steps a{grid-template-columns:28px minmax(0,1fr);gap:5px 10px;padding:15px}.demo-steps b{grid-row:span 2;padding-top:4px}.demo-steps span{grid-column:2}.demo-steps strong{font-size:15px}.data-chain summary{font-size:15px}}
</style>
