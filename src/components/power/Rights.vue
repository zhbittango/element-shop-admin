<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="rightsList"
        style="width: 100%"
        border
        stripe
        max-height=450
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="data">
            <div>
              <el-tag v-if="data.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="data.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const {
        data: { data, meta }
      } = await this.$http.get('rights/list')
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.rightsList = data
      // this.$msg.success(meta.msg)
    }
  }
}
</script>

<style lang="less" scoped></style>
