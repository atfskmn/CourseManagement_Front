import api from './api'

export function getCart(studentId) {
  return api.get(`/carts/student/${studentId}`)
}

export function addCourseToCart(studentId, courseId) {
  return api.post(`/carts/student/${studentId}/courses/${courseId}`)
}

export function removeCourseFromCart(studentId, courseId) {
  return api.delete(`/carts/student/${studentId}/courses/${courseId}`)
}

export function emptyCart(studentId) {
  return api.delete(`/carts/student/${studentId}/empty`)
}

export function updateCart(cartRequest) {
  return api.put('/carts', cartRequest)
}
