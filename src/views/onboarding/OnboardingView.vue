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
import { Badge } from '../../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import { ClipboardList, Eye, Clock, FileSearch, CheckCircle, XCircle } from 'lucide-vue-next'
import { useOnboardingStore, type OnboardingRequest } from '../../stores/onboarding'
import OnboardingRequestDialog from '../../components/onboarding/OnboardingRequestDialog.vue'

const onboardingStore = useOnboardingStore()

const isRequestDialogOpen = ref(false)
const selectedRequest = ref<OnboardingRequest | null>(null)
const activeTab = ref('all')

const filteredRequests = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return onboardingStore.pendingRequests
    case 'reviewing':
      return onboardingStore.reviewingRequests
    case 'approved':
      return onboardingStore.approvedRequests
    case 'rejected':
      return onboardingStore.rejectedRequests
    default:
      return onboardingStore.requests
  }
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800'
    case 'reviewing':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800'
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800'
  }
}

function handleViewRequest(request: OnboardingRequest) {
  selectedRequest.value = request
  isRequestDialogOpen.value = true
}

function handleDialogClose() {
  isRequestDialogOpen.value = false
  selectedRequest.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Onboarding Requests</h2>
        <p class="text-muted-foreground">Review and manage company onboarding applications</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ onboardingStore.pendingRequests.length }}</div>
          <p class="mt-1 text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
          <FileSearch class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ onboardingStore.reviewingRequests.length }}</div>
          <p class="mt-1 text-xs text-muted-foreground">Being reviewed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          <CheckCircle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ onboardingStore.approvedRequests.length }}</div>
          <p class="mt-1 text-xs text-muted-foreground">Successfully approved</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          <XCircle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ onboardingStore.rejectedRequests.length }}</div>
          <p class="mt-1 text-xs text-muted-foreground">Not accepted</p>
        </CardContent>
      </Card>
    </div>

    <!-- Requests Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-primary/10 p-2">
            <ClipboardList class="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>{{ onboardingStore.requests.length }} total onboarding request(s)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs v-model="activeTab" default-value="all">
          <TabsList class="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" class="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Workflow State</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead class="w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="request in filteredRequests"
                  :key="request.id"
                  class="cursor-pointer hover:bg-muted/50"
                  @click="handleViewRequest(request)"
                >
                  <TableCell class="font-medium">{{ request.companyName }}</TableCell>
                  <TableCell>{{ request.contactPerson }}</TableCell>
                  <TableCell class="text-muted-foreground">{{ request.email }}</TableCell>
                  <TableCell>
                    <Badge :class="getStatusBadgeClass(request.status)" variant="outline" class="capitalize font-medium">
                      {{ request.status }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span v-if="request.workflowState" class="text-sm">
                      {{ request.workflowState }}
                    </span>
                    <span v-else class="text-sm text-muted-foreground">—</span>
                  </TableCell>
                  <TableCell>
                    <span v-if="request.assignedTo" class="text-sm">
                      {{ request.assignedTo }}
                    </span>
                    <span v-else class="text-sm text-muted-foreground">Unassigned</span>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-sm">
                    {{ formatDate(request.submittedAt) }}
                  </TableCell>
                  <TableCell @click.stop>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="handleViewRequest(request)"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow v-if="filteredRequests.length === 0">
                  <TableCell colspan="8" class="text-center py-8 text-muted-foreground">
                    No requests found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent v-for="tab in ['pending', 'reviewing', 'approved', 'rejected']" :key="tab" :value="tab" class="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Workflow State</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead class="w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="request in filteredRequests"
                  :key="request.id"
                  class="cursor-pointer hover:bg-muted/50"
                  @click="handleViewRequest(request)"
                >
                  <TableCell class="font-medium">{{ request.companyName }}</TableCell>
                  <TableCell>{{ request.contactPerson }}</TableCell>
                  <TableCell class="text-muted-foreground">{{ request.email }}</TableCell>
                  <TableCell>
                    <Badge :class="getStatusBadgeClass(request.status)" variant="outline" class="capitalize font-medium">
                      {{ request.status }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span v-if="request.workflowState" class="text-sm">
                      {{ request.workflowState }}
                    </span>
                    <span v-else class="text-sm text-muted-foreground">—</span>
                  </TableCell>
                  <TableCell>
                    <span v-if="request.assignedTo" class="text-sm">
                      {{ request.assignedTo }}
                    </span>
                    <span v-else class="text-sm text-muted-foreground">Unassigned</span>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-sm">
                    {{ formatDate(request.submittedAt) }}
                  </TableCell>
                  <TableCell @click.stop>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="handleViewRequest(request)"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow v-if="filteredRequests.length === 0">
                  <TableCell colspan="8" class="text-center py-8 text-muted-foreground">
                    No {{ tab }} requests found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <OnboardingRequestDialog
      :open="isRequestDialogOpen"
      :request="selectedRequest"
      @update:open="handleDialogClose"
    />
  </div>
</template>
