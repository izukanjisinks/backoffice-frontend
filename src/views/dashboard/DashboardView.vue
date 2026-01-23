<script setup lang="ts">
import StatCard from '../../components/dashboard/StatCard.vue'
import CompanyGrowthChart from '../../components/dashboard/CompanyGrowthChart.vue'
import SubscriptionPieChart from '../../components/dashboard/SubscriptionPieChart.vue'
import WorkflowBarChart from '../../components/dashboard/WorkflowBarChart.vue'
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
      <!-- Subscription Pie Chart -->
      <div class="col-span-4">
        <SubscriptionPieChart />
      </div>

      <!-- Workflow Bar Chart -->
      <div class="col-span-3">
        <WorkflowBarChart />
      </div>
    </div>

    <!-- Growth Chart -->
    <CompanyGrowthChart />
  </div>
</template>
