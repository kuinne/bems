<template>
  <div class="page-container">
    <Tab />
    <MeterSetting v-if="activeKey === 'meterSetting'" />
    <CharingSetting v-if="activeKey === 'charingSetting'" />
  </div>
</template>

<script setup lang="ts">
import { useTab } from './hooks/use-tab/index.tsx'
import { useContainer } from './meterSetting/use-container/index.tsx'
import { useContainer as useCharingSetting } from './charingSetting/use-container/index.tsx'

const { Container: MeterSetting, tabRender } = useContainer()
const { Container: CharingSetting, tabRender: tabRender2 } = useCharingSetting()
const { Tab, activeKey } = useTab({
  chargingSettingRender: tabRender2,
  meterSettingRender: tabRender,
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
