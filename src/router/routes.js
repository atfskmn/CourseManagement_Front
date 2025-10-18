const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'courses', component: () => import('pages/CoursesPage.vue') },
      { path: 'cart', component: () => import('pages/CartPage.vue') },
      { path: 'orders', component: () => import('pages/OrdersPage.vue') },
      { path: 'students', component: () => import('pages/StudentsPage.vue') },
      { path: 'teachers', component: () => import('pages/TeachersPage.vue') },
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
