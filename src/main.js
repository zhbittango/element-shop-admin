import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
import './plugins/element-ui.js'

Vue.config.productionTip = false

Vue.component('treeTable', TreeTable)

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
