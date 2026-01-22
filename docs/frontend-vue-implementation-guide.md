# Vue.js Frontend Implementation Guide

## Enterprise Backoffice System with shadcn-vue & Tailwind CSS

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup & Configuration](#setup--configuration)
5. [State Management with Pinia](#state-management-with-pinia)
6. [Module Implementations](#module-implementations)
7. [Routing & Navigation](#routing--navigation)
8. [API Integration](#api-integration)
9. [Authentication & Authorization](#authentication--authorization)
10. [Testing Strategy](#testing-strategy)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Project Overview

### Purpose

A Vue.js backoffice application for managing company profiles, subscription tiers with granular permissions, multi-stage workflow approvals, and automated email notifications. Built with shadcn-vue components and Tailwind CSS for a modern, accessible UI.

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time analytics, charts, and system health metrics |
| **Subscriptions** | Tiered permission management with CRUD capabilities |
| **Workflows** | Multi-stage approval pipelines (Secretary → Commercial → CEO) |
| **Onboarding Requests** | External company registration request management |
| **Companies** | Full company lifecycle management |
| **SMTP** | Email configuration, templates, and delivery settings |

### User Roles

| Role | Access Level | Workflow Position |
|------|--------------|-------------------|
| Super Admin | Full system access | Final override |
| CEO | All modules, final approval | Stage 3 (Final) |
| Head of Commercial | Companies, Subscriptions, Workflows | Stage 2 |
| Company Secretary | Onboarding Requests, Workflows | Stage 1 (Initial) |
| Viewer | Read-only dashboard access | None |

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.4+ | Core framework with Composition API |
| TypeScript | 5.x | Type safety |
| Pinia | 2.x | State management |
| Vue Router | 4.x | Client-side routing |
| Vite | 5.x | Build tool and dev server |
| **shadcn-vue** | Latest | UI component library |
| **Tailwind CSS** | 3.4+ | Utility-first styling |
| Axios | 1.x | HTTP client |
| VueUse | 10.x | Composition utilities |
| VeeValidate + Zod | Latest | Form validation |
| Lucide Vue | Latest | Icon library (shadcn default) |
| Chart.js | Latest | Dashboard visualizations |

---

## Project Structure

```
backoffice/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── globals.css
│   ├── components/
│   │   ├── ui/                      # shadcn-vue components
│   │   │   ├── alert/
│   │   │   ├── avatar/
│   │   │   ├── badge/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── checkbox/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   ├── form/
│   │   │   ├── input/
│   │   │   ├── label/
│   │   │   ├── select/
│   │   │   ├── separator/
│   │   │   ├── sheet/
│   │   │   ├── skeleton/
│   │   │   ├── switch/
│   │   │   ├── table/
│   │   │   ├── tabs/
│   │   │   ├── textarea/
│   │   │   ├── toast/
│   │   │   └── tooltip/
│   │   ├── layout/
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppBreadcrumb.vue
│   │   │   └── UserNav.vue
│   │   ├── dashboard/
│   │   │   ├── StatCard.vue
│   │   │   ├── CompanyGrowthChart.vue
│   │   │   ├── SubscriptionPieChart.vue
│   │   │   ├── WorkflowPipeline.vue
│   │   │   └── RecentActivity.vue
│   │   ├── subscriptions/
│   │   │   ├── SubscriptionForm.vue
│   │   │   ├── PermissionMatrix.vue
│   │   │   └── TierCard.vue
│   │   ├── workflow/
│   │   │   ├── WorkflowTimeline.vue
│   │   │   ├── ApprovalCard.vue
│   │   │   ├── StageIndicator.vue
│   │   │   └── CommentThread.vue
│   │   ├── onboarding/
│   │   │   ├── RequestDetails.vue
│   │   │   ├── RequestCard.vue
│   │   │   └── ApprovalActions.vue
│   │   ├── companies/
│   │   │   ├── CompanyForm.vue
│   │   │   ├── CompanyCard.vue
│   │   │   └── SubscriptionSelect.vue
│   │   └── smtp/
│   │       ├── SmtpConfigForm.vue
│   │       ├── TemplateEditor.vue
│   │       └── TestEmailDialog.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── usePagination.ts
│   │   ├── usePermissions.ts
│   │   └── useDebounce.ts
│   ├── layouts/
│   │   ├── DefaultLayout.vue
│   │   └── AuthLayout.vue
│   ├── lib/
│   │   └── utils.ts
│   ├── plugins/
│   │   └── axios.ts
│   ├── router/
│   │   ├── index.ts
│   │   └── guards.ts
│   ├── services/
│   │   └── api/
│   │       ├── index.ts
│   │       ├── auth.api.ts
│   │       ├── companies.api.ts
│   │       ├── subscriptions.api.ts
│   │       ├── workflows.api.ts
│   │       ├── onboarding.api.ts
│   │       ├── smtp.api.ts
│   │       └── dashboard.api.ts
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── companies.store.ts
│   │   ├── subscriptions.store.ts
│   │   ├── workflows.store.ts
│   │   ├── onboarding.store.ts
│   │   ├── smtp.store.ts
│   │   └── ui.store.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── company.types.ts
│   │   ├── subscription.types.ts
│   │   ├── workflow.types.ts
│   │   └── onboarding.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── permissions.ts
│   ├── views/
│   │   ├── auth/
│   │   │   └── LoginView.vue
│   │   ├── dashboard/
│   │   │   └── DashboardView.vue
│   │   ├── subscriptions/
│   │   │   ├── SubscriptionListView.vue
│   │   │   └── SubscriptionDetailView.vue
│   │   ├── workflow/
│   │   │   ├── WorkflowListView.vue
│   │   │   └── WorkflowDetailView.vue
│   │   ├── onboarding/
│   │   │   ├── OnboardingListView.vue
│   │   │   └── OnboardingDetailView.vue
│   │   ├── companies/
│   │   │   ├── CompanyListView.vue
│   │   │   └── CompanyDetailView.vue
│   │   └── smtp/
│   │       └── SmtpConfigView.vue
│   ├── App.vue
│   └── main.ts
├── components.json
├── .env.development
├── .env.production
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Setup & Configuration

### 1. Initialize Project

```bash
# Create Vue project with Vite
npm create vue@latest backoffice -- --typescript

cd backoffice

# Install core dependencies
npm install pinia vue-router@4 axios @vueuse/core

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize shadcn-vue
npx shadcn-vue@latest init
```

### 2. Tailwind Configuration

```javascript
// tailwind.config.js
const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",
  
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
}
```

### 3. Global Styles

```css
/* src/assets/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .sidebar-item {
    @apply flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted;
  }
  
  .sidebar-item-active {
    @apply bg-muted text-primary font-medium;
  }
}
```

### 4. shadcn-vue Components Installation

```bash
npx shadcn-vue@latest add button card input label select checkbox switch table dialog sheet dropdown-menu avatar badge tabs toast tooltip skeleton separator form textarea alert
```

### 5. Utility Function

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 6. Main Entry Point

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/globals.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

---

## State Management with Pinia

### Auth Store

```typescript
// src/stores/auth.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types/auth.types'
import { authApi } from '@/services/api/auth.api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)
  const permissions = computed(() => user.value?.permissions ?? [])
  
  const hasPermission = computed(() => (permission: string) => {
    if (userRole.value === 'super_admin') return true
    return permissions.value.includes(permission)
  })

  const canApproveWorkflow = computed(() => {
    const approverRoles = ['company_secretary', 'head_commercial', 'ceo', 'super_admin']
    return approverRoles.includes(userRole.value ?? '')
  })

  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
  })

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      token.value = response.token
      refreshToken.value = response.refreshToken
      user.value = response.user
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message ?? 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      token.value = null
      refreshToken.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      router.push('/login')
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) throw new Error('No refresh token')
    
    const response = await authApi.refresh(refreshToken.value)
    token.value = response.token
    localStorage.setItem('token', response.token)
    
    return response.token
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    
    try {
      user.value = await authApi.getCurrentUser()
    } catch {
      await logout()
    }
  }

  return {
    user, token, isLoading, error,
    isAuthenticated, userRole, permissions, hasPermission, canApproveWorkflow, userInitials,
    login, logout, refreshAccessToken, fetchCurrentUser,
  }
})
```

### Companies Store

```typescript
// src/stores/companies.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company, CompanyFilters, CreateCompanyDTO } from '@/types/company.types'
import { companiesApi } from '@/services/api/companies.api'

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Map<string, Company>>(new Map())
  const companyIds = ref<string[]>([])
  const selectedCompanyId = ref<string | null>(null)
  const isLoading = ref(false)
  const totalCount = ref(0)
  const filters = ref<CompanyFilters>({
    search: '',
    status: null,
    subscriptionTier: null,
    page: 1,
    limit: 20,
  })

  // Getters
  const companyList = computed(() => 
    companyIds.value.map(id => companies.value.get(id)!).filter(Boolean)
  )

  const selectedCompany = computed(() => 
    selectedCompanyId.value ? companies.value.get(selectedCompanyId.value) : null
  )

  const activeCompanies = computed(() => 
    companyList.value.filter(c => c.status === 'active')
  )

  const inactiveCompanies = computed(() => 
    companyList.value.filter(c => c.status === 'inactive')
  )

  const companiesByTier = computed(() => {
    const grouped: Record<string, Company[]> = {}
    companyList.value.forEach(company => {
      const tier = company.subscriptionTier || 'unassigned'
      if (!grouped[tier]) grouped[tier] = []
      grouped[tier].push(company)
    })
    return grouped
  })

  // Actions
  async function fetchCompanies(resetPagination = false) {
    if (resetPagination) {
      filters.value.page = 1
      companies.value.clear()
      companyIds.value = []
    }
    
    isLoading.value = true
    
    try {
      const response = await companiesApi.getAll(filters.value)
      
      response.data.forEach(company => {
        companies.value.set(company.id, company)
        if (!companyIds.value.includes(company.id)) {
          companyIds.value.push(company.id)
        }
      })
      
      totalCount.value = response.total
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCompanyById(id: string) {
    isLoading.value = true
    try {
      const company = await companiesApi.getById(id)
      companies.value.set(company.id, company)
      return company
    } finally {
      isLoading.value = false
    }
  }

  async function createCompany(data: CreateCompanyDTO) {
    const company = await companiesApi.create(data)
    companies.value.set(company.id, company)
    companyIds.value.unshift(company.id)
    totalCount.value++
    return company
  }

  async function updateCompany(id: string, data: Partial<Company>) {
    const original = companies.value.get(id)
    if (original) {
      companies.value.set(id, { ...original, ...data })
    }
    
    try {
      const updated = await companiesApi.update(id, data)
      companies.value.set(id, updated)
      return updated
    } catch (err) {
      if (original) companies.value.set(id, original)
      throw err
    }
  }

  async function deleteCompany(id: string) {
    await companiesApi.delete(id)
    companies.value.delete(id)
    companyIds.value = companyIds.value.filter(cid => cid !== id)
    totalCount.value--
  }

  function setFilters(newFilters: Partial<CompanyFilters>) {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
  }

  function selectCompany(id: string | null) {
    selectedCompanyId.value = id
  }

  return {
    companies, companyIds, selectedCompanyId, isLoading, totalCount, filters,
    companyList, selectedCompany, activeCompanies, inactiveCompanies, companiesByTier,
    fetchCompanies, fetchCompanyById, createCompany, updateCompany, deleteCompany, setFilters, selectCompany,
  }
})
```

### Subscriptions Store

```typescript
// src/stores/subscriptions.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SubscriptionTier, Permission, CreateSubscriptionDTO } from '@/types/subscription.types'
import { subscriptionsApi } from '@/services/api/subscriptions.api'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const tiers = ref<Map<string, SubscriptionTier>>(new Map())
  const tierIds = ref<string[]>([])
  const availablePermissions = ref<Permission[]>([])
  const isLoading = ref(false)

  const tierList = computed(() => 
    tierIds.value.map(id => tiers.value.get(id)!).filter(Boolean)
  )

  const tiersByLevel = computed(() => 
    [...tierList.value].sort((a, b) => a.level - b.level)
  )

  const activeTiers = computed(() =>
    tierList.value.filter(t => t.isActive)
  )

  const permissionsByCategory = computed(() => {
    const grouped: Record<string, Permission[]> = {}
    availablePermissions.value.forEach(perm => {
      if (!grouped[perm.category]) grouped[perm.category] = []
      grouped[perm.category].push(perm)
    })
    return grouped
  })

  async function fetchTiers() {
    isLoading.value = true
    try {
      const response = await subscriptionsApi.getAllTiers()
      tiers.value.clear()
      tierIds.value = []
      response.forEach(tier => {
        tiers.value.set(tier.id, tier)
        tierIds.value.push(tier.id)
      })
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPermissions() {
    availablePermissions.value = await subscriptionsApi.getPermissions()
  }

  async function createTier(data: CreateSubscriptionDTO) {
    const tier = await subscriptionsApi.createTier(data)
    tiers.value.set(tier.id, tier)
    tierIds.value.push(tier.id)
    return tier
  }

  async function updateTier(id: string, data: Partial<SubscriptionTier>) {
    const updated = await subscriptionsApi.updateTier(id, data)
    tiers.value.set(id, updated)
    return updated
  }

  async function deleteTier(id: string) {
    await subscriptionsApi.deleteTier(id)
    tiers.value.delete(id)
    tierIds.value = tierIds.value.filter(tid => tid !== id)
  }

  async function updateTierPermissions(tierId: string, permissions: string[]) {
    return updateTier(tierId, { permissions })
  }

  function getTierById(id: string) {
    return tiers.value.get(id)
  }

  return {
    tiers, tierIds, availablePermissions, isLoading,
    tierList, tiersByLevel, activeTiers, permissionsByCategory,
    fetchTiers, fetchPermissions, createTier, updateTier, deleteTier, updateTierPermissions, getTierById,
  }
})
```

### Workflows Store

```typescript
// src/stores/workflows.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workflow, WorkflowStage, WorkflowFilters, ApprovalAction } from '@/types/workflow.types'
import { workflowsApi } from '@/services/api/workflows.api'
import { useAuthStore } from './auth.store'

export const useWorkflowsStore = defineStore('workflows', () => {
  const authStore = useAuthStore()
  
  const workflows = ref<Map<string, Workflow>>(new Map())
  const workflowIds = ref<string[]>([])
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const totalCount = ref(0)
  const filters = ref<WorkflowFilters>({
    status: null,
    stage: null,
    assignedToMe: false,
    page: 1,
    limit: 20,
  })

  const stageConfig: WorkflowStage[] = [
    { order: 1, name: 'Company Secretary Review', role: 'company_secretary', description: 'Initial document verification' },
    { order: 2, name: 'Head of Commercial Review', role: 'head_commercial', description: 'Business viability assessment' },
    { order: 3, name: 'CEO Approval', role: 'ceo', description: 'Final executive approval' },
  ]

  const workflowList = computed(() => 
    workflowIds.value.map(id => workflows.value.get(id)!).filter(Boolean)
  )

  const pendingWorkflows = computed(() => 
    workflowList.value.filter(w => w.status === 'pending')
  )

  const myPendingApprovals = computed(() => {
    const userRole = authStore.userRole
    return pendingWorkflows.value.filter(w => {
      const currentStage = stageConfig.find(s => s.order === w.currentStage)
      return currentStage?.role === userRole
    })
  })

  const workflowsByStage = computed(() => {
    const grouped: Record<number, Workflow[]> = {}
    stageConfig.forEach(s => { grouped[s.order] = [] })
    pendingWorkflows.value.forEach(w => {
      if (grouped[w.currentStage]) grouped[w.currentStage].push(w)
    })
    return grouped
  })

  async function fetchWorkflows(resetPagination = false) {
    if (resetPagination) {
      filters.value.page = 1
      workflows.value.clear()
      workflowIds.value = []
    }
    
    isLoading.value = true
    try {
      const response = await workflowsApi.getAll(filters.value)
      response.data.forEach(workflow => {
        workflows.value.set(workflow.id, workflow)
        if (!workflowIds.value.includes(workflow.id)) {
          workflowIds.value.push(workflow.id)
        }
      })
      totalCount.value = response.total
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWorkflowById(id: string) {
    isLoading.value = true
    try {
      const workflow = await workflowsApi.getById(id)
      workflows.value.set(workflow.id, workflow)
      return workflow
    } finally {
      isLoading.value = false
    }
  }

  async function approveWorkflow(id: string, comment?: string) {
    isProcessing.value = true
    try {
      const action: ApprovalAction = {
        action: 'approve',
        comment,
        timestamp: new Date().toISOString(),
        userId: authStore.user!.id,
      }
      const updated = await workflowsApi.processApproval(id, action)
      workflows.value.set(id, updated)
      return updated
    } finally {
      isProcessing.value = false
    }
  }

  async function rejectWorkflow(id: string, reason: string) {
    isProcessing.value = true
    try {
      const action: ApprovalAction = {
        action: 'reject',
        comment: reason,
        timestamp: new Date().toISOString(),
        userId: authStore.user!.id,
      }
      const updated = await workflowsApi.processApproval(id, action)
      workflows.value.set(id, updated)
      return updated
    } finally {
      isProcessing.value = false
    }
  }

  async function requestChanges(id: string, feedback: string) {
    isProcessing.value = true
    try {
      const action: ApprovalAction = {
        action: 'request_changes',
        comment: feedback,
        timestamp: new Date().toISOString(),
        userId: authStore.user!.id,
      }
      const updated = await workflowsApi.processApproval(id, action)
      workflows.value.set(id, updated)
      return updated
    } finally {
      isProcessing.value = false
    }
  }

  function setFilters(newFilters: Partial<WorkflowFilters>) {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
  }

  function getStageInfo(stageNumber: number) {
    return stageConfig.find(s => s.order === stageNumber)
  }

  function canUserApprove(workflow: Workflow): boolean {
    const userRole = authStore.userRole
    if (userRole === 'super_admin') return true
    const currentStage = stageConfig.find(s => s.order === workflow.currentStage)
    return currentStage?.role === userRole
  }

  return {
    workflows, workflowIds, isLoading, isProcessing, totalCount, filters, stageConfig,
    workflowList, pendingWorkflows, myPendingApprovals, workflowsByStage,
    fetchWorkflows, fetchWorkflowById, approveWorkflow, rejectWorkflow, requestChanges, setFilters, getStageInfo, canUserApprove,
  }
})
```

### Onboarding Store

```typescript
// src/stores/onboarding.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OnboardingRequest, OnboardingFilters, OnboardingStatus } from '@/types/onboarding.types'
import { onboardingApi } from '@/services/api/onboarding.api'

export const useOnboardingStore = defineStore('onboarding', () => {
  const requests = ref<Map<string, OnboardingRequest>>(new Map())
  const requestIds = ref<string[]>([])
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const totalCount = ref(0)
  const filters = ref<OnboardingFilters>({
    status: null,
    search: '',
    dateFrom: null,
    dateTo: null,
    page: 1,
    limit: 20,
  })

  const requestList = computed(() => 
    requestIds.value.map(id => requests.value.get(id)!).filter(Boolean)
  )

  const pendingRequests = computed(() => 
    requestList.value.filter(r => r.status === 'pending')
  )

  const inProgressRequests = computed(() => 
    requestList.value.filter(r => r.status === 'in_progress')
  )

  const requestStats = computed(() => ({
    pending: requestList.value.filter(r => r.status === 'pending').length,
    inProgress: requestList.value.filter(r => r.status === 'in_progress').length,
    approved: requestList.value.filter(r => r.status === 'approved').length,
    rejected: requestList.value.filter(r => r.status === 'rejected').length,
  }))

  async function fetchRequests(resetPagination = false) {
    if (resetPagination) {
      filters.value.page = 1
      requests.value.clear()
      requestIds.value = []
    }
    
    isLoading.value = true
    try {
      const response = await onboardingApi.getAll(filters.value)
      response.data.forEach(request => {
        requests.value.set(request.id, request)
        if (!requestIds.value.includes(request.id)) {
          requestIds.value.push(request.id)
        }
      })
      totalCount.value = response.total
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRequestById(id: string) {
    isLoading.value = true
    try {
      const request = await onboardingApi.getById(id)
      requests.value.set(request.id, request)
      return request
    } finally {
      isLoading.value = false
    }
  }

  async function initiateWorkflow(requestId: string) {
    isProcessing.value = true
    try {
      const updated = await onboardingApi.initiateWorkflow(requestId)
      requests.value.set(requestId, updated)
      return updated
    } finally {
      isProcessing.value = false
    }
  }

  async function updateRequestStatus(id: string, status: OnboardingStatus, notes?: string) {
    isProcessing.value = true
    try {
      const updated = await onboardingApi.updateStatus(id, status, notes)
      requests.value.set(id, updated)
      return updated
    } finally {
      isProcessing.value = false
    }
  }

  function setFilters(newFilters: Partial<OnboardingFilters>) {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
  }

  return {
    requests, requestIds, isLoading, isProcessing, totalCount, filters,
    requestList, pendingRequests, inProgressRequests, requestStats,
    fetchRequests, fetchRequestById, initiateWorkflow, updateRequestStatus, setFilters,
  }
})
```

### SMTP Store

```typescript
// src/stores/smtp.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SmtpConfig, EmailTemplate, TestEmailResult } from '@/types/smtp.types'
import { smtpApi } from '@/services/api/smtp.api'

export const useSmtpStore = defineStore('smtp', () => {
  const config = ref<SmtpConfig | null>(null)
  const templates = ref<Map<string, EmailTemplate>>(new Map())
  const templateIds = ref<string[]>([])
  const isLoading = ref(false)
  const isTesting = ref(false)
  const isConfigured = ref(false)
  const lastTestResult = ref<TestEmailResult | null>(null)

  const templateList = computed(() => 
    templateIds.value.map(id => templates.value.get(id)!).filter(Boolean)
  )

  const activeTemplates = computed(() =>
    templateList.value.filter(t => t.isActive)
  )

  async function fetchConfig() {
    isLoading.value = true
    try {
      config.value = await smtpApi.getConfig()
      isConfigured.value = !!config.value?.host
    } finally {
      isLoading.value = false
    }
  }

  async function saveConfig(newConfig: SmtpConfig) {
    isLoading.value = true
    try {
      config.value = await smtpApi.saveConfig(newConfig)
      isConfigured.value = true
      return config.value
    } finally {
      isLoading.value = false
    }
  }

  async function testConnection(testConfig?: SmtpConfig) {
    const configToTest = testConfig || config.value
    if (!configToTest) throw new Error('No SMTP configuration')
    
    isTesting.value = true
    try {
      lastTestResult.value = await smtpApi.testConnection(configToTest)
      return lastTestResult.value
    } finally {
      isTesting.value = false
    }
  }

  async function sendTestEmail(recipientEmail: string) {
    if (!config.value) throw new Error('SMTP not configured')
    
    isTesting.value = true
    try {
      lastTestResult.value = await smtpApi.sendTestEmail(recipientEmail)
      return lastTestResult.value
    } finally {
      isTesting.value = false
    }
  }

  async function fetchTemplates() {
    isLoading.value = true
    try {
      const response = await smtpApi.getTemplates()
      templates.value.clear()
      templateIds.value = []
      response.forEach(template => {
        templates.value.set(template.id, template)
        templateIds.value.push(template.id)
      })
    } finally {
      isLoading.value = false
    }
  }

  async function saveTemplate(template: EmailTemplate) {
    const saved = await smtpApi.saveTemplate(template)
    templates.value.set(saved.id, saved)
    if (!templateIds.value.includes(saved.id)) {
      templateIds.value.push(saved.id)
    }
    return saved
  }

  return {
    config, templates, templateIds, isLoading, isTesting, isConfigured, lastTestResult,
    templateList, activeTemplates,
    fetchConfig, saveConfig, testConnection, sendTestEmail, fetchTemplates, saveTemplate,
  }
})
```

### UI Store

```typescript
// src/stores/ui.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const sidebarMobileOpen = ref(false)
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  const isDarkMode = computed(() => theme.value === 'dark')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleMobileSidebar() {
    sidebarMobileOpen.value = !sidebarMobileOpen.value
  }

  function closeMobileSidebar() {
    sidebarMobileOpen.value = false
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme() {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }

  return {
    sidebarCollapsed, sidebarMobileOpen, theme, isDarkMode,
    toggleSidebar, toggleMobileSidebar, closeMobileSidebar, setTheme, toggleTheme, initTheme,
  }
})
```

---

## Module Implementations

### Layout - AppSidebar.vue

```vue
<template>
  <aside
    :class="cn(
      'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-64',
      sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b px-4">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Building2 class="h-5 w-5 text-primary-foreground" />
        </div>
        <span v-if="!sidebarCollapsed" class="text-lg font-semibold">Backoffice</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 p-2">
      <TooltipProvider :delay-duration="0">
        <template v-for="item in navigationItems" :key="item.path">
          <Tooltip v-if="sidebarCollapsed">
            <TooltipTrigger as-child>
              <RouterLink
                :to="item.path"
                :class="cn('sidebar-item justify-center', isActive(item.path) && 'sidebar-item-active')"
                @click="closeMobileSidebar"
              >
                <component :is="item.icon" class="h-5 w-5" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">{{ item.label }}</TooltipContent>
          </Tooltip>

          <RouterLink
            v-else
            :to="item.path"
            :class="cn('sidebar-item', isActive(item.path) && 'sidebar-item-active')"
            @click="closeMobileSidebar"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" variant="secondary" class="ml-auto">{{ item.badge }}</Badge>
          </RouterLink>
        </template>
      </TooltipProvider>
    </nav>

    <!-- Footer -->
    <div class="border-t p-2">
      <Button variant="ghost" size="icon" class="w-full" @click="toggleSidebar">
        <PanelLeftClose v-if="!sidebarCollapsed" class="h-5 w-5" />
        <PanelLeft v-else class="h-5 w-5" />
      </Button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="sidebarMobileOpen"
    class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
    @click="closeMobileSidebar"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui.store'
import { useWorkflowsStore } from '@/stores/workflows.store'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LayoutDashboard, CreditCard, GitBranch, FileInput, Building2, Mail, PanelLeftClose, PanelLeft } from 'lucide-vue-next'

const route = useRoute()
const uiStore = useUiStore()
const workflowsStore = useWorkflowsStore()
const onboardingStore = useOnboardingStore()

const { sidebarCollapsed, sidebarMobileOpen } = storeToRefs(uiStore)
const { toggleSidebar, closeMobileSidebar } = uiStore

const navigationItems = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/workflows', label: 'Workflows', icon: GitBranch, badge: workflowsStore.myPendingApprovals.length || undefined },
  { path: '/onboarding', label: 'Onboarding Requests', icon: FileInput, badge: onboardingStore.pendingRequests.length || undefined },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/smtp', label: 'SMTP Settings', icon: Mail },
])

function isActive(path: string): boolean {
  return route.path.startsWith(path)
}
</script>
```

### Layout - AppHeader.vue

```vue
<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
    <Button variant="ghost" size="icon" class="lg:hidden" @click="toggleMobileSidebar">
      <Menu class="h-5 w-5" />
    </Button>

    <AppBreadcrumb class="hidden md:flex" />

    <div class="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" @click="toggleTheme">
        <Sun v-if="isDarkMode" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel>
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium">{{ user?.firstName }} {{ user?.lastName }}</p>
              <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="logout" class="text-destructive">
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AppBreadcrumb from './AppBreadcrumb.vue'
import { Menu, Sun, Moon, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const uiStore = useUiStore()

const { user, userInitials } = storeToRefs(authStore)
const { isDarkMode } = storeToRefs(uiStore)
const { logout } = authStore
const { toggleMobileSidebar, toggleTheme } = uiStore
</script>
```

### Dashboard - StatCard.vue

```vue
<template>
  <Card 
    :class="cn('cursor-pointer transition-shadow hover:shadow-md', clickable && 'cursor-pointer')"
    @click="clickable && $emit('click')"
  >
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">{{ title }}</CardTitle>
      <slot name="icon" />
    </CardHeader>
    <CardContent>
      <div class="flex items-baseline gap-2">
        <div class="text-2xl font-bold">
          <Badge v-if="status" :variant="status">{{ value }}</Badge>
          <template v-else>{{ formattedValue }}</template>
        </div>
        <div 
          v-if="trend !== undefined" 
          :class="cn('flex items-center text-sm', trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground')"
        >
          <TrendingUp v-if="trend > 0" class="mr-1 h-4 w-4" />
          <TrendingDown v-else-if="trend < 0" class="mr-1 h-4 w-4" />
          {{ Math.abs(trend) }}%
        </div>
      </div>
      <p v-if="description" class="mt-1 text-xs text-muted-foreground">{{ description }}</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: string | number
  description?: string
  trend?: number
  clickable?: boolean
  status?: 'default' | 'success' | 'warning' | 'destructive'
}>()

defineEmits(['click'])

const formattedValue = computed(() => 
  typeof props.value === 'number' ? props.value.toLocaleString() : props.value
)
</script>
```

### Workflow - WorkflowTimeline.vue

```vue
<template>
  <div class="relative">
    <div class="absolute left-4 top-0 h-full w-0.5 bg-border" />
    
    <div class="space-y-8">
      <div v-for="stage in stages" :key="stage.order" class="relative flex gap-4">
        <div
          :class="cn(
            'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
            getStageClasses(stage.order)
          )"
        >
          <component :is="getStageIcon(stage.order)" class="h-4 w-4" />
        </div>
        
        <div class="flex-1 pb-8">
          <div class="flex items-center gap-2">
            <h4 class="font-medium">{{ stage.name }}</h4>
            <Badge :variant="getStageBadgeVariant(stage.order)">{{ getStageStatus(stage.order) }}</Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">{{ stage.description }}</p>
          
          <Card v-if="getStageAction(stage.order)" class="mt-3 bg-muted/50">
            <CardContent class="p-3">
              <div class="flex items-start gap-3">
                <Avatar class="h-8 w-8">
                  <AvatarFallback>{{ getStageAction(stage.order)!.userName.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ getStageAction(stage.order)!.userName }}</span>
                    <span class="text-sm text-muted-foreground">{{ formatDate(getStageAction(stage.order)!.timestamp) }}</span>
                  </div>
                  <p v-if="getStageAction(stage.order)!.comment" class="mt-1 text-sm">"{{ getStageAction(stage.order)!.comment }}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div v-else-if="isCurrentStage(stage.order) && workflow.status === 'pending'" class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 class="h-4 w-4 animate-spin" />
            Awaiting review
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workflow, WorkflowStage, WorkflowAction } from '@/types/workflow.types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, X, AlertTriangle, Clock, Circle, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  workflow: Workflow
  stages: WorkflowStage[]
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStageStatus(order: number): string {
  if (order < props.workflow.currentStage) return 'Completed'
  if (order === props.workflow.currentStage) {
    if (props.workflow.status === 'rejected') return 'Rejected'
    if (props.workflow.status === 'changes_requested') return 'Changes Requested'
    if (props.workflow.status === 'approved') return 'Approved'
    return 'In Progress'
  }
  return 'Pending'
}

function getStageClasses(order: number): string {
  if (order < props.workflow.currentStage) return 'border-green-500 bg-green-500 text-white'
  if (order === props.workflow.currentStage) {
    if (props.workflow.status === 'rejected') return 'border-destructive bg-destructive text-destructive-foreground'
    if (props.workflow.status === 'changes_requested') return 'border-yellow-500 bg-yellow-500 text-white'
    if (props.workflow.status === 'approved') return 'border-green-500 bg-green-500 text-white'
    return 'border-primary bg-primary text-primary-foreground'
  }
  return 'border-muted-foreground/25 bg-background text-muted-foreground'
}

function getStageBadgeVariant(order: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (order < props.workflow.currentStage) return 'default'
  if (order === props.workflow.currentStage) {
    if (props.workflow.status === 'rejected') return 'destructive'
    return 'secondary'
  }
  return 'outline'
}

function getStageIcon(order: number) {
  if (order < props.workflow.currentStage) return Check
  if (order === props.workflow.currentStage) {
    if (props.workflow.status === 'rejected') return X
    if (props.workflow.status === 'changes_requested') return AlertTriangle
    if (props.workflow.status === 'approved') return Check
    return Clock
  }
  return Circle
}

function getStageAction(order: number): WorkflowAction | undefined {
  return props.workflow.history?.find(h => h.stage === order)
}

function isCurrentStage(order: number): boolean {
  return order === props.workflow.currentStage
}
</script>
```

### Subscriptions - PermissionMatrix.vue

```vue
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium">Permission Matrix</h3>
        <p class="text-sm text-muted-foreground">Configure permissions for each subscription tier</p>
      </div>
      <div v-if="canEdit" class="flex gap-2">
        <Button variant="outline" size="sm" @click="resetChanges" :disabled="!hasChanges">
          <RotateCcw class="mr-2 h-4 w-4" />Reset
        </Button>
        <Button size="sm" @click="saveChanges" :disabled="!hasChanges || isSaving">
          <Save class="mr-2 h-4 w-4" />Save Changes
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[300px]">Permission</TableHead>
            <TableHead v-for="tier in tiers" :key="tier.id" class="text-center">
              <div class="flex flex-col items-center gap-1">
                <span>{{ tier.name }}</span>
                <Badge variant="outline">{{ getTierPermissionCount(tier.id) }}</Badge>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-for="(category, key) in permissionsByCategory" :key="key">
            <TableRow class="bg-muted/50">
              <TableCell :colspan="tiers.length + 1" class="font-medium">{{ category.label }}</TableCell>
            </TableRow>
            <TableRow v-for="perm in category.permissions" :key="perm.code">
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-medium">{{ perm.label }}</span>
                  <span class="text-sm text-muted-foreground">{{ perm.description }}</span>
                </div>
              </TableCell>
              <TableCell v-for="tier in tiers" :key="tier.id" class="text-center">
                <Checkbox
                  :checked="hasPermission(tier.id, perm.code)"
                  @update:checked="(v) => togglePermission(tier.id, perm.code, v)"
                  :disabled="!canEdit"
                />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubscriptionsStore } from '@/stores/subscriptions.store'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PERMISSION_CATEGORIES } from '@/utils/constants'
import { Save, RotateCcw } from 'lucide-vue-next'

const subscriptionsStore = useSubscriptionsStore()
const authStore = useAuthStore()

const { tiersByLevel: tiers } = storeToRefs(subscriptionsStore)
const permissionsByCategory = PERMISSION_CATEGORIES

const pendingChanges = ref<Map<string, Set<string>>>(new Map())
const isSaving = ref(false)

const canEdit = computed(() => authStore.hasPermission('subscription:manage'))
const hasChanges = computed(() => pendingChanges.value.size > 0)

function hasPermission(tierId: string, code: string): boolean {
  if (pendingChanges.value.has(tierId)) {
    return pendingChanges.value.get(tierId)!.has(code)
  }
  return subscriptionsStore.getTierById(tierId)?.permissions.includes(code) ?? false
}

function togglePermission(tierId: string, code: string, enabled: boolean) {
  if (!pendingChanges.value.has(tierId)) {
    const tier = subscriptionsStore.getTierById(tierId)
    pendingChanges.value.set(tierId, new Set(tier?.permissions ?? []))
  }
  const perms = pendingChanges.value.get(tierId)!
  enabled ? perms.add(code) : perms.delete(code)
}

function getTierPermissionCount(tierId: string): number {
  if (pendingChanges.value.has(tierId)) return pendingChanges.value.get(tierId)!.size
  return subscriptionsStore.getTierById(tierId)?.permissions.length ?? 0
}

async function saveChanges() {
  isSaving.value = true
  try {
    for (const [tierId, perms] of pendingChanges.value) {
      await subscriptionsStore.updateTierPermissions(tierId, Array.from(perms))
    }
    pendingChanges.value.clear()
  } finally {
    isSaving.value = false
  }
}

function resetChanges() {
  pendingChanges.value.clear()
}
</script>
```

---

## Routing & Navigation

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { public: true, layout: 'auth' } },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { permission: 'dashboard:view' } },
    { path: '/subscriptions', name: 'subscriptions', component: () => import('@/views/subscriptions/SubscriptionListView.vue'), meta: { permission: 'subscriptions:view' } },
    { path: '/subscriptions/:id', name: 'subscription-detail', component: () => import('@/views/subscriptions/SubscriptionDetailView.vue'), meta: { permission: 'subscriptions:view' } },
    { path: '/workflows', name: 'workflows', component: () => import('@/views/workflow/WorkflowListView.vue'), meta: { permission: 'workflows:view' } },
    { path: '/workflows/:id', name: 'workflow-detail', component: () => import('@/views/workflow/WorkflowDetailView.vue'), meta: { permission: 'workflows:view' } },
    { path: '/onboarding', name: 'onboarding', component: () => import('@/views/onboarding/OnboardingListView.vue'), meta: { permission: 'onboarding:view' } },
    { path: '/onboarding/:id', name: 'onboarding-detail', component: () => import('@/views/onboarding/OnboardingDetailView.vue'), meta: { permission: 'onboarding:view' } },
    { path: '/companies', name: 'companies', component: () => import('@/views/companies/CompanyListView.vue'), meta: { permission: 'companies:view' } },
    { path: '/companies/:id', name: 'company-detail', component: () => import('@/views/companies/CompanyDetailView.vue'), meta: { permission: 'companies:view' } },
    { path: '/smtp', name: 'smtp', component: () => import('@/views/smtp/SmtpConfigView.vue'), meta: { permission: 'smtp:view' } },
    { path: '/forbidden', name: 'forbidden', component: () => import('@/views/errors/ForbiddenView.vue'), meta: { public: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/errors/NotFoundView.vue'), meta: { public: true } },
  ],
})

router.beforeEach(authGuard)

export default router
```

```typescript
// src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore()
  
  if (to.meta.public) {
    if (authStore.isAuthenticated && to.name === 'login') return next({ name: 'dashboard' })
    return next()
  }
  
  if (!authStore.isAuthenticated) {
    if (authStore.token) {
      try {
        await authStore.fetchCurrentUser()
      } catch {
        return next({ name: 'login', query: { redirect: to.fullPath } })
      }
    } else {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }
  
  const permission = to.meta.permission as string | undefined
  if (permission && !authStore.hasPermission(permission)) {
    return next({ name: 'forbidden' })
  }
  
  next()
}
```

---

## API Integration

```typescript
// src/plugins/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await authStore.refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        authStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

```typescript
// src/services/api/companies.api.ts
import api from '@/plugins/axios'
import type { Company, CompanyFilters, CreateCompanyDTO, PaginatedResponse } from '@/types'

export const companiesApi = {
  async getAll(filters: CompanyFilters): Promise<PaginatedResponse<Company>> {
    const { data } = await api.get('/companies', { params: filters })
    return data
  },
  
  async getById(id: string): Promise<Company> {
    const { data } = await api.get(`/companies/${id}`)
    return data
  },
  
  async create(payload: CreateCompanyDTO): Promise<Company> {
    const { data } = await api.post('/companies', payload)
    return data
  },
  
  async update(id: string, payload: Partial<Company>): Promise<Company> {
    const { data } = await api.put(`/companies/${id}`, payload)
    return data
  },
  
  async delete(id: string): Promise<void> {
    await api.delete(`/companies/${id}`)
  },
  
  async generateCredentials(id: string): Promise<{ adminEmail: string; temporaryPassword: string }> {
    const { data } = await api.post(`/companies/${id}/generate-credentials`)
    return data
  },
}
```

---

## Type Definitions

```typescript
// src/types/index.ts
export * from './auth.types'
export * from './company.types'
export * from './subscription.types'
export * from './workflow.types'
export * from './onboarding.types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

```typescript
// src/types/auth.types.ts
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export type UserRole = 'super_admin' | 'ceo' | 'head_commercial' | 'company_secretary' | 'viewer'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}
```

```typescript
// src/types/workflow.types.ts
export interface Workflow {
  id: string
  type: WorkflowType
  referenceId: string
  currentStage: number
  status: WorkflowStatus
  initiatedBy: string
  history?: WorkflowAction[]
  createdAt: string
  completedAt?: string
}

export type WorkflowType = 'onboarding' | 'company_update' | 'subscription_change'
export type WorkflowStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested' | 'cancelled'

export interface WorkflowStage {
  order: number
  name: string
  role: string
  description: string
}

export interface WorkflowAction {
  id: string
  workflowId: string
  stage: number
  action: 'approve' | 'reject' | 'request_changes'
  userId: string
  userName?: string
  comment?: string
  timestamp: string
}

export interface ApprovalAction {
  action: 'approve' | 'reject' | 'request_changes'
  comment?: string
  timestamp: string
  userId: string
}

export interface WorkflowFilters {
  status: WorkflowStatus | null
  stage: number | null
  assignedToMe: boolean
  page: number
  limit: number
}
```

---

## Constants

```typescript
// src/utils/constants.ts
export const PERMISSION_CATEGORIES = {
  companies: {
    label: 'Company Management',
    permissions: [
      { code: 'company:create', label: 'Create Companies', description: 'Add new companies' },
      { code: 'company:read', label: 'View Companies', description: 'View company details' },
      { code: 'company:update', label: 'Update Companies', description: 'Modify company info' },
      { code: 'company:delete', label: 'Delete Companies', description: 'Remove companies' },
    ]
  },
  documents: {
    label: 'Document Management',
    permissions: [
      { code: 'document:upload', label: 'Upload Documents', description: 'Upload files' },
      { code: 'document:download', label: 'Download Documents', description: 'Download files' },
      { code: 'document:delete', label: 'Delete Documents', description: 'Remove documents' },
    ]
  },
  reports: {
    label: 'Reporting',
    permissions: [
      { code: 'report:view', label: 'View Reports', description: 'Access reports' },
      { code: 'report:export', label: 'Export Reports', description: 'Export to PDF/Excel' },
    ]
  },
  users: {
    label: 'User Management',
    permissions: [
      { code: 'user:invite', label: 'Invite Users', description: 'Invite new users' },
      { code: 'user:manage', label: 'Manage Users', description: 'Edit user roles' },
    ]
  },
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup with Vite + Vue 3 + TypeScript
- [ ] Install and configure Tailwind CSS + shadcn-vue
- [ ] Set up Pinia stores (auth, ui)
- [ ] Create layout components (Sidebar, Header)
- [ ] Implement login/logout flow
- [ ] Set up route guards

### Phase 2: Core Modules (Week 3-4)
- [ ] Dashboard with stats and charts
- [ ] Subscription management + Permission Matrix
- [ ] Companies list and detail views
- [ ] Company CRUD forms

### Phase 3: Workflow System (Week 5-6)
- [ ] Workflow list and detail views
- [ ] WorkflowTimeline component
- [ ] Approval/rejection UI
- [ ] Onboarding requests management

### Phase 4: Email & Polish (Week 7-8)
- [ ] SMTP configuration UI
- [ ] Email template editor
- [ ] Toast notifications
- [ ] Loading states and skeletons
- [ ] Error handling

### Phase 5: Testing & Deployment (Week 9-10)
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Performance optimization
- [ ] Build and deployment setup

---

## Best Practices Summary

1. **State Management**: Use Pinia with normalized data (Maps + ID arrays)
2. **Components**: Keep views smart (use stores), components dumb (use props)
3. **Styling**: Use Tailwind utilities + shadcn-vue components
4. **Type Safety**: Full TypeScript coverage for better DX
5. **API Layer**: Centralized Axios instance with interceptors
6. **Error Handling**: Optimistic updates with rollback on failure
7. **Performance**: Lazy load routes and heavy components
