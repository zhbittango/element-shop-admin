## 项目知识点

[toc]

### eslint [格式化配置](https://www.jianshu.com/p/23a5d6194a4b)
- quotes - 引号
- semi - 分号

> 项目根目录创建 .prettierrc  
```
{
  "singleQuote": true,
  "semi": false
}
```
- space-before-function-paren - 方法前空格报错
> 修改 .eslintrc.js
```
rules: {
    'space-before-function-paren': 0
  }  
```

### 安装less依赖
`npm install --save-dev less-loader less`
```
<style lang="less" scoped>
  
</style>
```

### element-ui工程
#### 1. Login
* form 使用
* icon 使用
* :model > v-model默认数据绑定使用
* :rules > prop 验证规则使用
* resetFields 表单重置
  * no-prototype-builtins [原型函数调用报错](https://cloud.tencent.com/developer/section/1135740)
* validate 表单预验证
* axios
```
npm install axios --save
// main.js
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

```
* promise - [使用async和await](https://blog.csdn.net/weixin_42470791/article/details/82560734)
* $message 原型添加 success error
* [sessionStorage](https://www.runoob.com/jsref/prop-win-sessionstorage.html) 
  * setItem(key, val)
  * getItem(key)
  * clear()
* router.beforeEach(to, from, next) - 路由导航守卫, 控制登录状态跳转
* git
```
git chechout master 切换到主分支
git merge login 合并分支
git chechout login 切换分支
git push -u origin login 推送到远程分支
```

#### 2. Home
* 布局
* 请求拦截器
```
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
```
* 获取菜单数据
* 菜单调整
* Menu Attribute
  * unique-opened
  * collapse
  * collapse-transition
  * router
  * default-active

#### 2. Users
* Breadcrumb
* BreadcrumbItem
* Card
* Row - :gutter
* Col - span
* Table - :data
* TableColumn - prop label v-slot
* Switch 
* Tooltip
* Pagination
* Dialog
* 添加用户
* 修改用户信息
* 删除用户

#### 3. Rights
* 权限列表 rights
* 角色列表 roles
* 权限分配
* 用户角色分配    

#### 4. goods 
* 商品分类
* MessageBox,
  * Tag,
  * Tree,
  * Select,
  * Option,
  * Cascader
  * vue-table-with-tree-grid --save
* 商品参数
  * 
* 商品列表 
  * Alert,
  * Tabs,
  * TabPane,
  * Steps,
  * Step,
  * Checkbox,
  * CheckboxGroup,
  * Upload
  * vue-quill-editor --save
  * lodash
  * 对象拷贝
    * 浅拷贝 obj1 = {...obj}
    * 深拷贝 
      * lodash 可对方法进行拷贝
      * obj1 = JSON.parse(JSON.stringify(obj))
      * 递归

## 优化部署

* [npm镜像](https://www.cnblogs.com/cythia/p/10985080.html)
* nprogress
  ```
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
  })

  axios.interceptors.response.use(config => {
    NProgress.done()
    return config
  })
  ```
* transform-remove-console 删除打印
* vue.config.js 配置
  * [x] chainwebpack
    * [配置别名](https://www.jianshu.com/p/e4716e5bc8bb) 
  * configurewebpack
  * '@babel/plugin-syntax-dynamic-import' 路由分组懒加载
