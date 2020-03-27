<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
      </el-row>

      <el-table :data="list" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="data">
            <el-tag type="success" v-if="data.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="创建时间" width="170">
          <template v-slot="data">
            {{ data.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-information"
              size="mini"
              @click="show"
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

    <el-dialog title="修改地址" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="location">
          <el-cascader
            v-model="addForm.location"
            :options="cityData"
            :props="cascaderProps"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改地址" :visible.sync="showDialogVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in showData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from 'components/order/citydata'

export default {
  data() {
    return {
      list: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: null,

      addDialogVisible: false,
      addForm: {
        location: '',
        address: ''
      },
      addFormRules: {
        location: [
          {
            required: true,
            type: 'array',
            message: '请选择省市区/县',
            tigger: 'blur'
          }
        ],
        address: [{ required: true, message: '请输入详细地址', tigger: 'blur' }]
      },

      cityData,
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children'
      },

      showDialogVisible: false,
      showData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const {
        data: { data, meta }
      } = await this.$http.get('orders', { params: this.queryInfo })
      if (meta.status !== 200) return this.$msg.error(meta.msg)
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
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    searchList() {
      this.queryInfo.pagenum = 1
      this.getList()
    },
    addFormHandle() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        console.log(this.addForm)

        // const {
        //   data: { meta }
        // } = await this.$http.post('roles', this.addForm)

        // if (meta.status !== 201) return this.$msg.error(meta.msg)
        // this.$msg.success(meta.msg)
        // this.addDialogVisible = false
        // this.getList()
      })
    },
    async show() {
      const {
        data: { data, meta }
      } = await this.$http.get('/kuaidi/1106975712662')
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.showData = data
      this.showDialogVisible = true
    }
  },
  watch: {
    addDialogVisible: function(value) {
      if (!value) {
        this.$refs.addFormRef.resetFields()
      }
    },
    editDialogVisible: function(value) {
      if (!value) {
        this.$refs.editFormRef.resetFields()
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
