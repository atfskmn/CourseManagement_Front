<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h1 class="text-h3 text-white">Test Page Works!</h1>
      <p class="text-h6 text-grey-4">If you see this, Vue Router is working</p>
      <q-btn
        color="primary"
        label="Go to Login"
        to="/login"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup>
console.log('TestPage loaded!')
</script>
