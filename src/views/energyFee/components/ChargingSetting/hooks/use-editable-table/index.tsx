import { defineAsyncComponent, ref, Ref } from 'vue'
import { i18n } from '@/utils/i18n'

/** 分时 */
export const timePeriodOptions: any = (function () {
  const res = []
  for (let i = 0; i <= 24; i++) {
    res.push({
      value: `${String(i).padStart(2, '0')}:00`,
      label: `${String(i).padStart(2, '0')}:00`,
    })
    if (i < 24) {
      res.push({
        value: `${String(i).padStart(2, '0')}:30`,
        label: `${String(i).padStart(2, '0')}:30`,
      })
    }
  }
  return res
})()

export function useEditableTable({ formData, isView }: { formData: Ref<any>; isView: Ref<boolean> }) {
  const EditableTableSFC = defineAsyncComponent(() => import('../../../../common/components/EditableTable/index.vue'))

  type EditableTableProps = InstanceType<typeof EditableTableSFC>['$props']

  const columns: EditableTableProps['columns'] = [
    {
      label: i18n('开始时间' as any).value,
      prop: 'startTime',
      type: 'select',
      required: true,
      options: (row: any) => {
        return timePeriodOptions.map((item: any) => {
          let disabled: any = false
          if (row.endTime && item.value >= row?.endTime) {
            disabled = true
          }
          return {
            ...item,
            disabled,
          }
        })
      },
      validator: (val: any) => {
        if (!val) {
          return '必填' as string
        }
      },
    },
    {
      label: i18n('结束时间' as any).value,
      prop: 'endTime',
      type: 'select',
      required: true,
      options: (row: any) => {
        return timePeriodOptions.map((item: any) => {
          let disabled: any = false
          if (row.startTime && item.value <= row?.startTime) {
            disabled = true
          }
          return {
            ...item,
            disabled,
          }
        })
      },
      validator: (val: any) => {
        if (!val) {
          return '必填' as string
        }
      },
    },
    {
      label: i18n('单价' as any).value,
      prop: 'price',
      required: true,
      validator: (val: any) => {
        if (!val) {
          return '必填' as string
        }
      },
    },
    {
      label: i18n('备注' as any).value,
      prop: 'mark',
    },
  ]
  const editableTableRef = ref<InstanceType<typeof EditableTableSFC>>()

  const defaultData = {
    startTime: '',
    endTime: '',
    price: '',
    mark: '',
  }

  const EditableTable = () => <EditableTableSFC ref={editableTableRef} v-model={formData.value.unitPriceDtos} isView={isView.value} columns={columns} defaultData={defaultData} />

  return {
    EditableTable,
    validator: () => {
      const flag = editableTableRef.value?.validate()

      return flag ? '' : ' '
    },
  }
}
