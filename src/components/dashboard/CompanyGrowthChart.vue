<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChartConfig } from '../ui/chart'
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
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

// Daily activity data for the last 3 months (Oct-Dec 2024)
const chartData = [
  { date: new Date('2024-10-01'), companies: 186, users: 150 },
  { date: new Date('2024-10-02'), companies: 97, users: 180 },
  { date: new Date('2024-10-03'), companies: 167, users: 120 },
  { date: new Date('2024-10-04'), companies: 242, users: 260 },
  { date: new Date('2024-10-05'), companies: 373, users: 290 },
  { date: new Date('2024-10-06'), companies: 301, users: 340 },
  { date: new Date('2024-10-07'), companies: 245, users: 180 },
  { date: new Date('2024-10-08'), companies: 409, users: 320 },
  { date: new Date('2024-10-09'), companies: 59, users: 110 },
  { date: new Date('2024-10-10'), companies: 261, users: 190 },
  { date: new Date('2024-10-11'), companies: 327, users: 350 },
  { date: new Date('2024-10-12'), companies: 292, users: 210 },
  { date: new Date('2024-10-13'), companies: 342, users: 380 },
  { date: new Date('2024-10-14'), companies: 137, users: 220 },
  { date: new Date('2024-10-15'), companies: 120, users: 170 },
  { date: new Date('2024-10-16'), companies: 138, users: 190 },
  { date: new Date('2024-10-17'), companies: 446, users: 360 },
  { date: new Date('2024-10-18'), companies: 364, users: 410 },
  { date: new Date('2024-10-19'), companies: 243, users: 180 },
  { date: new Date('2024-10-20'), companies: 89, users: 150 },
  { date: new Date('2024-10-21'), companies: 137, users: 200 },
  { date: new Date('2024-10-22'), companies: 224, users: 170 },
  { date: new Date('2024-10-23'), companies: 138, users: 230 },
  { date: new Date('2024-10-24'), companies: 387, users: 290 },
  { date: new Date('2024-10-25'), companies: 215, users: 250 },
  { date: new Date('2024-10-26'), companies: 75, users: 130 },
  { date: new Date('2024-10-27'), companies: 383, users: 420 },
  { date: new Date('2024-10-28'), companies: 122, users: 180 },
  { date: new Date('2024-10-29'), companies: 315, users: 240 },
  { date: new Date('2024-10-30'), companies: 454, users: 380 },
  { date: new Date('2024-10-31'), companies: 165, users: 220 },
  { date: new Date('2024-11-01'), companies: 293, users: 310 },
  { date: new Date('2024-11-02'), companies: 247, users: 190 },
  { date: new Date('2024-11-03'), companies: 385, users: 420 },
  { date: new Date('2024-11-04'), companies: 481, users: 390 },
  { date: new Date('2024-11-05'), companies: 498, users: 520 },
  { date: new Date('2024-11-06'), companies: 388, users: 300 },
  { date: new Date('2024-11-07'), companies: 149, users: 210 },
  { date: new Date('2024-11-08'), companies: 227, users: 180 },
  { date: new Date('2024-11-09'), companies: 293, users: 330 },
  { date: new Date('2024-11-10'), companies: 335, users: 270 },
  { date: new Date('2024-11-11'), companies: 197, users: 240 },
  { date: new Date('2024-11-12'), companies: 197, users: 160 },
  { date: new Date('2024-11-13'), companies: 448, users: 490 },
  { date: new Date('2024-11-14'), companies: 473, users: 380 },
  { date: new Date('2024-11-15'), companies: 338, users: 400 },
  { date: new Date('2024-11-16'), companies: 499, users: 420 },
  { date: new Date('2024-11-17'), companies: 315, users: 350 },
  { date: new Date('2024-11-18'), companies: 235, users: 180 },
  { date: new Date('2024-11-19'), companies: 177, users: 230 },
  { date: new Date('2024-11-20'), companies: 82, users: 140 },
  { date: new Date('2024-11-21'), companies: 81, users: 120 },
  { date: new Date('2024-11-22'), companies: 252, users: 290 },
  { date: new Date('2024-11-23'), companies: 294, users: 220 },
  { date: new Date('2024-11-24'), companies: 201, users: 250 },
  { date: new Date('2024-11-25'), companies: 213, users: 170 },
  { date: new Date('2024-11-26'), companies: 420, users: 460 },
  { date: new Date('2024-11-27'), companies: 233, users: 190 },
  { date: new Date('2024-11-28'), companies: 78, users: 130 },
  { date: new Date('2024-11-29'), companies: 340, users: 280 },
  { date: new Date('2024-11-30'), companies: 178, users: 230 },
  { date: new Date('2024-12-01'), companies: 178, users: 200 },
  { date: new Date('2024-12-02'), companies: 470, users: 410 },
  { date: new Date('2024-12-03'), companies: 103, users: 160 },
  { date: new Date('2024-12-04'), companies: 439, users: 380 },
  { date: new Date('2024-12-05'), companies: 88, users: 140 },
  { date: new Date('2024-12-06'), companies: 294, users: 250 },
  { date: new Date('2024-12-07'), companies: 323, users: 370 },
  { date: new Date('2024-12-08'), companies: 385, users: 320 },
  { date: new Date('2024-12-09'), companies: 438, users: 480 },
  { date: new Date('2024-12-10'), companies: 155, users: 200 },
  { date: new Date('2024-12-11'), companies: 92, users: 150 },
  { date: new Date('2024-12-12'), companies: 492, users: 420 },
  { date: new Date('2024-12-13'), companies: 81, users: 130 },
  { date: new Date('2024-12-14'), companies: 426, users: 380 },
  { date: new Date('2024-12-15'), companies: 307, users: 350 },
  { date: new Date('2024-12-16'), companies: 371, users: 310 },
  { date: new Date('2024-12-17'), companies: 475, users: 520 },
  { date: new Date('2024-12-18'), companies: 107, users: 170 },
  { date: new Date('2024-12-19'), companies: 341, users: 290 },
  { date: new Date('2024-12-20'), companies: 408, users: 450 },
  { date: new Date('2024-12-21'), companies: 169, users: 210 },
  { date: new Date('2024-12-22'), companies: 317, users: 270 },
  { date: new Date('2024-12-23'), companies: 480, users: 530 },
  { date: new Date('2024-12-24'), companies: 132, users: 180 },
  { date: new Date('2024-12-25'), companies: 141, users: 190 },
  { date: new Date('2024-12-26'), companies: 434, users: 380 },
  { date: new Date('2024-12-27'), companies: 448, users: 490 },
  { date: new Date('2024-12-28'), companies: 149, users: 200 },
  { date: new Date('2024-12-29'), companies: 103, users: 160 },
  { date: new Date('2024-12-30'), companies: 446, users: 400 },
  { date: new Date('2024-12-31'), companies: 142, users: 235 },
]

