import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guard for protected routes
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    console.log('Navigation:', {
      path: to.path,
      authenticated: authStore.isAuthenticated,
      role: authStore.role,
    })

    // Redirect root to login if not authenticated
    if (to.path === '/' && !authStore.isAuthenticated) {
      console.log('Redirecting to /login - not authenticated')
      next('/login')
      return
    }

    // If authenticated and on root, redirect to appropriate dashboard
    if (to.path === '/' && authStore.isAuthenticated) {
      if (authStore.isStudent) {
        console.log('Redirecting student to /courses')
        next('/courses')
      } else if (authStore.isTeacher) {
        console.log('Redirecting teacher to /my-courses')
        next('/my-courses')
      } else {
        console.log('Unknown role, staying on /')
        next()
      }
      return
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log('Route requires auth, redirecting to /login')
      next('/login')
      return
    }

    // Check if route requires student role
    if (to.meta.requiresStudent && !authStore.isStudent) {
      console.log('Route requires student, redirecting to /courses')
      next('/courses')
      return
    }

    // Check if route requires teacher role
    if (to.meta.requiresTeacher && !authStore.isTeacher) {
      console.log('Route requires teacher, redirecting to /my-courses')
      next('/my-courses')
      return
    }

    // If already logged in, redirect from login/register to appropriate dashboard
    if ((to.path === '/login' || to.path.startsWith('/register')) && authStore.isAuthenticated) {
      if (authStore.isStudent) {
        console.log('Already logged in as student, redirecting to /courses')
        next('/courses')
      } else if (authStore.isTeacher) {
        console.log('Already logged in as teacher, redirecting to /my-courses')
        next('/my-courses')
      } else {
        next('/')
      }
      return
    }

    console.log('Allowing navigation to:', to.path)
    next()
  })

  return Router
})
