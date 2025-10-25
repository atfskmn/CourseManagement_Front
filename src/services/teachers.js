import api from './api'

export function getTeachers() {
  return api.get('/teachers')
}

export function getTeacherById(id) {
  return api.get(`/teachers/${id}`)
}

export function createTeacher(payload) {
  return api.post('/teachers', payload)
}

export function updateTeacher(id, payload) {
  return api.put(`/teachers/${id}`, payload)
}

export function deleteTeacher(id) {
  return api.delete(`/teachers/${id}`)
}

export function getTeacherCourses(teacherId) {
  return api.get(`/teachers/${teacherId}/courses`)
}

export function createCourseForTeacher(teacherId, payload) {
  return api.post(`/teachers/${teacherId}/courses`, payload)
}

export function updateCourseForTeacher(teacherId, courseId, payload) {
  return api.put(`/teachers/${teacherId}/courses/${courseId}`, payload)
}

export function deleteCourseForTeacher(teacherId, courseId) {
  return api.delete(`/teachers/${teacherId}/courses/${courseId}`)
}
