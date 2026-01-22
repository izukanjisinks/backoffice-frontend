<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: string | number
  description?: string
  trend?: number
  icon?: any
}>()

const formattedValue = computed(() =>
  typeof props.value === 'number' ? props.value.toLocaleString() : props.value
)
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">{{ title }}</CardTitle>
      <component v-if="icon" :is="icon" class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="flex items-baseline gap-2">
        <div class="text-2xl font-bold">{{ formattedValue }}</div>
        <div
          v-if="trend !== undefined"
          :class="cn(
            'flex items-center text-sm',
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'
          )"
        >
          <TrendingUp v-if="trend > 0" class="mr-1 h-4 w-4" />
          <TrendingDown v-else-if="trend < 0" class="mr-1 h-4 w-4" />
          {{ Math.abs(trend) }}%
        </div>
      </div>
      <p v-if="description" class="mt-1 text-xs text-muted-foreground">{{ description }}</p>
    </CardContent>
  </Card>
</template>
