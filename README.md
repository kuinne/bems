# 企业管理后台-能源管理

## 安装依赖

新版本都使用 pnpm 安装依赖，node 版本也升级到 16+，推荐使用 nvm 管理 node 版本

ps：如果没有安装 pnpm 可以使用 npm i -g pnpm

```
  pnpm i
  pnpm run dev
```

执行完以上脚本会自动同步 starter库 以及 ui库

## config.local.js 文件配置如下：

```js
/** @type {import('../src/types/config').Config} */
window.config = {
  title: 'bems',
  baseURL: 'http://v6aiotdev.rd.chn-das.com',
  // baseURL: 'http://v6aiottest.rd.chn-das.com',
  server: { port: 4012 },
  microAppName: 'enterpriseadmin/bems',
}

```

## 子应用 portal 使用指南：

#### 1、如何切换 portal 状态？

示例如下：

```js
import { useLayoutStore } from '@/common/micro-app/store/layoutStore'
const layoutStore = useLayoutStore()
// 左侧菜单隐藏
layoutStore.changeState('showAside', false)
// 标签栏隐藏
layoutStore.changeState('showTabs', false)
// 左侧菜单折叠
layoutStore.changeState('collapse', true)
```

#### 2、如何打开一个标签页？

示例如下：

```js
import { useTabsStore } from '@/common/micro-app/store/tabsStore'
const tabsStore = useTabsStore()

// 路由参数不同会打开两个不同的标签
tabsStore.openTabs({
  path: '/demo',
  name: '示例', // 标签名称
  componentName: 'Demo',
  query: {
    roleId: 'id',
    roleName: 'name',
  }
})
```

## 备注：

portal 有个需求：切换标签页的时候页面不刷新，只有在切换菜单以及点击刷新 icon 的时候才刷新；现在是通过 keep-alive 默认都缓存，因为使用 keep-alive 的 include 和 exclude 功能必须显示声明组件 name 才能正常执行逻辑; 所以大家在写业务页面的时候组件必须显示声明 name 以及在路由的 meta 中带上当前渲染的路由组件名称 componentName。示例如下：

```vue
<template>
  <div>Demo</div>
</template>

<script lang="ts">
export default {
  // 与路由文件的meta.componentName保持一致
  name: 'Demo',
}
</script>

<script setup lang="ts"></script>

<style scoped></style>
```

```js
// 路由文件
import type { RouteRecordRaw } from 'vue-router'
const router: RouteRecordRaw[] = [
  {
    path: '/demo',
    component: () => import('./index.vue'),
    meta: {
      componentName: 'Demo',
    },
  },
]
export default router
```

## 主应用：

[企业管理后台](http://das-git.chn-das.com/DasAIoT/EnterpriseAdmin/Front-end/enterpriseAdmin.git)
