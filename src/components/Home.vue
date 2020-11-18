<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/me.jpg" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-collapse" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#030b16"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath || $route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menusList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
               @click="saveActivePath('/' + subItem.path)"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: [],
      iconsList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: null
    }
  },
  created() {
    this.getMenusList()
  },
  mounted() {
    this.activePath = window.sessionStorage.getItem('path')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$message.success({
        message: '退出登录成功',
        duration: 1000
      })
      this.$router.push('/login')
    },
    async getMenusList() {
      const {
        data: { data, meta }
      } = await this.$http.get('menus')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.menusList = data
      console.log('menusList', data)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(path) {
      window.sessionStorage.setItem('path', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  overflow: hidden;
}
.el-header {
  background: #070f11;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;

    img {
      width: 45px;
      border-radius: 50%;
    }

    span {
      margin-left: 10px;
      font-size: 18px;
    }
  }
}
.el-aside {
  background: #030b16;

  .toggle-collapse {
    background-color: #182435;
    color: #fff;
    text-align: center;
    padding: 4px 0;
    font-size: 10px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #ddd;
}

.iconfont {
  margin-right: 10px;
}
</style>
