<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Orders</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn color="primary" @click="fetchOrders">Refresh</q-btn>
        <div v-if="orders && orders.length">
          <div v-for="o in orders" :key="o.id">{{ o.code }} - {{ o.total }}</div>
        </div>
        <div v-else>No orders</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const orders = ref([])

async function fetchOrders() {
  try {
    const res = await api.get('/api/orders/student/1')
    orders.value = res.data
  } catch (err) {
    console.error(err)
  }
}

fetchOrders()
</script>
