import { defineAsyncComponent } from 'vue'

export const Container = defineAsyncComponent(() => import('./Container.vue'))
