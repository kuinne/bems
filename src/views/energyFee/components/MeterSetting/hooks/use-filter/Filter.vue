<template>
  <div class="filter-container">
    <DasSearchForm :options="options" v-model="filterObj" layout="horizontal" :showFilterPanel="false"></DasSearchForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { meterTypeOptions } from '../../constants'
import { DasSearchForm } from '@/das-fe/ui'
import type { Props, Emits } from './type'

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const filterObj = ref(props.modelValue)

const handleChange = (key: string, value: any) => {
  filterObj.value[key] = value
  emits('update:modelValue', filterObj.value)
}
const options = ref<any[]>([
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
    change: (data: any) => handleChange('meterType', data.value),
    size: 'middle',
  },
  {
    type: 'searchInput',
    key: 'search',
    label: '',
    placeholder: '搜索表计名称/编码',
    value: filterObj.value.search,
    clearable: false,
    isIconLeft: true,
    size: 'middle',
    change: (data: any) => handleChange('search', data.value),
  },
])
</script>
<style scoped lang="scss">
.filter-container {
  display: flex;
  .filter-item {
    display: flex;
    align-items: center;
    .filter-label {
      margin-right: 8px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
