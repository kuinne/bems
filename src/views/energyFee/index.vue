<template>
  <div class="page-container">
    <Tab />
    <div class="tab-content">
      <ChargingSetting v-if="activeKey === 'charingSetting'" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useContainer } from './components/ChargingSetting/hooks/use-container'

import { useTab } from './hooks/use-tab'

const { TabPaneContent, Container: ChargingSetting } = useContainer()

const { Tab, activeKey } = useTab({
  charingSettingRender: () => <TabPaneContent />,
  meterSettingRender: () => <div>ss</div>,
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
