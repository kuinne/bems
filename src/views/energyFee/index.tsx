import { DasTabs } from '@/das-fe/ui'

import { defineComponent, nextTick, onActivated, ref, watch } from 'vue'
import { useContainer as useCharingSetting } from './modules/charingSetting'
import { useContainer as useMeterSetting } from './modules/meterSetting'
import styles from './style.module.scss'
export default defineComponent({
  setup() {
    const { render: CharingSetting, update: charingSettingUpdate } = useCharingSetting()
    const { render: MeterSetting, update: meterSettingUpdate } = useMeterSetting()

    const options: any = [
      {
        key: 'CharingSetting',
        tab: '计费设置',
        contentSlot: 'CharingSetting',
        render: CharingSetting,
        update: charingSettingUpdate,
      },

      {
        key: 'MeterSetting',
        tab: '表计设置',
        contentSlot: 'MeterSetting',
        render: MeterSetting,
        update: meterSettingUpdate,
      },
    ]

    const activeKey = ref<any>(null)

    onActivated(() => {
      activeKey.value = null
      nextTick(() => {
        activeKey.value = options[1]?.key
      })
    })
    watch(
      () => activeKey.value,
      () => {
        options.find((item: any) => item.key === activeKey.value)?.update?.()
      },
    )

    return () => (
      <div class={styles['page-container']}>
        <DasTabs options={options} v-model:activeKey={activeKey.value}>
          {options.reduce((acc: any, cur: any) => {
            acc[cur.contentSlot] = cur.render
            return acc
          }, {})}
        </DasTabs>
      </div>
    )
  },
})
