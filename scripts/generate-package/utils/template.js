const { containsUpperCase, underline } = require('./utils')

// 将 comp-name 形式的字符串转换为 CompName
const upperCamelCase = require('uppercamelcase')

module.exports = {
  // demo模板
  demoTemplate: (componentName) => {
    let realName = componentName
    if (containsUpperCase(componentName)) realName = underline(componentName)
    const name = upperCamelCase(componentName)
    return `<template>
  <das-${realName}/>
</template>

<script setup lang="ts">
import { Das${name} } from '@/das-fe/ui'
</script>

<style lang='scss' scoped></style>`
  },

  // 组件模板
  componentTemplate: (componentName) => {
    let realName = componentName
    if (containsUpperCase(componentName)) realName = underline(componentName)
    return `<template>
    <div class="das-ui-${realName}">${realName}</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.das-ui-${realName} {
};
</style>`
  },

  // 入口文件模板
  entryTemplate: (componentName) => {
    let name = upperCamelCase(componentName)
    return `
import { ref,defineAsyncComponent } from 'vue'

const Das${name} = defineAsyncComponent(() => import('./src/Index.vue'))

/** 获取组件实例 */
const Das${name}Ref = () => ref<InstanceType<typeof Das${name}> | null>(null)

export { Das${name},Das${name}Ref }
`
  },

  // 路由文件模板
  routerTemplate: (componentName) => {
    let realName = componentName
    if (containsUpperCase(componentName)) realName = underline(componentName)
    const path = 'das-' + realName
    return `
import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [{
  path: "/${path}",
  name: "${path}",
  component: ()=> import('./demo/Index.vue')
}]
export default router`
  },

  typeTemplate: () => {
    return `
export interface Props {}

export interface Emits {}
    `
  },
}
