<template>
  <Render />
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
const props = defineProps<{ render: () => JSX.Element }>()

const Render = defineComponent({
  setup() {
    return props.render
  },
})
</script>

<style></style>
