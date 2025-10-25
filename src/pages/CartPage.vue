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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { getCart, removeCourseFromCart, emptyCart } from '../services/cart'
import { placeOrder } from '../services/orders'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const cart = ref(null)
const studentId = computed(() => authStore.currentUserId)

onMounted(async () => {
  if (!authStore.isStudent || !studentId.value) {
    router.push('/login')
    return
  }
  await refreshCart()
})

async function refreshCart() {
  try {
    cart.value = await getCart(studentId.value)
    const count = cart.value && cart.value.items ? cart.value.items.length : 0
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count } }))
  } catch (err) {
    Notify.create({ type: 'negative', message: err?.response?.data?.message || 'Unable to load cart', position: 'top' })
  }
}

async function remove(item) {
  try {
    await removeCourseFromCart(studentId.value, item.courseId)
    await refreshCart()
    Notify.create({ type: 'positive', message: 'Item removed', position: 'top' })
  } catch (err) {
    Notify.create({ type: 'negative', message: err?.response?.data?.message || 'Failed to remove item', position: 'top' })
  }
}

async function empty() {
  try {
    await emptyCart(studentId.value)
    await refreshCart()
    Notify.create({ type: 'positive', message: 'Cart emptied', position: 'top' })
  } catch (err) {
    Notify.create({ type: 'negative', message: err?.response?.data?.message || 'Failed to empty cart', position: 'top' })
  }
}

async function placeOrderAction() {
  try {
    await placeOrder(studentId.value)
    Notify.create({ type: 'positive', message: 'Order placed successfully', position: 'top' })
    await refreshCart()
    router.push('/orders')
  } catch (err) {
    Notify.create({ type: 'negative', message: err?.response?.data?.message || 'Failed to place order', position: 'top' })
  }
}
</script>
