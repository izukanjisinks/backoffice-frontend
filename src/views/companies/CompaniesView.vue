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
import type { Company, CompanyFormValues } from '../../components/companies/types'
import CompaniesTable from '../../components/companies/CompaniesTable.vue'
import CompaniesPagination from '../../components/companies/CompaniesPagination.vue'
import CompanyDialog from '../../components/companies/CompanyDialog.vue'
import { useCompaniesStore } from '../../stores/companies'

const companiesStore = useCompaniesStore()

// Dialog state
const isDialogOpen = ref(false)
const selectedCompany = ref<Company | null>(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return companiesStore.companies.slice(start, end)
})

function openCreateDialog() {
  selectedCompany.value = null
  isDialogOpen.value = true
}

function handleViewCompany(company: Company) {
  selectedCompany.value = company
  isDialogOpen.value = true
}

function handleDeleteCompany(company: Company) {
  companiesStore.deleteCompany(company.id)
}

function handleDialogSubmit(values: CompanyFormValues) {
  if (selectedCompany.value) {
    // Update existing company
    companiesStore.updateCompany(selectedCompany.value.id, {
      name: values.companyName,
      email: values.companyEmail,
      phone: values.phone,
      website: values.website,
      industry: values.industry,
      companySize: values.companySize,
      subscription: values.subscriptionTier as Company['subscription'],
      billingCycle: values.billingCycle as Company['billingCycle'],
      billingEmail: values.billingEmail,
      billingAddress: values.billingAddress,
      billingCity: values.billingCity,
      billingCountry: values.billingCountry,
      adminFirstName: values.adminFirstName,
      adminLastName: values.adminLastName,
      adminEmail: values.adminEmail,
      adminPhone: values.adminPhone,
      adminRole: values.adminRole,
      sendWelcomeEmail: values.sendWelcomeEmail,
    })
  } else {
    // Create new company
    companiesStore.addCompany({
      name: values.companyName,
      email: values.companyEmail,
      phone: values.phone,
      website: values.website,
      industry: values.industry,
      companySize: values.companySize,
      subscription: values.subscriptionTier as Company['subscription'],
      billingCycle: values.billingCycle as Company['billingCycle'],
      billingEmail: values.billingEmail,
      billingAddress: values.billingAddress,
      billingCity: values.billingCity,
      billingCountry: values.billingCountry,
      adminFirstName: values.adminFirstName,
      adminLastName: values.adminLastName,
      adminEmail: values.adminEmail,
      adminPhone: values.adminPhone,
      adminRole: values.adminRole,
      sendWelcomeEmail: values.sendWelcomeEmail,
    })
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
      <Button @click="openCreateDialog">
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
          @delete="handleDeleteCompany"
        />

        <CompaniesPagination
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :total-items="companiesStore.totalCompanies"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </CardContent>
    </Card>

    <CompanyDialog
      :open="isDialogOpen"
      :company="selectedCompany"
      @update:open="isDialogOpen = $event"
      @submit="handleDialogSubmit"
    />
  </div>
</template>
