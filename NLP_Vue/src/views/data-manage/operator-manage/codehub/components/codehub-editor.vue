<template>
  <div class="components-container">

    <el-row>
      <el-form ref="codeUploadForm" :inline="true" :model="codeUpload" class="demo-form-inline">

        <el-form-item label="算子类型" prop="operatorType" :rules="[{ required: true, message: '请选择算子类型', trigger: 'blur' }]">
          <el-select v-model="codeUpload.operatorType" placeholder="请选择算子类型">
            <el-option label="数据清洗算子" value="数据清洗算子" />
            <el-option label="预处理算子" value="预处理算子" />
            <el-option label="批处理算子" value="批处理算子" />
          </el-select>
        </el-form-item>
        <el-form-item label="算子名称" prop="operatorName" :rules="[{ required: true, message: '请填写算子名称', trigger: 'blur' }]">
          <el-input v-model="codeUpload.operatorName" placeholder="请填写算子名称" />
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
      <el-button type="primary" @click="handleOperatorUpload()">
        保存算子
      </el-button>
      <el-button type="primary" @click="datasetSelect.show=true">
        在线调试
      </el-button>
      <el-button type="primary" @click="handleReadpy()">
        本地读取
      </el-button>
      <el-button type="success" @click="handleApiFetch()">
        数据访问API
      </el-button>
    </el-row>

    <div class="editor-container">
      <python-editor ref="pythonEditor" v-model="codeUpload.code" />
    </div>
    <el-row style="margin:20px 0px" />
    <div class="editor-container">
      <el-card>
        <div slot="header" class="clearfix">
          <span>输出控制台</span>
        </div>
        <python-console ref="pythonConsole" v-model="console.code" />

      </el-card>
    </div>

    <el-dialog
      title="测试数据集"
      :visible.sync="datasetSelect.show"
      width="500px"
    >
      <el-form ref="form" :model="datasetSelect" label-width="180px">
        <el-form-item label="选择数据集以继续">
          <el-select v-model="datasetSelect.datasetid" placeholder="请选择数据集">
            <el-option v-for="item in datasetSelect.list" :key="item._id" :label="item._id+' '+item.taskName" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCodeRun()">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- API文档 -->
    <el-drawer title="API文档" :visible.sync="APIDrawer" :with-header="false">
      <el-card>
        <h2>数据访问API</h2>
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="item in API" :key="item.name" :title="item.name" :name="item.name">
            <div>{{ item.content }}</div>
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
import PythonConsole from '@/components/PythonConsoleForWhite'

import { operatorUpload, operatorFetch, codeRun, apiFetch } from '@/api/data-manage/operator'
import { datasetIDListFetch } from '@/api/common/dataset'

export default {
  name: 'CodehubEditor',
  components: { PythonEditor, PythonConsole },
  data() {
    return {
      operatorid: '',
      codeUpload: {
        code: 'class Operator():\n\tdef operator(self):',
        operatorType: '',
        operatorName: '',
        publicity: '不公开'
      },
      console: {
        code: '此处查看测试输出'
      },
      APIDrawer: false,
      API: [],
      datasetSelect: {
        list: [],
        datasetid: '',
        show: false
      },
      readpyInfo: {
        show: false,
        filelist: []
      }
    }
  },
  watch: {
    'codeUpload.operatorType': {
      handler: function(val) {
        switch (val) {
          case '数据清洗算子':
            this.getDatasetList('训练数据集')
            break
          case '预处理算子':
            this.getDatasetList('预处理数据集')
            break
          case '批处理算子':
            this.getDatasetList('批处理特征集')
            break
        }
      }
    }
  },
  created() {
    this.operatorid = this.$route.params.operatorid
    this.init()
    this.getDatasetList()
  },
  methods: {
    init() {
      if (this.operatorid !== '-1') {
        operatorFetch({ 'operatorid': this.operatorid }).then(response => {
          this.codeUpload = response.data
        })
      }
    },
    getDatasetList(datasetType) {
      datasetIDListFetch({ 'datasetType': datasetType }).then(response => {
        this.datasetSelect.list = response.data.items
      })
    },
    handleOperatorUpload() {
      this.$refs.codeUploadForm.validate((valid) => {
        if (valid) {
          operatorUpload(Object.assign({ 'operatorid': this.operatorid }, this.codeUpload)).then(response => {
            if (this.operatorid === '-1') {
              this.$router.push('/data-manage/operator-manage/codehub/' + response.data['operatorid'])
            }
            this.$notify({
              title: '算子保存成功',
              message: '可在各个模块调用算子',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCodeRun() {
      this.datasetSelect.show = false
      codeRun({ 'code': this.codeUpload.code, 'datasetid': this.datasetSelect.datasetid }).then(response => {
        this.$message.success('程序运行完成！')
        this.console.code = response.data
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
    },
    handleApiFetch() {
      if (this.codeUpload.operatorType === '') {
        this.$message.error('请先选择算子类型！')
      } else {
        apiFetch({ 'operatorType': this.codeUpload.operatorType }).then(response => {
          this.API = response.data.API
          this.APIDrawer = true
        })
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

