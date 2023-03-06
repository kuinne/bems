import { defineAsyncComponent, ref, computed, watchEffect } from 'vue'
import ActionButtons from '../../../ActionButtons/ActionButton.vue'

export function useContainer() {
  const ContainerSFC = defineAsyncComponent(() => import('./Container.vue'))

  const containerRef = ref<InstanceType<typeof ContainerSFC>>()

  const Container = () => <ContainerSFC ref={containerRef}></ContainerSFC>

  const actionButtonsOptions = computed(() => [
    {
      label: '新增',
      onClick: containerRef.value?.openAdd,
    },
    {
      label: '删除',
      onClick: containerRef.value?.openBatchDelete,
      disabled: (containerRef.value?.multipleSection || []).length === 0,
    },
    {
      label: '导入',
    },
    {
      label: '导出',
    },
  ])
  const TabPaneContent = () => <ActionButtons options={actionButtonsOptions.value} />

  return {
    Container,
    reload: () => containerRef.value?.reload(),
    TabPaneContent,
  }
}
