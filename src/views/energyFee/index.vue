<template>
  <div class="page-container">
    <Tab :options="options" v-model:active-key="activeKey" @change="handleTabChange" />
    <CharingSetting v-if="activeKey === 'charingSetting'" :ref="charingSettingRef" />
    <MeterSetting v-if="activeKey === 'meterSetting'" :ref="meterSettingRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated, watch } from 'vue'
import { Tab } from '@/views/energyFee/common/components/Tab'
import type { TabProps } from '@/views/energyFee/common/components/Tab'
import MeterSetting from './meterSetting'
import CharingSetting from './charingSetting'
import { vAuth } from '@/utils/directive'

const charingSettingRef = ref()
const meterSettingRef = ref()

const options = computed<TabProps['options']>(() => {
  const res: any = []
  if (
    vAuth(null, {
      code: 'charingSetting',
    })
  ) {
    res.push({
      key: 'charingSetting',
      tab: '计费设置',
    })
  }
  if (
    vAuth(null, {
      code: 'meterSetting',
    })
  ) {
    res.push({
      key: 'meterSetting',
      tab: '表计设置',
    })
  }
  return res
})

const activeKey = ref<TabProps['activeKey']>(options.value[0]?.key)

const handleTabChange = () => {
  charingSettingRef.value?.update()
  meterSettingRef.value?.update()
}

onActivated(() => {
  activeKey.value = options.value[0]?.key
  charingSettingRef.value?.update()
  meterSettingRef.value?.update()
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
