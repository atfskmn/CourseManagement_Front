<template>
  <q-layout
    view="lHh Lpr lFf"
    class="modern-layout"
  >
    <!-- Animated Gradient Header -->
    <q-header
      elevated
      class="gradient-header"
    >
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="hover-scale"
        />

        <q-toolbar-title class="gradient-title">
          <div class="row items-center q-gapx-sm">
            <q-icon
              name="school"
              size="32px"
              class="rotate-icon"
            />
            <span class="text-h5 text-weight-bold">Course Management Panel </span>
          </div>
        </q-toolbar-title>

        <q-chip
          square
          color="secondary"
          text-color="white"
          class="q-mr-sm"
          icon="groups"
        >
          Expert Teachers: {{ headerTeachersCount }}
        </q-chip>

        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="hover-scale q-mr-sm"
        >
          <q-badge
            color="accent"
            floating
          >3</q-badge>
        </q-btn>

        <q-btn
          v-if="authStore.isStudent"
          flat
          round
          dense
          icon="shopping_cart"
          to="/cart"
          class="hover-scale cart-btn"
        >
          <q-badge
            v-if="cartCount > 0"
            color="accent"
            floating
          >{{ cartCount }}</q-badge>
        </q-btn>

        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          round
          dense
          icon="logout"
          class="hover-scale q-ml-sm"
          @click="handleLogout"
        >
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Modern Sidebar with Glass Effect -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="modern-drawer"
    >
      <div class="drawer-header q-pa-md">
        <div class="user-profile glass-card q-pa-md">
          <q-avatar
            size="64px"
            class="pulse-glow"
          >
            <img
              src="icons/atıf.png"
              alt="Atıf Sekmen"
            />
          </q-avatar>
          <div class="q-mt-sm text-center">
            <div class="text-weight-bold">Atıf Sekmen</div>
            <div class="text-caption text-grey-6">Full Stack Developer</div>
            <div class="text-caption text-grey-6">Owner of the Software</div>
          </div>
        </div>
      </div>

      <q-list class="q-pa-sm nav-list">
        <q-item
          v-for="(link, index) in linksList"
          :key="link.title"
          clickable
          v-ripple
          :to="link.link"
          active-class="active-nav-item"
          class="nav-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <q-item-section avatar>
            <q-icon
              :name="link.icon"
              size="24px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ link.title }}</q-item-label>
            <q-item-label
              caption
              class="text-grey-6"
            >{{ link.caption }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="chevron_right"
              size="20px"
              class="arrow-icon"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container with animated transitions -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          name="page-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- Modern Footer -->
      <footer class="modern-footer">
        <div class="footer-content q-pa-lg">
          <div class="row q-col-gutter-lg">
            <!-- About Section -->
            <div class="col-12 col-md-4">
              <div class="footer-section">
                <div class="row items-center q-mb-md">
                  <q-icon
                    name="school"
                    size="32px"
                    class="text-primary q-mr-sm"
                  />
                  <span class="text-h6 text-weight-bold">Course Hub</span>
                </div>
                <p class="text-body2 text-grey-6">
                  Modern ve kullanıcı dostu kurs yönetim sistemi.
                  Öğrenme deneyiminizi bir üst seviyeye taşıyın.
                </p>
              </div>
            </div>

            <!-- Developer Info -->
            <div class="col-12 col-md-4">
              <div class="footer-section">
                <h6 class="text-weight-bold q-mb-md">Geliştirici</h6>
                <div class="developer-info">
                  <div class="info-item q-mb-sm">
                    <q-icon
                      name="person"
                      class="q-mr-sm"
                    />
                    <span>Atıf Sekmen</span>
                  </div>
                  <div class="info-item q-mb-sm">
                    <q-icon
                      name="code"
                      class="q-mr-sm"
                    />
                    <span>Full Stack Developer</span>
                  </div>
                  <div class="info-item">
                    <q-icon
                      name="location_on"
                      class="q-mr-sm"
                    />
                    <span>Bolu Merkez</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="col-12 col-md-4">
              <div class="footer-section">
                <h6 class="text-weight-bold q-mb-md">İletişim</h6>
                <div class="social-links">
                  <q-btn
                    round
                    flat
                    icon="fab fa-linkedin"
                    href="https://www.linkedin.com/in/atifsekmen"
                    target="_blank"
                    class="social-btn hover-scale"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-instagram"
                    href="https://www.instagram.com/atifsekmen"
                    target="_blank"
                    class="social-btn hover-scale"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-github"
                    href="https://github.com/atifsekmen"
                    target="_blank"
                    class="social-btn hover-scale"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-twitter"
                    href="https://twitter.com/atifsekmen"
                    target="_blank"
                    class="social-btn hover-scale"
                  />
                  <q-btn
                    round
                    flat
                    icon="email"
                    href="mailto:info@example.com"
                    class="social-btn hover-scale"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Bottom -->
          <q-separator class="q-my-lg" />
          <div class="footer-bottom text-center">
            <p class="text-body2 text-grey-6 q-ma-none">
              © 2025 Course Hub. Tüm hakları saklıdır.
              <span class="gradient-text text-weight-bold">Made with ❤️ by Atıf Sekmen</span>
            </p>
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCart } from '../services/cart'
import { getStats } from '../services/stats'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Computed menu based on user role
const linksList = computed(() => {
  const baseLinks = [
    { title: 'Courses', caption: 'Browse courses', icon: 'school', link: '/courses' }
  ]

  if (!authStore.isAuthenticated) {
    return [
      ...baseLinks,
      { title: 'Login', caption: 'Sign in', icon: 'login', link: '/login' }
    ]
  }

  if (authStore.isStudent) {
    return [
      ...baseLinks,
      { title: 'Cart', caption: 'Your cart', icon: 'shopping_cart', link: '/cart' },
      { title: 'Orders', caption: 'Your orders', icon: 'receipt_long', link: '/orders' }
    ]
  }

  if (authStore.isTeacher) {
    return [
      ...baseLinks,
      { title: 'My Courses', caption: 'Manage your courses', icon: 'edit_note', link: '/my-courses' }
    ]
  }

  return baseLinks
})

