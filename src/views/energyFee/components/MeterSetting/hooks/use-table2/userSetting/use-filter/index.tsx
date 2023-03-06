import { DasSearchForm } from '@/das-fe/ui/packages/search-form'
import { ref } from 'vue'

type DasSearchFormProps = InstanceType<typeof DasSearchForm>['$props']

export function useFilter() {
  const filterObj = ref<any>({
    name: '',
    status: -1,
  })

  const handleChange = (prop: string, val: any) => {
    filterObj.value[prop] = val
  }

  const options = ref<DasSearchFormProps['options']>([
    {
      type: 'searchInput',
      key: 'name',
      label: '',
      placeholder: '请输入关键字',
      value: '',
      clearable: false,
      isIconLeft: true,
      size: 'small',
      change: (data: any) => handleChange('name', data.value),
    },
    {
      key: 'status',
      label: '下拉选择',
      type: 'select',
      placeholder: '',
      value: -1,
      options: [
        {
          value: -1,
          label: '全部',
        },
        {
          value: 1,
          label: '成功',
        },
        {
          value: 2,
          label: '失败',
        },
      ],
      clearable: false,
      width: '200px',
      borderType: 'bordered',
      showSearch: true,
      change: (data: any) => handleChange('status', data.value),
    },
  ])
  const Filter = () => <DasSearchForm options={options.value}></DasSearchForm>

  return {
    Filter,
    filterObj,
  }
}
