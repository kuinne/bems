import { Tab } from '@/views/energyFee/common/components/Tab'
import type { TabProps } from '@/views/energyFee/common/components/Tab'
import { ref } from 'vue'
export function useTab({ userSettingRender, productSettingRender }: { userSettingRender: () => JSX.Element; productSettingRender: () => JSX.Element }) {
  const options = ref<TabProps['options']>([
    {
      key: 'userSetting',
      tab: '用户设置',
      render: userSettingRender,
    },
    {
      key: 'productSetting',
      tab: '产品设置',
      render: productSettingRender,
    },
  ])

  const activeKey = ref<TabProps['activeKey']>(options.value[0].key)
  const render = () => <Tab options={options.value} v-model:activeKey={activeKey.value}></Tab>

  return {
    Tab: render,
    activeKey,
  }
}
