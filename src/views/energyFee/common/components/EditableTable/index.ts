import { defineAsyncComponent } from 'vue'

export const EditableTable = defineAsyncComponent(() => import('./EditableTable.vue'))

export type EditableTableProps = InstanceType<typeof EditableTable>['$props']
