import DashboardView from '@/features/dashboard/DashboardView.vue'
import {createRouter, createWebHistory} from 'vue-router'
import PostView from '@/features/posts/PostView.vue'
import SinglePostView from '@/features/posts/SinglePostView.vue'
import ProductView from '@/features/products/ProductView.vue'
import SingleProductView from '@/features/products/SingleProductView.vue'
import NotFoundView from "@/features/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardView,
    },
    {
      path: '/posts',
      component: PostView,
    },
    {path: '/posts/:slug', component: SinglePostView},
    {
      path: '/products',
      component: ProductView,
    },
    {path: '/products/:slug', component: SingleProductView},
    {path: '/:pathMatch(.*)*', component: NotFoundView},
  ],
})

export default router
