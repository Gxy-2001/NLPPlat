<template>
  <el-dialog
    title="资源上传"
    :visible.sync="show"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="2" />
      <el-col :span="16">
        <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" label-width="100px">
          <el-form-item label="资源名称" prop="resourceName">
            <el-input v-model="uploadForm.resourceName" placeholder="请填写该任务名" style="width:400px" />
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="uploadForm.desc" type="textarea" placeholder="选填" style="width:400px" />
          </el-form-item>
          <el-form-item label="公开性" prop="publicity">
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
              style="height:120px"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:150px" @click="onUploadSubmit('uploadForm')">确认上传</el-button>
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
        resourceName: '',
        desc: '',
        publicity: ''
      },
      uploadInfo: {
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/process-manage/data-upload/train-file',
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
