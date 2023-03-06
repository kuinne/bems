<template>
  <div class="demo-container">
    <Layout>
      <template #tree>
        <Tree />
      </template>
      <template #filter>
        <Filter />
      </template>
      <template #table>
        <Table />
      </template>
    </Layout>
    <Add />
    <Delete />
  </div>
</template>

<script setup lang="tsx">
import { computed, watchEffect } from 'vue'
import { useTable } from '../../use-table/index.tsx'
import { useFilter } from '../../use-filter/index.tsx'
import { useTree } from '../../use-tree/index.tsx'
import { useAdd } from '../../use-add/index.tsx'
import { useDelete } from '../../use-delete/index.tsx'
import { Layout } from '@/views/energyFee/common/components/Layout'

const { Tree, currentNodeKey } = useTree()
const { Filter, filterObj } = useFilter()

const { Add, open } = useAdd()

const { Delete, open: openDelete } = useDelete()

const { Table, selectionRows, update, clearSelection } = useTable({
  filterObj: computed(() => ({
    ...filterObj.value,
    id: currentNodeKey,
  })),
  onEdit: (row: any) => {
    return open('edit', row)
  },
  onView: (row: any) => {
    return open('view', row)
  },
  onDelete: (ids: any) => {
    return openDelete(ids)
  },
})

defineExpose({
  onAdd: async () => {
    const shouldUpdate = await open('add')
    if (shouldUpdate) {
      update()
    }
  },
  onBatchDelete: async () => {
    const shouldUpdate = await openDelete(selectionRows.value.map((item: any) => item.id))
    if (shouldUpdate) {
      update()
    }
    clearSelection()
  },
  selectionRows,
})
</script>
<style scoped lang="scss">
.demo-container {
  display: flex;
  height: 100%;
  background-color: #ccc;
  flex-direction: column;
}
</style>
