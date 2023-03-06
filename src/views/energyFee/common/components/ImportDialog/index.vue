<template>
  <!-- 导入弹窗 -->
  <das-dialog :title="i18n('导入' as any).value" v-model="visible" customClass="deviceManage-import-dialog" size="small" :close-on-click-modal="false" :close-on-press-escape="false">
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
import { downloadMeterSettingImportTemplate, importMeterSetting } from '@/views/energyFee/apis'
import { ref, reactive } from 'vue'
import { exportExcel } from '../../utils'
import { nanoid } from 'nanoid'
import { getUserInfo } from '@/utils/common-info/index'
const visible = ref(true)

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
  const filename = '计表导入模板' + '.xlsx'
  const [error, data] = await downloadMeterSettingImportTemplate({
    taskId: new Date().getTime() + '',
  })
  if (error) {
    return
  }
  exportExcel(data.data, filename)
}

const handleErrorFileDownload = () => {}

// 导入
const {
  showProgressDialog,
  progressTitle,
  percent,
  progressStatus,
  progressLoading,
  errorFileName,
  errorFileSize,
  errorMessage,
  errorImport,
  errorFilePath,
  fileImport,
  generateUniqueName,
  fileExport,
  resetStataus,
} = useFile()

let importFileName: string = ''
const handleFileUpload = (file: any) => {
  errorImport.value = false
  importFileName = generateUniqueName(file.name)
}

const handleCancel = () => {}

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
    bucketName: 'temp',
    importFileName: `/${tenantId}/energy-manage/${importFileName}`,
    // importFileName: `/t371677589594182/bems-data-manage/${importFileName}`,
  }
  fileImport(confirmCategoryImportAjax, fileList.value[0], options)
}

// 产品列表--确定导入请求
const confirmCategoryImportAjax = async () => {
  const taskId = nanoid()
  const params = {
    fileName: importFileName,
    taskId,
    energyBillingSettingId: '1078682899801620480',
  }
  const [error, data] = await importMeterSetting(params)
  if (error) {
    return { status: false }
  }
  return { status: true, taskId }
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
