import { defineAsyncComponent } from 'vue'

export const ActionButtons = defineAsyncComponent(() => import('./ActionButton.vue'))

export type ActionButtonsProps = InstanceType<typeof ActionButtons>['$props']
