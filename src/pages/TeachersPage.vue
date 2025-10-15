<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Teachers</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn color="primary" @click="fetchTeachers">Refresh</q-btn>
        <q-table :rows="teachers" :columns="columns" row-key="id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const teachers = ref([])

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'expertise', label: 'Expertise', field: 'expertise' },
]

async function fetchTeachers() {
  try {
    const res = await api.get('/api/teachers')
    teachers.value = res.data
  } catch (err) {
    console.error(err)
  }
}

fetchTeachers()
</script>
