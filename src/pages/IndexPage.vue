<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <q-spinner-dots color="primary" size="50px" />
      <div class="q-mt-md text-h6">Yönlendiriliyor...</div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Redirect based on role
  if (authStore.isStudent) {
    router.push('/courses')
  } else if (authStore.isTeacher) {
    router.push('/my-courses')
  } else {
    router.push('/login')
  }
})
</script>
