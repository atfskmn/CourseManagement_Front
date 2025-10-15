<template>
  <q-page padding>
    <q-card class="q-ma-md" style="max-width: 400px; margin: auto">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="doLogin" ref="form">
          <q-input v-model="email" label="Email" type="email" dense />
          <q-input v-model="password" label="Password" type="password" dense />
          <div class="q-mt-md">
            <q-btn label="Login" color="primary" type="submit" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function doLogin() {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    Notify.create({ type: 'positive', message: 'Logged in' })
    router.push('/')
  } catch (err) {
    Notify.create({ type: 'negative', message: err.response?.data?.message || 'Login failed' })
  } finally {
    loading.value = false
  }
}
</script>
