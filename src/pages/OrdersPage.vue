<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">My Orders</div>

    <div class="row q-mb-md q-gutter-md">
      <div class="col-4">
        <q-input
          v-model="orderCodeSearch"
          outlined
          dense
          placeholder="Search by order code..."
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn
              flat
              color="primary"
              label="Search"
              @click="searchByCode"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div>
      <q-list bordered>
        <q-item
          v-for="order in orders"
          :key="order.id"
          clickable
          @click="viewOrder(order)"
        >
          <q-item-section>
            <q-item-label>Order: {{ order.orderCode }}</q-item-label>
            <q-item-label caption>Status: {{ order.status }} - Total: ${{ order.totalPrice }}</q-item-label>
            <q-item-label
              caption
              v-if="order.orderDate"
            >Date: {{ formatDate(order.orderDate) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="orders.length === 0">
          <q-item-section>
            <q-item-label caption>No orders yet</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog
      v-model="showDetail"
      v-if="selectedOrder"
    >
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Order {{ selectedOrder.orderCode }}</div>
          <div class="text-caption">Status: {{ selectedOrder.status }}</div>
        </q-card-section>

        <q-card-section>
          <q-list bordered>
            <q-item
              v-for="item in selectedOrder.items"
              :key="item.id"
            >
              <q-item-section>
                <q-item-label>{{ item.course?.name || 'Course' }}</q-item-label>
                <q-item-label caption>${{ item.price }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-mt-md text-h6">Total: ${{ selectedOrder.totalPrice }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            v-close-popup
            @click="showDetail = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrdersForStudent, getOrder } from '../services/orders'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const orders = ref([])
const studentId = 1

const showDetail = ref(false)
const selectedOrder = ref(null)
const orderCodeSearch = ref('')

onMounted(async () => {
  orders.value = await getOrdersForStudent(studentId)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

function viewOrder(order) {
  selectedOrder.value = order
  showDetail.value = true
}

async function searchByCode() {
  if (!orderCodeSearch.value) {
    $q.notify({
      type: 'warning',
      message: 'Please enter an order code'
    })
    return
  }
  try {
    const order = await getOrder(orderCodeSearch.value)
    selectedOrder.value = order
    showDetail.value = true
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Order not found or error occurred'
    })
    console.error('Failed to fetch order', err)
  }
}
</script>
