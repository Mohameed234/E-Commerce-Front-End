import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Orders from '../views/Orders.vue';
import Cart from '../views/Cart.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/', redirect: '/dashboard' },  // أي دخول على / يروح /dashboard
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/products', component: Products, meta: { requiresAuth: true } },
  { path: '/orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;

  // صفحات محمية تحتاج تسجيل دخول
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 
  // منع الوصول لصفحات Login / Register للمسجلين دخول
  else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/dashboard');
  } 
  else {
    next();
  }
});

export default router;
