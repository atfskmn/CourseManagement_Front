import { api } from 'boot/axios'

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
