<template>
  <q-page
    class="flex flex-center"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;"
  >
    <q-card
      class="q-pa-md shadow-10"
      style="width: 400px; max-width: 90vw;"
    >
      <q-card-section>
        <div
          class="text-h4 text-center text-weight-bold q-mb-md"
          style="color: #667eea;"
        >
          <q-icon
            name="school"
            size="48px"
            class="q-mr-sm"
          />
          Login
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit.prevent="handleLogin"
          class="q-gutter-md"
        >
          <q-input
            v-model="username"
            label="Username"
            outlined
            dense
            color="primary"
            :rules="[val => !!val || 'Username is required']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            dense
            color="primary"
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width q-mt-md"
            size="md"
            :loading="loading"
            unelevated
          />
        </q-form>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section class="text-center">
        <div class="text-body2 text-grey-8 q-mb-md">Don't have an account?</div>
        <div class="row q-gutter-sm justify-center">
          <q-btn
            outline
            color="primary"
            label="Register as Student"
            @click="$router.push('/register-student')"
            size="sm"
          />
          <q-btn
            outline
            color="secondary"
            label="Register as Teacher"
            @click="$router.push('/register-teacher')"
            size="sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const result = await authStore.login(username.value, password.value)

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: 'Login successful!',
        position: 'top'
      })

      // Redirect based on role
      if (result.role === 'STUDENT') {
        router.push('/courses')
      } else if (result.role === 'TEACHER') {
        router.push('/my-courses')
      }
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>
