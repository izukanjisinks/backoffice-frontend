<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { GitBranch, Plus, Play, Pause, MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import { useWorkflowStore, type Workflow } from '../../stores/workflow'
import WorkflowDialog from '../../components/workflow/WorkflowDialog.vue'

const router = useRouter()
const workflowStore = useWorkflowStore()

const isCreateDialogOpen = ref(false)

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function handleCreateWorkflow() {
  isCreateDialogOpen.value = true
}

function handleWorkflowCreated(workflowId: string) {
  isCreateDialogOpen.value = false
  router.push(`/workflows/${workflowId}`)
}

function handleEditWorkflow(workflow: Workflow) {
  router.push(`/workflows/${workflow.id}`)
}

function handleDeleteWorkflow(workflow: Workflow) {
  if (confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
    workflowStore.deleteWorkflow(workflow.id)
  }
}

function handleToggleActive(workflow: Workflow) {
  workflowStore.toggleWorkflowActive(workflow.id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Workflows</h2>
        <p class="text-muted-foreground">Manage your state machine workflows</p>
      </div>
      <Button @click="handleCreateWorkflow">
        <Plus class="mr-2 h-4 w-4" />
        Create Workflow
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-primary/10 p-2">
            <GitBranch class="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>All Workflows</CardTitle>
            <CardDescription>{{ workflowStore.workflows.length }} workflow(s) configured</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead class="text-center">States</TableHead>
              <TableHead class="text-center">Transitions</TableHead>
              <TableHead class="text-center">Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead class="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="workflow in workflowStore.workflows"
              :key="workflow.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="handleEditWorkflow(workflow)"
            >
              <TableCell class="font-medium">{{ workflow.name }}</TableCell>
              <TableCell class="text-muted-foreground max-w-[200px] truncate">
                {{ workflow.description }}
              </TableCell>
              <TableCell class="text-center">{{ workflow.nodes.length }}</TableCell>
              <TableCell class="text-center">{{ workflow.edges.length }}</TableCell>
              <TableCell class="text-center">
                <Badge :variant="workflow.isActive ? 'default' : 'secondary'">
                  <component :is="workflow.isActive ? Play : Pause" class="mr-1 h-3 w-3" />
                  {{ workflow.isActive ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ formatDate(workflow.updatedAt) }}
              </TableCell>
              <TableCell @click.stop>
                <div class="flex items-center gap-2">
                  <Switch
                    :checked="workflow.isActive"
                    @update:checked="handleToggleActive(workflow)"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEditWorkflow(workflow)">
                        <Pencil class="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        class="text-red-600"
                        @click="handleDeleteWorkflow(workflow)"
                      >
                        <Trash2 class="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="workflowStore.workflows.length === 0">
              <TableCell colspan="7" class="text-center py-8 text-muted-foreground">
                No workflows found. Create your first workflow to get started.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <WorkflowDialog
      :open="isCreateDialogOpen"
      @update:open="isCreateDialogOpen = $event"
      @created="handleWorkflowCreated"
    />
  </div>
</template>
