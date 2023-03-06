<template>
  <div class="tree-container">
    <das-tree v-model="currentNodeKey" :data="treeData" :props="treeProps" default-expand-all node-key="id" @node-click="handleNodeClick" empty-text="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { DasTree } from '@/das-fe/ui'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { Props, Emits } from './type'
import { ref, watchEffect } from 'vue'

const treeProps = {
  label: 'nameWithCount',
  children: 'children',
  isLeaf: 'leaf',
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const currentNodeKey = ref('')

const treeData = ref<any[]>([])

watchEffect(() => {
  treeData.value = props.treeData
  currentNodeKey.value = props.treeData[0].id
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
  :deep(.das-ui-tree) {
    height: 100%;
  }
}
</style>
