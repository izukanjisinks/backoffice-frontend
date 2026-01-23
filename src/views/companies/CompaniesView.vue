<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Building2,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal as Ellipsis,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

interface Company {
  id: number
  name: string
  email: string
  subscription: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'pending'
  users: number
  createdAt: string
}

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

const totalPages = computed(() => Math.ceil(companies.value.length / itemsPerPage.value))

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return companies.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, companies.value.length))

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function onItemsPerPageChange(value: unknown) {
  if (value !== null && value !== undefined) {
    itemsPerPage.value = Number(value)
    currentPage.value = 1
  }
}

// Generate visible page numbers
const visiblePages = computed(() => {
  const pages: (number | 'ellipsis')[] = []
  const total = totalPages.value
  const current = currentPage.value

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

function getSubscriptionVariant(subscription: Company['subscription']) {
  switch (subscription) {
    case 'enterprise':
      return 'default'
    case 'professional':
      return 'secondary'
    case 'starter':
      return 'outline'
  }
}

function getStatusVariant(status: Company['status']) {
  switch (status) {
    case 'active':
      return 'default'
    case 'inactive':
      return 'destructive'
    case 'pending':
      return 'secondary'
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
      <Button>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Users</TableHead>
              <TableHead>Created</TableHead>
              <TableHead class="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="company in paginatedCompanies" :key="company.id">
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-medium">{{ company.name }}</span>
                  <span class="text-sm text-muted-foreground">{{ company.email }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="getSubscriptionVariant(company.subscription)">
                  {{ company.subscription }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(company.status)">
                  {{ company.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">{{ company.users }}</TableCell>
              <TableCell>{{ company.createdAt }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between border-t pt-4 mt-4">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {{ startIndex }} to {{ endIndex }} of {{ companies.length }} results</span>
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
      </CardContent>
    </Card>
  </div>
</template>
