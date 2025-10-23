import { createRouter, createWebHistory } from 'vue-router'
import NewListView from '@/views/NewListView.vue'
import { useAuthStore } from '@/stores/auth'
import NProgress from 'nprogress'
// import NewsDetailView from '@/views/NewsDetail/NewsDetailFrame.vue'
import TestDetailView from '@/views/NewsDetail/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewListView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/create-news',
      name: 'create-news',
      component: () => import('../views/CreateNewsView.vue'),

      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn && (authStore.isMember || authStore.isAdmin)) {
          next()
        } else {
          next({ name: 'home' })
        }
      },
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: TestDetailView,
    },
  ],
})
NProgress.configure({ showSpinner: false })
router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})
export default router
