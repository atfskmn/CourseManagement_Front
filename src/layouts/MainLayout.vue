<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <q-toolbar class="anim-fade-up">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        />

        <q-toolbar-title class="text-weight-bold">Course Management</q-toolbar-title>

        <div class="row items-center">
          <div class="q-mr-sm">Quasar v{{ $q.version }}</div>
          <div
            v-if="auth.user"
            class="q-mr-md accent-tag"
          >{{ auth.user.name }}</div>
          <q-btn
            v-if="!auth.user"
            dense
            flat
            label="Login"
            color="white"
            @click="$router.push('/login')"
            class="btn-animated"
          />
          <q-btn
            v-else
            dense
            flat
            label="Logout"
            color="white"
            @click="logout"
            class="btn-animated"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list class="q-pa-sm">
        <q-item-label
          header
          class="text-weight-medium"
        >Navigation</q-item-label>

        <q-item
          clickable
          v-for="link in linksList"
          :key="link.title"
          @click="$router.push(link.link)"
          class="anim-fade-up"
        >
          <q-item-section avatar>
            <q-icon
              :name="link.icon"
              class="text-primary"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
// EssentialLink component is no longer used here (we use simple q-item navigation)
import { useAuthStore } from 'stores/auth'

// keep only in-app navigation links to minimize icon usage
const linksList = [
  { title: 'Home', caption: 'Overview', icon: 'home', link: '/' },
  { title: 'Students', caption: 'Students', icon: 'person', link: '/students' },
  { title: 'Teachers', caption: 'Teachers', icon: 'school', link: '/teachers' },
  { title: 'Courses', caption: 'Courses', icon: 'menu_book', link: '/courses' },
  { title: 'Cart', caption: 'Cart', icon: 'shopping_cart', link: '/cart' },
  { title: 'Orders', caption: 'Orders', icon: 'receipt', link: '/orders' }
]

const leftDrawerOpen = ref(false)
const auth = useAuthStore()

function logout() {
  auth.logout()
  // simple notify
  // use $q or Notify in components; keep minimal here
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
