import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)

  function setToken(t) {
    token.value = t
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
    // set axios header
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`
    else delete api.defaults.headers.common.Authorization
  }

  async function login(credentials) {
    const res = await api.post('/api/auth/login', credentials)
    setToken(res.data.token)
    user.value = res.data.user || null
    return res
  }

  function logout() {
    setToken('')
    user.value = null
  }

  // initialize axios header if token exists
  if (token.value) api.defaults.headers.common.Authorization = `Bearer ${token.value}`

  return { token, user, login, logout }
})
