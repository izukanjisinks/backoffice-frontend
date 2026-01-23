export interface Company {
  id: number
  name: string
  email: string
  subscription: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'pending'
  users: number
  createdAt: string
}
