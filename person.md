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
#### 1. login
* form 使用
* icon 使用
* :model > v-model默认数据绑定使用
* :rules > prop 验证规则使用
* resetFields 表单重置
  * no-prototype-builtins [原型函数调用报错]
* validate 表单预验证
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
git merge login - 合并分支
git chechout login 切换分支
git push -u origin login 推送到远程分支
```