<template>
  <div class="page-container">
    <Demo></Demo>
    <!-- <ImportDialog /> -->
  </div>
</template>

<script setup lang="ts">
import Demo from '@/views/energyFee/components/MeterSetting/hooks/use-table2/Demo.vue'
import ImportDialog from './common/components/ImportDialog/index.vue'
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
