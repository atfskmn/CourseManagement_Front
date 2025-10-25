const routes = [
  // Root should land on login; guard will reroute if already authenticated
  { path: '/', redirect: '/login' },
  // Test route - wrapped in AuthLayout so QPage works
  {
    path: '/test',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/TestPage.vue') }],
  },

  // Auth routes with lightweight layout (to satisfy QPage)
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/register-student',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterStudent.vue') }],
  },
  {
    path: '/register-teacher',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterTeacher.vue') }],
  },

  // Main routes with layout (authenticated sections)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // IndexPage is not needed when root redirects to /login
      {
        path: 'courses',
        component: () => import('pages/CoursesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'cart',
        component: () => import('pages/CartPage.vue'),
        meta: { requiresAuth: true, requiresStudent: true },
      },
      {
        path: 'orders',
        component: () => import('pages/OrdersPage.vue'),
        meta: { requiresAuth: true, requiresStudent: true },
      },
      {
        path: 'my-courses',
        component: () => import('pages/TeacherCoursesPage.vue'),
        meta: { requiresAuth: true, requiresTeacher: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
