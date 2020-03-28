<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="searchList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goToAdd"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="list" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170">
          <template v-slot="data">
            {{ data.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(data.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(data.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/common/utils'

export default {
  data() {
    return {
      list: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const {
        data: { data, meta }
      } = await this.$http.get('goods', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // console.log(data, meta)

      this.list = data.goods
      // // console.log(this.list)
      this.total = data.total
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    searchList() {
      this.queryInfo.pagenum = 1
      this.getList()
    },
    deleteById(id) {
      console.log(id)

      this.$confirm('此操作将永久删除该商品, 是否继续?', '商品删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('goods/' + id).then(({ data: { meta } }) => {
            if (meta.status !== 200) return this.$message.error(meta.msg)
            this.$message.success(meta.msg)
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    goToAdd() {
      this.$router.push('goods/add')
    }
  },
  filters: {
    showDate: function(value) {
      const date = new Date(value * 1000)
      // console.log(date);

      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>
