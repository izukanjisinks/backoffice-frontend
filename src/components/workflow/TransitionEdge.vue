<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'
import { X, Pencil, Check } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useUserStore } from '../../stores/user'

const props = defineProps<{
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: string
  targetPosition: string
  data: {
    name: string
    assignedTo: string
  }
  markerEnd?: string
}>()

const emit = defineEmits<{
  updateLabel: [edgeId: string, name: string, assignedTo: string]
  delete: [edgeId: string]
}>()

const userStore = useUserStore()

const isEditing = ref(false)
const editName = ref('')
const editAssignedTo = ref('')

const path = computed(() => {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition as any,
    targetPosition: props.targetPosition as any,
  })
  return edgePath
})

const labelX = computed(() => (props.sourceX + props.targetX) / 2)
const labelY = computed(() => (props.sourceY + props.targetY) / 2)


function startEditing() {
  editName.value = props.data?.name || ''
  editAssignedTo.value = props.data?.assignedTo || 'unassigned'
  isEditing.value = true
}

function saveEditing() {
  const assignedTo = editAssignedTo.value === 'unassigned' ? '' : editAssignedTo.value
  emit('updateLabel', props.id, editName.value, assignedTo)
  isEditing.value = false
}

function cancelEditing() {
  isEditing.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveEditing()
  } else if (event.key === 'Escape') {
    cancelEditing()
  }
}
</script>

<template>
  <g>
    <BaseEdge :id="id" :path="path" :marker-end="markerEnd" />
    <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
        zIndex: isEditing ? 9999 : 1,
      }"
      class="nodrag nopan"
    >
      <!-- View Mode -->
      <div
        v-if="!isEditing"
        class="group flex items-center gap-1"
      >
        <div
          class="px-3 py-2 rounded-lg bg-slate-700 text-white text-xs font-medium cursor-pointer hover:bg-slate-600 shadow-lg border border-slate-600 transition-all min-w-[120px]"
          @click="startEditing"
        >
          <div class="font-semibold">{{ data?.name || 'Unnamed' }}</div>
          <div class="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
            <span class="text-slate-400">→</span>
            <span :class="!data?.assignedTo ? 'text-slate-400 italic' : ''">
              {{ data?.assignedTo || 'Unassigned' }}
            </span>
          </div>
        </div>
        <button
          class="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          @click.stop="emit('delete', id)"
        >
          <X class="w-3 h-3" />
        </button>
        <button
          class="w-5 h-5 rounded-full bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          @click.stop="startEditing"
        >
          <Pencil class="w-3 h-3" />
        </button>
      </div>

      <!-- Edit Mode -->
      <div
        v-else
        class="bg-white dark:bg-slate-800 p-3 rounded-lg border-2 border-slate-400 dark:border-slate-600 shadow-xl min-w-[280px]"
        @click.stop
      >
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
              Transition Name
            </label>
            <input
              v-model="editName"
              type="text"
              class="w-full px-3 py-2 text-sm rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              placeholder="e.g., Submit Application"
              autofocus
              @keydown="handleKeydown"
            />
          </div>

          <div>
            <label class="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
              Assigned To
            </label>
            <Select v-model="editAssignedTo">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Assign to user" />
              </SelectTrigger>
              <SelectContent class="z-[10000]">
                <SelectGroup>
                  <SelectLabel>Users</SelectLabel>
                  <SelectItem value="unassigned">
                    <span class="text-muted-foreground">Unassigned</span>
                  </SelectItem>
                  <SelectItem
                    v-for="user in userStore.activeUsers"
                    :key="user.id"
                    :value="user.name"
                  >
                    {{ user.name }} <span class="text-muted-foreground">({{ user.role }})</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex gap-2 pt-1">
            <button
              class="flex-1 px-3 py-2 text-xs font-medium rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-white flex items-center justify-center gap-1 transition-colors"
              @click.stop="cancelEditing"
            >
              Cancel
            </button>
            <button
              class="flex-1 px-3 py-2 text-xs font-medium rounded-md bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300 flex items-center justify-center gap-1 transition-colors"
              @click.stop="saveEditing"
            >
              <Check class="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </EdgeLabelRenderer>
  </g>
</template>
