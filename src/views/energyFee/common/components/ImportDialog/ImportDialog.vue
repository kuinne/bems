<template>
  <!-- 导入弹窗 -->
  <das-dialog
    :title="i18n('导入' as any).value"
    v-model="visible"
    customClass="deviceManage-import-dialog"
    size="small"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="import-container">
      <div class="tip-box">
        <div class="first-line">
          {{ i18n('1、点击下载 ' as any).value }}<das-button btnType="primary-text" size="large" block @click="handleDownload">{{ i18n('表计导入模板' as any).value }}</das-button>
        </div>
        <div class="second-line">{{ i18n('2、文件格式支持xlsx格式，文件大小小于4M' as any).value }}</div>
      </div>
      <das-upload
        v-model="fileList"
        :error="errorImport"
        :error-file-name="errorFileName"
        :error-file-size="errorFileSize"
        :error-message="errorMessage"
        @errorFile-download="handleErrorFileDownload"
        @file-upload="handleFileUpload"
      ></das-upload>
    </div>
    <template #footer>
      <div>
        <das-button size="middle" @click="handleCancel">{{ i18n('取消' as any).value }}</das-button>
        <das-button size="middle" btnType="primary" class="margin-l-10" @click="handleConfirm">{{ i18n('确定导入' as any).value }}</das-button>
      </div>
    </template>
  </das-dialog>
  <!-- 进度弹窗 -->
  <das-dialog size="mini" v-model="showProgressDialog" type="basic" :title="progressTitle" class="device-progress-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
    <das-progress v-model="percent" type="circle" :status="progressStatus" :textMap="progressState.textMap"></das-progress>
  </das-dialog>
</template>

<script setup lang="ts">
import { DasButton, DasDialog, DasUpload, DasProgress, DasMessage } from '@/das-fe/ui'
import { useFile } from '@/utils/api-services'
import { i18n } from '@/utils/i18n'
import { ref, reactive, watch, defineEmits, defineProps } from 'vue'
import { getUserInfo } from '@/utils/common-info/index'

const props = defineProps<{ visible: boolean; confirmImportAjax: any; downloadTemplate: any }>()
const emits = defineEmits<{
  ($event: 'close'): void
}>()
const visible = ref(props.visible)

watch(
  () => props.visible,
  () => {
    visible.value = props.visible
  },
)

const handleClose = () => {
  emits('close')
}

type DasProgressProps = InstanceType<typeof DasProgress>['$props']

const progressState = ref<{
  visible: boolean
  title: string
  percent: DasProgressProps['modelValue']
  status?: 'success' | 'exception' | 'warning'
  textMap: DasProgressProps['textMap']
}>({
  visible: false,
  title: '',
  percent: 0,
  status: undefined,
  textMap: '',
})

const fileList = ref([])
const handleDownload = async () => {
  // exportExcel(data.data, filename)
  const res = await props.downloadTemplate()
  if (res) {
    const { taskId, filename } = res
    checkProgress(taskId, 'export', filename)
  }
}

const handleErrorFileDownload = () => {}

// 导入
const { showProgressDialog, progressTitle, percent, progressStatus, progressLoading, errorFileName, errorFileSize, errorMessage, errorImport, fileImport, generateUniqueName, checkProgress } =
  useFile()

let importFileName: string = ''
const handleFileUpload = (file: any) => {
  errorImport.value = false
  importFileName = generateUniqueName(file.name)
}

const handleCancel = () => {
  emits('close')
}

// 租户id
let tenantId: any = getUserInfo()?.tenantId || 't371677589594182'

const handleConfirm = () => {
  //文件格式/大小校验
  const tempFile = fileList.value[0] as File
  const tempWuffix = tempFile.name.substring(tempFile.name.lastIndexOf('.') + 1)
  if (tempFile.size > 1024 * 4 * 1024) {
    DasMessage.error('文件大小不能超过4M')
    return false
  }
  if (!['xlsx'].includes(tempWuffix.toLowerCase())) {
    DasMessage.error('文件必须为xlsx格式')
    return false
  }
  //
  const options = {
    bucketName: tenantId,
    importFileName: `bems-data-manage/temp/${importFileName}`,
  }
  fileImport(props.confirmImportAjax(importFileName), fileList.value[0], options)
}
</script>
<style lang="scss">
.energyFee-import-dialog {
  .margin-l-10 {
    margin-left: 10px;
  }

  .import-container {
    font-size: 14px;
    color: #333;
    line-height: 21px;

    .tip-box {
      margin-bottom: 20px;
    }
  }
}

.energyFee-progress-dialog {
  .das-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
