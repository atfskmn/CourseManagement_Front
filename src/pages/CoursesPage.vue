<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Courses</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn
          color="primary"
          @click="fetchCourses"
        >Refresh</q-btn>
        <q-table
          :rows="courses"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="isStudent"
                size="sm"
                color="secondary"
                label="Buy"
                @click="buyCourse(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const user = JSON.parse(localStorage.getItem('user') || 'null')
const isStudent = user && user.role === 'STUDENT'

const courses = ref([])

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'price', label: 'Price', field: 'price' },
]

async function fetchCourses() {
  try {
    const res = await api.get('/api/courses')
    courses.value = res.data
  } catch (err) {
    console.error(err)
  }
}

fetchCourses()

const router = useRouter()
async function buyCourse(course) {
  if (!isStudent) return
  try {
    await api.post(`/api/cart/${course.id}`)
    // navigate to cart
    router.push('/app/cart')
  } catch (err) {
    console.error(err)
  }
}
</script>
