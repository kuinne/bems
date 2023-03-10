<template>
  <div class="tab-container">
    <div class="tab-container-inner">
      <Das-tabs :options="options" v-model:activeKey="activeKey">
        <!-- <template v-for="item in options" #[item.contentSlot]>
          <Render :render="item.render"></Render>
        </template> -->
      </Das-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DasTabs } from '@/das-fe/ui'
import { computed, ref, watch, watchEffect } from 'vue'
import type { Props, Emits } from './type'
import Render from '../Render/index.vue'

const props = withDefaults(defineProps<Props>(), {
  activeKey: '',
})
const emits = defineEmits<Emits>()

const options = computed(() =>
  props.options.map((item) => ({
    ...item,
    contentSlot: item.key,
  })),
)

const activeKey = ref<string>('')

watch(
  () => activeKey.value,
  () => {
    emits('update:activeKey', activeKey.value)
    emits('change', activeKey.value)
  },
)

watchEffect(() => {
  activeKey.value = props.activeKey
})
</script>
<style scoped lang="scss">
.tab-container {
  --font-size-base: 12px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;

  .tab-container-inner {
    background: #fff;
    :deep(.ant-tabs) {
      font-size: var(--font-size-base);
      .das-tab-label {
        font-size: var(--font-size-base);
      }
      .ant-tabs-content {
        padding: 0 0 10px 18px;
      }
      .ant-tabs-nav {
        margin: 0 !important;
      }
      .ant-tabs-content-holder {
        display: none;
      }
    }
  }
}
</style>
