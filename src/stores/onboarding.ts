import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type OnboardingStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

export interface OnboardingRequest {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  status: OnboardingStatus
  workflowState?: string
  workflowStateId?: string
  assignedTo?: string
  submittedAt: string
  reviewedAt?: string
  notes?: string
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const requests = ref<OnboardingRequest[]>([
    {
      id: '1',
      companyName: 'Acme Corporation',
      contactPerson: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      website: 'https://acme.com',
      status: 'approved',
      workflowState: 'Application Review',
      workflowStateId: '2',
      assignedTo: 'Admin User',
      submittedAt: '2024-01-20T09:00:00Z',
      reviewedAt: '2024-01-20T14:30:00Z',
      notes: 'Initial review completed. Documents pending.',
    },
    {
      id: '2',
      companyName: 'TechStart Inc.',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      phone: '+1 (555) 234-5678',
      website: 'https://techstart.io',
      status: 'reviewing',
      assignedTo: 'Manager User',
      submittedAt: '2024-01-21T10:15:00Z',
      notes: 'Awaiting additional documentation.',
    },
    {
      id: '3',
      companyName: 'Global Solutions Ltd',
      contactPerson: 'Michael Chen',
      email: 'michael.chen@globalsolutions.com',
      phone: '+1 (555) 345-6789',
      status: 'pending',
      submittedAt: '2024-01-22T08:30:00Z',
    },
    {
      id: '4',
      companyName: 'Innovation Labs',
      contactPerson: 'Emily Rodriguez',
      email: 'emily@innovationlabs.net',
      phone: '+1 (555) 456-7890',
      website: 'https://innovationlabs.net',
      status: 'approved',
      workflowState: 'Application Approval ',
      workflowStateId: '3',
      assignedTo: 'Manager User',
      submittedAt: '2024-01-18T11:00:00Z',
      reviewedAt: '2024-01-18T16:45:00Z',
      notes: 'Fast-tracked for approval. All documents verified.',
    },
    {
      id: '5',
      companyName: 'Metro Enterprises',
      contactPerson: 'David Kim',
      email: 'david.kim@metro-ent.com',
      phone: '+1 (555) 567-8901',
      status: 'rejected',
      assignedTo: 'Admin User',
      submittedAt: '2024-01-19T13:20:00Z',
      reviewedAt: '2024-01-19T17:00:00Z',
      notes: 'Incomplete application. Missing required business licenses.',
    },
    {
      id: '6',
      companyName: 'CloudFirst Systems',
      contactPerson: 'Lisa Anderson',
      email: 'lisa@cloudfirst.io',
      phone: '+1 (555) 678-9012',
      website: 'https://cloudfirst.io',
      status: 'pending',
      submittedAt: '2024-01-22T14:45:00Z',
    },
  ])

  const pendingRequests = computed(() =>
    requests.value.filter(r => r.status === 'pending')
  )

  const reviewingRequests = computed(() =>
    requests.value.filter(r => r.status === 'reviewing')
  )

  const approvedRequests = computed(() =>
    requests.value.filter(r => r.status === 'approved')
  )

  const rejectedRequests = computed(() =>
    requests.value.filter(r => r.status === 'rejected')
  )

  function getRequestById(id: string): OnboardingRequest | undefined {
    return requests.value.find(r => r.id === id)
  }

  function updateRequestStatus(
    id: string,
    status: OnboardingStatus,
    notes?: string,
    assignedTo?: string
  ) {
    const request = requests.value.find(r => r.id === id)
    if (request) {
      request.status = status
      if (notes !== undefined) request.notes = notes
      if (assignedTo !== undefined) request.assignedTo = assignedTo
      if (status !== 'pending') {
        request.reviewedAt = new Date().toISOString()
      }
    }
  }

  function updateWorkflowState(id: string, stateId: string, stateName: string) {
    const request = requests.value.find(r => r.id === id)
    if (request) {
      request.workflowStateId = stateId
      request.workflowState = stateName
    }
  }

  function assignRequest(id: string, assignedTo: string) {
    const request = requests.value.find(r => r.id === id)
    if (request) {
      request.assignedTo = assignedTo
    }
  }

  function addNotes(id: string, notes: string) {
    const request = requests.value.find(r => r.id === id)
    if (request) {
      request.notes = notes
    }
  }

  return {
    requests,
    pendingRequests,
    reviewingRequests,
    approvedRequests,
    rejectedRequests,
    getRequestById,
    updateRequestStatus,
    updateWorkflowState,
    assignRequest,
    addNotes,
  }
})
