<template>
  <!-- 导入弹窗 -->
  <das-dialog :title="i18n('导入' as any).value" v-model="visible" customClass="energyFee-import-dialog" size="small" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleClose">
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
        <das-button size="middle" @click="handleClose">{{ i18n('取消' as any).value }}</das-button>
        <das-button size="middle" btnType="primary" class="margin-l-10" @click="handleConfirm">{{ i18n('确定导入' as any).value }}</das-button>
      </div>
    </template>
  </das-dialog>
  <!-- 进度弹窗 -->
  <ProgressDialog v-model="showProgressDialog" :title="progressTitle" v-model:percent="percent" :status="progressStatus" :textMap="''" />
</template>

<script setup lang="ts">
import { DasButton, DasDialog, DasUpload, DasProgress, DasMessage } from '@/das-fe/ui'
import { useFile, downloadFile } from '@/utils/api-services'
import { i18n } from '@/utils/i18n'
import { ref, reactive, watch, defineEmits, defineProps } from 'vue'
import { getUserInfo } from '@/utils/common-info/index'
import ProgressDialog from '../ProgressDialog/index.vue'
const props = defineProps<{ visible: boolean; confirmImportAjax: any; downloadTemplate: any }>()
const emits = defineEmits<{
  ($event: 'close'): void
  ($event: 'finish'): void
}>()
const visible = ref(props.visible)

watch(
  () => props.visible,
  () => {
    visible.value = props.visible
  },
)

const fileList = ref([])

// 导入
const { showProgressDialog, progressTitle, percent, progressStatus, errorFileName, errorFileSize, errorMessage, errorImport, fileImport, generateUniqueName, checkProgress, errorFilePath } = useFile()

const handleClose = () => {
  emits('close')
}

/** 文件下载 */
const handleDownload = async () => {
  const res = await props.downloadTemplate()
  if (res) {
    const { taskId, filename } = res
    checkProgress(taskId, 'export', filename)
  }
}

/** 错误标记文件下载 */
const handleErrorFileDownload = () => {
  const fileName = fileList.value[0].name
  const suffix = fileName?.substr(fileName.indexOf('.'))
  const name = fileName?.replace(/(.*\/)*([^.]+).*/gi, '$2')

  downloadFile(errorFilePath.value, `${name}-错误标记${suffix}`)
}

let importFileName: string = ''
const handleFileUpload = (file: any) => {
  errorImport.value = false
  importFileName = generateUniqueName(file.name)
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

const reset = () => {
  fileList.value = []
  errorImport.value = false
  errorFileName.value = ''
  errorFileSize.value = ''
  errorMessage.value = ''
}

watch(progressStatus, (newVal, oldVal) => {
  if (newVal === 'success') {
    emits('finish')
    emits('close')
  }
})

watch(
  () => props.visible,
  () => {
    if (!props.visible) {
      reset()
    }
  },
)
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
</style>
