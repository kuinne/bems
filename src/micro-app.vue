<template>
  <div class="app">
    <!-- <router-view v-if="$route.meta.hiddenLayout" />
    <micro-layout :microPortal="microPortal" v-else>
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="exclude">
          <component :is="Component" v-if="isRouterKeepAlive" :key="$route.path" />
        </keep-alive>
      </router-view>
    </micro-layout> -->
    <EnergyFee />
  </div>
</template>

<script setup lang="ts">
import EnergyFee from './views/energyFee/index.vue'
import { defineAsyncComponent, nextTick, provide, ref } from 'vue'
import { getConfig } from '@/utils/config'
const microLayout = defineAsyncComponent(() => import('@/common/micro-app/layout/index.vue'))
const config = getConfig()

/**
 * 子应用portal配置
 */
const microPortal = {
  showAside: true,
  showTabs: true,
}

/**兼容独立运行情况 */
const appConfig = {
  mainAppName: 'enterpriseadmin',
  // 应用code（与后端保持统一）
  appName: config.title,
}

provide(`${config.microAppName}-appConfig`, appConfig)

const isRouterKeepAlive = ref<boolean>(true)
const exclude = ref<any[]>([])

// 刷新路由
const reload = (name: any) => {
  exclude.value.push(name)
  isRouterKeepAlive.value = false
  nextTick(() => {
    isRouterKeepAlive.value = true
    exclude.value = []
  })
}
provide('refresh', reload)
</script>

<style lang="scss">
html,
body,
#app,
.app {
  height: 100%;
}
</style>
