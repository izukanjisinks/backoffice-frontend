<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui.store'
import { cn } from '../lib/utils'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'

const uiStore = useUiStore()
const { sidebarCollapsed } = storeToRefs(uiStore)
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppSidebar />

    <div
      :class="cn(
        'flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )"
    >
      <AppHeader />

      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
