import { defineAsyncComponent } from 'vue'

export const ConfirmDialog = defineAsyncComponent(() => import('./ConfirmDialog.vue'))

export type ConfirmDialogProps = InstanceType<typeof ConfirmDialog>['$props']
