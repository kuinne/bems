import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/energySetting/energyFee',
    component: () => import('./index.vue'),
    meta: {
      componentName: 'energyFee',
      hiddenBread: true,
    },
  },
]

export default router
