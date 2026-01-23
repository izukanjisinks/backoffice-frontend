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
import { Textarea } from '../ui/textarea'
import { useWorkflowStore } from '../../stores/workflow'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  created: [workflowId: string]
}>()

const workflowStore = useWorkflowStore()

const name = ref('')
const description = ref('')
const isSubmitting = ref(false)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    name.value = ''
    description.value = ''
  }
})

function handleClose() {
  emit('update:open', false)
}

function handleSubmit() {
  if (!name.value.trim()) return

  isSubmitting.value = true

  const workflowId = workflowStore.createWorkflow(
    name.value.trim(),
    description.value.trim()
  )

  isSubmitting.value = false
  emit('created', workflowId)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogDescription>
          Create a new state machine workflow. You can add states and transitions after creation.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="name">Workflow Name</Label>
          <Input
            id="name"
            v-model="name"
            placeholder="e.g., Company Onboarding"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="description"
            placeholder="Describe what this workflow is for..."
            rows="3"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleClose">
            Cancel
          </Button>
          <Button type="submit" :disabled="!name.trim() || isSubmitting">
            Create Workflow
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
