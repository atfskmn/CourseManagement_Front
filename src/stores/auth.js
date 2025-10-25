import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    role: localStorage.getItem('role') || null,
    entityId: localStorage.getItem('entityId') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isStudent: (state) => state.role === 'STUDENT',
    isTeacher: (state) => state.role === 'TEACHER',
    currentUserId: (state) => (state.entityId ? parseInt(state.entityId) : null),
  },

  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/auth/login', { username, password })
        const { token, entityId, role, email } = response.data

        this.token = token
        this.entityId = entityId
        this.role = role
        this.user = { username, email, role }

        localStorage.setItem('token', token)
        localStorage.setItem('entityId', entityId)
        localStorage.setItem('role', role)
        localStorage.setItem('user', JSON.stringify(this.user))

        return { success: true, role }
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async registerStudent(username, password, name, email) {
      try {
        const response = await api.post('/auth/register', {
          username,
          password,
          name,
          email,
          role: 'STUDENT',
        })

        const { token, entityId, role } = response.data

        this.token = token
        this.entityId = entityId
        this.role = role
        this.user = { username, email, role }

        localStorage.setItem('token', token)
        localStorage.setItem('entityId', entityId)
        localStorage.setItem('role', role)
        localStorage.setItem('user', JSON.stringify(this.user))

        return { success: true, role }
      } catch (error) {
        console.error('Student registration failed:', error)
        throw error
      }
    },

    async registerTeacher(username, password, name, email) {
      try {
        const response = await api.post('/auth/register', {
          username,
          password,
          name,
          email,
          role: 'TEACHER',
        })

        const { token, entityId, role } = response.data

        this.token = token
        this.entityId = entityId
        this.role = role
        this.user = { username, email, role }

        localStorage.setItem('token', token)
        localStorage.setItem('entityId', entityId)
        localStorage.setItem('role', role)
        localStorage.setItem('user', JSON.stringify(this.user))

        return { success: true, role }
      } catch (error) {
        console.error('Teacher registration failed:', error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.role = null
      this.entityId = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('entityId')
    },
  },
})
