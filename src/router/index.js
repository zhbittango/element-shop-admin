import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
// const Login = () => import('components/Login')
// const Home = () => import('components/Home')
// const Welcom = () => import('components/Welcom')
// const Users = () => import('components/user/Users')
// const Rights = () => import('components/power/Rights')
// const Roles = () => import('components/power/Roles')
// const Cate = () => import('components/goods/Cate')
// const Params = () => import('components/goods/Params')
// const List = () => import('components/goods/List')
// const Add = () => import('components/goods/Add')
// const Order = () => import('components/order/Order')
// const Report = () => import('components/report/Report')

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */'components/Home')
// const Welcom = () => import(/* webpackChunkName: "Login_Home_Welcome" */'components/Welcom')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/power/Roles')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */'components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */'components/goods/Params')
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/Add')

const Order = () => import(/* webpackChunkName: "Order_Order" */ 'components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'components/report/Report')

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
    redirect: '/users',
    children: [
      // { path: '/welcom', component: Welcom },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
