<template>
  <Layout>
    <template #aside>
      <Tree />
    </template>
    <template #main>
      <Table />
    </template>
  </Layout>
  <Add />
  <Edit />
  <Delete />
</template>

<script setup lang="tsx">
import { useTree } from '../use-tree'
import { useTable } from '../use-table'
import { useDelete } from '../use-delete'
import { useAdd } from '../use-add'
import Layout from '../../../Layout/index.vue'
import { toRaw } from 'vue'

const { Tree, energyTypeOptions } = useTree({
  onSearch: (keys: string[]) => {
    console.log('keys', keys)

    // reload({
    //   filterObj: {
    //     energyTypeId: node.id,
    //   },
    // })
  },
})

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

const { Table, reload, multipleSection } = useTable({
  slots: {
    // header: () => <Filter />,
  },
  energyTypeOptions,
  onDelete: openDelete,
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

<style></style>
