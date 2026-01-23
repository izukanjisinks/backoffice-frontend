import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { title: 'Dashboard' },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../views/dashboard/DashboardView.vue'), // Placeholder
      meta: { title: 'Subscriptions' },
    },
    {
      path: '/workflows',
      name: 'workflows',
      component: () => import('../views/workflows/WorkflowsView.vue'),
      meta: { title: 'Workflows' },
    },
    {
      path: '/workflows/:id',
      name: 'workflow-detail',
      component: () => import('../views/workflows/WorkflowDetailView.vue'),
      meta: { title: 'Edit Workflow' },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/dashboard/DashboardView.vue'), // Placeholder
      meta: { title: 'Onboarding Requests' },
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/companies/CompaniesView.vue'),
      meta: { title: 'Companies' },
    },
    {
      path: '/smtp',
      name: 'smtp',
      component: () => import('../views/dashboard/DashboardView.vue'), // Placeholder
      meta: { title: 'SMTP Settings' },
    },
  ],
})

export default router
