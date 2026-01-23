<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { GitBranch, Play, Pause, Save } from 'lucide-vue-next'
import WorkflowEditor from '../../components/workflow/WorkflowEditor.vue'
import { useWorkflowStore } from '../../stores/workflow'

const workflowStore = useWorkflowStore()

function handleSave() {
  console.log('Saving workflow...', {
    name: workflowStore.workflowName,
    nodes: workflowStore.nodes,
    edges: workflowStore.edges,
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Workflow</h2>
        <p class="text-muted-foreground">Configure your company onboarding state machine</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Switch
            :checked="workflowStore.isActive"
            @update:checked="workflowStore.toggleActive()"
          />
          <Label>{{ workflowStore.isActive ? 'Active' : 'Inactive' }}</Label>
        </div>
        <Button @click="handleSave">
          <Save class="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2">
              <GitBranch class="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{{ workflowStore.workflowName }}</CardTitle>
              <CardDescription>{{ workflowStore.workflowDescription }}</CardDescription>
            </div>
          </div>
          <Badge :variant="workflowStore.isActive ? 'default' : 'secondary'">
            <component :is="workflowStore.isActive ? Play : Pause" class="mr-1 h-3 w-3" />
            {{ workflowStore.isActive ? 'Running' : 'Paused' }}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <WorkflowEditor />

        <div class="mt-6 grid grid-cols-3 gap-4">
          <Card class="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
            <CardContent class="pt-4">
              <div class="flex items-center gap-2">
                <div class="rounded-full w-3 h-3 bg-emerald-500" />
                <span class="text-sm font-medium">Initial State</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">Entry point of the workflow</p>
            </CardContent>
          </Card>
          <Card class="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent class="pt-4">
              <div class="flex items-center gap-2">
                <div class="rounded-full w-3 h-3 bg-blue-500" />
                <span class="text-sm font-medium">Middle State</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">Intermediate processing steps</p>
            </CardContent>
          </Card>
          <Card class="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardContent class="pt-4">
              <div class="flex items-center gap-2">
                <div class="rounded-full w-3 h-3 bg-red-500" />
                <span class="text-sm font-medium">Final State</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">End points of the workflow</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
