import api from './api'

export function placeOrder(studentId) {
  return api.post(`/api/orders/student/${studentId}/place`)
}

export function getOrder(orderCode) {
  return api.get(`/api/orders/${orderCode}`)
}

export function getOrdersForStudent(studentId) {
  return api.get(`/api/orders/student/${studentId}`)
}
