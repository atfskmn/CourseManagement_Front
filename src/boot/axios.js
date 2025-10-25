import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { Notify } from 'quasar'

// api instance is created in services/api to avoid circular deps with stores

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()

      Notify.create({
        type: 'negative',
        message: 'Session expired. Please login again.',
        position: 'top',
      })

      // Redirect to login (hash mode)
      if (!window.location.hash.includes('/login')) {
        window.location.href = '/#/login'
      }
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
