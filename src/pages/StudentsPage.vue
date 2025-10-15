<template>
  <q-page padding>
    <q-card class="card-elevated anim-fade-up page-bg">
      <q-card-section>
        <div class="text-h6">Students</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-btn
            color="primary"
            @click="fetchStudents"
            class="btn-animated"
          >Refresh</q-btn>
          <q-btn
            color="secondary"
            @click="openNew"
            class="btn-animated"
          >New Student</q-btn>
        </div>

        <q-skeleton
          v-if="loading"
          type="table"
        />
        <q-table
          v-else
          :rows="students"
          :columns="columns"
          row-key="id"
          @request="fetchStudents"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <router-link
                :to="`/students/${props.row.id}`"
                class="text-primary"
              >{{ props.row.name }}</router-link>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-dialog v-model="showNew">
        <q-card style="min-width: 300px;">
          <q-card-section>
            <div class="text-h6">New Student</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="form.name"
              label="Name"
              dense
            />
            <q-input
              v-model="form.email"
              label="Email"
              dense
            />
            <q-input
              v-model="form.password"
              label="Password"
              type="password"
              dense
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              v-close-popup
            />
            <q-btn
              color="primary"
              label="Create"
              @click="createStudent"
              :loading="creating"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'


const students = ref([])
const loading = ref(false)
const showNew = ref(false)
const creating = ref(false)
const form = ref({ name: '', email: '', password: '' })

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
]

async function fetchStudents() {
  loading.value = true
  try {
    const res = await api.get('/api/students')
    students.value = res.data
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load students' })
  } finally {
    loading.value = false
  }
}

fetchStudents()

function openNew() {
  showNew.value = true
}

async function createStudent() {
  creating.value = true
  try {
    await api.post('/api/students', form.value)
    Notify.create({ type: 'positive', message: 'Student created' })
    showNew.value = false
    form.value = { name: '', email: '', password: '' }
    await fetchStudents()
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Create failed' })
    console.error(err)
  } finally {
    creating.value = false
  }
}
</script>
