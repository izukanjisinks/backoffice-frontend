import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SubscriptionFeature {
  id: string
  name: string
  enabled: boolean
  limit?: number | null
}

export interface Subscription {
  id: string
  name: string
  description: string
  price: number
  billingPeriod: 'month' | 'year'
  isActive: boolean
  features: SubscriptionFeature[]
  order: number
  updatedAt: string
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref<Subscription[]>([
    {
      id: '1',
      name: 'Basic',
      description: 'Perfect for small teams getting started',
      price: 29,
      billingPeriod: 'month',
      isActive: true,
      order: 1,
      features: [
        { id: 'f1', name: 'Create Companies', enabled: true },
        { id: 'f2', name: 'Manage Workflows', enabled: true, limit: 2 },
        { id: 'f3', name: 'User Accounts', enabled: true, limit: 5 },
        { id: 'f4', name: 'Document Storage (GB)', enabled: true, limit: 10 },
        { id: 'f5', name: 'API Access', enabled: false },
        { id: 'f6', name: 'Custom Branding', enabled: false },
        { id: 'f7', name: 'Advanced Analytics', enabled: false },
        { id: 'f8', name: 'Priority Support', enabled: false },
      ],
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Professional',
      description: 'For growing businesses with advanced needs',
      price: 79,
      billingPeriod: 'month',
      isActive: true,
      order: 2,
      features: [
        { id: 'f1', name: 'Create Companies', enabled: true },
        { id: 'f2', name: 'Manage Workflows', enabled: true, limit: 10 },
        { id: 'f3', name: 'User Accounts', enabled: true, limit: 25 },
        { id: 'f4', name: 'Document Storage (GB)', enabled: true, limit: 100 },
        { id: 'f5', name: 'API Access', enabled: true },
        { id: 'f6', name: 'Custom Branding', enabled: true },
        { id: 'f7', name: 'Advanced Analytics', enabled: false },
        { id: 'f8', name: 'Priority Support', enabled: false },
      ],
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'Unlimited power for large organizations',
      price: 199,
      billingPeriod: 'month',
      isActive: true,
      order: 3,
      features: [
        { id: 'f1', name: 'Create Companies', enabled: true },
        { id: 'f2', name: 'Manage Workflows', enabled: true, limit: null },
        { id: 'f3', name: 'User Accounts', enabled: true, limit: null },
        { id: 'f4', name: 'Document Storage (GB)', enabled: true, limit: null },
        { id: 'f5', name: 'API Access', enabled: true },
        { id: 'f6', name: 'Custom Branding', enabled: true },
        { id: 'f7', name: 'Advanced Analytics', enabled: true },
        { id: 'f8', name: 'Priority Support', enabled: true },
      ],
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ])

  function getSubscriptionById(id: string): Subscription | undefined {
    return subscriptions.value.find(s => s.id === id)
  }

  function updateSubscription(id: string, updates: Partial<Subscription>) {
    const subscription = subscriptions.value.find(s => s.id === id)
    if (subscription) {
      Object.assign(subscription, updates)
      subscription.updatedAt = new Date().toISOString()
    }
  }

  function updateSubscriptionFeature(
    subscriptionId: string,
    featureId: string,
    updates: Partial<SubscriptionFeature>
  ) {
    const subscription = subscriptions.value.find(s => s.id === subscriptionId)
    if (subscription) {
      const feature = subscription.features.find(f => f.id === featureId)
      if (feature) {
        Object.assign(feature, updates)
        subscription.updatedAt = new Date().toISOString()
      }
    }
  }

  function toggleSubscriptionActive(id: string) {
    const subscription = subscriptions.value.find(s => s.id === id)
    if (subscription) {
      subscription.isActive = !subscription.isActive
      subscription.updatedAt = new Date().toISOString()
    }
  }

  return {
    subscriptions,
    getSubscriptionById,
    updateSubscription,
    updateSubscriptionFeature,
    toggleSubscriptionActive,
  }
})
