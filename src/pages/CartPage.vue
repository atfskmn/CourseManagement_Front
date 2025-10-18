<template>
  <q-page padding>
    <div>
      <div v-if="!cart">Loading...</div>
      <div v-else>
        <div class="text-h6 q-mb-md">Shopping Cart</div>
        <q-list bordered>
          <q-item
            v-for="item in cart.items"
            :key="item.courseId"
          >
            <q-item-section>
              <q-item-label>{{ item.courseName }}</q-item-label>
              <q-item-label caption>${{ item.price }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                color="negative"
                @click="remove(item)"
              >Remove</q-btn>
            </q-item-section>
          </q-item>
          <q-item v-if="cart.items.length === 0">
            <q-item-section>
              <q-item-label caption>Your cart is empty</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Total: ${{ cart.totalPrice || 0 }}</div>
          <q-btn
            color="primary"
            label="Place Order"
            @click="placeOrderAction"
            :disable="cart.items.length === 0"
          />
          <q-btn
            color="secondary"
            label="Empty Cart"
            @click="empty"
            class="q-ml-sm"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeCourseFromCart, emptyCart } from '../services/cart'
import { placeOrder } from '../services/orders'

const cart = ref(null)
const studentId = 1

onMounted(async () => {
  cart.value = await getCart(studentId)
})

async function remove(item) {
  await removeCourseFromCart(studentId, item.courseId)
  cart.value = await getCart(studentId)
}

async function empty() {
  await emptyCart(studentId)
  cart.value = await getCart(studentId)
}

async function placeOrderAction() {
  await placeOrder(studentId)
  // navigate to orders page (simple)
  window.location.href = '/orders'
}
</script>
