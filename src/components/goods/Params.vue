<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级参数设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col>
          <span> 选择商品分类：</span>
          <el-cascader
            v-model="selected"
            :options="cascaderList"
            :props="cascaderProps"
            clearable
            @change="cascaderChange"
            style="width: 250px"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="tagHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="isDisabled"
                @click="addDialogVisible = true"
              >
                添加参数
              </el-button>
            </el-col>
          </el-row>

          <!-- <el-table :data="tableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
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
            </el-table-column>
          </el-table> -->
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="isDisabled"
                @click="addDialogVisible = true"
              >
                添加属性
              </el-button>
            </el-col>
          </el-row>

          <!-- <el-table :data="tableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
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
            </el-table-column>
          </el-table> -->
        </el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" border stripe>
        <el-table-column type="expand">
          <template v-slot="data">
            <el-tag
              v-for="(item, i) in data.row.attr_vals"
              :key="i"
              closable
              @close="removeTag(i, data.row)"
            >
              {{ item }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="data.row.inputVisible"
              v-model="data.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(data.row)"
              @blur="handleInputConfirm(data.row)"
              style="width: 150px"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInputVisible(data.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
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
              @click="deleteById(data.row.attr_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: [],
      selectedId: null,
      cascaderList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      activeName: 'many',
      isDisabled: true,

      onlyTableData: [],
      manyTableData: [],
      tableData: [],

      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', tigger: 'blur' }
          // { min: 3, max: 15, message: '长度在 3 到 15 个字符', tigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      editForm: {}
    }
  },
  created() {
    this.getCascaderList()
  },
  computed: {
    titleText() {
      if (this.activeName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    }
  },
  methods: {
    async getCascaderList() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // console.log(data)

      this.cascaderList = data
    },
    cascaderChange() {
      // console.log(this.selected)
      this.getParamsData()
    },
    tagHandleClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selected.length !== 3) {
        this.selected = []
        this.tableData = []
        this.$message.warning('请选中商品的三级分类')
        this.isDisabled = true
      } else {
        this.isDisabled = false

        this.selectedId = this.selected[this.selected.length - 1]
        const {
          data: { data, meta }
        } = await this.$http.get(`categories/${this.selectedId}/attributes`, {
          params: { sel: this.activeName }
        })
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // if (this.activeName === 'only') {
        //   this.onlyTableData = data
        // } else {
        //   this.manyTableData = data
        // }
        data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []

          // 为每一个参数初始化tag标签
          item.inputVisible = false
          item.inputValue = null
        })
        console.log(data)
        this.tableData = data
      }
    },
    addFormHandle() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
        } = await this.$http.post(`categories/${this.selectedId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(meta)

        if (meta.status !== 201) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async editDialog(info) {
      // console.log(info)

      const {
        data: { data, meta }
      } = await this.$http.get(
        `categories/${info.cat_id}/attributes/${info.attr_id}`,
        { params: info }
      )
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // console.log(data)

      this.editForm = data
      this.editDialogVisible = !this.editDialogVisible
    },
    editFormHandle() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const {
          data: { meta }
          // data
        } = await this.$http.put(
          `categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
          this.editForm
        )
        // console.log(data)

        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    deleteById(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '参数删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.selectedId}/attributes/${id}`)
            .then(({ data: { meta } }) => {
              if (meta.status !== 200) return this.$message.error(meta.msg)
              this.$message.success(meta.msg)
              this.getParamsData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showInputVisible(row) {
      row.inputVisible = true

      // 元素渲染完毕后执行
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      console.log(row)

      if (row.inputValue === null || row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      row.attr_vals.push(row.inputValue.trim())
      this.saveTag(row)
      row.inputValue = ''
      row.inputVisible = false
    },
    removeTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveTag(row)
    },
    async saveTag(row) {
      const {
        data: { meta }
      } = await this.$http.put(
        `categories/${this.selectedId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join()
        }
      )
      if (meta.status !== 200) {
        row.attr_vals.pop()
        this.$message.error(meta.msg)
      }
      this.$message.success(meta.msg)
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
        // this.$refs.editFormRef.resetFields()
        // this.editForm = {}
        // console.log('edit', this.editForm)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 10px 15px 10px 0;
}
</style>
