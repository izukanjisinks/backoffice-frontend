<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUiStore } from './stores/ui.store'
import DefaultLayout from './layouts/DefaultLayout.vue'

const uiStore = useUiStore()

onMounted(() => {
  uiStore.initTheme()
})
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>
