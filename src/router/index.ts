import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { title: 'Login', requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../views/subscriptions/SubscriptionsView.vue'),
      meta: { title: 'Subscriptions', requiresAuth: true },
    },
    {
      path: '/workflows',
      name: 'workflows',
      component: () => import('../views/workflows/WorkflowsView.vue'),
      meta: { title: 'Workflows', requiresAuth: true },
    },
    {
      path: '/workflows/:id',
      name: 'workflow-detail',
      component: () => import('../views/workflows/WorkflowDetailView.vue'),
      meta: { title: 'Edit Workflow', requiresAuth: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/onboarding/OnboardingView.vue'),
      meta: { title: 'Onboarding Requests', requiresAuth: true },
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/companies/CompaniesView.vue'),
      meta: { title: 'Companies', requiresAuth: true },
    },
    {
      path: '/smtp',
      name: 'smtp',
      component: () => import('../views/dashboard/DashboardView.vue'), // Placeholder
      meta: { title: 'SMTP Settings', requiresAuth: true },
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next('/dashboard')
  } else {
    next()
  }
})

export default router
