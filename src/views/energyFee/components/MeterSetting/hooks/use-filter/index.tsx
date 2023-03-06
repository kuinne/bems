import { defineAsyncComponent, ref } from 'vue'

export function useFilter() {
  const FilterSFC = defineAsyncComponent(() => import('./Filter.vue'))
  const filterObj = ref({
    meterType: -1,
    search: '',
  })
  const Filter = () => <FilterSFC v-model={filterObj.value} />
  return {
    Filter,
    filterObj,
  }
}
