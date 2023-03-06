import { defineAsyncComponent } from 'vue'

export const Layout = defineAsyncComponent(() => import('./Layout.vue'))

export type LayoutProps = InstanceType<typeof Layout>['$props']
