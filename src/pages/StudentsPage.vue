<template>
  <q-page padding>
    <div class="row items-center q-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h6">Students</div>
      </div>
      <div class="col-auto">
        <q-input
          ref="searchInput"
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search students..."
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
          label="Add Student"
          @click="showAdd = true"
        />
      </div>
    </div>

    <q-list bordered>
      <q-item
        v-for="s in filteredStudents"
        :key="s.id"
      >
        <q-item-section>
          <q-item-label>{{ s.name }}</q-item-label>
          <q-item-label caption>{{ s.email }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            color="info"
            icon="visibility"
            @click="viewStudent(s)"
          />
          <q-btn
            flat
            color="primary"
            icon="edit"
            @click="editStudent(s)"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            @click="confirmDelete(s)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAdd">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editMode ? 'Edit Student' : 'Add Student' }}</div>
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
            @click="cancelEdit"
          />
          <q-btn
            color="primary"
            :label="editMode ? 'Update' : 'Create'"
            @click="submit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showDetail"
      v-if="selectedStudent"
    >
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{ selectedStudent.name }} - Details</div>
          <div class="text-caption">{{ selectedStudent.email }}</div>
        </q-card-section>

        <q-card-section>
          <q-tabs
            v-model="detailTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab
              name="courses"
              label="Courses"
            />
            <q-tab
              name="cart"
              label="Cart"
            />
            <q-tab
              name="orders"
              label="Orders"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels
            v-model="detailTab"
            animated
          >
            <q-tab-panel name="courses">
              <q-list bordered>
                <q-item
                  v-for="c in studentCourses"
                  :key="c.id"
                >
                  <q-item-section>
                    <q-item-label>{{ c.name }}</q-item-label>
                    <q-item-label caption>${{ c.price }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="studentCourses.length === 0">
                  <q-item-section>
                    <q-item-label caption>No enrolled courses</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="cart">
              <div v-if="studentCart">
                <q-list bordered>
                  <q-item
                    v-for="item in studentCart.items"
                    :key="item.courseId"
                  >
                    <q-item-section>
                      <q-item-label>{{ item.courseName }}</q-item-label>
                      <q-item-label caption>${{ item.price }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="studentCart.items.length === 0">
                    <q-item-section>
                      <q-item-label caption>Cart is empty</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div class="q-mt-md text-h6">Total: ${{ studentCart.totalPrice || 0 }}</div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="orders">
              <q-list bordered>
                <q-item
                  v-for="o in studentOrders"
                  :key="o.id"
                >
                  <q-item-section>
                    <q-item-label>Order: {{ o.orderCode }}</q-item-label>
                    <q-item-label caption>Status: {{ o.status }} - ${{ o.totalPrice }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="studentOrders.length === 0">
                  <q-item-section>
                    <q-item-label caption>No orders yet</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getAllStudents, registerStudent, updateStudent, deleteStudent, getStudentCourses, getStudentOrders } from '../services/students'
import { getCart } from '../services/cart'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const students = ref([])

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const q = searchQuery.value.toLowerCase()
  return students.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q)
  )
})
const showAdd = ref(false)
const form = ref({ name: '', email: '' })
const editMode = ref(false)

const showDetail = ref(false)
const selectedStudent = ref(null)
const studentCourses = ref([])
const studentOrders = ref([])
const studentCart = ref(null)
const detailTab = ref('courses')
const editingId = ref(null)
const searchQuery = ref('')

const route = useRoute()
const searchInput = ref(null)

async function load() {
  students.value = await getAllStudents()
}

onMounted(async () => {
  await load()
  if (route.query.from === 'courses') {
    // focus the search input so user can start typing immediately
    nextTick(() => {
      if (searchInput.value && typeof searchInput.value.focus === 'function') {
        searchInput.value.focus()
      } else if (searchInput.value && searchInput.value.$el) {
        // fallback to focusing the underlying element
        const el = searchInput.value.$el.querySelector('input')
        if (el) el.focus()
      }
    })
  }
})

async function viewStudent(student) {
  selectedStudent.value = student
  showDetail.value = true
  detailTab.value = 'courses'
  try {
    studentCourses.value = await getStudentCourses(student.id)
    studentOrders.value = await getStudentOrders(student.id)
    studentCart.value = await getCart(student.id)
  } catch (err) {
    console.error('Failed to load student details', err)
  }
}

// onMounted handled above

async function submit() {
  try {
    if (editMode.value) {
      await updateStudent(editingId.value, form.value)
    } else {
      await registerStudent(form.value)
    }
    cancelEdit()
    await load()
  } catch (err) {
    console.error('Failed to save student', err)
  }
}

function editStudent(student) {
  editMode.value = true
  editingId.value = student.id
  form.value = { name: student.name, email: student.email }
  showAdd.value = true
}

function cancelEdit() {
  showAdd.value = false
  editMode.value = false
  editingId.value = null
  form.value = { name: '', email: '' }
}

function confirmDelete(student) {
  $q.dialog({
    title: 'Confirm',
    message: `Delete student ${student.name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteStudent(student.id)
      await load()
    } catch (err) {
      console.error('Failed to delete student', err)
    }
  })
}
</script>
