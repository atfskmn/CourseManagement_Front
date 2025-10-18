import api from './api'

export function getCart(studentId) {
  return api.get(`/api/carts/student/${studentId}`)
}

export function addCourseToCart(studentId, courseId) {
  return api.post(`/api/carts/student/${studentId}/courses/${courseId}`)
}

export function removeCourseFromCart(studentId, courseId) {
  return api.delete(`/api/carts/student/${studentId}/courses/${courseId}`)
}

export function emptyCart(studentId) {
  return api.delete(`/api/carts/student/${studentId}/empty`)
}

export function updateCart(cartRequest) {
  return api.put('/api/carts', cartRequest)
}
