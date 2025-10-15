import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

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
    // backend returns { token, role, userId, name }
    user.value = {
      id: res.data.userId,
      name: res.data.name,
      role: res.data.role,
    }
    if (user.value) localStorage.setItem('user', JSON.stringify(user.value))
    return res
  }

  function logout() {
    setToken('')
    user.value = null
    localStorage.removeItem('user')
  }

  // initialize axios header and user if token exists
  if (token.value) api.defaults.headers.common.Authorization = `Bearer ${token.value}`
  if (token.value && !user.value) {
    // try to read persisted user
    const persisted = localStorage.getItem('user')
    if (persisted) user.value = JSON.parse(persisted)
  }

  return { token, user, login, logout }
})
