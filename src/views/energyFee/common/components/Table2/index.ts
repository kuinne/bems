import { defineAsyncComponent } from 'vue'
const Table = defineAsyncComponent(() => import('./Table.vue'))

export type TableProps = InstanceType<typeof Table>['$props']
export { Table }
