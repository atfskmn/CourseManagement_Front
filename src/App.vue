<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

const $q = useQuasar()

onMounted(() => {
  // Enable dark mode
  $q.dark.set(true)
})
</script>
