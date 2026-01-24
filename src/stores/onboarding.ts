import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type OnboardingStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

export interface OnboardingRequest {
  id: string
  // Company Details
  companyName: string
  email: string
  phone: string
  website?: string
  industry?: string
  companySize?: string
  // Contact Person (maps to admin)
  contactPerson: string
  contactEmail?: string
  contactPhone?: string
  contactRole?: string
  // Onboarding status tracking
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
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      website: 'https://acme.com',
      industry: 'Technology',
      companySize: '201-500',
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@acme.com',
      contactPhone: '+1 (555) 123-4568',
      contactRole: 'CEO',
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
      email: 'hello@techstart.io',
      phone: '+1 (555) 234-5678',
      website: 'https://techstart.io',
      industry: 'Technology',
      companySize: '11-50',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@techstart.io',
      contactPhone: '+1 (555) 234-5679',
      contactRole: 'CTO',
      status: 'reviewing',
      assignedTo: 'Manager User',
      submittedAt: '2024-01-21T10:15:00Z',
      notes: 'Awaiting additional documentation.',
    },
    {
      id: '3',
      companyName: 'Global Solutions Ltd',
      email: 'info@globalsolutions.com',
      phone: '+1 (555) 345-6789',
      website: '',
      industry: 'Consulting',
      companySize: '500+',
      contactPerson: 'Michael Chen',
      contactEmail: 'michael.chen@globalsolutions.com',
      contactPhone: '+1 (555) 345-6790',
      contactRole: 'Business Development Manager',
      status: 'pending',
      submittedAt: '2024-01-22T08:30:00Z',
    },
    {
      id: '4',
      companyName: 'Innovation Labs',
      email: 'info@innovationlabs.net',
      phone: '+1 (555) 456-7890',
      website: 'https://innovationlabs.net',
      industry: 'Technology',
      companySize: '51-200',
      contactPerson: 'Emily Rodriguez',
      contactEmail: 'emily@innovationlabs.net',
      contactPhone: '+1 (555) 456-7891',
      contactRole: 'Founder',
      status: 'approved',
      workflowState: 'Application Approval',
      workflowStateId: '3',
      assignedTo: 'Manager User',
      submittedAt: '2024-01-18T11:00:00Z',
      reviewedAt: '2024-01-18T16:45:00Z',
      notes: 'Fast-tracked for approval. All documents verified.',
    },
    {
      id: '5',
      companyName: 'Metro Enterprises',
      email: 'contact@metro-ent.com',
      phone: '+1 (555) 567-8901',
      website: '',
      industry: 'Manufacturing',
      companySize: '201-500',
      contactPerson: 'David Kim',
      contactEmail: 'david.kim@metro-ent.com',
      contactPhone: '+1 (555) 567-8902',
      contactRole: 'Operations Director',
      status: 'rejected',
      assignedTo: 'Admin User',
      submittedAt: '2024-01-19T13:20:00Z',
      reviewedAt: '2024-01-19T17:00:00Z',
      notes: 'Incomplete application. Missing required business licenses.',
    },
    {
      id: '6',
      companyName: 'CloudFirst Systems',
      email: 'admin@cloudfirst.io',
      phone: '+1 (555) 678-9012',
      website: 'https://cloudfirst.io',
      industry: 'Technology',
      companySize: '11-50',
      contactPerson: 'Lisa Anderson',
      contactEmail: 'lisa@cloudfirst.io',
      contactPhone: '+1 (555) 678-9013',
      contactRole: 'VP Sales',
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

  function deleteRequest(id: string) {
    const index = requests.value.findIndex(r => r.id === id)
    if (index !== -1) {
      requests.value.splice(index, 1)
      return true
    }
    return false
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
    deleteRequest,
  }
})
