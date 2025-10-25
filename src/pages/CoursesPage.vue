<template>
  <q-page
    padding
    class="courses-page"
  >
    <!-- Hero Section with Animated Background -->
    <div class="hero-section q-mb-xl">
      <div class="animated-bg"></div>
      <div class="hero-content">
        <h2 class="text-h2 text-weight-bold gradient-text q-mb-md">
          Discover Amazing Courses
        </h2>
        <p class="text-h6 text-grey-5">
          Transform your skills with our expert-led courses
        </p>

        <!-- Animated Stats -->
        <div class="stats-row row q-gapx-lg q-mt-lg">
          <div class="stat-card glass-card q-pa-md">
            <div class="text-h4 text-weight-bold text-primary">{{ courses.length }}+</div>
            <div class="text-caption text-grey-6">Available Courses</div>
          </div>
          <div class="stat-card glass-card q-pa-md">
            <div class="text-h4 text-weight-bold text-accent">{{ studentsCount }}</div>
            <div class="text-caption text-grey-6">Active Students</div>
          </div>
          <div class="stat-card glass-card q-pa-md">
            <div class="text-h4 text-weight-bold text-secondary">{{ teachersCount }}</div>
            <div class="text-caption text-grey-6">Expert Teachers</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section with Glow Effect -->
    <div class="search-section q-mb-xl">
      <q-input
        v-model="searchQuery"
        filled
        rounded
        placeholder="🔍 Search for courses..."
        class="search-input pulse-glow"
        dark
      >
        <template v-slot:prepend>
          <q-icon
            name="search"
            color="primary"
            size="24px"
          />
        </template>
        <template
          v-slot:append
          v-if="searchQuery"
        >
          <q-btn
            round
            dense
            icon="close"
            @click="searchQuery = ''"
            class="hover-scale"
          />
        </template>
      </q-input>

      <div class="row items-center q-mt-md q-gapx-md">
        <q-btn
          unelevated
          rounded
          icon="bookmarks"
          label="My Enrolled Courses"
          color="accent"
          @click="showEnrolled = true"
          class="enrolled-btn pulse-glow"
        />
        <q-chip
          v-if="enrolledCourses.length > 0"
          color="primary"
          text-color="white"
          icon="school"
        >
          {{ enrolledCourses.length }} Enrolled
        </q-chip>
      </div>
    </div>

    <!-- Courses Grid with Enhanced Cards -->
    <div class="courses-grid">
      <transition-group
        name="course-card"
        appear
      >
        <q-card
          v-for="(course, index) in filteredCourses"
          :key="course.id"
          class="course-card glass-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="viewCourseDetail(course)"
        >
          <!-- Gradient Overlay -->
          <div class="card-gradient"></div>

          <!-- Course Content -->
          <q-card-section class="course-header">
            <div class="row items-start justify-between q-mb-sm">
              <q-icon
                name="school"
                size="32px"
                class="text-primary float-animation"
              />
              <q-chip
                dense
                :color="(!course.isAvailable || seatsLeft(course) === 0) ? 'negative' : 'positive'"
                text-color="white"
                size="sm"
              >
                {{ !course.isAvailable ? 'Closed' : (seatsLeft(course) === 0 ? 'Full' : 'Open') }}
              </q-chip>
            </div>
            <div class="text-h5 text-weight-bold q-mb-sm">{{ course.name }}</div>
            <div class="text-body2 text-grey-5 line-clamp-2">{{ course.description }}</div>
          </q-card-section>

          <q-card-section class="course-footer">
            <div class="row items-center justify-between">
              <div class="price-container">
                <div class="price-label text-caption text-grey-6">Price</div>
                <div class="price-tag gradient-text text-h4 text-weight-bold">
                  ${{ course.price }}
                </div>
              </div>
              <div class="seats-container">
                <q-chip
                  outline
                  color="primary"
                  text-color="white"
                  icon="people"
                >
                  {{ Math.max((course.maxStudents || 0) - (course.currentStudentCount || 0), 0) }} seats left
                </q-chip>
              </div>
            </div>
          </q-card-section>

          <q-card-actions
            class="q-pa-md"
            v-if="authStore.isStudent"
          >
            <q-btn
              unelevated
              rounded
              icon="add_shopping_cart"
              label="Add to Cart"
              color="primary"
              class="full-width add-cart-btn"
              @click.stop="addToCart(course)"
            />
          </q-card-actions>

          <!-- Capacity Progress -->
          <div class="q-px-md q-pb-md">
            <q-linear-progress
              :value="capacityRatio(course)"
              size="8px"
              :color="(!course.isAvailable || seatsLeft(course) === 0) ? 'negative' : 'primary'"
              track-color="grey-4"
              rounded
            />
            <div class="row items-center justify-between q-mt-xs text-caption text-grey-6">
              <div>Enrolled: {{ (course.currentStudentCount || 0) }} / {{ (course.maxStudents || 0) }}</div>
              <div>{{ seatsLeft(course) }} left</div>
            </div>
          </div>

          <!-- Shimmer Effect on Hover -->
          <div class="shimmer-overlay"></div>
        </q-card>
      </transition-group>

      <!-- Empty State -->
      <div
        v-if="filteredCourses.length === 0"
        class="no-results text-center"
      >
        <div class="empty-state">
          <q-icon
            name="search_off"
            size="120px"
            color="grey-6"
            class="float-animation"
          />
          <h5 class="text-h5 text-weight-bold q-mt-lg">
            {{ courses.length === 0 ? 'No courses available yet' : 'No courses match your search' }}
          </h5>
          <p class="text-body1 text-grey-6">Try adjusting your search terms</p>
        </div>
      </div>
    </div>

    <!-- Enrolled Courses Dialog -->
    <q-dialog
      v-model="showEnrolled"
      class="enrolled-dialog-container"
    >
      <q-card
        style="min-width: 500px"
        class="enrolled-dialog"
      >
        <q-card-section>
          <div class="text-h6">My Enrolled Courses</div>
        </q-card-section>

        <q-card-section>
          <q-list bordered>
            <q-item
              v-for="c in enrolledCourses"
              :key="c.id"
            >
              <q-item-section>
                <q-item-label>{{ c.name }}</q-item-label>
                <q-item-label caption>{{ c.description }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="enrolledCourses.length === 0">
              <q-item-section>
                <q-item-label caption>No enrolled courses yet</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            v-close-popup
            @click="showEnrolled = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showCourseDetail"
      v-if="selectedCourse"
    >
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6">{{ selectedCourse.name }}</div>
            <q-chip
              dense
              :color="(!selectedCourse.isAvailable || seatsLeft(selectedCourse) === 0) ? 'negative' : 'positive'"
              text-color="white"
              size="sm"
            >
              {{ !selectedCourse.isAvailable ? 'Closed' : (seatsLeft(selectedCourse) === 0 ? 'Full' : 'Open') }}
            </q-chip>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <div class="text-subtitle2">Description</div>
            <div>{{ selectedCourse.description }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle2">Price</div>
            <div>${{ selectedCourse.price }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle2">Seats</div>
            <div>{{ Math.max((selectedCourse.maxStudents || 0) - (selectedCourse.currentStudentCount || 0), 0) }} left
              of {{
                selectedCourse.maxStudents }}</div>
          </div>
          <q-linear-progress
            :value="capacityRatio(selectedCourse)"
            size="10px"
            :color="(!selectedCourse.isAvailable || seatsLeft(selectedCourse) === 0) ? 'negative' : 'primary'"
            track-color="grey-4"
            rounded
            class="q-mb-md"
          />
          <div
            v-if="selectedCourse.teacher"
            class="q-mb-md"
          >
            <div class="text-subtitle2">Teacher</div>
            <div>{{ selectedCourse.teacher.name }} ({{ selectedCourse.teacher.email }})</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="authStore.isStudent"
            flat
            label="Add to Cart"
            color="primary"
            @click="addToCart(selectedCourse)"
          />
          <q-btn
            flat
            label="Close"
            v-close-popup
            @click="showCourseDetail = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { getAvailableCourses } from '../services/courses'
import { addCourseToCart, getCart } from '../services/cart'
import { getStudentCourses } from '../services/students'
import { getStats } from '../services/stats'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const courses = ref([])
const cart = ref(null)
const studentId = computed(() => authStore.currentUserId)
const studentsCount = ref('...')
const teachersCount = ref('...')
// studentsList/teachersList and dialogs removed — navigation links to dedicated pages are used instead
const searchQuery = ref('')
const showCourseDetail = ref(false)
const selectedCourse = ref(null)

const filteredCourses = computed(() => {
  if (!searchQuery.value) return courses.value
  const q = searchQuery.value.toLowerCase()
  return courses.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.description && c.description.toLowerCase().includes(q))
  )
})

const showEnrolled = ref(false)
const enrolledCourses = ref([])

onMounted(async () => {
  courses.value = await getAvailableCourses()
  // Only fetch student-specific data when logged in as student
  if (authStore.isStudent && studentId.value) {
    cart.value = await getCart(studentId.value)
    enrolledCourses.value = await getStudentCourses(studentId.value)
    // propagate cart count to header
    try {
      const count = cart.value && cart.value.items ? cart.value.items.length : 0
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count } }))
    } catch {
      // no-op
    }
  }
  // fetch counts via optimized stats endpoint
  try {
    const stats = await getStats()
    studentsCount.value = stats.students ?? 0
    teachersCount.value = stats.teachers ?? 0
    // optionally override courses length if backend authoritative
    // courses.valueCount = stats.courses ?? courses.value.length
  } catch {
    // if stats endpoint fails, show notification and zeros
    Notify.create({ type: 'negative', message: 'Unable to load statistics. Please try again later.' })
    studentsCount.value = 0
    teachersCount.value = 0
  }
})


