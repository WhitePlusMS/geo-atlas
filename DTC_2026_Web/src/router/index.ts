import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  // 同页筛选不重置滚动；返回目录还原位置，章节链接使用路由内的hash。
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash && to.hash !== from.hash) return { el: to.hash, top: 96 }
    if (to.path === from.path) return false
    return { top: 0 }
  },
  routes: [
    { path: '/', component: () => import('../views/OverviewView.vue') },
    { path: '/map', component: () => import('../views/MapView.vue') },
    { path: '/sites', component: () => import('../views/SitesView.vue') },
    { path: '/sites/:siteId', component: () => import('../views/SiteDetailView.vue') },
    { path: '/model', component: () => import('../views/ModelView.vue') },
    { path: '/statistics', component: () => import('../views/StatisticsView.vue') },
    // 已移除内部工作页；不存在的地址统一回到正式成果概览。
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
