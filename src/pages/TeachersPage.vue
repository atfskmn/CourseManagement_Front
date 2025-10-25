<template>
  <q-page padding>
    <div class="row items-center q-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h6">Teachers</div>
      </div>
      <div class="col-auto">
        <q-input
          ref="searchInput"
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search teachers..."
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn
          color="primary"
          label="Add Teacher"
          @click="showAdd = true"
        />
      </div>
    </div>

    <q-list bordered>
      <q-item
        v-for="t in filteredTeachers"
        :key="t.id"
      >
        <q-item-section
          clickable
          @click="viewTeacher(t)"
        >
          <q-item-label>{{ t.name }}</q-item-label>
          <q-item-label caption>{{ t.email }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            color="primary"
            icon="edit"
            @click.stop="editTeacher(t)"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            @click.stop="confirmDeleteTeacher(t)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAdd">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editModeTeacher ? 'Edit Teacher' : 'Add Teacher' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submit">
            <q-input
              v-model="form.name"
              label="Name"
              required
            />
            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              required
              class="q-mt-sm"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="cancelEditTeacher"
          />
          <q-btn
            color="primary"
            :label="editModeTeacher ? 'Update' : 'Create'"
            @click="submit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showDetail"
      v-if="selectedTeacher"
    >
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ selectedTeacher.name }}'s Courses</div>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            label="Add Course"
            @click="showAddCourse = true"
            class="q-mb-md"
          />
          <q-list bordered>
            <q-item
              v-for="c in teacherCourses"
              :key="c.id"
            >
              <q-item-section>
                <q-item-label>{{ c.name }}</q-item-label>
                <q-item-label caption>{{ c.description }} - ${{ c.price }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  @click="editCourse(c)"
                />
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  @click="confirmDeleteCourse(c)"
                />
              </q-item-section>
            </q-item>
            <q-item v-if="teacherCourses.length === 0">
              <q-item-section>
                <q-item-label caption>No courses yet</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            v-close-popup
            @click="showDetail = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddCourse">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editModeCourse ? 'Edit Course' : 'Add Course' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitCourse">
            <q-input
              v-model="courseForm.name"
              label="Course Name"
              required
            />
            <q-input
              v-model="courseForm.description"
              label="Description"
              type="textarea"
              class="q-mt-sm"
            />
            <q-input
              v-model.number="courseForm.price"
              label="Price"
              type="number"
              step="0.01"
              required
              class="q-mt-sm"
            />
            <q-input
              v-model.number="courseForm.maxStudents"
              label="Max Students"
              type="number"
              required
              class="q-mt-sm"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="cancelEditCourse"
          />
          <q-btn
            color="primary"
            :label="editModeCourse ? 'Update' : 'Create'"
            @click="submitCourse"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherCourses, createCourseForTeacher, updateCourseForTeacher, deleteCourseForTeacher } from '../services/teachers'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const teachers = ref([])
const route = useRoute()
const searchInput = ref(null)
const showAdd = ref(false)
const form = ref({ name: '', email: '' })
const editModeTeacher = ref(false)
const editingTeacherId = ref(null)
const searchQuery = ref('')

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value
  const q = searchQuery.value.toLowerCase()
  return teachers.value.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.email.toLowerCase().includes(q)
  )
})

const showDetail = ref(false)
const selectedTeacher = ref(null)
const teacherCourses = ref([])

const showAddCourse = ref(false)
const courseForm = ref({ name: '', description: '', price: 0, maxStudents: 1 })
const editModeCourse = ref(false)
const editingCourseId = ref(null)

async function load() {
  teachers.value = await getTeachers()
}

onMounted(async () => {
  await load()
  if (route.query.from === 'courses') {
    nextTick(() => {
      if (searchInput.value && typeof searchInput.value.focus === 'function') {
        searchInput.value.focus()
      } else if (searchInput.value && searchInput.value.$el) {
        const el = searchInput.value.$el.querySelector('input')
        if (el) el.focus()
      }
    })
  }
})

async function submit() {
  try {
    if (editModeTeacher.value) {
      await updateTeacher(editingTeacherId.value, form.value)
    } else {
      await createTeacher(form.value)
    }
    cancelEditTeacher()
    await load()
  } catch (err) {
    console.error('Failed to save teacher', err)
  }
}

function editTeacher(teacher) {
  editModeTeacher.value = true
  editingTeacherId.value = teacher.id
  form.value = { name: teacher.name, email: teacher.email }
  showAdd.value = true
}

function cancelEditTeacher() {
  showAdd.value = false
  editModeTeacher.value = false
  editingTeacherId.value = null
  form.value = { name: '', email: '' }
}

function confirmDeleteTeacher(teacher) {
  $q.dialog({
    title: 'Confirm',
    message: `Delete teacher ${teacher.name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteTeacher(teacher.id)
      await load()
    } catch (err) {
      console.error('Failed to delete teacher', err)
    }
  })
}

async function viewTeacher(teacher) {
  selectedTeacher.value = teacher
  showDetail.value = true
  try {
    teacherCourses.value = await getTeacherCourses(teacher.id)
  } catch (err) {
    console.error('Failed to load courses', err)
    teacherCourses.value = []
  }
}

async function submitCourse() {
  if (!selectedTeacher.value) return
  try {
    const payload = {
      ...courseForm.value,
      teacherId: selectedTeacher.value.id
    }
    if (editModeCourse.value) {
      await updateCourseForTeacher(selectedTeacher.value.id, editingCourseId.value, payload)
    } else {
      await createCourseForTeacher(selectedTeacher.value.id, payload)
    }
    cancelEditCourse()
    teacherCourses.value = await getTeacherCourses(selectedTeacher.value.id)
  } catch (err) {
    console.error('Failed to save course', err)
  }
}

function editCourse(course) {
  editModeCourse.value = true
  editingCourseId.value = course.id
  courseForm.value = {
    name: course.name,
    description: course.description || '',
    price: course.price,
    maxStudents: course.maxStudents
  }
  showAddCourse.value = true
}

function cancelEditCourse() {
  showAddCourse.value = false
  editModeCourse.value = false
  editingCourseId.value = null
  courseForm.value = { name: '', description: '', price: 0, maxStudents: 1 }
}

function confirmDeleteCourse(course) {
  $q.dialog({
    title: 'Confirm',
    message: `Delete course ${course.name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteCourseForTeacher(selectedTeacher.value.id, course.id)
      teacherCourses.value = await getTeacherCourses(selectedTeacher.value.id)
    } catch (err) {
      console.error('Failed to delete course', err)
    }
  })
}
</script>
