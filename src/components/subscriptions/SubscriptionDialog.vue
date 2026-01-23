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
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { useSubscriptionStore, type Subscription, type SubscriptionFeature } from '../../stores/subscription'

const props = defineProps<{
  open: boolean
  subscription: Subscription | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const subscriptionStore = useSubscriptionStore()

const editName = ref('')
const editDescription = ref('')
const editPrice = ref(0)
const editFeatures = ref<SubscriptionFeature[]>([])

watch(() => props.subscription, (subscription) => {
  if (subscription) {
    editName.value = subscription.name
    editDescription.value = subscription.description
    editPrice.value = subscription.price
    editFeatures.value = JSON.parse(JSON.stringify(subscription.features))
  }
}, { immediate: true })

function handleClose() {
  emit('update:open', false)
}

function handleSave() {
  if (!props.subscription) return

  subscriptionStore.updateSubscription(props.subscription.id, {
    name: editName.value,
    description: editDescription.value,
    price: editPrice.value,
    features: editFeatures.value,
  })

  emit('update:open', false)
}

function toggleFeature(featureId: string) {
  const feature = editFeatures.value.find(f => f.id === featureId)
  if (feature) {
    feature.enabled = !feature.enabled
  }
}

function updateFeatureLimit(featureId: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  const feature = editFeatures.value.find(f => f.id === featureId)
  if (feature) {
    if (value === '' || value === 'unlimited') {
      feature.limit = null
    } else {
      const numValue = parseInt(value)
      feature.limit = isNaN(numValue) ? 0 : numValue
    }
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Configure {{ subscription?.name }} Subscription</DialogTitle>
        <DialogDescription>
          Adjust subscription details and enable/disable features for this tier.
        </DialogDescription>
      </DialogHeader>

      <div v-if="subscription" class="space-y-6 py-4">
        <!-- Basic Info -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Subscription Name</Label>
            <Input
              id="name"
              v-model="editName"
              placeholder="e.g., Professional"
            />
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Input
              id="description"
              v-model="editDescription"
              placeholder="Brief description of this tier"
            />
          </div>

          <div class="space-y-2">
            <Label for="price">Price (per {{ subscription.billingPeriod }})</Label>
            <div class="flex items-center gap-2">
              <span class="text-2xl">$</span>
              <Input
                id="price"
                v-model.number="editPrice"
                type="number"
                min="0"
                step="1"
                class="max-w-[150px]"
              />
            </div>
          </div>
        </div>

        <Separator />

        <!-- Features Configuration -->
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-3">Features & Actions</h4>
            <p class="text-sm text-muted-foreground mb-4">
              Configure what features and actions are available in this subscription tier.
            </p>
          </div>

          <div class="space-y-3">
            <div
              v-for="feature in editFeatures"
              :key="feature.id"
              class="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div class="flex items-center gap-3 flex-1">
                <Switch
                  :checked="feature.enabled"
                  @update:checked="toggleFeature(feature.id)"
                />
                <span
                  class="text-sm font-medium"
                  :class="!feature.enabled && 'text-muted-foreground'"
                >
                  {{ feature.name }}
                </span>
              </div>

              <div v-if="feature.enabled && feature.limit !== undefined" class="flex items-center gap-2">
                <Label :for="`limit-${feature.id}`" class="text-xs text-muted-foreground">
                  Limit:
                </Label>
                <Input
                  :id="`limit-${feature.id}`"
                  :value="feature.limit === null ? 'unlimited' : feature.limit"
                  type="text"
                  placeholder="unlimited"
                  class="w-28 h-8 text-xs"
                  @input="updateFeatureLimit(feature.id, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button type="button" @click="handleSave">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
