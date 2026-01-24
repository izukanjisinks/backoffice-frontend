<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useUiStore } from './stores/ui.store'
import DefaultLayout from './layouts/DefaultLayout.vue'

const uiStore = useUiStore()
const route = useRoute()

const isAuthPage = computed(() => route.meta.requiresAuth === false)

onMounted(() => {
  uiStore.initTheme()
})
</script>

<template>
  <div v-if="isAuthPage">
    <RouterView />
  </div>
  <DefaultLayout v-else>
    <RouterView />
  </DefaultLayout>
</template>