async function addToCart(course) {
  if (!authStore.isStudent || !studentId.value) return
  try {
    await addCourseToCart(studentId.value, course.id)
    cart.value = await getCart(studentId.value)
    Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' })
    // notify header about new cart count
    try {
      const count = cart.value && cart.value.items ? cart.value.items.length : 0
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count } }))
    } catch {
      // no-op
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'Could not add to cart'
    Notify.create({ type: 'negative', message: msg, position: 'top' })
  } finally {
    showCourseDetail.value = false
  }
}

function viewCourseDetail(course) {
  selectedCourse.value = course
  showCourseDetail.value = true
}

// helpers for capacity visuals
function seatsLeft(c) {
  const max = (c && c.maxStudents) || 0
  const curr = (c && c.currentStudentCount) || 0
  return Math.max(max - curr, 0)
}

function capacityRatio(c) {
  const max = (c && c.maxStudents) || 0
  const curr = (c && c.currentStudentCount) || 0
  return max > 0 ? curr / max : 0
}
</script>

<style scoped lang="scss">
.courses-page {
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

// Hero Section with Animated Background
.hero-section {
  position: relative;
  padding: 80px 40px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 48px;

  .animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
    background-size: 400% 400%;
    animation: gradient-dance 15s ease infinite;
    opacity: 0.15;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .stats-row {
    justify-content: center;
    margin-top: 48px;

    .stat-card {
      border-radius: 16px;
      text-align: center;
      min-width: 150px;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;

      &:nth-child(1) {
        animation-delay: 0.2s;
      }

      &:nth-child(2) {
        animation-delay: 0.4s;
      }

      &:nth-child(3) {
        animation-delay: 0.6s;
      }

      &:hover {
        transform: translateY(-8px) scale(1.05);
      }
    }
  }
}

@keyframes gradient-dance {
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Search Section
.search-section {
  max-width: 800px;
  margin: 0 auto 48px;

  .search-input {
    font-size: 18px;

    :deep(.q-field__control) {
      height: 64px;
      background: rgba(99, 102, 241, 0.1);
      border: 2px solid rgba(99, 102, 241, 0.3);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(99, 102, 241, 0.6);
        background: rgba(99, 102, 241, 0.15);
      }
    }
  }

  .enrolled-btn {
    padding: 12px 32px;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
    }
  }
}

