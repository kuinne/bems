import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/energySetting/energyFee',
    component: () => import('./index.vue'),
    meta: {
      componentName: 'energyFee',
      hiddenBread: true,
      hiddenLayout: true,
    },
  },
]

export default router
