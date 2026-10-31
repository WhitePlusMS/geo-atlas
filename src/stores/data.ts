import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loadBsr, loadEvidence, loadMeta, loadProfiles, loadSites, loadSources } from '../services/dataLoader'
import type { BaseProfile, BsrRow, EvidenceRow, FrontendMeta, SiteFeature, SourceRegistry } from '../types/data'

export const useDataStore = defineStore('data', () => {
  const meta = ref<FrontendMeta | null>(null)
  const sites = ref<SiteFeature[]>([])
  const profiles = ref<BaseProfile[]>([])
  const bsrRows = ref<BsrRow[]>([])
  const evidenceRows = ref<EvidenceRow[]>([])
  const sourceRegistry = ref<SourceRegistry | null>(null)
  const loading = ref(false)
  const error = ref('')
  const coreReady = computed(() => Boolean(meta.value && sites.value.length && sourceRegistry.value && profiles.value.length === sites.value.length))

  async function loadCore() {
    if (coreReady.value || loading.value) return
    loading.value = true
    error.value = ''
    try {
      const [loadedMeta, loadedSites, loadedProfiles, loadedBsr, loadedEvidence, loadedSources] = await Promise.all([
        loadMeta(), loadSites(), loadProfiles(), loadBsr(), loadEvidence(), loadSources(),
      ])
      // 先检查画像和站点的一一对应，再一起提交，失败时不显示半套数据。
      const profileIds = new Set(loadedProfiles.profiles.map((profile) => profile.site_id))
      if (loadedProfiles.profile_count !== loadedSites.features.length || loadedProfiles.profiles.length !== loadedSites.features.length || profileIds.size !== loadedSites.features.length || loadedSites.features.some((site) => !profileIds.has(site.properties.site_id))) {
        throw new Error('站点画像与参考站点不一致')
      }
      meta.value = loadedMeta
      sites.value = loadedSites.features
      profiles.value = loadedProfiles.profiles
      bsrRows.value = loadedBsr
      evidenceRows.value = loadedEvidence
      sourceRegistry.value = loadedSources
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '核心数据加载失败'
      console.error('[DTC 数据加载]', error.value)
    } finally {
      loading.value = false
    }
  }

  return { meta, sites, profiles, bsrRows, evidenceRows, sourceRegistry, loading, error, coreReady, loadCore }
})
