import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/energySetting/energyObject',
    component: () => import('./Index.vue'),
    meta: {
      componentName: 'EnergyObject',
      hiddenBread: true,
    },
  },
]

export default router
