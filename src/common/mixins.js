
export const formHandle = {
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
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
