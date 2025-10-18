import api from './api'

export function getAllCourses() {
  return api.get('/api/courses')
}

export function getAvailableCourses() {
  return api.get('/api/courses/available')
}

export function getCoursesForStudent(studentId) {
  return api.get(`/api/courses/student/${studentId}`)
}
