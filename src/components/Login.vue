<template>
  <div id="login">
    <div class="login-box">
      <div class="logo">
        <img src="~assets/logo.png" alt="" />
      </div>
      <el-form
        label-width="70px"
        class="login-form"
        :model="loginForm"
        :rules="loginFromRules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetClick() {
      console.log(this)
      this.$refs.loginForm.resetFields()
    },
    login() {
      // promise
      /* this.$refs.loginForm.validate((valid, obj) => {
        if (!valid) return false
        const res = this.$http.post('login', this.loginForm)
        res.then(data => console.log(data.data))
        // console.log(this)
      }) */

      this.$refs.loginForm.validate(async (valid, obj) => {
        if (!valid) return false
        // 解构别名
        const {
          data: { data, meta }
        } = await this.$http.post('login', this.loginForm)
        console.log(data, meta)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        else {
          this.$message.success(meta.msg)
          window.sessionStorage.setItem('token', data.token)
          this.$router.push('/home')
        }
        // else return console.log(res.meta.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .logo {
    height: 130px;
    width: 130px;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login-form {
  // padding: 20px;
  // margin-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: -15px;

  .el-input {
    width: 350px;
  }
}
</style>
