<template>
  <Layout>
    <template #aside>
      <Tree />
    </template>
    <template #main>
      <div class="main-container">
        <Filter />
        <Table />
      </div>
    </template>
  </Layout>
  <Add />
  <Edit />
  <Delete />
</template>

<script setup lang="ts">
import { useTree } from '../use-tree'
import { useTable } from '../use-table'
import { useDelete } from '../use-delete'
import { useAdd } from '../use-add'
import { useFilter } from '../use-filter'
import Layout from '../../../Layout/index.vue'
import { toRaw } from 'vue'

const { Tree, energyTypeOptions, energyBillingSettingId } = useTree()

const { Add, open } = useAdd({
  energyTypeOptions,
  onSubmit: () => {
    reload?.()
  },
})

const { Delete, open: openDelete } = useDelete({
  onConfirm: () => {
    reload?.()
  },
})

const { Filter, filterObj } = useFilter()

const { Table, reload, multipleSection } = useTable({
  // slots: {},
  filterObj,
  energyTypeOptions,
  onDelete: openDelete,
  energyBillingSettingId,
  onEdit: (formData: any) => open('edit', formData),
  onView: (formData: any) => open('view', formData),
})

defineExpose({
  reload,
  openAdd: () => open('add'),
  openBatchDelete: () => openDelete(multipleSection.value.map((item) => toRaw(item))),
  multipleSection,
})
</script>

<style scoped lang="scss">
.main-container {
  height: 100%;
  background: #fff;
}
</style>
