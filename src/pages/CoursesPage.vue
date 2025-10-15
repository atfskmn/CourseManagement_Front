<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Courses</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn color="primary" @click="fetchCourses">Refresh</q-btn>
        <q-table :rows="courses" :columns="columns" row-key="id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

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
</script>