const leftDrawerOpen = ref(false)
const cartCount = ref(0)
const headerTeachersCount = ref('...')
let headerStatsTimer = null

async function fetchHeaderTeachersCount() {
  try {
    const stats = await getStats()
    headerTeachersCount.value = stats.teachers ?? 0
  } catch {
    headerTeachersCount.value = 0
  }
}

onMounted(async () => {
  if (authStore.isStudent && authStore.currentUserId) {
    try {
      const cart = await getCart(authStore.currentUserId)
      cartCount.value = cart && cart.items ? cart.items.length : 0
    } catch {
      cartCount.value = 0
    }
  }

  // Initial fetch + refresh every 20s
  await fetchHeaderTeachersCount()
  headerStatsTimer = setInterval(fetchHeaderTeachersCount, 20000)

  // Live cart count updates from pages
  window.addEventListener('cart:updated', onCartUpdated)
})

onBeforeUnmount(() => {
  if (headerStatsTimer) {
    clearInterval(headerStatsTimer)
    headerStatsTimer = null
  }
  window.removeEventListener('cart:updated', onCartUpdated)
})

function onCartUpdated(e) {
  try {
    const count = e?.detail?.count
    if (typeof count === 'number') {
      cartCount.value = count
    }
  } catch {
    /* no-op */
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.modern-layout {
  font-family: 'Inter', 'Roboto', sans-serif;
}

// Animated Gradient Header
.gradient-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.gradient-title {
  .rotate-icon {
    animation: rotate-pulse 4s ease-in-out infinite;
  }
}

@keyframes rotate-pulse {

  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }

  25% {
    transform: rotate(10deg) scale(1.1);
  }

  50% {
    transform: rotate(0deg) scale(1);
  }

  75% {
    transform: rotate(-10deg) scale(1.1);
  }
}

.hover-scale {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.15);
  }
}

.cart-btn {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: linear-gradient(45deg, #6366f1, #ec4899);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(8px);
  }

  &:hover::before {
    opacity: 0.6;
  }
}

// Modern Drawer
.modern-drawer {
  background: #1e293b;
  border-right: 1px solid rgba(99, 102, 241, 0.2);

  .drawer-header {
    background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
  }

  .user-profile {
    text-align: center;
    border-radius: 16px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.nav-list {
  .nav-item {
    margin: 8px 0;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: slideInLeft 0.5s ease forwards;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(180deg, #6366f1, #ec4899);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateX(8px);

      &::before {
        transform: scaleY(1);
      }

      .arrow-icon {
        transform: translateX(4px);
      }
    }

    .arrow-icon {
      transition: transform 0.3s ease;
      opacity: 0.5;
    }
  }

  .active-nav-item {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
    border-left: 4px solid #6366f1;
    transform: translateX(4px);

    &::before {
      transform: scaleY(1);
    }
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Modern Footer
.modern-footer {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-top: 2px solid rgba(99, 102, 241, 0.3);
  margin-top: 64px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
    background-size: 200% 100%;
    animation: gradient-flow 3s linear infinite;
  }
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 200% 50%;
  }
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-section {
  h6 {
    color: #6366f1;
    margin: 0 0 16px 0;
  }
}

.developer-info {
  .info-item {
    display: flex;
    align-items: center;
    color: #94a3b8;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #6366f1;
      transform: translateX(4px);
    }
  }
}

.social-links {
  display: flex;
  gap: 12px;

  .social-btn {
    width: 48px;
    height: 48px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-color: #6366f1;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }
  }
}

.footer-bottom {
  p {
    font-size: 14px;
  }
}

// Page transitions
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}
</style>
