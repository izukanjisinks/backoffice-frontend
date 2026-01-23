<script setup lang="ts">
import type { ChartConfig } from '../ui/chart'
import { Donut } from '@unovis/ts'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import { computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '../ui/chart'

const chartData = [
  { tier: 'enterprise', companies: 64, fill: 'var(--color-enterprise)' },
  { tier: 'professional', companies: 50, fill: 'var(--color-professional)' },
  { tier: 'starter', companies: 28, fill: 'var(--color-starter)' },
]

type Data = typeof chartData[number]

const chartConfig = {
  companies: {
    label: 'Companies',
    color: undefined,
  },
  enterprise: {
    label: 'Enterprise',
    color: 'var(--chart-1)',
  },
  professional: {
    label: 'Professional',
    color: 'var(--chart-2)',
  },
  starter: {
    label: 'Starter',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

const totalCompanies = computed(() => chartData.reduce((acc, curr) => acc + curr.companies, 0))
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader class="items-center pb-0">
      <CardTitle>Subscription Distribution</CardTitle>
      <CardDescription>Companies by subscription tier</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 pb-0">
      <ChartContainer
        :config="chartConfig"
        class="mx-auto aspect-square max-h-[250px]"
        :style="{
          '--vis-donut-central-label-font-size': 'var(--text-3xl)',
          '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
          '--vis-donut-central-label-text-color': 'var(--foreground)',
          '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
        }"
      >
        <VisSingleContainer
          :data="chartData"
          :margin="{ top: 30, bottom: 30 }"
        >
          <VisDonut
            :value="(d: Data) => d.companies"
            :color="(d: Data) => chartConfig[d.tier as keyof typeof chartConfig]?.color"
            :arc-width="30"
            :central-label-offset-y="10"
            :central-label="totalCompanies.toString()"
            central-sub-label="Companies"
          />
          <ChartTooltip
            :triggers="{
              [Donut.selectors.segment]: componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })!,
            }"
          />
        </VisSingleContainer>
      </ChartContainer>
    </CardContent>
    <div class="p-6 pt-0">
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <div v-for="item in chartData" :key="item.tier" class="flex items-center gap-2">
          <div
            class="h-3 w-3 rounded-sm"
            :style="{ backgroundColor: chartConfig[item.tier as keyof typeof chartConfig]?.color }"
          />
          <span class="text-muted-foreground">
            {{ chartConfig[item.tier as keyof typeof chartConfig]?.label }}
          </span>
          <span class="font-medium">{{ Math.round((item.companies / totalCompanies) * 100) }}%</span>
        </div>
      </div>
    </div>
  </Card>
</template>
