export interface Company {
  id: number
  // Basic info (displayed in table)
  name: string
  email: string
  subscription: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'pending'
  users: number
  createdAt: string
  // Company Details (Step 1)
  phone?: string
  website?: string
  industry?: string
  companySize?: string
  // Subscription & Billing (Step 2)
  billingCycle?: 'monthly' | 'annually'
  billingEmail?: string
  billingAddress?: string
  billingCity?: string
  billingCountry?: string
  // Admin Account (Step 3)
  adminFirstName?: string
  adminLastName?: string
  adminEmail?: string
  adminPhone?: string
  adminRole?: string
  sendWelcomeEmail?: boolean
}

export interface CompanyFormValues {
  // Step 1: Company Details
  companyName: string
  companyEmail: string
  phone: string
  website: string
  industry: string
  companySize: string
  // Step 2: Subscription & Billing
  subscriptionTier: string
  billingCycle: string
  billingEmail: string
  billingAddress: string
  billingCity: string
  billingCountry: string
  // Step 3: Admin Account
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminPhone: string
  adminRole: string
  sendWelcomeEmail: boolean
}
