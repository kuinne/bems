import { defineAsyncComponent } from 'vue'
import { Props } from './type'
const Table = defineAsyncComponent(() => import('./Table.vue'))

export type TableProps = Props
export { Table }
