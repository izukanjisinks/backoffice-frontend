<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

const route = useRoute()

const breadcrumbs = computed(() => {
  const routeTitle = route.meta.title as string | undefined
  return [
    { label: 'Backoffice', href: '/dashboard' },
    ...(routeTitle ? [{ label: routeTitle }] : []),
  ]
})
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <BreadcrumbItem v-if="index < breadcrumbs.length - 1" class="hidden md:block">
            <BreadcrumbLink :href="crumb.href">
              {{ crumb.label }}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" class="hidden md:block" />
          <BreadcrumbItem v-if="index === breadcrumbs.length - 1">
            <BreadcrumbPage>{{ crumb.label }}</BreadcrumbPage>
          </BreadcrumbItem>
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </header>
</template>
