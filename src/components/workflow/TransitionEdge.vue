<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'
import { X } from 'lucide-vue-next'

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
  }
  markerEnd?: string
}>()

const emit = defineEmits<{
  updateLabel: [edgeId: string, name: string]
  delete: [edgeId: string]
}>()

const isEditing = ref(false)
const editName = ref('')

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
  isEditing.value = true
}

function saveEditing() {
  emit('updateLabel', props.id, editName.value)
  isEditing.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveEditing()
  } else if (event.key === 'Escape') {
    isEditing.value = false
  }
}
</script>

<template>
  <BaseEdge :id="id" :path="path" :marker-end="markerEnd" />
  <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
      }"
      class="nodrag nopan"
    >
      <!-- View Mode -->
      <div
        v-if="!isEditing"
        class="group flex items-center gap-1"
      >
        <div
          class="px-2 py-1 rounded bg-slate-700 text-white text-xs font-medium cursor-pointer hover:bg-slate-600 shadow-md"
          @click="startEditing"
        >
          {{ data?.name || 'Unnamed' }}
        </div>
        <button
          class="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          @click.stop="emit('delete', id)"
        >
          <X class="w-2.5 h-2.5" />
        </button>
      </div>

      <!-- Edit Mode -->
      <div v-else class="flex items-center gap-1">
        <input
          v-model="editName"
          type="text"
          class="px-2 py-1 text-xs rounded border border-slate-400 bg-white text-slate-900 focus:outline-none focus:border-blue-500 w-32"
          placeholder="Transition name"
          autofocus
          @keydown="handleKeydown"
          @blur="saveEditing"
        />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>
