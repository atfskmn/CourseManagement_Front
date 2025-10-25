import api from './api'

export function getStats() {
  return api.get('/stats')
}
