<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal as Ellipsis,
} from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endIndex = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const visiblePages = computed(() => {
  const pages: (number | 'ellipsis')[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('ellipsis')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('ellipsis')
    pages.push(total)
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

function onItemsPerPageChange(value: unknown) {
  if (value !== null && value !== undefined) {
    emit('update:itemsPerPage', Number(value))
    emit('update:currentPage', 1)
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-t pt-4 mt-4">
    <div class="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} results</span>
      <span class="mx-2">|</span>
      <span>Rows per page:</span>
      <Select :model-value="String(itemsPerPage)" @update:model-value="onItemsPerPageChange">
        <SelectTrigger class="w-18 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <nav class="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="currentPage === 1"
        @click="goToPage(1)"
      >
        <ChevronsLeft class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <span
        v-for="(page, index) in visiblePages"
        :key="index"
        :class="page === 'ellipsis' ? 'px-2 text-muted-foreground flex items-center' : ''"
      >
        <Ellipsis v-if="page === 'ellipsis'" class="h-4 w-4" />
        <Button
          v-else
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
      </span>

      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        <ChevronsRight class="h-4 w-4" />
      </Button>
    </nav>
  </div>
</template>
