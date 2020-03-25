<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="list">
        <el-table-column type="expand">
          <template v-slot="data">
            <el-row
              v-for="(item1, i1) in data.row.children"
              :key="item1.id"
              :class="['b-bottom', i1 === 0 ? 'b-top' : '', 'v-middle']"
            >
              <el-col :span="5">
                <el-tag closable @close="deleteRightsById(data.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'b-top', 'v-middle']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightsById(data.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      type="warning"
                      :key="item3.id"
                      closable
                      @close="deleteRightsById(data.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(data.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(data.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-share"
              size="mini"
              @click="showRightsDialog(data.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="角色添加" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="角色信息修改"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="email">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormHandel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="全选分配"
      :visible.sync="showRightsDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="hasChecked"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTreeHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      addDialogVisible: false,
      editDialogVisible: false,
      showRightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      hasChecked: [],
      roleId: null,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', tigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', tigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', tigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', tigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.list = data
    },
    addFormHandle() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.post('roles', this.addForm)

        if (meta.status !== 201) return this.$msg.error(meta.msg)
        this.$msg.success(meta.msg)
        this.addDialogVisible = false
        this.getList()
      })
    },
    editDialog(info) {
      this.editDialogVisible = !this.editDialogVisible
      this.editForm = info
      // console.log(info)
    },
    editFormHandel() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.put('roles/' + this.editForm.id, this.editForm)

        if (meta.status !== 200) return this.$msg.error(meta.msg)
        this.$msg.success('修改成功')
        this.editDialogVisible = false
        this.getList()
      })
    },
    deleteById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '角色删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('roles/' + id).then(({ data: { meta } }) => {
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
    },
    deleteRightsById(role, id) {
      this.$confirm('此操作将取消该权限, 是否继续?', '权限取消', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`roles/${role.id}}/rights/${id}`)
            .then(({ data: { data, meta } }) => {
              if (meta.status !== 200) return this.$msg.error(meta.msg)
              this.$msg.success(meta.msg)
              // this.getList()
              role.children = data
            })
        })
        .catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showRightsDialog(role) {
      // console.log('role', role)
      this.roleId = role.id
      this.hasChecked = []
      this.getRightsList()

      this.getHasChecked(role, this.hasChecked)

      this.showRightsDialogVisible = !this.showRightsDialogVisibleDialogVisible
    },
    async getRightsList() {
      const {
        data: { data, meta }
      } = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.rightsList = data
    },
    getHasChecked(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getHasChecked(item, arr))
    },
    async setTreeHandle() {
      const hasCheckedkeys = this.$refs.treeRef.getCheckedKeys()
      const hasHalfCheckedkeys = this.$refs.treeRef.getHalfCheckedKeys()
      const checkKeys = [...hasCheckedkeys, ...hasHalfCheckedkeys]
      // console.log(checkKeys)
      const rids = checkKeys.join()
      const {
        data: { meta }
      } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids
      })

      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.$msg.success(meta.msg)
      this.showRightsDialogVisible = false
      this.getList()
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
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
</style>
