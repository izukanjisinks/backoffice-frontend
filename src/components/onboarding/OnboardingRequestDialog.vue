<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Check, X, User, Mail, Phone, Globe, Calendar, FileText } from 'lucide-vue-next'
import { useOnboardingStore, type OnboardingRequest } from '../../stores/onboarding'
import { useUserStore } from '../../stores/user'

const props = defineProps<{
  open: boolean
  request: OnboardingRequest | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const onboardingStore = useOnboardingStore()
const userStore = useUserStore()

const notes = ref('')
const assignedTo = ref('')

watch(() => props.request, (request) => {
  if (request) {
    notes.value = request.notes || ''
    assignedTo.value = request.assignedTo || ''
  }
}, { immediate: true })

function handleClose() {
  emit('update:open', false)
}

function handleApprove() {
  if (!props.request) return
  onboardingStore.updateRequestStatus(props.request.id, 'approved', notes.value, assignedTo.value)
  emit('update:open', false)
}

function handleReject() {
  if (!props.request) return
  onboardingStore.updateRequestStatus(props.request.id, 'rejected', notes.value, assignedTo.value)
  emit('update:open', false)
}

function handleStartReview() {
  if (!props.request) return
  onboardingStore.updateRequestStatus(props.request.id, 'reviewing', notes.value, assignedTo.value)
  emit('update:open', false)
}

function handleUpdateAssignment() {
  if (!props.request) return
  onboardingStore.assignRequest(props.request.id, assignedTo.value)
}

function handleUpdateNotes() {
  if (!props.request) return
  onboardingStore.addNotes(props.request.id, notes.value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'reviewing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Onboarding Request Details</DialogTitle>
        <DialogDescription>
          Review and manage this company onboarding application.
        </DialogDescription>
      </DialogHeader>

      <div v-if="request" class="space-y-6 py-4">
        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <Badge :class="getStatusColor(request.status)" class="capitalize">
            {{ request.status }}
          </Badge>
          <Badge v-if="request.workflowState" variant="outline">
            In Workflow: {{ request.workflowState }}
          </Badge>
        </div>

        <Separator />

        <!-- Company Information -->
        <div class="space-y-4">
          <h4 class="text-sm font-semibold">Company Information</h4>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label class="text-xs text-muted-foreground flex items-center gap-2">
                <User class="h-3 w-3" />
                Company Name
              </Label>
              <p class="text-sm font-medium">{{ request.companyName }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-xs text-muted-foreground flex items-center gap-2">
                <User class="h-3 w-3" />
                Contact Person
              </Label>
              <p class="text-sm font-medium">{{ request.contactPerson }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-xs text-muted-foreground flex items-center gap-2">
                <Mail class="h-3 w-3" />
                Email
              </Label>
              <p class="text-sm">{{ request.email }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-xs text-muted-foreground flex items-center gap-2">
                <Phone class="h-3 w-3" />
                Phone
              </Label>
              <p class="text-sm">{{ request.phone }}</p>
            </div>

            <div v-if="request.website" class="space-y-2 col-span-2">
              <Label class="text-xs text-muted-foreground flex items-center gap-2">
                <Globe class="h-3 w-3" />
                Website
              </Label>
              <a :href="request.website" target="_blank" class="text-sm text-primary hover:underline">
                {{ request.website }}
              </a>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Timeline -->
        <div class="space-y-4">
          <h4 class="text-sm font-semibold">Timeline</h4>

          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">Submitted:</span>
              <span class="font-medium">{{ formatDate(request.submittedAt) }}</span>
            </div>

            <div v-if="request.reviewedAt" class="flex items-center gap-2 text-sm">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">Reviewed:</span>
              <span class="font-medium">{{ formatDate(request.reviewedAt) }}</span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Assignment -->
        <div class="space-y-4">
          <h4 class="text-sm font-semibold">Assignment</h4>

          <div class="flex items-end gap-2">
            <div class="flex-1 space-y-2">
              <Label for="assignedTo">Assigned To</Label>
              <Select v-model="assignedTo">
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    <SelectItem
                      v-for="user in userStore.activeUsers"
                      :key="user.id"
                      :value="user.name"
                    >
                      {{ user.name }} <span class="text-muted-foreground">({{ user.role }})</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" @click="handleUpdateAssignment">
              Update
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Notes -->
        <div class="space-y-4">
          <h4 class="text-sm font-semibold flex items-center gap-2">
            <FileText class="h-4 w-4" />
            Notes
          </h4>

          <div class="space-y-2">
            <Textarea
              v-model="notes"
              placeholder="Add notes about this request..."
              rows="4"
            />
            <Button variant="outline" size="sm" @click="handleUpdateNotes">
              Save Notes
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter class="flex gap-2">
        <Button type="button" variant="outline" @click="handleClose">
          Close
        </Button>
        <div class="flex gap-2">
          <Button
            v-if="request?.status === 'pending'"
            type="button"
            variant="default"
            @click="handleStartReview"
          >
            Start Review
          </Button>
          <Button
            v-if="request?.status !== 'rejected' && request?.status !== 'approved'"
            type="button"
            variant="destructive"
            @click="handleReject"
          >
            <X class="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            v-if="request?.status !== 'approved'"
            type="button"
            @click="handleApprove"
          >
            <Check class="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
