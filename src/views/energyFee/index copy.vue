<template>
  <div class="page-container">
    <!-- <Tab :options="options" v-model:active-key="activeKey" @change="handleTabChange" />
    
    <CharingSetting v-if="activeKey === 'charingSetting'" />
    <MeterSetting v-if="activeKey === 'meterSetting'" /> -->
    <das-tabs v-model:active-key="activeKey" :options="options">
      <template #charingSetting>
        <CharingSetting />
      </template>
      <template #meterSetting>
        <MeterSetting />
      </template>
    </das-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated, watch } from 'vue'
// import { Tab } from '@/views/energyFee/common/components/Tab'
import { DasTabs } from '@/das-fe/ui'
import type { TabProps } from '@/views/energyFee/common/components/Tab'
import MeterSetting from './meterSetting'
import CharingSetting from './charingSetting'
import { vAuth } from '@/utils/directive'

// const options = computed<TabProps['options']>(() => {
//   const res: any = []
//   if (
//     vAuth(null, {
//       code: 'charingSetting',
//     })
//   ) {
//     res.push({
//       key: 'charingSetting',
//       tab: '计费设置',
//     })
//   }
//   if (
//     vAuth(null, {
//       code: 'meterSetting',
//     })
//   ) {
//     res.push({
//       key: 'meterSetting',
//       tab: '表计设置',
//     })
//   }
//   return res
// })

const options: any = [
  {
    key: 1,
    tab: '计费设置',
    contentSlot: 'charingSetting',
  },
  ,
  {
    key: 2,
    tab: '表计设置',
    contentSlot: 'meterSetting',
  },
]

// const activeKey = ref<TabProps['activeKey']>(options.value[0]?.key)
const activeKey = ref<any>(options[0]?.key)

onActivated(() => {
  activeKey.value = options[0]?.key
  // charingSettingRef.value?.update()
  // meterSettingRef.value?.update()
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.ant-tabs) {
    .ant-tabs-nav-wrap {
      background: #fff;
    }
    .ant-tabs-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      .ant-tabs-tabpane {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