// Courses Grid with Enhanced Cards
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;

  .course-card {
    cursor: pointer;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(99, 102, 241, 0.2);
    opacity: 0;
    animation: cardSlideIn 0.6s ease forwards;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }

    .card-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    &:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
      border-color: #6366f1;

      &::before {
        transform: scaleX(1);
      }

      .card-gradient {
        opacity: 1;
      }

      .shimmer-overlay {
        animation: shimmer-slide 1.5s ease infinite;
      }

      .add-cart-btn {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        transform: scale(1.05);
      }
    }

    .course-header {
      padding: 24px;
      min-height: 180px;
      position: relative;
      z-index: 1;

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.6;
      }
    }

    .course-footer {
      padding: 20px 24px;
      background: rgba(15, 23, 42, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
    }

    .price-container {
      .price-label {
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }

    .add-cart-btn {
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }

    .shimmer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 50%,
          transparent 100%);
      transform: translateX(-100%);
      pointer-events: none;
    }
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}

// Empty State
.no-results {
  grid-column: 1 / -1;
  padding: 80px 0;

  .empty-state {
    opacity: 0;
    animation: fadeInUp 0.8s ease 0.2s forwards;
  }
}

// Transitions
.course-card-enter-active {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.course-card-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.course-card-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.8);
}

.course-card-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.8);
}

.course-card-move {
  transition: transform 0.6s ease;
}

// Dialogs
.enrolled-dialog-container {
  :deep(.q-card) {
    border-radius: 20px;
    border: 2px solid rgba(99, 102, 241, 0.3);
  }
}
</style>
