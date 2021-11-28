<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" label-width="100px">
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="uploadForm.taskType" placeholder="请选择NLP任务类型" style="width:400px">
              <el-option label="通用单文本分类" value="通用单文本分类" />
              <el-option label="情感分析/意图识别" value="情感分析/意图识别" />
              <el-option label="实体关系抽取" value="实体关系抽取" />
              <el-option label="文本关系分析" value="文本关系分析" />
              <el-option label="文本配对" value="文本配对" />
              <el-option label="文本摘要" value="文本摘要" />
              <el-option label="文本排序学习" value="文本排序学习" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="uploadForm.taskName" placeholder="请填写该任务名" style="width:400px" />
          </el-form-item>
          <el-form-item label="任务描述">
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
              <div slot="tip" class="el-upload__tip" style="cursor:pointer" @click="example.show=true">点击查看支持的文件类型和格式</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:150px" @click="onUploadSubmit('uploadForm')">确认上传</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="支持的文件类型"
      :visible.sync="example.show"
    >
      <train-file-example />
    </el-dialog>

  </div>
</template>

<script>
import TrainFileExample from './train-file-example'

export default {
  name: 'TrainFile',
  components: { TrainFileExample },
  data() {
    const validateTaskType = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请选择任务类型'))
      } else {
        callback()
      }
    }
    const validateTaskName = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('任务名称长度不小于2位'))
      } else {
        callback()
      }
    }
    const validatePublicity = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请选择是否公开'))
      } else {
        callback()
      }
    }
    const validateFilelist = (rule, value, callback) => {
      const _this = this
      const uploadFile = _this.$refs.uploadFunc.uploadFiles
      const flag = uploadFile && uploadFile.length !== 0
      if (!flag) {
        callback(new Error('请上传文件'))
      } else {
        callback()
      }
    }
    return {
      uploadForm: {
        taskType: '',
        taskName: '',
        desc: '',
        publicity: ''
      },
      uploadInfo: {
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/process-manage/data-upload/train-file',
        headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }
      },
      uploadRules: {
        taskType: [{ required: true, trigger: 'blur', validator: validateTaskType }],
        taskName: [{ required: true, trigger: 'blur', validator: validateTaskName }],
        publicity: [{ required: true, trigger: 'blur', validator: validatePublicity }],
        filelist: [{ required: true, trigger: 'blur', validator: validateFilelist }]
      },
      example: {
        show: false
      }
    }
  },
  methods: {
    onUploadSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log('success submit!!')
        } else {
          console.log('error submit!!')
        }
      })
      this.$refs.uploadFunc.submit()
    },
    handleUploadSuccess() {
      this.$notify({
        title: '上传成功',
        message: '后台解析文件中。',
        type: 'success',
        duration: 2000
      })
      this.$router.push('/process-manage/data-set')
    }
  }
}
</script>

<style scoped>
</style>

