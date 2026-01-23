<script setup lang="ts">
import type { ChartConfig } from '../ui/chart'
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '../ui/chart'

const chartData = [
  { stage: 'Pending', count: 20, fill: 'var(--color-pending)' },
  { stage: 'In Progress', count: 16, fill: 'var(--color-progress)' },
  { stage: 'Approved', count: 10, fill: 'var(--color-approved)' },
  { stage: 'Rejected', count: 8, fill: 'var(--color-rejected)' },
]

type Data = typeof chartData[number]

const chartConfig = {
  count: {
    label: 'Count',
    color: undefined,
  },
  pending: {
    label: 'Pending Review',
    color: 'var(--chart-4)',
  },
  progress: {
    label: 'In Progress',
    color: 'var(--chart-2)',
  },
  approved: {
    label: 'Approved',
    color: 'var(--chart-3)',
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const stageToColor: Record<string, string> = {
  'Pending': chartConfig.pending.color,
  'In Progress': chartConfig.progress.color,
  'Approved': chartConfig.approved.color,
  'Rejected': chartConfig.rejected.color,
}
</script>

<template>
  <Card class="h-full">
    <CardHeader>
      <CardTitle>Workflow Pipeline</CardTitle>
      <CardDescription>Current workflow status</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer :config="chartConfig" class="h-[200px]">
        <VisXYContainer
          :data="chartData"
          :margin="{ left: -24, bottom: 10 }"
          :y-domain="[0, undefined]"
        >
          <VisGroupedBar
            :x="(_d: Data, i: number) => i"
            :y="(d: Data) => d.count"
            :color="(d: Data) => stageToColor[d.stage]"
            :rounded-corners="4"
            :bar-padding="0.3"
          />
          <VisAxis
            type="x"
            :x="(_d: Data, i: number) => i"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :tick-format="(_d: number, i: number) => chartData[i]?.stage ?? ''"
          />
          <VisAxis
            type="y"
            :num-ticks="3"
            :tick-line="false"
            :domain-line="false"
          />
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })"
            color="#0000"
          />
        </VisXYContainer>
      </ChartContainer>
      <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div v-for="item in chartData" :key="item.stage" class="flex items-center gap-2">
          <div
            class="h-3 w-3 rounded-sm"
            :style="{ backgroundColor: stageToColor[item.stage] }"
          />
          <span class="text-muted-foreground">{{ item.stage }}</span>
          <span class="font-medium">{{ item.count }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
