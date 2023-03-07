import { Tab } from '@/views/energyFee/common/components/Tab'
import type { TabProps } from '@/views/energyFee/common/components/Tab'
import { ref } from 'vue'
export function useTab({ chargingSettingRender, meterSettingRender }: { chargingSettingRender: () => JSX.Element; meterSettingRender: () => JSX.Element }) {
  const options = ref<TabProps['options']>([
    {
      key: 'charingSetting',
      tab: '计费设置',
      render: chargingSettingRender,
    },
    {
      key: 'meterSetting',
      tab: '表计设置',
      render: meterSettingRender,
    },
  ])

  const activeKey = ref<TabProps['activeKey']>(options.value[0].key)
  const render = () => <Tab options={options.value} v-model:activeKey={activeKey.value}></Tab>

  return {
    Tab: render,
    activeKey,
  }
}
