<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">My Courses</div>
        <q-btn
          color="primary"
          label="Add Course"
          @click="showAddDialog = true"
        />
      </div>

      <q-table
        :rows="courses"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="editCourse(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="deleteCourse(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Add/Edit Course Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editMode ? 'Edit Course' : 'Add Course' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="saveCourse"
            class="q-gutter-md"
          >
            <q-input
              v-model="courseForm.name"
              label="Name"
              outlined
              :rules="[val => !!val || 'Name is required']"
            />

            <q-input
              v-model="courseForm.description"
              label="Description"
              type="textarea"
              outlined
              rows="3"
              :rules="[val => !!val || 'Description is required']"
            />

            <q-input
              v-model.number="courseForm.price"
              label="Price"
              type="number"
              outlined
              :rules="[val => val > 0 || 'Price must be greater than 0']"
            />

            <q-input
              v-model.number="courseForm.maxStudents"
              label="Max Students"
              type="number"
              outlined
              :rules="[val => val >= 0 || 'Max students must be 0 or more']"
            />

            <q-toggle
              v-model="courseForm.isAvailable"
              label="Available"
              color="primary"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancel"
                flat
                @click="closeDialog"
              />
              <q-btn
                type="submit"
                label="Save"
                color="primary"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Notify, Dialog } from 'quasar'
import { getTeacherCourses, createCourseForTeacher, updateCourseForTeacher, deleteCourseForTeacher } from '../services/teachers'

const authStore = useAuthStore()

const courses = ref([])
const loading = ref(false)
const showAddDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)

const courseForm = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  maxStudents: 0,
  isAvailable: true,
})

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'left', format: val => `$${val}` },
  { name: 'maxStudents', label: 'Max Students', field: 'maxStudents', align: 'left' },
  {
    name: 'available', label: 'Available', field: 'isAvailable', align: 'left',
    format: val => (val ? 'Open' : 'Closed')
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const fetchCourses = async () => {
  loading.value = true
  try {
    const teacherId = authStore.currentUserId
    courses.value = await getTeacherCourses(teacherId)
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Failed to load courses',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const saveCourse = async () => {
  saving.value = true
  try {
    const teacherId = authStore.currentUserId
    const payload = {
      name: courseForm.value.name,
      description: courseForm.value.description,
      price: courseForm.value.price,
      maxStudents: courseForm.value.maxStudents,
      isAvailable: courseForm.value.isAvailable
    }

    if (editMode.value) {
      await updateCourseForTeacher(teacherId, courseForm.value.id, payload)
      Notify.create({ type: 'positive', message: 'Course updated successfully', position: 'top' })
    } else {
      await createCourseForTeacher(teacherId, payload)
      Notify.create({ type: 'positive', message: 'Course created successfully', position: 'top' })
    }

    closeDialog()
    fetchCourses()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save course',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

const editCourse = (course) => {
  editMode.value = true
  courseForm.value = { id: course.id, name: course.name, description: course.description, price: course.price, maxStudents: course.maxStudents, isAvailable: course.isAvailable }
  showAddDialog.value = true
}

const deleteCourse = (courseId) => {
  Dialog.create({
    title: 'Confirm',
    message: 'Are you sure you want to delete this course?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const teacherId = authStore.currentUserId
      await deleteCourseForTeacher(teacherId, courseId)
      Notify.create({ type: 'positive', message: 'Course deleted successfully', position: 'top' })
      fetchCourses()
    } catch {
      Notify.create({ type: 'negative', message: 'Failed to delete course', position: 'top' })
    }
  })
}

const closeDialog = () => {
  showAddDialog.value = false
  editMode.value = false
  courseForm.value = { id: null, name: '', description: '', price: 0, maxStudents: 0, isAvailable: true }
}

onMounted(() => {
  fetchCourses()
})
</script>
