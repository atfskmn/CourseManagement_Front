<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Cart</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn color="primary" @click="fetchCart">Refresh</q-btn>
        <div v-if="cart">
          <div v-for="item in cart.courses" :key="item.id">
            {{ item.name }} - {{ item.price }}
          </div>
        </div>
        <div v-else>Empty</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const cart = ref(null)

async function fetchCart() {
  try {
    const res = await api.get('/api/carts/student/1')
    cart.value = res.data
  } catch (err) {
    console.error(err)
  }
}

fetchCart()
</script>
