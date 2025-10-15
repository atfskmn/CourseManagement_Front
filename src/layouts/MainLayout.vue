<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

            <q-toolbar-title> Quasar App </q-toolbar-title>

            <div class="row items-center">
              <div class="q-mr-sm">Quasar v{{ $q.version }}</div>
              <div v-if="auth.user">{{ auth.user.name }}</div>
              <q-btn v-if="!auth.user" dense flat label="Login" @click="$router.push('/login')" />
              <q-btn v-else dense flat label="Logout" @click="logout" />
            </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <q-item clickable v-for="link in linksList" :key="link.title" @click="$router.push(link.link)">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
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

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
]

// add app-specific links
linksList.unshift(
  { title: 'Home', caption: 'Overview', icon: 'home', link: '/' },
  { title: 'Students', caption: 'Students', icon: 'person', link: '/students' },
  { title: 'Teachers', caption: 'Teachers', icon: 'school', link: '/teachers' },
  { title: 'Courses', caption: 'Courses', icon: 'menu_book', link: '/courses' },
  { title: 'Cart', caption: 'Cart', icon: 'shopping_cart', link: '/cart' },
  { title: 'Orders', caption: 'Orders', icon: 'receipt', link: '/orders' }
)

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
