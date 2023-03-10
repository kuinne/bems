import ProgressDialog from '@/views/energyFee/common/components/ProgressDialog/index.vue'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { ref } from 'vue'
import { exportMeterSetting } from '@/views/energyFee/apis'
import { useFile } from '@/utils/api-services'
export function useExport() {
  const exportParams = ref<any>()

  // 导入
  const { showProgressDialog, fileExport, progressTitle, percent, progressStatus } = useFile()

  const open = (_exportParams: any) => {
    exportParams.value = _exportParams
    const filename = '表计设置' + dayjs().format('YYYYMMDDHHmmss') + '.xlsx'
    fileExport(exportRequest, filename)
  }

  const exportRequest = async () => {
    const taskId = nanoid()
    const params = {
      taskId,
      ...exportParams.value,
    }

    const [error, data] = await exportMeterSetting(params)
    if (error) {
      return { status: false }
    }
    return { status: true, taskId }
  }

  const render = () => <ProgressDialog v-model={showProgressDialog.value} v-model:percent={percent.value} title={progressTitle.value} textMap="" />
  return {
    Export: render,
    open,
  }
}
