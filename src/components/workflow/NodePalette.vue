<script setup lang="ts">
import { Circle, Info } from 'lucide-vue-next'

function onDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', 'state')
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div>
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Add State</h3>
      <p class="text-xs text-muted-foreground mt-1">Drag to add a new state</p>
    </div>

    <!-- Draggable State Node -->
    <div
      class="flex items-center gap-2 p-3 rounded-lg bg-blue-500 border-2 border-blue-600 cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
      draggable="true"
      @dragstart="onDragStart"
    >
      <div class="rounded-full w-8 h-8 flex items-center justify-center bg-white/20">
        <Circle class="w-4 h-4 text-white" />
      </div>
      <div class="text-white">
        <div class="text-xs font-semibold">New State</div>
        <div class="text-[10px] opacity-80">Drag to canvas</div>
      </div>
    </div>

    <!-- Legend -->
    <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
        <Info class="w-3 h-3" />
        State Types
      </h4>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-xs text-slate-600 dark:text-slate-400">Initial State</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-xs text-slate-600 dark:text-slate-400">Middle State</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="text-xs text-slate-600 dark:text-slate-400">Final State</span>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Instructions</h4>
      <ul class="text-xs text-slate-500 dark:text-slate-500 space-y-1">
        <li>• Drag state to canvas</li>
        <li>• Click edit icon to modify</li>
        <li>• Connect states for transitions</li>
        <li>• Click transition label to edit</li>
      </ul>
    </div>
  </div>
</template>
