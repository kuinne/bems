<template>
  <div class="page-container">
    <!-- <Filter v-model="filterObj" /> -->
    <Filter />
  </div>
</template>

<script setup lang="ts">
// import Filter from '../energyFee/components/MeterSetting/hooks/use-filter/Filter.vue'
import { useFilter } from '../energyFee/components/MeterSetting/hooks/use-filter'
import { ref, watchEffect } from 'vue'
// const filterObj = ref({
//   meterType: -1,
//   search: '',
// })

const { Filter, filterObj } = useFilter()
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  .tab-content {
    flex: 1;
    margin-top: 10px;
  }
}
</style>
