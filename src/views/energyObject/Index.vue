<template>
  <div class="energy-object-manage-list">
    <div class="search-header">
      <DasSearchForm :title="i18n('能源对象' as any).value" :options="[]"> </DasSearchForm>
    </div>
    <div class="content-container">
      <div class="content">
        <das-split-panel ref="$mySplitPanel" :defaultSplit="defaultSplit" :canFold="true" :canDrag="true" :firstMin="firstMin">
          <template #firstSlot>
            <div class="tree-container">
              <div class="tree-content">
                <div class="tree-box" v-overlay>
                  <DasTree
                    ref="$objectTree"
                    :data="treeData"
                    v-model="currentItem"
                    v-model:filter-value="keyword"
                    v-model:path="currentPath"
                    :props="{
                      isLeaf: 'leaf',
                      disabled: 'en',
                      children: 'children',
                    }"
                    :load="load"
                    :search="requestfilterTree"
                    @node-click="handleClickTreeNode"
                    showOperations
                    :inputOptions="{ placeholder: '搜索对象名称' }"
                    @handleOperation="handleOperation"
                    draggable
                    :allow-drop="dragBrotherNode"
                    @node-drag-start="dragStart"
                    @node-drop="dragFinish"
                  >
                    <template #empty-text>
                      <div class="empty-text">
                        暂无对象，请点击 <das-button btnType="primary-text" size="large" @click="handleAdd">{{ i18n('新增能源对象' as any).value }}</das-button>
                      </div>
                    </template>
                  </DasTree>
                </div>
              </div>
            </div>
          </template>
          <template #secondSlot>
            <div class="right-w" v-overlay>
              <div class="title" v-if="currentItem">基础信息</div>
              <ObjectInfo marginRight="80px" v-if="currentItem"></ObjectInfo>
              <div class="empty-info" v-else>
                <img src="./images/empty.png" />
                <span>暂无数据</span>
              </div>
            </div>
          </template>
        </das-split-panel>
      </div>
    </div>
    <!-- 添加/编辑 -->
    <EditObject v-model:visible="editVisible" :edit-status="editStatus" @close-dialog="handleCloseEdit" @updateTree="handleUpdateTree" v-if="editVisible"></EditObject>
    <!-- 删除确认 -->
    <DelConfirmDialog v-model:visible="delVisible" :content="delContent" @confirm="handleDelConfirm" @cancel="handleDelCancel" v-if="delVisible"></DelConfirmDialog>
  </div>
</template>
<script lang="ts">
export default {
  name: 'EnergyObject',
}
</script>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref } from 'vue'
import { DasSearchForm, DasSpin, DasSplitPanel, DasTree, DasTreeRef } from '@/das-fe/ui'
import DelConfirmDialog from './components/ConfirmDelDialog.vue'
import EditObject from './components/EditObject.vue'
import { useEnergyObject } from './hooks/index'
import ObjectInfo from './components/ObjectInfo.vue'
const $objectTree = DasTreeRef()

// 分隔面板
let defaultSplit = ref({ first: 336 })
let firstMin = ref(336)

const {
  currentItem,
  treeData,
  keyword,
  currentPath,
  load,
  requestfilterTree,
  handleClickTreeNode,
  dragStart,
  dragFinish,
  dragBrotherNode,
  handleAdd,
  handleOperation,
  delContent,
  delVisible,
  editVisible,
  editStatus,
  handleCloseEdit,
  handleDelConfirm,
  handleDelCancel,
  handleUpdateTree,
} = useEnergyObject($objectTree)
</script>
<style scoped lang="scss">
.energy-object-manage-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-header {
    width: 100%;
    background: #fff;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
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
      .empty-text {
        font-size: 14px;
        color: #999;
      }
      .right-w {
        height: 100%;
        display: flex;
        flex-direction: column;
        z-index: 0;
        .empty-info {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 14px;
          color: #999;
          img {
            width: 96px;
            display: inline-block;
          }
        }
        .das-ui-form {
          flex: 1;
          min-height: 0;
          max-width: 1309px;
        }
        .title {
          font-size: 16px;
          color: #212121;
          font-weight: bold;
          padding: 7px 20px;
        }
      }
    }
  }
  .tree-container {
    width: 100%;
    height: 100%;
    .tree-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .filter-box {
        padding: 8px;
        :deep(.das-ui-search.middle) {
          width: 100%;
          display: flex;
        }
      }
      .tree-box {
        flex: 1;
        width: 100%;
        min-height: 0;
        z-index: 0;
      }
    }
    :deep(.das-ui-tree.is-operations) {
      .el-tree-node__content .das-tree-oprations-container {
        width: 100%;
      }
    }
    :deep(.das-ui-dialog.confirm-dialog) {
      .das-dialog__feed-img {
        display: none !important;
      }
    }
    .delete-info {
      font-size: 16px;
      color: #212121;
      letter-spacing: 0;
      text-align: center;
      line-height: 24px;
      font-weight: 400;
    }
    .alert-orange {
      width: 100%;
      img {
        margin: 0 auto;
        height: 96px;
      }
    }
  }
}
</style>
<style lang="scss">
.energy-object-manage-list {
  .das-ui-table .das-ui-button .second-btn {
    display: inline-block;
    margin-left: 8px;
  }
  .das-ui-button .top-second-btn {
    margin-left: 10px;
  }
}
</style>
