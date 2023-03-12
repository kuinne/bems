import { ImportDialog } from '@/views/energyFee/common/components/ImportDialog'

import { ref, Ref } from 'vue'
import { nanoid } from 'nanoid'
import { importMeterSetting, downloadMeterSettingImportTemplate } from '@/views/energyFee/apis'
import { Fn } from '../../../common/type'

export function useImport({ energyBillingSettingId, onFinish }: { energyBillingSettingId: Ref<string>; onFinish: Fn }) {
  const visible = ref(false)

  const handleClose = () => {
    visible.value = false
  }

  const open = () => {
    visible.value = true
  }

  const confirmImportAjax = (importFileName: string) => async () => {
    const taskId = nanoid()
    const params = {
      fileName: importFileName,
      taskId,
      energyBillingSettingId: energyBillingSettingId.value,
    }
    const [error, data] = await importMeterSetting(params)

    if (error) {
      return { status: false }
    }
    return { status: true, taskId }
  }

  const downloadTemplate = async () => {
    const filename = '计表导入模板' + '.xlsx'
    const taskId = nanoid()
    const [error, data] = await downloadMeterSettingImportTemplate({
      taskId,
    })
    if (error) {
      return false
    } else {
      return {
        taskId,
        filename,
      }
    }
  }

  const render = () => <ImportDialog visible={visible.value} onClose={handleClose} confirmImportAjax={confirmImportAjax} downloadTemplate={downloadTemplate} onFinish={onFinish} />

  return {
    Import: render,
    open,
  }
}