type Data = typeof chartData[number]

const chartConfig = {
  growth: {
    label: 'Growth',
    color: undefined,
  },
  companies: {
    label: 'Companies',
    color: 'var(--chart-1)',
  },
  users: {
    label: 'Users',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

const activeChart = ref<'companies' | 'users'>('companies')

const total = computed(() => ({
  companies: chartData.reduce((acc, curr) => acc + curr.companies, 0),
  users: chartData.reduce((acc, curr) => acc + curr.users, 0),
}))
</script>

<template>
  <Card class="py-4 sm:py-0">
    <CardHeader class="flex flex-col items-stretch border-b !p-0 sm:flex-row">
      <div class="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
        <CardTitle>Growth Overview</CardTitle>
        <CardDescription>
          Daily activity for the last 3 months
        </CardDescription>
      </div>
      <div class="flex">
        <button
          v-for="chart in (['companies', 'users'] as const)"
          :key="chart"
          :data-active="activeChart === chart"
          class="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
          @click="activeChart = chart"
        >
          <span class="text-muted-foreground text-xs">
            {{ chartConfig[chart].label }}
          </span>
          <span class="text-lg leading-none font-bold sm:text-3xl">
            {{ total[chart].toLocaleString() }}
          </span>
        </button>
      </div>
    </CardHeader>
    <CardContent class="px-2 sm:p-6">
      <ChartContainer :config="chartConfig" class="aspect-auto h-[250px] w-full">
        <VisXYContainer
          :data="chartData"
          :margin="{ left: -24 }"
          :y-domain="[0, undefined]"
        >
          <VisLine
            :x="(d: Data) => d.date"
            :y="(d: Data) => d[activeChart]"
            :color="chartConfig[activeChart].color"
          />
          <VisAxis
            type="x"
            :x="(d: Data) => d.date"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :tick-format="(d: number) => {
              const date = new Date(d)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }"
          />
          <VisAxis
            type="y"
            :num-ticks="4"
            :tick-line="false"
            :domain-line="false"
          />
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, {
              labelFormatter(d) {
                return new Date(d).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              },
            })"
            :color="chartConfig[activeChart].color"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
  </Card>
</template>
