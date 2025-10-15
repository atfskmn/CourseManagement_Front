<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Student Detail</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-if="student">
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
          <div class="q-mt-md">
            <q-btn
              color="primary"
              label="Save"
              @click="save"
              :loading="saving"
            />
          </div>
        </div>
        <div v-else>
          <q-skeleton type="text" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

const route = useRoute()
const student = ref(null)
const form = ref({ name: '', email: '' })
const saving = ref(false)

async function load() {
  try {
    const res = await api.get(`/api/students/${route.params.id}`)
    student.value = res.data
    form.value = { name: res.data.name, email: res.data.email }
  } catch (err) {
    console.error(err)
  }
}

onMounted(load)

async function save() {
  saving.value = true
  try {
    await api.put(`/api/students/${route.params.id}`, form.value)
    Notify.create({ type: 'positive', message: 'Saved' })
    await load()
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Save failed' })
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>
