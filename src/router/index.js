import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcom = () => import('components/Welcom')
const Users = () => import('components/user/Users')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  // {
  //   path: '/home',
  //   component: Home,
  //   // redirect: '/welcom',
  //   children: [
  //     { path: '', redirect: 'welcom' },
  //     { path: 'welcom', component: Welcom }
  //   ]
  // },
  {
    path: '/home',
    component: Home,
    redirect: '/welcom',
    children: [
      { path: '/welcom', component: Welcom },
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
