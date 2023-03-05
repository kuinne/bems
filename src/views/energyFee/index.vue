<template>
  <div class="page-container">
    <Tab />
    <div class="tab-content">
      <ChargingSetting v-if="activeKey === 'charingSetting'" />
      <MeterSetting v-if="activeKey === 'meterSetting'" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useContainer as useCharingSetting } from './components/ChargingSetting/hooks/use-container'
import { useContainer as useMeterSetting } from './components/MeterSetting/hooks/use-container'

import { useTab } from './hooks/use-tab'

const { TabPaneContent: CharingTabContent, Container: ChargingSetting } = useCharingSetting()
const { TabPaneContent: MeterSettingTabContent, Container: MeterSetting } = useMeterSetting()

const { Tab, activeKey } = useTab({
  charingSettingRender: () => <CharingTabContent />,
  meterSettingRender: () => <MeterSettingTabContent />,
})
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .tab-content {
    flex: 1;
    margin-top: 10px;
  }
}
</style>
