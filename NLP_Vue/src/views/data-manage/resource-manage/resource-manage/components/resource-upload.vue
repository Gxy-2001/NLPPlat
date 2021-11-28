<template>
  <el-dialog
    title="资源上传"
    :visible.sync="show"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="2" />
      <el-col :span="16">
        <el-form ref="uploadForm" :model="uploadForm" label-width="100px">
          <el-form-item label="资源类型" prop="resourceType" :rules="[{ required: true, message: '请选择资源类型', trigger: 'blur' }]">
            <el-select v-model="uploadForm.resourceType" placeholder="请选择资源类型" style="width:400px">
              <el-option label="停用词表" value="停用词表" />
              <el-option label="预训练向量" value="预训练向量" />
              <el-option label="通用资源" value="通用资源" />
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称" prop="resourceName" :rules="[{ required: true, message: '请填写资源名称', trigger: 'blur' }]">
            <el-input v-model="uploadForm.resourceName" placeholder="请填写资源名称" style="width:400px" />
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="uploadForm.desc" type="textarea" placeholder="选填" style="width:400px" />
          </el-form-item>
          <el-form-item label="公开性" prop="publicity" :rules="[{ required: true, message: '请选择公开性', trigger: 'blur' }]">
            <el-radio-group v-model="uploadForm.publicity">
              <el-radio label="公开" />
              <el-radio label="不公开" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件上传" prop="filelist">
            <el-upload
              ref="uploadFunc"
              class="upload-demo"
              :action="uploadInfo.uploadUrl"
              :file-list="uploadInfo.filelist"
              :headers="uploadInfo.headers"
              :data="uploadForm"
              :limit="1"
              :auto-upload="false"
              :on-success="handleUploadSuccess"
              accept=".csv, .txt, .tsv, .doc, .docx, .xls, .xlsx, .json"
              style="height:60px"
            >
              <el-button size="small" type="primary">点击选择</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:120px" @click="onUploadSubmit()">确认上传</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" />
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  name: 'ResourceUpload',
  props: [],
  data() {
    return {
      show: false,
      uploadForm: {
        resourceType: '',
        resourceName: '',
        desc: '',
        publicity: ''
      },
      uploadInfo: {
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/data-manage/resource/resources',
        headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.show = true
    },
    setURL(url) {
      this.uploadInfo.uploadURL = process.env.VUE_APP_BASE_API + url
    },
    onUploadSubmit() {
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          this.$refs.uploadFunc.submit()
        }
      })
    },
    handleUploadSuccess() {
      this.$notify({
        title: '上传成功',
        message: '资源已添加至资源列表',
        type: 'success',
        duration: 2000
      })
      this.show = false
      this.$parent.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
