<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { useWorkflowStore, type StateNode as StateNodeType, type StateType } from '../../stores/workflow'
import StateNode from './StateNode.vue'
import TransitionEdge from './TransitionEdge.vue'
import NodePalette from './NodePalette.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

const workflowStore = useWorkflowStore()
const vueFlowRef = ref<HTMLElement | null>(null)

const { onNodesChange, onEdgesChange, onConnect, addEdges, project } = useVueFlow()

onNodesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'position' && change.position) {
      workflowStore.updateNode(change.id, { position: change.position })
    }
  })
})

onEdgesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'remove') {
      workflowStore.removeEdge(change.id)
    }
  })
})

onConnect((params) => {
  const newEdge = {
    id: `e${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    type: 'transition',
    markerEnd: MarkerType.ArrowClosed,
    data: { name: 'New Transition' },
  }
  addEdges([newEdge])
  workflowStore.addEdge({
    id: newEdge.id,
    source: params.source,
    target: params.target,
    data: { name: 'New Transition' },
  })
})

function getNodeColor(node: { data: { stateType: StateType } }) {
  switch (node.data.stateType) {
    case 'initial':
      return '#10b981'
    case 'final':
      return '#ef4444'
    default:
      return '#3b82f6'
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(event: DragEvent) {
  if (!event.dataTransfer) return

  const nodeType = event.dataTransfer.getData('application/vueflow')
  if (nodeType !== 'state') return

  const bounds = vueFlowRef.value?.getBoundingClientRect()
  if (!bounds) return

  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  })

  const newNode: StateNodeType = {
    id: workflowStore.nextNodeId,
    type: 'state',
    position,
    data: {
      name: 'New State',
      stateType: 'middle',
      displayOrder: workflowStore.nextDisplayOrder,
    },
  }

  workflowStore.addNode(newNode)
}

function handleDeleteNode(nodeId: string) {
  workflowStore.removeNode(nodeId)
}

function handleUpdateNodeData(nodeId: string, data: { name?: string; stateType?: StateType; displayOrder?: number }) {
  console.log('[WorkflowEditor] handleUpdateNodeData called')
  console.log('[WorkflowEditor] nodeId:', nodeId)
  console.log('[WorkflowEditor] data:', data)
  console.log('[WorkflowEditor] nodes before update:', JSON.parse(JSON.stringify(workflowStore.nodes)))
  workflowStore.updateNodeData(nodeId, data)
  console.log('[WorkflowEditor] nodes after update:', JSON.parse(JSON.stringify(workflowStore.nodes)))
}

function handleUpdateTransitionLabel(edgeId: string, name: string) {
  workflowStore.updateEdgeData(edgeId, { name })
}

function handleDeleteTransition(edgeId: string) {
  workflowStore.removeEdge(edgeId)
}

// Add marker end to edges for display
const edgesWithMarkers = computed(() =>
  workflowStore.edges.map(edge => ({
    ...edge,
    type: 'transition',
    markerEnd: MarkerType.ArrowClosed,
  }))
)
</script>

<template>
  <div class="flex h-[600px] w-full border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
    <!-- Node Palette Sidebar -->
    <div class="w-52 border-r bg-white dark:bg-slate-800 flex-shrink-0 overflow-y-auto">
      <NodePalette />
    </div>

    <!-- Vue Flow Canvas -->
    <div
      ref="vueFlowRef"
      class="flex-1"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <VueFlow
        :nodes="workflowStore.nodes"
        :edges="edgesWithMarkers"
        :default-viewport="{ zoom: 1, x: 0, y: 50 }"
        :min-zoom="0.5"
        :max-zoom="2"
        fit-view-on-init
        class="vue-flow-wrapper"
      >
        <template #node-state="props">
          <StateNode
            :id="props.id"
            :data="props.data"
            @delete="handleDeleteNode"
            @update-data="handleUpdateNodeData"
          />
        </template>

        <template #edge-transition="props">
          <TransitionEdge
            v-bind="props"
            @update-label="handleUpdateTransitionLabel"
            @delete="handleDeleteTransition"
          />
        </template>

        <Background pattern-color="#94a3b8" :gap="20" />
        <Controls position="top-right" />
        <MiniMap :node-color="getNodeColor" position="bottom-left" />
      </VueFlow>
    </div>
  </div>
</template>

<style>
.vue-flow-wrapper {
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
}

.dark .vue-flow-wrapper {
  background: linear-gradient(to bottom right, #0f172a, #1e293b);
}

.vue-flow__edge-path {
  stroke: #64748b;
  stroke-width: 2;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #3b82f6;
}
</style>
