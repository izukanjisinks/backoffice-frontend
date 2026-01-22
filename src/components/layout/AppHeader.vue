<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '../../stores/ui.store'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Menu, Sun, Moon, LogOut, User, Settings } from 'lucide-vue-next'

const uiStore = useUiStore()

const { isDarkMode } = storeToRefs(uiStore)
const { toggleMobileSidebar, toggleTheme } = uiStore
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
    <Button variant="ghost" size="icon" class="lg:hidden" @click="toggleMobileSidebar">
      <Menu class="h-5 w-5" />
    </Button>

    <div class="flex-1">
      <h1 class="text-lg font-semibold">Dashboard</h1>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" @click="toggleTheme">
        <Sun v-if="isDarkMode" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel>
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium">Admin User</p>
              <p class="text-xs text-muted-foreground">admin@backoffice.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User class="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings class="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive">
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
