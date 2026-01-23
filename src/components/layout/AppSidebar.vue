<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  LayoutDashboard,
  CreditCard,
  GitBranch,
  FileInput,
  Building2,
  Mail,
  LogOut,
  Settings,
  User,
  ChevronsUpDown,
} from 'lucide-vue-next'

defineProps<{
  variant?: 'sidebar' | 'floating' | 'inset'
}>()

const route = useRoute()

// Mock user data - replace with actual auth store later
const currentUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: '',
  initials: 'AU',
}

const navigationItems = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/workflows', label: 'Workflows', icon: GitBranch },
  { path: '/onboarding', label: 'Onboarding Requests', icon: FileInput },
  { path: '/smtp', label: 'SMTP Settings', icon: Mail },
])

function isActive(path: string): boolean {
  return route.path.startsWith(path)
}
</script>

<template>
  <Sidebar :variant="variant" collapsible="icon">
    <!-- Header with Logo -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/dashboard">
              <div class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Backoffice</span>
                <span class="truncate text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Navigation Content -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigationItems" :key="item.path">
              <SidebarMenuButton
                as-child
                :tooltip="item.label"
                :data-active="isActive(item.path)"
              >
                <RouterLink :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer with User Profile -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="currentUser.avatar" :alt="currentUser.name" />
                  <AvatarFallback class="rounded-lg">{{ currentUser.initials }}</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ currentUser.name }}</span>
                  <span class="truncate text-xs">{{ currentUser.email }}</span>
                </div>
                <ChevronsUpDown class="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--reka-popper-anchor-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage :src="currentUser.avatar" :alt="currentUser.name" />
                    <AvatarFallback class="rounded-lg">{{ currentUser.initials }}</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ currentUser.name }}</span>
                    <span class="truncate text-xs">{{ currentUser.email }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User class="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings class="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive focus:text-destructive">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
