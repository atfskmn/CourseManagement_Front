import api from './api'

export function registerStudent(payload) {
  return api.post('/api/students', payload)
}

export function getStudent(id) {
  return api.get(`/api/students/${id}`)
}

export function getAllStudents() {
  return api.get('/api/students')
}

export function updateStudent(id, payload) {
  return api.put(`/api/students/${id}`, payload)
}

export function deleteStudent(id) {
  return api.delete(`/api/students/${id}`)
}

export function getStudentCourses(studentId) {
  return api.get(`/api/students/${studentId}/courses`)
}

export function placeStudentOrder(studentId) {
  return api.post(`/api/students/${studentId}/orders`)
}

export function getStudentOrders(studentId) {
  return api.get(`/api/students/${studentId}/orders`)
}

export function getOrderForCode(orderCode) {
  return api.get(`/api/students/orders/${orderCode}`)
}
