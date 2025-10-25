import axios from 'axios'

// Shared Axios instance without importing Pinia stores to avoid circular deps
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})
// Using local axios instance; do not import from boot to avoid circular deps

// base API service helper
export default {
  get(path, params) {
    return api.get(path, { params }).then((r) => r.data)
  },
  post(path, data) {
    return api.post(path, data).then((r) => r.data)
  },
  put(path, data) {
    return api.put(path, data).then((r) => r.data)
  },
  delete(path) {
    return api.delete(path).then((r) => r.data)
  },
}
