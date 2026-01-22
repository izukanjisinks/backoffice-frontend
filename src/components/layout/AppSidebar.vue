<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUiStore } from '../../stores/ui.store'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import {
  LayoutDashboard,
  CreditCard,
  GitBranch,
  FileInput,
  Building2,
  Mail,
  PanelLeftClose,
  PanelLeft
} from 'lucide-vue-next'

const route = useRoute()
const uiStore = useUiStore()

const { sidebarCollapsed, sidebarMobileOpen } = storeToRefs(uiStore)
const { toggleSidebar, closeMobileSidebar } = uiStore

const navigationItems = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/workflows', label: 'Workflows', icon: GitBranch },
  { path: '/onboarding', label: 'Onboarding Requests', icon: FileInput },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/smtp', label: 'SMTP Settings', icon: Mail },
])

function isActive(path: string): boolean {
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    :class="cn(
      'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-64',
      sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b px-4">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Building2 class="h-5 w-5 text-primary-foreground" />
        </div>
        <span v-if="!sidebarCollapsed" class="text-lg font-semibold">Backoffice</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 p-2">
      <TooltipProvider :delay-duration="0">
        <template v-for="item in navigationItems" :key="item.path">
          <Tooltip v-if="sidebarCollapsed">
            <TooltipTrigger as-child>
              <RouterLink
                :to="item.path"
                :class="cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted justify-center',
                  isActive(item.path) && 'bg-muted text-primary font-medium'
                )"
                @click="closeMobileSidebar"
              >
                <component :is="item.icon" class="h-5 w-5" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">{{ item.label }}</TooltipContent>
          </Tooltip>

          <RouterLink
            v-else
            :to="item.path"
            :class="cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
              isActive(item.path) && 'bg-muted text-primary font-medium'
            )"
            @click="closeMobileSidebar"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </template>
      </TooltipProvider>
    </nav>

    <!-- Footer -->
    <div class="border-t p-2">
      <Button variant="ghost" size="icon" class="w-full" @click="toggleSidebar">
        <PanelLeftClose v-if="!sidebarCollapsed" class="h-5 w-5" />
        <PanelLeft v-else class="h-5 w-5" />
      </Button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="sidebarMobileOpen"
    class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
    @click="closeMobileSidebar"
  />
</template>
