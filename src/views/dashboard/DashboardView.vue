<script setup lang="ts">
import StatCard from '../../components/dashboard/StatCard.vue'
import RecentActivity from '../../components/dashboard/RecentActivity.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Building2, Users, FileCheck, AlertCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground">Welcome to your backoffice dashboard</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Companies"
        :value="142"
        description="Active companies in system"
        :trend="12"
        :icon="Building2"
      />
      <StatCard
        title="Active Users"
        :value="2350"
        description="Users across all companies"
        :trend="8"
        :icon="Users"
      />
      <StatCard
        title="Pending Approvals"
        :value="23"
        description="Workflows awaiting review"
        :icon="FileCheck"
      />
      <StatCard
        title="Onboarding Requests"
        :value="7"
        description="New company requests"
        :trend="-3"
        :icon="AlertCircle"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <!-- Overview Card -->
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Company Growth</CardTitle>
          <CardDescription>Number of companies onboarded over time</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart placeholder - integrate with @unovis/vue
        </CardContent>
      </Card>

      <!-- Subscription Distribution -->
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Companies by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-full">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">Enterprise</span>
                  <span class="text-sm text-muted-foreground">45%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-primary" style="width: 45%"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-full">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">Professional</span>
                  <span class="text-sm text-muted-foreground">35%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-blue-500" style="width: 35%"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-full">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">Starter</span>
                  <span class="text-sm text-muted-foreground">20%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-green-500" style="width: 20%"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <RecentActivity />
  </div>
</template>
