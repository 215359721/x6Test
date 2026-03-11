import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/flowchart',
    name: 'FlowChart',
    component: () => import('@/views/FlowChart.vue')
  },
  {
    path: '/tree-table',
    name: 'TreeTable',
    component: () => import('@/views/TreeTableDemo.vue')
  },
  {
    path: '/draggable-tabs',
    name: 'DraggableTabs',
    component: () => import('@/views/DraggableTabsDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
