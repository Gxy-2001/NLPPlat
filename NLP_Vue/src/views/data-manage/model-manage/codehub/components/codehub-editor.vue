<template>
  <div class="components-container">

    <el-row>
      <el-form ref="codeUploadForm" :inline="true" :model="codeUpload" class="demo-form-inline">
        <el-form-item label="运行平台" prop="platType" :rules="[{ required: true, message: '请选择运行平台', trigger: 'blur' }]">
          <el-select v-model="codeUpload.platType" placeholder="请选择运行平台">
            <el-option label="Tensorflow1.X" value="Tensorflow1.X" />
            <el-option label="Tensorflow2.X" value="Tensorflow2.X" />
            <el-option label="Keras" value="Keras" />
            <el-option label="Pytorch" value="Pytorch" />
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称" prop="modelName" :rules="[{ required: true, message: '请填写模型名称', trigger: 'blur' }]">
          <el-input v-model="codeUpload.modelName" placeholder="请填写模型名称" />
        </el-form-item>
        <el-form-item label="公开性">
          <el-radio-group v-model="codeUpload.publicity">
            <el-radio-button label="公开" />
            <el-radio-button label="不公开" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-bottom:20px">
      <el-button type="primary" @click="handlemodelUpload()">
        保存模型
      </el-button>
      <el-button type="primary" @click="handleReadpy()">
        本地读取
      </el-button>
      <el-button type="success" @click="APIDrawer=true">
        数据访问API
      </el-button>
    </el-row>

    <div class="editor-container">
      <python-editor ref="pythonEditor" v-model="codeUpload.code" />
    </div>
    <el-row style="margin:20px 0px" />

    <!-- API文档 -->
    <el-drawer title="API文档" :visible.sync="APIDrawer" :with-header="false">
      <el-card>
        <h2>预处理数据集：数据访问API</h2>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="app.dataAPI.preprocess.getPreprocessData(id)" name="0">
            <div>输入预处理步骤id，返回结果。id为-1时为最后一个步骤。</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-drawer>

    <div>
      <el-upload
        v-show="readpyInfo.show"
        class="upload-demo"
        :auto-upload="false"
        :on-change="fileChange"
        :file-list="readpyInfo.filelist"
        accept=".py, .txt"
      >
        <el-button id="readpySelect">选取文件</el-button>
      </el-upload>
    </div>

  </div>
</template>

<script>
import PythonEditor from '@/components/PythonEditor'

import { modelFetch } from '@/api/common/model'
import { modelUpload } from '@/api/data-manage/model'
import { datasetIDListFetch } from '@/api/common/dataset'

export default {
  name: 'CodehubEditor',
  components: { PythonEditor },
  data() {
    return {
      modelid: '',
      codeUpload: {
        code: 'class TrainModel():\n\tdef train(self):\n\n\tdef hyperparameters(self):',
        platType: '',
        modelName: '',
        publicity: '不公开'
      },
      APIDrawer: false,
      readpyInfo: {
        show: false,
        filelist: []
      }
    }
  },
  watch: {
  },
  created() {
    this.modelid = this.$route.params.modelid
    this.init()
    this.getDatasetList()
  },
  methods: {
    init() {
      if (this.modelid !== '-1') {
        modelFetch({ 'modelid': this.modelid }).then(response => {
          this.codeUpload = response.data
        })
      }
    },
    getDatasetList(datasetType) {
      datasetIDListFetch({ 'datasetType': datasetType }).then(response => {
        this.datasetSelect.list = response.data.items
      })
    },
    handlemodelUpload() {
      this.$refs.codeUploadForm.validate((valid) => {
        if (valid) {
          modelUpload(Object.assign({ 'modelid': this.modelid }, this.codeUpload)).then(response => {
            if (this.modelid === '-1') {
              this.$router.push('/data-manage/model-manage/codehub/' + response.data['modelid'])
            }
            this.$notify({
              title: '模型保存成功',
              message: '可在模型训练模块使用',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleReadpy() {
      document.querySelector('#readpySelect').click()
    },
    fileChange(event) {
      const reader = new FileReader()
      reader.readAsText(event.raw)
      reader.onload = () => {
        this.codeUpload.code = reader.result
      }
    }
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>

