<template>
  <div class="demo-container">
    <Tab />
    <MeterSetting v-if="activeKey === 'meterSetting'" />
    <CharingSetting v-if="activeKey === 'charingSetting'" />
  </div>
</template>

<script setup lang="ts">
import { useTab } from './use-tab/index.tsx'
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
.demo-container {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
