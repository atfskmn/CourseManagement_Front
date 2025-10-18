import api from './api'

export function getTeachers() {
  return api.get('/api/teachers')
}

export function getTeacherById(id) {
  return api.get(`/api/teachers/${id}`)
}

export function createTeacher(payload) {
  return api.post('/api/teachers', payload)
}

export function updateTeacher(id, payload) {
  return api.put(`/api/teachers/${id}`, payload)
}

export function deleteTeacher(id) {
  return api.delete(`/api/teachers/${id}`)
}

export function getTeacherCourses(teacherId) {
  return api.get(`/api/teachers/${teacherId}/courses`)
}

export function createCourseForTeacher(teacherId, payload) {
  return api.post(`/api/teachers/${teacherId}/courses`, payload)
}

export function updateCourseForTeacher(teacherId, courseId, payload) {
  return api.put(`/api/teachers/${teacherId}/courses/${courseId}`, payload)
}

export function deleteCourseForTeacher(teacherId, courseId) {
  return api.delete(`/api/teachers/${teacherId}/courses/${courseId}`)
}
