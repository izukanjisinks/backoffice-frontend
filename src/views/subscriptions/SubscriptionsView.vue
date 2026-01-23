<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Check, X, Settings, Crown, Zap, Building2 } from 'lucide-vue-next'
import { useSubscriptionStore, type Subscription } from '../../stores/subscription'
import SubscriptionDialog from '../../components/subscriptions/SubscriptionDialog.vue'

const subscriptionStore = useSubscriptionStore()

const isEditDialogOpen = ref(false)
const selectedSubscription = ref<Subscription | null>(null)

function handleEditSubscription(subscription: Subscription) {
  selectedSubscription.value = subscription
  isEditDialogOpen.value = true
}

function handleDialogClose() {
  isEditDialogOpen.value = false
  selectedSubscription.value = null
}

function formatPrice(price: number, period: 'month' | 'year'): string {
  return `$${price}/${period}`
}

function getSubscriptionIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'basic':
      return Zap
    case 'professional':
      return Crown
    case 'enterprise':
      return Building2
    default:
      return Zap
  }
}

function getSubscriptionColor(name: string) {
  switch (name.toLowerCase()) {
    case 'basic':
      return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    case 'professional':
      return 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
    case 'enterprise':
      return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
    default:
      return 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Subscriptions</h2>
        <p class="text-muted-foreground">Configure subscription tiers and features</p>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <Card
          v-for="subscription in subscriptionStore.subscriptions"
          :key="subscription.id"
          :class="getSubscriptionColor(subscription.name)"
          class="relative w-full max-w-sm"
        >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-background p-2 shadow-sm">
                <component
                  :is="getSubscriptionIcon(subscription.name)"
                  class="h-6 w-6 text-primary"
                />
              </div>
              <div>
                <CardTitle>{{ subscription.name }}</CardTitle>
                <CardDescription class="mt-1">{{ subscription.description }}</CardDescription>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-bold">${{ subscription.price }}</span>
              <span class="text-muted-foreground">/{{ subscription.billingPeriod }}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div class="space-y-2">
            <div
              v-for="feature in subscription.features"
              :key="feature.id"
              class="flex items-start gap-2 text-sm"
            >
              <component
                :is="feature.enabled ? Check : X"
                :class="feature.enabled ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'"
                class="h-4 w-4 mt-0.5 flex-shrink-0"
              />
              <span :class="!feature.enabled && 'text-muted-foreground line-through'">
                {{ feature.name }}
                <span v-if="feature.enabled && feature.limit !== undefined" class="font-medium">
                  {{ feature.limit === null ? '(Unlimited)' : `(${feature.limit})` }}
                </span>
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
          <div class="flex items-center justify-between w-full">
            <span class="text-sm text-muted-foreground">Status</span>
            <div class="flex items-center gap-2">
              <Switch
                :checked="subscription.isActive"
                @update:checked="subscriptionStore.toggleSubscriptionActive(subscription.id)"
              />
              <Badge :variant="subscription.isActive ? 'default' : 'secondary'">
                {{ subscription.isActive ? 'Active' : 'Inactive' }}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            class="w-full"
            @click="handleEditSubscription(subscription)"
          >
            <Settings class="mr-2 h-4 w-4" />
            Configure Features
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>

    <SubscriptionDialog
      :open="isEditDialogOpen"
      :subscription="selectedSubscription"
      @update:open="handleDialogClose"
    />
  </div>
</template>
