<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    :total="total"
    :actions="[]"
    :das-table-props="{ paginationProps: { layout: 'prev,next,sizes' } }"
    v-model:page="page"
    v-model:selection-rows="selectionRows"
  >
    <template #pagination-left>
      <das-search width="200px" v-model="keywords" isIconLeft searchType="basis" placeholder="搜索表计名称/编码" @search="handleSearch" @press-enter="handleSearch" @change="handleSearch" />
    </template>
  </Table>
</template>

<script setup lang="tsx">
import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import StatusTag from '../../StatusTag.vue'
import { ref, defineProps, defineEmits, watch } from 'vue'
import { DasSearch } from '@/das-fe/ui'
import { getMeterInfoList } from '@/views/energyFee/apis'

const props = defineProps<{
  selectionRows: any[]
  checkedNodes: {
    typeCode: string
    dimensionId: string
    isObj: boolean
    objId: string
    orgId: string
    name: string
  }[]
}>()

const emits = defineEmits<{
  ($event: 'update:selectionRows', val: any[]): void
}>()

const columns = ref<TableProps['columns']>([
  {
    label: '表计名称',
    prop: 'meterName',
  },
  {
    label: '表计编码',
    prop: 'meterCode',
  },
  {
    label: '表计类型',
    prop: 'meterTypeName',
  },
  {
    label: '表计状态',
    prop: 'status',
    render: ({ row }) => <StatusTag status={row.status} />,
  },
])

const data = ref<any[]>([])

const loading = ref(false)
const total = ref(0)

const page = ref({
  curPage: 1,
  pageSize: 10,
})

const selectionRows = ref<any[]>(props.selectionRows)

const keywords = ref('')

const handleSearch = () => {
  console.log('search')
}

watch(
  () => selectionRows.value,
  () => {
    emits('update:selectionRows', selectionRows.value)
  },
)

watch(
  () => props.selectionRows,
  () => {
    selectionRows.value = props.selectionRows
  },
)
const fetchData = async () => {
  loading.value = true

  const params = {
    pageIndex: page.value.curPage,
    pageSize: page.value.pageSize,

    list: props.checkedNodes.map((item: any) => ({
      typeCode: item.typeCode,
      dimensionId: item.dimensionId || '-1',
      objId: item.id,
      gradationId: item.orgId || '-1',
      objectName: item.name,
    })),
  }
  const [error, res] = await getMeterInfoList(params)
  if (!error) {
    data.value = res.records
    total.value = parseFloat(res.total)
  }
  loading.value = false
}

watch(
  () => props.checkedNodes,
  () => {
    if (props.checkedNodes.length > 0) {
      selectionRows.value = []
      fetchData()
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
<style scoped lang="scss"></style>
