import { defineAsyncComponent } from 'vue'

export const EditDialog = defineAsyncComponent(() => import('./EditDialog.vue'))

export type EditDialogProps = InstanceType<typeof EditDialog>['$props']
