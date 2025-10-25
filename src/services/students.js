import api from './api'

export function registerStudent(payload) {
  return api.post('/students', payload)
}

export function getStudent(id) {
  return api.get(`/students/${id}`)
}

export function getAllStudents() {
  return api.get('/students')
}

export function updateStudent(id, payload) {
  return api.put(`/students/${id}`, payload)
}

export function deleteStudent(id) {
  return api.delete(`/students/${id}`)
}

export function getStudentCourses(studentId) {
  return api.get(`/students/${studentId}/courses`)
}

export function placeStudentOrder(studentId) {
  return api.post(`/students/${studentId}/orders`)
}

export function getStudentOrders(studentId) {
  return api.get(`/students/${studentId}/orders`)
}

export function getOrderForCode(orderCode) {
  return api.get(`/students/orders/${orderCode}`)
}
