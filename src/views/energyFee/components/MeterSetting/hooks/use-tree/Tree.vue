<template>
  <div class="tree-container">
    <das-tree show-checkbox v-model="currentNodeKey" :data="treeData" check-on-click-node default-expand-all node-key="id" @node-click="handleNodeClick" empty-text="暂无数据" />
    <div class="tree-footer">
      <das-button class="search-btn" btn-type="primary" @click="handleSearch">{{ i18n('查询' as any).value }}</das-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DasTree, DasButton } from '@/das-fe/ui'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { Props, Emits } from './type'
import { ref, watchEffect } from 'vue'
import { i18n } from '@/utils/i18n'

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const currentNodeKey = ref<any>([])

const treeData = ref<any[]>([])

const handleSearch = () => {
  emits('search', currentNodeKey.value)
}

watchEffect(() => {
  treeData.value = props.treeData
  currentNodeKey.value = [props.treeData[0].id]
})

const handleNodeClick = (node: Node) => {
  emits('nodeClick', node)
}

defineExpose({
  currentNodeKey,
})
</script>

<style lang="scss" scoped>
.tree-container {
  height: 100%;
  background: #fff;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  :deep(.das-ui-tree) {
    /* height: 100%; */
  }
  .tree-footer {
    display: flex;
    justify-content: center;
    .search-btn {
      margin: 0 auto;
    }
  }
}
</style>
