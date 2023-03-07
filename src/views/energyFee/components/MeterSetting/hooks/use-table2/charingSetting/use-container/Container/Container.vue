<template>
  <div class="container">
    <Layout>
      <template #tree>
        <div class="tree-content">
          <div class="tree-wrapper" v-overlay>
            <Tree />
          </div>
        </div>
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
import { useTree } from '../../use-tree/index.tsx'
import { useAdd } from '../../use-add/index.tsx'
import { useDelete } from '../../use-delete/index.tsx'
import { Layout } from '@/views/energyFee/common/components/Layout'
import { vOverlay } from '@/das-fe/ui'

const { Tree, currentNodeKey, energyTypeOptions } = useTree()

const { Add, open } = useAdd({
  energyTypeOptions,
})

const { Delete, open: openDelete } = useDelete()

const { Table, selectionRows, update, clearSelection } = useTable({
  filterObj: computed(() => ({
    energyTypeId: currentNodeKey,
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
.container {
  display: flex;
  height: 100%;

  flex-direction: column;
  .tree-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .tree-wrapper {
    flex: 1;
    min-height: 0;
    height: 100%;
    z-index: 0;
    box-sizing: border-box;
    :deep(.el-tree-node) {
      &.is-current {
        & > .el-tree-node__content {
          // background-color: red;
          background-color: var(--das-ui-tree-node-active-bg-color);
        }
      }
    }
  }
}
</style>
