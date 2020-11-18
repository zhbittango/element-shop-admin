import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
// import './plugins/element-ui.js'

import VueQuillEditor from 'vue-quill-editor'

// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.component('treeTable', TreeTable)

Vue.prototype.$baseURL = 'http://www.tangoh.cn:8888/api/private/v1/'
// Vue.prototype.$baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$baseURL = '/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

axios.defaults.baseURL = 'http://www.tangoh.cn:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = '/api/private/v1/'
Vue.prototype.$http = axios

Vue.filter('dateFormat', function (time) {
  const dt = new Date(time * 1000)
  const y = (dt.getFullYear() + '')
  const m = (dt.getMonth() + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
