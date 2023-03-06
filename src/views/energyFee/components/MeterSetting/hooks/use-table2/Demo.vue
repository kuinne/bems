<template>
  <div class="demo-container">
    <Tab />
    <UserSetting />
  </div>
</template>

<script setup lang="tsx">
import { useTab } from './use-tab/index.tsx'
import { useContainer } from './userSetting/use-container/index.tsx'

const { Container: UserSetting, tabRender } = useContainer()

const { Tab } = useTab({
  userSettingRender: tabRender,
  productSettingRender: () => <div>fsfs</div>,
})
</script>
<style scoped lang="scss">
.demo-container {
  display: flex;
  height: 100%;
  background-color: #ccc;
  flex-direction: column;
}
</style>
