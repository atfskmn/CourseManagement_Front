<template>
  <q-page padding>
    <q-card class="card-elevated anim-fade-up">
      <q-card-section>
        <div class="text-h6">Register Teacher</div>
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
          to="/"
        />
        <q-btn
          color="primary"
          label="Register"
          @click="register"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function register() {
  loading.value = true
  try {
    const res = await api.post('/api/auth/register-teacher', form.value)
    auth.setToken(res.data.token)
    auth.user = { id: res.data.userId, name: res.data.name, role: res.data.role }
    localStorage.setItem('user', JSON.stringify(auth.user))
    Notify.create({ type: 'positive', message: 'Registered' })
    router.push('/')
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Register failed' })
  } finally {
    loading.value = false
  }
}
</script>
