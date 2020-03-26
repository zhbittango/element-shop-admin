<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddFromDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <treeTable
        class="tree-table"
        :data="list"
        :columns="listColumns"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#"
      >
        <template #isAble="data">
          <!-- <template v-slot:isAble="data"> -->
          <!-- <template slot="isAble" slot-scope="data"> -->
          <i
            v-if="data.row.cat_deleted"
            class="el-icon-error"
            style="color: red"
          ></i>
          <i v-else class="el-icon-success" style="color: green"></i>
        </template>

        <!-- <template #isAble="data"> -->
        <template v-slot:order="data">
          <!-- <template slot="isAble" slot-scope="data"> -->
          <el-tag v-if="data.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="data.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- <template #isAble="data"> -->
        <!-- <template v-slot:order="data"> -->
        <template slot="handle" slot-scope="data">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editDialog(data.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteById(data.row.cat_id)"
          >
            删除
          </el-button>
        </template>
      </treeTable>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <el-dialog title="分类添加" :visible.sync="addDialogVisible" width="50%">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类级别">
            <el-cascader
              v-model="selected"
              :options="parentCateList"
              :props="cascaderProps"
              clearable
              @change="parentCateChange"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFormHandle">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="分类名称修改"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFormHandle">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: null,

      selected: [],
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },

      listColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // prop: 'cat_name',
          type: 'template',
          template: 'isAble'
        },
        {
          label: '排序',
          // prop: 'cat_name',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // prop: 'cat_name',
          type: 'template',
          template: 'handle'
        }
      ],

      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', tigger: 'blur' }
          // { min: 3, max: 15, message: '长度在 3 到 15 个字符', tigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      editForm: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', { params: this.queryInfo })
      if (meta.status !== 200) return this.$msg.error(meta.msg)

      this.list = data.result
      // console.log(this.list)
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
    showAddFromDialog() {
      this.getCateList()
      this.addDialogVisible = !this.addDialogVisible
    },
    async getCateList() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', { params: { type: 2 } })
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      // console.log(data)

      this.parentCateList = data
    },
    addFormHandle() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.post('categories', this.addForm)

        if (meta.status !== 201) return this.$msg.error(meta.msg)
        this.$msg.success(meta.msg)
        this.addDialogVisible = false
        this.getList()
      })
    },
    parentCateChange() {
      if (this.selected.length > 0) {
        this.addForm.cat_pid = this.selected[this.selected.length - 1]
        this.addForm.cat_level = this.selected.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
      console.log(this.addForm)
    },
    editDialog(info) {
      this.editDialogVisible = !this.editDialogVisible
      this.editForm = info
      // console.log(info)
    },
    editFormHandle() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.put('categories/' + this.editForm.cat_id, this.editForm)

        if (meta.status !== 200) return this.$msg.error(meta.msg)
        this.$msg.success(meta.msg)
        this.editDialogVisible = false
        this.getList()
      })
    },
    deleteById(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '角色删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('categories/' + id).then(({ data: { meta } }) => {
            if (meta.status !== 200) return this.$msg.error(meta.msg)
            this.$msg.success(meta.msg)
            this.getList()
          })
        })
        .catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  watch: {
    addDialogVisible: function(value) {
      if (!value) {
        this.$refs.addFormRef.resetFields()
        this.selected = []
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
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

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
