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

export interface Workflow {
  id: string
  name: string
  description: string
  isActive: boolean
  nodes: StateNode[]
  edges: Transition[]
  createdAt: string
  updatedAt: string
}

export const useWorkflowStore = defineStore('workflow', () => {
  // List of all workflows
  const workflows = ref<Workflow[]>([
    {
      id: '1',
      name: 'Company Onboarding Workflow',
      description: 'State machine for company onboarding process',
      isActive: true,
      nodes: [
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
        }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: { name: 'Submit Application' } },
        { id: 'e2-3', source: '2', target: '3', data: { name: 'Documents Received' } }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Document Approval Workflow',
      description: 'Workflow for document review and approval',
      isActive: false,
      nodes: [
        {
          id: '1',
          type: 'state',
          position: { x: 250, y: 0 },
          data: { name: 'Submitted', stateType: 'initial', displayOrder: 1 },
        },
        {
          id: '2',
          type: 'state',
          position: { x: 250, y: 120 },
          data: { name: 'Approved', stateType: 'final', displayOrder: 2 },
        }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: { name: 'Approve' } }
      ],
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    }
  ])

  // Currently selected workflow for editing
  const currentWorkflowId = ref<string | null>(null)

  const currentWorkflow = computed(() => {
    if (!currentWorkflowId.value) return null
    return workflows.value.find(w => w.id === currentWorkflowId.value) || null
  })

  // Computed properties for current workflow (for backward compatibility with WorkflowEditor)
  const nodes = computed(() => currentWorkflow.value?.nodes || [])
  const edges = computed(() => currentWorkflow.value?.edges || [])
  const workflowName = computed(() => currentWorkflow.value?.name || '')
  const workflowDescription = computed(() => currentWorkflow.value?.description || '')
  const isActive = computed(() => currentWorkflow.value?.isActive || false)

  // Get next display order for current workflow
  const nextDisplayOrder = computed(() => {
    if (!currentWorkflow.value || currentWorkflow.value.nodes.length === 0) return 1
    return Math.max(...currentWorkflow.value.nodes.map(n => n.data.displayOrder)) + 1
  })

  // Get next node ID for current workflow
  const nextNodeId = computed(() => {
    if (!currentWorkflow.value || currentWorkflow.value.nodes.length === 0) return '1'
    return String(Math.max(...currentWorkflow.value.nodes.map(n => parseInt(n.id))) + 1)
  })

  // Get next workflow ID
  const nextWorkflowId = computed(() => {
    if (workflows.value.length === 0) return '1'
    return String(Math.max(...workflows.value.map(w => parseInt(w.id))) + 1)
  })

  function selectWorkflow(id: string) {
    currentWorkflowId.value = id
  }

  function clearSelection() {
    currentWorkflowId.value = null
  }

  function createWorkflow(name: string, description: string): string {
    const newWorkflow: Workflow = {
      id: nextWorkflowId.value,
      name,
      description,
      isActive: false,
      nodes: [
        {
          id: '1',
          type: 'state',
          position: { x: 250, y: 0 },
          data: { name: 'Initial State', stateType: 'initial', displayOrder: 1 },
        }
      ],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    workflows.value.push(newWorkflow)
    return newWorkflow.id
  }

  function deleteWorkflow(id: string) {
    workflows.value = workflows.value.filter(w => w.id !== id)
    if (currentWorkflowId.value === id) {
      currentWorkflowId.value = null
    }
  }

  function updateWorkflowInfo(id: string, name: string, description: string) {
    const workflow = workflows.value.find(w => w.id === id)
    if (workflow) {
      workflow.name = name
      workflow.description = description
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function toggleWorkflowActive(id: string) {
    const workflow = workflows.value.find(w => w.id === id)
    if (workflow) {
      workflow.isActive = !workflow.isActive
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function addNode(node: StateNode) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.nodes.push(node)
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function updateNode(id: string, updates: { position?: { x: number; y: number } }) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      const node = workflow.nodes.find(n => n.id === id)
      if (node && updates.position) {
        node.position = updates.position
        workflow.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateNodeData(id: string, data: Partial<StateNode['data']>) {
    if (!currentWorkflow.value) return
    const workflowIndex = workflows.value.findIndex(w => w.id === currentWorkflowId.value)
    const workflow = workflows.value[workflowIndex]
    if (workflowIndex === -1 || !workflow) return

    const nodeIndex = workflow.nodes.findIndex(n => n.id === id)
    const existingNode = workflow.nodes[nodeIndex]

    if (nodeIndex !== -1 && existingNode) {
      const newNode = {
        id: existingNode.id,
        type: existingNode.type,
        position: existingNode.position,
        data: { ...existingNode.data, ...data }
      }
      // Replace entire nodes array to trigger Vue Flow reactivity
      workflow.nodes = [
        ...workflow.nodes.slice(0, nodeIndex),
        newNode,
        ...workflow.nodes.slice(nodeIndex + 1)
      ]
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function removeNode(id: string) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.nodes = workflow.nodes.filter(n => n.id !== id)
      workflow.edges = workflow.edges.filter(e => e.source !== id && e.target !== id)
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function addEdge(edge: Transition) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.edges.push(edge)
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function updateEdge(id: string, updates: { source?: string; target?: string }) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      const edge = workflow.edges.find(e => e.id === id)
      if (edge) {
        if (updates.source) edge.source = updates.source
        if (updates.target) edge.target = updates.target
        workflow.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateEdgeData(id: string, data: Partial<Transition['data']>) {
    if (!currentWorkflow.value) return
    const workflowIndex = workflows.value.findIndex(w => w.id === currentWorkflowId.value)
    const workflow = workflows.value[workflowIndex]
    if (workflowIndex === -1 || !workflow) return

    const edgeIndex = workflow.edges.findIndex(e => e.id === id)
    const existingEdge = workflow.edges[edgeIndex]

    if (edgeIndex !== -1 && existingEdge) {
      const newEdge = {
        id: existingEdge.id,
        source: existingEdge.source,
        target: existingEdge.target,
        data: { ...existingEdge.data, ...data }
      }
      // Replace entire edges array to trigger Vue Flow reactivity
      workflow.edges = [
        ...workflow.edges.slice(0, edgeIndex),
        newEdge,
        ...workflow.edges.slice(edgeIndex + 1)
      ]
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function removeEdge(id: string) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.edges = workflow.edges.filter(e => e.id !== id)
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function setNodes(newNodes: StateNode[]) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.nodes = newNodes
      workflow.updatedAt = new Date().toISOString()
    }
  }

  function setEdges(newEdges: Transition[]) {
    if (!currentWorkflow.value) return
    const workflow = workflows.value.find(w => w.id === currentWorkflowId.value)
    if (workflow) {
      workflow.edges = newEdges
      workflow.updatedAt = new Date().toISOString()
    }
  }

  // Legacy toggleActive for backward compatibility
  function toggleActive() {
    if (currentWorkflowId.value) {
      toggleWorkflowActive(currentWorkflowId.value)
    }
  }

  // Legacy updateWorkflow for backward compatibility
  function updateWorkflow(name: string, description: string) {
    if (currentWorkflowId.value) {
      updateWorkflowInfo(currentWorkflowId.value, name, description)
    }
  }

  return {
    // Multi-workflow management
    workflows,
    currentWorkflowId,
    currentWorkflow,
    nextWorkflowId,
    selectWorkflow,
    clearSelection,
    createWorkflow,
    deleteWorkflow,
    updateWorkflowInfo,
    toggleWorkflowActive,
    // Current workflow properties (backward compatible)
    nodes,
    edges,
    workflowName,
    workflowDescription,
    isActive,
    nextDisplayOrder,
    nextNodeId,
    // Node operations
    addNode,
    updateNode,
    updateNodeData,
    removeNode,
    // Edge operations
    addEdge,
    updateEdge,
    updateEdgeData,
    removeEdge,
    // Batch operations
    setNodes,
    setEdges,
    // Legacy methods
    toggleActive,
    updateWorkflow,
  }
})
