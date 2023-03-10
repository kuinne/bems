<template>
  <div class="tree-container" v-overlay>
    <das-tree
      check-strictly
      checkboxType="default"
      ref="dasTreeRef"
      :data="treeData"
      v-model="checkedKeys"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :props="{
        label: 'name',
        children: 'childs',
      }"
      @check="handleCheckChange"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="node-label">{{ data.label }}</span>
          <div v-if="!node.isLeaf" :class="['select-all-btn', { 'is-active': node.data.isSelectAll }]" @click="($event) => handleClickAll(node)">ALL</div>
        </span>
      </template>
    </das-tree>
    <das-button @click="handleSearch">{{ i18n('查询' as any).value }}</das-button>
  </div>
</template>

<script setup lang="ts">
import { DasTree, vOverlay, DasButton } from '@/das-fe/ui'
import { getObjTree } from '@/views/energyFee/apis'
import { ref, defineProps, watch, computed } from 'vue'
import { i18n } from '@/utils/i18n'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const props = defineProps<{
  energyTypeId: string
  dimensionId: string
}>()

const emits = defineEmits<{
  ($event: 'search', data: any): void
  ($event: 'update:checkedNodes', data: any): void
}>()

const dasTreeRef = ref()

const treeData = ref<Tree[]>([])

const checkedKeys = ref<any>([])

const loading = ref(false)

const checkedNodes = computed(() => dasTreeRef.value?.treeRef?.getCheckedNodes() || [])

const fetchData = async () => {
  treeData.value = []
  loading.value = true
  const params = {
    energyTypeId: props.energyTypeId,
    dimensionId: props.dimensionId,
  }
  const [error, data] = await getObjTree(params)
  if (!error) {
    treeData.value = data
  }
  loading.value = false
}

const handleClickAll = (node: any) => {
  if (node.data.isSelectAll) {
    node.data.isSelectAll = false
    const removedKeys = (node.childNodes || []).map((item: any) => item.data.id)
    checkedKeys.value = checkedKeys.value.filter((key: any) => !removedKeys.includes(key))
  } else {
    node.data.isSelectAll = true

    checkedKeys.value.push(...(node.childNodes || []).map((item: any) => item.data.id))
  }
}

const handleCheckChange = (data: any) => {
  const curNode = dasTreeRef.value?.treeRef?.getNode(data.id)

  if (curNode) {
    const parentNode = curNode.parent
    if (parentNode) {
      const isAllChildNodeChecked = parentNode.childNodes?.every((item: any) => item.checked)
      if (isAllChildNodeChecked) {
        parentNode.data.isSelectAll = true
      } else {
        parentNode.data.isSelectAll = false
      }
    }
  }
}

const handleSearch = () => {
  emits(
    'search',
    checkedNodes.value.map((item: any) => item.data),
  )
}

watch(
  () => [props.energyTypeId, props.dimensionId],
  () => {
    if (props.energyTypeId && props.dimensionId) {
      fetchData()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;

  padding-right: 8px;
  .node-label {
    font-size: 12px;
    color: #212121;
  }

  .select-all-btn {
    border: 1px solid rgba(102, 102, 96, 1);
    border-radius: 9px;
    box-sizing: border-box;
    width: 36px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #666660;
    cursor: pointer;
    margin-left: 5px;
    &.is-active {
      border-color: rgba(237, 129, 43, 1);
      color: rgba(237, 129, 43, 1);
    }
  }
}
</style>

<style scoped lang="scss">
.tree-container {
  margin-top: 24px;
  height: 339px;
  padding-left: 10px;
  box-sizing: border-box;
  min-height: 0;
  flex: 1;
  z-index: 0;
}
</style>
