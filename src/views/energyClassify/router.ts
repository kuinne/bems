import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/energySetting/energyClassify',
    component: () => import('./Index.vue'),
    meta: {
      componentName: 'EnergyClassify',
      hiddenBread: true,
    },
  },
]

export default router
