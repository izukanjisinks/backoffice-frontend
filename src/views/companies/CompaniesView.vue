<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Building2, Plus } from 'lucide-vue-next'
import type { Company } from '../../components/companies/types'
import CompaniesTable from '../../components/companies/CompaniesTable.vue'
import CompaniesPagination from '../../components/companies/CompaniesPagination.vue'
import CreateCompanyDialog from '../../components/companies/CreateCompanyDialog.vue'

const isCreateDialogOpen = ref(false)

const companies = ref<Company[]>([
  { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', subscription: 'enterprise', status: 'active', users: 45, createdAt: '2024-01-15' },
  { id: 2, name: 'TechStart Inc', email: 'hello@techstart.io', subscription: 'professional', status: 'active', users: 12, createdAt: '2024-02-20' },
  { id: 3, name: 'Global Solutions Ltd', email: 'info@globalsolutions.com', subscription: 'enterprise', status: 'active', users: 78, createdAt: '2023-11-08' },
  { id: 4, name: 'StartupHub', email: 'team@startuphub.co', subscription: 'starter', status: 'pending', users: 3, createdAt: '2024-03-01' },
  { id: 5, name: 'Digital Dynamics', email: 'support@digitaldynamics.net', subscription: 'professional', status: 'active', users: 25, createdAt: '2024-01-28' },
  { id: 6, name: 'CloudNine Systems', email: 'admin@cloudnine.io', subscription: 'enterprise', status: 'inactive', users: 0, createdAt: '2023-09-15' },
  { id: 7, name: 'InnovateTech', email: 'contact@innovatetech.com', subscription: 'starter', status: 'active', users: 5, createdAt: '2024-02-10' },
  { id: 8, name: 'DataFlow Analytics', email: 'hello@dataflow.ai', subscription: 'professional', status: 'active', users: 18, createdAt: '2024-01-05' },
  { id: 9, name: 'NextGen Labs', email: 'info@nextgenlabs.io', subscription: 'enterprise', status: 'active', users: 52, createdAt: '2023-12-01' },
  { id: 10, name: 'Quantum Computing Inc', email: 'support@quantumcomp.com', subscription: 'enterprise', status: 'active', users: 89, createdAt: '2023-08-22' },
  { id: 11, name: 'Green Energy Solutions', email: 'contact@greenenergy.org', subscription: 'professional', status: 'active', users: 34, createdAt: '2024-01-10' },
  { id: 12, name: 'FinTech Pro', email: 'hello@fintechpro.com', subscription: 'enterprise', status: 'pending', users: 0, createdAt: '2024-03-05' },
  { id: 13, name: 'HealthCare Plus', email: 'admin@healthcareplus.net', subscription: 'professional', status: 'active', users: 41, createdAt: '2023-10-15' },
  { id: 14, name: 'EduTech Academy', email: 'info@edutechacademy.com', subscription: 'starter', status: 'active', users: 8, createdAt: '2024-02-01' },
  { id: 15, name: 'Cyber Shield Security', email: 'security@cybershield.io', subscription: 'enterprise', status: 'active', users: 67, createdAt: '2023-07-20' },
  { id: 16, name: 'Smart Home Tech', email: 'support@smarthometech.com', subscription: 'professional', status: 'inactive', users: 0, createdAt: '2023-11-30' },
  { id: 17, name: 'AI Solutions Corp', email: 'contact@aisolutions.ai', subscription: 'enterprise', status: 'active', users: 112, createdAt: '2023-06-15' },
  { id: 18, name: 'Mobile First Apps', email: 'hello@mobilefirst.dev', subscription: 'starter', status: 'active', users: 6, createdAt: '2024-02-28' },
  { id: 19, name: 'Cloud Infrastructure Ltd', email: 'ops@cloudinfra.io', subscription: 'enterprise', status: 'active', users: 95, createdAt: '2023-09-01' },
  { id: 20, name: 'Social Media Hub', email: 'team@socialmediahub.com', subscription: 'professional', status: 'active', users: 28, createdAt: '2024-01-20' },
  { id: 21, name: 'E-Commerce Express', email: 'sales@ecomexpress.com', subscription: 'professional', status: 'active', users: 37, createdAt: '2023-12-10' },
  { id: 22, name: 'Virtual Reality Labs', email: 'info@vrlabs.tech', subscription: 'starter', status: 'pending', users: 2, createdAt: '2024-03-08' },
  { id: 23, name: 'Blockchain Ventures', email: 'contact@blockchainv.io', subscription: 'enterprise', status: 'active', users: 54, createdAt: '2023-10-05' },
  { id: 24, name: 'DevOps Masters', email: 'support@devopsmasters.com', subscription: 'professional', status: 'active', users: 19, createdAt: '2024-01-25' },
  { id: 25, name: 'Data Science Co', email: 'hello@datascienceco.ai', subscription: 'enterprise', status: 'active', users: 73, createdAt: '2023-08-10' },
])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return companies.value.slice(start, end)
})

function handleCreateCompany(values: Record<string, unknown>) {
  const newCompany: Company = {
    id: companies.value.length + 1,
    name: values.companyName as string,
    email: values.companyEmail as string,
    subscription: values.subscriptionTier as Company['subscription'],
    status: 'pending',
    users: 0,
    createdAt: new Date().toISOString().split('T')[0],
  }
  companies.value.unshift(newCompany)
}

function handleViewCompany(company: Company) {
  console.log('View company:', company)
}

function handleEditCompany(company: Company) {
  console.log('Edit company:', company)
}

function handleDeleteCompany(company: Company) {
  const index = companies.value.findIndex(c => c.id === company.id)
  if (index !== -1) {
    companies.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Companies</h2>
        <p class="text-muted-foreground">Manage all registered companies</p>
      </div>
      <Button @click="isCreateDialogOpen = true">
        <Plus class="mr-2 h-4 w-4" />
        Add Company
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Building2 class="h-5 w-5" />
          All Companies
        </CardTitle>
        <CardDescription>
          A list of all companies registered in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompaniesTable
          :companies="paginatedCompanies"
          @view="handleViewCompany"
          @edit="handleEditCompany"
          @delete="handleDeleteCompany"
        />

        <CompaniesPagination
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :total-items="companies.length"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </CardContent>
    </Card>

    <CreateCompanyDialog
      :open="isCreateDialogOpen"
      @update:open="isCreateDialogOpen = $event"
      @submit="handleCreateCompany"
    />
  </div>
</template>
