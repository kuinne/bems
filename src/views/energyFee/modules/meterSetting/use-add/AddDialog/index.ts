import { defineAsyncComponent } from 'vue'

export const AddDialog = defineAsyncComponent(() => import('./AddDialog.vue'))

export type AddDialogProps = InstanceType<typeof AddDialog>['$props']
