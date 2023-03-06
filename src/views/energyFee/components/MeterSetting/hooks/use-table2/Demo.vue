<template>
  <div class="demo-container">
    <Table />
  </div>
</template>

<script setup lang="ts">
import { useTable } from './index'
import { ref } from 'vue'

const filterObj = ref({
  search: '',
})

const { Table } = useTable({
  filterObj,
})
</script>
<style scoped lang="scss">
.demo-container {
  height: 100%;
}
</style>
