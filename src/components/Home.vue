<template>
  <div id="home">
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$msg.success({
        message: '退出登录成功',
        duration: 1000
      })
      this.$router.push('/login')
    }
  }
}
</script>
