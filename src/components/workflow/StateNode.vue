<script setup lang="ts">
import { ref, computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Circle, X, Pencil, Check } from 'lucide-vue-next'
import type { StateType } from '../../stores/workflow'

const props = defineProps<{
  id: string
  data: {
    name: string
    stateType: StateType
    displayOrder: number
  }
}>()

const emit = defineEmits<{
  delete: [nodeId: string]
  updateData: [nodeId: string, data: { name?: string; stateType?: StateType; displayOrder?: number }]
}>()

const isEditing = ref(false)
const editName = ref(props.data.name)
const editStateType = ref(props.data.stateType)
const editDisplayOrder = ref(props.data.displayOrder)

const stateTypeColor = computed(() => {
  switch (props.data.stateType) {
    case 'initial':
      return 'bg-emerald-500 border-emerald-600'
    case 'final':
      return 'bg-red-500 border-red-600'
    default:
      return 'bg-blue-500 border-blue-600'
  }
})

const stateTypeLabel = computed(() => {
  switch (props.data.stateType) {
    case 'initial':
      return 'Initial'
    case 'final':
      return 'Final'
    default:
      return 'Middle'
  }
})

function startEditing() {
  editName.value = props.data.name
  editStateType.value = props.data.stateType
  editDisplayOrder.value = props.data.displayOrder
  isEditing.value = true
}

function saveEditing() {
  const updatePayload = {
    name: editName.value,
    stateType: editStateType.value,
    displayOrder: editDisplayOrder.value,
  }
  console.log('[StateNode] Saving edit for node:', props.id)
  console.log('[StateNode] Update payload:', updatePayload)
  emit('updateData', props.id, updatePayload)
  isEditing.value = false
}

function cancelEditing() {
  isEditing.value = false
}
</script>

<template>
  <div
    :class="[stateTypeColor]"
    class="group relative px-4 py-3 shadow-md rounded-lg border-2 min-w-[200px]"
  >
    <!-- Delete button -->
    <button
      class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
      @click.stop="emit('delete', id)"
    >
      <X class="w-3 h-3" />
    </button>

    <!-- Edit button -->
    <button
      v-if="!isEditing"
      class="absolute -top-2 right-5 w-5 h-5 rounded-full bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
      @click.stop="startEditing"
    >
      <Pencil class="w-3 h-3" />
    </button>

    <!-- Input handle (not for initial states) -->
    <Handle
      v-if="data.stateType !== 'initial'"
      type="target"
      :position="Position.Top"
      class="w-3 h-3 !bg-slate-700"
    />

    <!-- View Mode -->
    <div v-if="!isEditing" class="flex items-center gap-2">
      <div class="rounded-full w-8 h-8 flex items-center justify-center bg-white/20">
        <Circle class="w-4 h-4 text-white" />
      </div>
      <div class="text-white">
        <div class="text-xs font-medium uppercase tracking-wide opacity-80">
          {{ stateTypeLabel }} State (#{{ data.displayOrder }})
        </div>
        <div class="text-sm font-semibold">{{ data.name }}</div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-2" @click.stop>
      <div>
        <label class="text-xs text-white/80 block mb-1">Name</label>
        <input
          v-model="editName"
          type="text"
          class="w-full px-2 py-1 text-sm rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-xs text-white/80 block mb-1">Type</label>
          <select
            v-model="editStateType"
            class="w-full px-2 py-1 text-sm rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          >
            <option value="initial" class="text-slate-900">Initial</option>
            <option value="middle" class="text-slate-900">Middle</option>
            <option value="final" class="text-slate-900">Final</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-white/80 block mb-1">Order</label>
          <input
            v-model.number="editDisplayOrder"
            type="number"
            min="1"
            class="w-full px-2 py-1 text-sm rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>
      </div>
      <div class="flex gap-2 pt-1">
        <button
          class="flex-1 px-2 py-1 text-xs rounded bg-white/20 hover:bg-white/30 text-white flex items-center justify-center gap-1"
          @click.stop="cancelEditing"
        >
          Cancel
        </button>
        <button
          class="flex-1 px-2 py-1 text-xs rounded bg-white text-slate-900 hover:bg-white/90 flex items-center justify-center gap-1"
          @click.stop="saveEditing"
        >
          <Check class="w-3 h-3" />
          Save
        </button>
      </div>
    </div>

    <!-- Output handle (not for final states) -->
    <Handle
      v-if="data.stateType !== 'final'"
      type="source"
      :position="Position.Bottom"
      class="w-3 h-3 !bg-slate-700"
    />
  </div>
</template>
