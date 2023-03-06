import { defineAsyncComponent, ref, watchEffect } from 'vue'
import type { UseTabOptionsType } from './type'
import { i18n } from '@/utils/i18n'

export function useTab({ charingSettingRender, meterSettingRender }: UseTabOptionsType) {
  const TabSFC = defineAsyncComponent(() => import('../../common/components/Tab/Tab.vue'))
  type TabProps = InstanceType<typeof TabSFC>['$props']

  const options = ref<TabProps['options']>([
    {
      key: 'charingSetting',
      tab: i18n('计费设置' as any).value,
      render: charingSettingRender,
    },
    {
      key: 'meterSetting',
      tab: i18n('表计设置' as any).value,
      render: meterSettingRender,
    },
  ])
  const activeKey = ref<string>(options.value[1].key)

  const Tab = () => <TabSFC v-model:activeKey={activeKey.value} options={options.value}></TabSFC>
  return {
    Tab,
    activeKey,
  }
}
