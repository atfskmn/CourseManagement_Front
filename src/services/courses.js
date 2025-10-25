import api from './api'

export function getAllCourses() {
  return api.get('/courses')
}

export function getAvailableCourses() {
  return api.get('/courses/available')
}

export function getCoursesForStudent(studentId) {
  return api.get(`/courses/student/${studentId}`)
}
