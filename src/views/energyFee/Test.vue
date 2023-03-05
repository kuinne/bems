<template>
  <das-table selection :data="tableData" v-model:selection-rows="multiSelection">
    <das-table-column prop="name1" label="字段1"></das-table-column>
    <das-table-column prop="name2" label="字段2"></das-table-column>
    <das-table-column prop="name3" label="字段3"></das-table-column>
  </das-table>
</template>

<script setup lang="ts">
import { DasTable, DasTableColumn } from '@/das-fe/ui'
import { ref } from 'vue'

const tableData = ref<any>([
  {
    id: '1',
    name1: 'name1',
    name2: '333',
    name3: '2233',
  },
  {
    id: '2',
    name1: 'name1',
    name2: '333',
    name3: '2233',
  },
  {
    id: '3',
    name1: 'name1',
    name2: '333',
    name3: '2233',
  },
])

const multiSelection = ref<any>([])
</script>
<style scoped lang="scss"></style>
