import api from './api'

export function placeOrder(studentId) {
  return api.post(`/orders/student/${studentId}/place`)
}

export function getOrder(orderCode) {
  return api.get(`/orders/${orderCode}`)
}

export function getOrdersForStudent(studentId) {
  return api.get(`/orders/student/${studentId}`)
}
