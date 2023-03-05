<template>
  <div class="energy-classify-manage-list">
    <div class="search-header">
      <DasSearchForm labelLength="6" :title="i18n('能源分类' as any).value" :isMarginRight="true" :options="searchOptions" @confirm="searchData"> </DasSearchForm>
      <div class="m-t-5">
        <das-button btnType="primary" @click="handleAdd">{{ i18n('新增' as any).value }}</das-button>
        <das-button btnType="primary" class="top-second-btn" @click="handleDelBatch" :disabled="!multiSelection.length">{{ i18n('删除' as any).value }}</das-button>
      </div>
    </div>
    <div class="content-container">
      <div class="content">
        <das-spin full :spinning="tableLoading">
          <DasTable
            selection
            hideSelectionText
            max-height="100%"
            :data="tableData"
            :total="total"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            v-model:selection-rows="multiSelection"
            :loading="tableLoading"
            @size-change="pageSizeChange"
            @current-page-change="currentPageChange"
          >
            <DasTableColumn :label="i18n('分类名称' as any).value" prop="name" content-type="link" @click-link="handleView"></DasTableColumn>
            <DasTableColumn :label="i18n('分类编码' as any).value" prop="typeCode"></DasTableColumn>
            <DasTableColumn :label="i18n('能源单位' as any).value" prop="calUnit"></DasTableColumn>
            <DasTableColumn :label="i18n('折标煤系数（tce）' as any).value" prop="coalFactor"></DasTableColumn>
            <DasTableColumn :label="i18n('折碳排放系数（t）' as any).value" prop="ceFactor"></DasTableColumn>
            <DasTableColumn :label="i18n('最近更新人' as any).value" prop="lastUpdater"></DasTableColumn>
            <DasTableColumn :label="i18n('最近更新时间' as any).value" prop="lastUpdateTime"></DasTableColumn>
            <DasTableColumn :label="i18n('操作' as any).value">
              <template #default="{ row }">
                <das-button btnType="primary-text" block @click.stop="handleView(row)">{{ i18n('查看' as any).value }}</das-button>
                <das-button btnType="primary-text" class="second-btn" block @click.stop="handleEdit(row)">{{ i18n('编辑' as any).value }}</das-button>
                <das-button btnType="primary-text" class="second-btn" block @click.stop="handleDel(row)">{{ i18n('删除' as any).value }}</das-button>
              </template>
            </DasTableColumn>
          </DasTable>
        </das-spin>
      </div>
    </div>

    <!-- 添加/编辑 -->
    <Edit v-model:visible="editVisible" @close-dialog="handleCloseEdit" v-if="editVisible"></Edit>
    <!-- 删除确认 -->
    <DelConfirmDialog v-model:visible="delVisible" :content="delContent" @confirm="handleDelConfirm" @cancel="handleDelCancel" v-if="delVisible"></DelConfirmDialog>
  </div>
</template>
<script lang="ts">
export default {
  name: 'EnergyClassify',
}
</script>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { onActivated } from 'vue'
import { DasTable, DasTableColumn, DasButton, DasSearchForm, DasSpin } from '@/das-fe/ui'
import DelConfirmDialog from './components/ConfirmDelDialog.vue'
import Edit from './components/Edit.vue'
import { useTable } from './hooks/index'
onActivated(() => {
  initData()
})
const {
  delContent,
  currentPage,
  pageSize,
  total,
  tableData,
  tableLoading,
  searchOptions,
  editVisible,
  delVisible,
  multiSelection,
  pageSizeChange,
  currentPageChange,
  handleAdd,
  handleView,
  handleDel,
  handleDelBatch,
  handleDelConfirm,
  handleDelCancel,
  handleCloseEdit,
  handleEdit,
  searchData,
  initData,
} = useTable()
</script>
<style scoped lang="scss">
.energy-classify-manage-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-header {
    width: 100%;
    background: #fff;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
    .m-t-5 {
      margin-top: 5px;
    }
  }
  .content-container {
    flex: 1;
    min-height: 0;
    width: 100%;
    background-color: #e2e7ef;
    box-sizing: border-box;
    padding: 10px;
    .content {
      background: #fff;
      height: 100%;
      position: relative;
    }
  }
}
</style>
<style lang="scss">
.energy-classify-manage-list {
  .das-ui-table .das-ui-button .second-btn {
    display: inline-block;
    margin-left: 8px;
  }
  .das-ui-button .top-second-btn {
    margin-left: 10px;
  }
}
</style>
