<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="leaveBefore"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cascaderList"
                :props="cascaderProps"
                @change="cascaderChange"
                style="width: 250px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  border
                  size="mini"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <template>
              <el-form-item
                v-for="item in onlyData"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <el-input v-model="item.attr_vals"> </el-input>
              </el-form-item>
            </template>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
              multiple
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button
              @click="addFormHandle"
              type="primary"
              style="margin-top:15px"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="showPreviewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',

      cateList: null,
      cascaderList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      manyData: [],
      onlyData: [],

      uploadURL: this.$baseURL + 'upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },

      addForm: {
        goods_name: null,
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      previewPath: '',
      showPreviewDialogVisible: false,

      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tigger: 'blur' }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            tigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            tigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            tigger: 'blur'
          }
        ],
        goods_cat: [
          {
            type: 'array',
            required: true,
            message: '请选择商品分类',
            tigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCascaderList()
  },
  computed: {
    selectedId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCascaderList() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      // console.log(data)

      this.cascaderList = data
    },
    cascaderChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$msg.warning('请选中商品的三级分类')
      }
    },
    leaveBefore(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)

      // if (+activeName - +oldActiveName !== 1) {
      //   this.$msg.warning('请按步骤点击')
      //   return false
      // }

      if (oldActiveName === '0') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$msg.error('请选中商品的三级分类')
          return false
        }
      }
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const {
          data: { data, meta }
        } = await this.$http.get(`categories/${this.selectedId}/attributes`, {
          params: { sel: 'many' }
        })
        if (meta.status !== 200) return this.$msg.error(meta.msg)
        data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.manyData = data
        // console.log('tabClick -> data', data)
      } else if (this.activeIndex === '2') {
        const {
          data: { data, meta }
        } = await this.$http.get(`categories/${this.selectedId}/attributes`, {
          params: { sel: 'only' }
        })
        if (meta.status !== 200) return this.$msg.error(meta.msg)
        this.onlyData = data
        // console.log(data)
      }
    },
    handlePreview(file) {
      console.log(file)
      const previewPath = file.response.data.url
      this.previewPath = previewPath
      this.showPreviewDialogVisible = true
    },
    handleRemove(file) {
      // console.log(file)
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    handleSuccess(response) {
      // console.log(response)

      const { data, meta } = response
      if (meta.status !== 200) return this.$msg.error(meta.msg)
      this.addForm.pics.push({ pic: data.tmp_path })
      this.$msg.success(meta.msg)
      // console.log(this.addForm)
    },
    addFormHandle() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$msg.error('请填写必要的表单项')
        this.manyData.forEach(item => {
          const attrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(attrs)
        })
        this.onlyData.forEach(item => {
          const attrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(attrs)
        })
        // console.log(this.addForm)

        const addForm = JSON.parse(JSON.stringify(this.addForm))
        addForm.goods_cat = addForm.goods_cat.join(',')
        console.log(addForm)

        const {
          data: { meta }
        } = await this.$http.post('goods', addForm)
        if (meta.status !== 201) return this.$msg.error(meta.msg)
        this.$msg.success(meta.msg)
        // this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 10px 15px 0 0 !important;
}

.el-dialog img {
  width: 100%;
}
</style>
