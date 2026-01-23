import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type StateType = 'initial' | 'middle' | 'final'

export interface StateNode {
  id: string
  type: 'state'
  position: { x: number; y: number }
  data: {
    name: string
    stateType: StateType
    displayOrder: number
  }
}

export interface Transition {
  id: string
  source: string
  target: string
  data: {
    name: string
  }
}

export const useWorkflowStore = defineStore('workflow', () => {
  // Single workflow with state nodes
  const nodes = ref<StateNode[]>([
    {
      id: '1',
      type: 'state',
      position: { x: 250, y: 0 },
      data: { name: 'New Company', stateType: 'initial', displayOrder: 1 },
    },
    {
      id: '2',
      type: 'state',
      position: { x: 250, y: 120 },
      data: { name: 'Documents Pending', stateType: 'middle', displayOrder: 2 },
    },
    {
      id: '3',
      type: 'state',
      position: { x: 250, y: 240 },
      data: { name: 'Under Review', stateType: 'middle', displayOrder: 3 },
    },
    {
      id: '4',
      type: 'state',
      position: { x: 100, y: 360 },
      data: { name: 'Rejected', stateType: 'final', displayOrder: 4 },
    },
    {
      id: '5',
      type: 'state',
      position: { x: 400, y: 360 },
      data: { name: 'Approved', stateType: 'final', displayOrder: 5 },
    },
  ])

  const edges = ref<Transition[]>([
    { id: 'e1-2', source: '1', target: '2', data: { name: 'Submit Application' } },
    { id: 'e2-3', source: '2', target: '3', data: { name: 'Documents Received' } },
    { id: 'e3-4', source: '3', target: '4', data: { name: 'Decline' } },
    { id: 'e3-5', source: '3', target: '5', data: { name: 'Approve' } },
  ])

  const workflowName = ref('Company Onboarding Workflow')
  const workflowDescription = ref('State machine for company onboarding process')
  const isActive = ref(true)

  // Get next display order
  const nextDisplayOrder = computed(() => {
    if (nodes.value.length === 0) return 1
    return Math.max(...nodes.value.map(n => n.data.displayOrder)) + 1
  })

  // Get next node ID
  const nextNodeId = computed(() => {
    if (nodes.value.length === 0) return '1'
    return String(Math.max(...nodes.value.map(n => parseInt(n.id))) + 1)
  })

  function addNode(node: StateNode) {
    nodes.value.push(node)
  }

  function updateNode(id: string, updates: { position?: { x: number; y: number } }) {
    const node = nodes.value.find(n => n.id === id)
    if (node && updates.position) {
      node.position = updates.position
    }
  }

  function updateNodeData(id: string, data: Partial<StateNode['data']>) {
    console.log('[Store] updateNodeData called with id:', id, 'data:', data)
    const index = nodes.value.findIndex(n => n.id === id)
    const existingNode = nodes.value[index]
    console.log('[Store] Found node at index:', index, 'existingNode:', existingNode)
    if (index !== -1 && existingNode) {
      // Create new node with updated data
      const newNode = {
        id: existingNode.id,
        type: existingNode.type,
        position: existingNode.position,
        data: { ...existingNode.data, ...data }
      }
      console.log('[Store] Creating new node:', newNode)
      // Replace entire array to trigger Vue Flow reactivity
      nodes.value = [
        ...nodes.value.slice(0, index),
        newNode,
        ...nodes.value.slice(index + 1)
      ]
      console.log('[Store] Node updated, new nodes array:', nodes.value)
    } else {
      console.log('[Store] Node not found!')
    }
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
  }

  function addEdge(edge: Transition) {
    edges.value.push(edge)
  }

  function updateEdge(id: string, updates: { source?: string; target?: string }) {
    const edge = edges.value.find(e => e.id === id)
    if (edge) {
      if (updates.source) edge.source = updates.source
      if (updates.target) edge.target = updates.target
    }
  }

  function updateEdgeData(id: string, data: Partial<Transition['data']>) {
    const index = edges.value.findIndex(e => e.id === id)
    const existingEdge = edges.value[index]
    if (index !== -1 && existingEdge) {
      // Create new edge with updated data
      const newEdge = {
        id: existingEdge.id,
        source: existingEdge.source,
        target: existingEdge.target,
        data: { ...existingEdge.data, ...data }
      }
      // Replace entire array to trigger Vue Flow reactivity
      edges.value = [
        ...edges.value.slice(0, index),
        newEdge,
        ...edges.value.slice(index + 1)
      ]
    }
  }

  function removeEdge(id: string) {
    edges.value = edges.value.filter(e => e.id !== id)
  }

  function updateWorkflow(name: string, description: string) {
    workflowName.value = name
    workflowDescription.value = description
  }

  function toggleActive() {
    isActive.value = !isActive.value
  }

  function setNodes(newNodes: StateNode[]) {
    nodes.value = newNodes
  }

  function setEdges(newEdges: Transition[]) {
    edges.value = newEdges
  }

  return {
    nodes,
    edges,
    workflowName,
    workflowDescription,
    isActive,
    nextDisplayOrder,
    nextNodeId,
    addNode,
    updateNode,
    updateNodeData,
    removeNode,
    addEdge,
    updateEdge,
    updateEdgeData,
    removeEdge,
    updateWorkflow,
    toggleActive,
    setNodes,
    setEdges,
  }
})
