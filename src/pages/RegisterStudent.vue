<template>
  <q-page
    class="flex flex-center"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;"
  >
    <q-card
      class="q-pa-md shadow-10"
      style="width: 450px; max-width: 90vw;"
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
          Student Registration
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="handleRegister"
          class="q-gutter-md"
        >
          <q-input
            v-model="form.name"
            label="Name"
            outlined
            :rules="[val => !!val || 'Name is required']"
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Email must be valid'
            ]"
          />

          <q-input
            v-model="form.username"
            label="Username"
            outlined
            :rules="[val => !!val || 'Username is required']"
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 6 || 'Password must be at least 6 characters'
            ]"
          />

          <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            :rules="[
              val => !!val || 'Please confirm password',
              val => val === form.password || 'Passwords do not match'
            ]"
          />

          <q-btn
            type="submit"
            label="Register"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-caption">Already have an account?</div>
        <q-btn
          flat
          color="primary"
          label="Login"
          @click="$router.push('/login')"
        />
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

const form = ref({
  name: '',
  email: '',
  username: '',
  password: ''
})
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    const result = await authStore.registerStudent(
      form.value.username,
      form.value.password,
      form.value.name,
      form.value.email
    )

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: 'Registration successful! Redirecting to courses...',
        position: 'top'
      })
      // Redirect to courses page (student dashboard)
      router.push('/courses')
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Registration failed. Please try again.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>
