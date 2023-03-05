import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/energySetting/energySubitem',
    component: () => import('./Index.vue'),
    meta: {
      componentName: 'EnergySubitem',
      hiddenBread: true,
    },
  },
]

export default router
