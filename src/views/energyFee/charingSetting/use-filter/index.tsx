import { DasSearchForm } from '@/das-fe/ui/packages/search-form'
import { ref } from 'vue'
import { meterTypeOptions } from '@/views/energyFee/meterSetting/constants'

type DasSearchFormProps = InstanceType<typeof DasSearchForm>['$props']

export function useFilter() {
  const filterObj = ref<any>({
    meterType: -1,
    search: '',
  })

  const handleChange = (prop: string, val: any) => {
    filterObj.value[prop] = val
  }

  const options = ref<DasSearchFormProps['options']>([
    {
      key: 'meterType',
      label: '表计类型',
      type: 'select',
      placeholder: '',
      value: filterObj.value.meterType,
      options: meterTypeOptions,
      clearable: false,
      width: '200px',
      closable: true,
      size: 'middle',
      change: (data: any) => handleChange('meterType', data.value),
    },
    {
      key: 'search',
      type: 'searchInput',
      label: '',
      placeholder: '搜索表计名称/编码',
      value: filterObj.value.search,
      clearable: false,
      isIconLeft: true,
      size: 'middle',
      change: (data: any) => handleChange('search', data.value),
    },
  ])
  const Filter = () => <DasSearchForm options={options.value}></DasSearchForm>

  return {
    Filter,
    filterObj,
  }
}
