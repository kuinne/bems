import { defineAsyncComponent } from 'vue'

export const Tab = defineAsyncComponent(() => import('./Tab.vue'))

export type TabProps = InstanceType<typeof Tab>['$props']
