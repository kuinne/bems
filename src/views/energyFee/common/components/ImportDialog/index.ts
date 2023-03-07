import { defineAsyncComponent } from 'vue'

export const ImportDialog = defineAsyncComponent(() => import('./ImportDialog.vue'))

export type ImportDialogProps = InstanceType<typeof ImportDialog>['$props']
