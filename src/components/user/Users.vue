<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="data">
            <!-- {{ data | filterData }} -->
            <el-switch
              v-model="data.row.mg_state"
              @change="switchChange(data.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
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
              @click="deleteUserById(data.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="showRoleDialog(data.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="用户添加"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="用户信息修改"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限分配" :visible.sync="roleDialogVisible" width="50%">
      <p>当前的用户： {{ info.username }}</p>
      <p>当前的角色： {{ info.role_name }}</p>
      角色分配：
      <el-select v-model="roleId" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      info: {},
      roleList: [],
      roleId: null,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', tigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', tigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', tigger: 'blur' },
          { validator: checkMobile, tigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', tigger: 'blur' },
          { validator: checkMobile, tigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const {
        data: { data, meta }
      } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.usersList = data.users
      this.total = data.total
      // console.log(data)
    },
    editDialog(info) {
      this.editForm = info
      this.editDialogVisible = !this.editDialogVisible
      console.log(info)
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    async switchChange(info) {
      console.log(info)
      const {
        data: { meta }
      } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      if (meta.status !== 200) {
        info.mg_state = !info.mg_state
        this.$message.error(meta.msg)
      }
      this.$message.success(meta.msg)
    },
    addDialogClose() {
      // console.log('---')
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.post('users', this.addForm)

        if (meta.status !== 201) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.put('users/' + this.editForm.id, this.editForm)

        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.editDialogVisible = false
        this.getUsersList()
      })
    },
    deleteUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '用户删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('users/' + id).then(({ data: { meta } }) => {
            if (meta.status !== 200) return this.$message.error(meta.msg)
            this.$message.success(meta.msg)
            this.getUsersList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showRoleDialog(info) {
      this.info = info
      this.getRoleList()
      this.roleDialogVisible = !this.roleDialogVisible
    },
    async getRoleList() {
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.roleList = data
    },
    async roleHandle() {
      const {
        data: { meta }
      } = await this.$http.put(`users/${this.info.id}/role`, {
        rid: this.roleId
      })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getUsersList()
      this.roleDialogVisible = false
    }
  },
  filters: {
    filterData(data) {
      console.log(data)
      return 1
    }
  },
  watch: {
    addDialogVisible: function(value) {
      // if (!value) this.$refs.addForm.resetFields()
    },
    editDialogVisible: function(value) {
      if (!value) {
        // this.$refs.editFormRef.resetFields()
        this.editForm = {}
        this.getUsersList()
        // console.log('edit', this.editForm)
      }
    },
    roleDialogVisible: function(value) {
      if (!value) {
        // this.info = {}
        this.roleId = null
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
