import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue'
import Checkout from '../views/Checkout.vue'
import CheckoutSuccess from '../views/CheckoutSuccess.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
    {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/checkout/success',
    name: 'CheckoutSuccess',
    component: CheckoutSuccess
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
