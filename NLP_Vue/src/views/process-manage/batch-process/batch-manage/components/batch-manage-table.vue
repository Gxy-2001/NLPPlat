<template>
  <div ref="container" class="app-container" style="background-color:#f0f3f5;">

    <el-row type="flex" justify="space-between" :gutter="20">
      <el-col :span="15">
        <el-card shadow="hover" class="feature-config">
          <div slot="header" class="clearfix" style="vertical-align:middle">
            <span>数据集信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form ref="form" :model="datasetInfo" label-width="100px" style="width:300px">
                <el-form-item label="任务ID">
                  <el-tag type="warning" effect="dark">{{ datasetid }}</el-tag>
                </el-form-item>
                <el-form-item label="任务名称">
                  <el-tag effect="dark">{{ datasetInfo.taskName }}</el-tag>
                </el-form-item>
                <el-form-item label="任务类型">
                  <el-tag effect="dark">{{ datasetInfo.taskType }}</el-tag>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form ref="form" :model="datasetInfo" label-width="100px" style="width:300px">
                <el-form-item label="批处理状态">
                  <el-tag effect="dark" :type="dataStatus.batchStatus | statusFilter">{{ dataStatus.batchStatus }}</el-tag>
                </el-form-item>
                <!-- <el-form-item label="运行时间">
                  <span>{{ getCalTime() }}</span>
                </el-form-item> -->
                <el-form-item label="结果文件">
                  <el-button :disabled="dataStatus.batchStatus!=='处理完成'" style="float:left;" type="text">导出文件</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="feature-config">
          <div slot="header" class="clearfix">
            <span>批处理设置</span>
          </div>
          <el-form ref="batchConfigForm" :model="batchConfig" label-width="100px" style="width:300px">
            <el-form-item label="自定义批处理">
              <el-switch v-model="batchConfig.operatorOn" />
            </el-form-item>
            <el-form-item v-if="batchConfig.operatorOn===false" label="训练模型" prop="trainedmodelSelect" :rules="[{ required: true, message: '请选择模型', trigger: 'blur' }]">
              <el-select v-model="batchConfig.trainedmodelSelect" placeholder="选择已有的模型">
                <el-option v-for="model in trainedmodels" :key="model" :label="model.modelName" :value="model._id" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="batchConfig.operatorOn===true" label="算子选择" prop="operatorSelect" :rules="[{ required: true, message: '请选择算子', trigger: 'blur' }]">
              <el-select v-model="batchConfig.operatorSelect" placeholder="选择批处理算子" @change="handleOperatorChange">
                <el-option v-for="operator in operators" :key="operator" :label="operator.operatorName" :value="operator._id" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="batchConfig.operatorOn===true" label="算子调整">
              <el-button type="success" round size="small" @click="batchConfig.show=true">点击调整</el-button>
            </el-form-item>
            <el-button type="primary" style="margin:10px 0px 0px 120px" :loading="dataStatus.batchStatus==='处理中'" @click="handleBatchRun()">{{ dataStatus.batchStatus==='处理中'?'处理中':'开始处理' }}</el-button>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="feature-config">
          <div slot="header" class="clearfix" style="vertical-align:middle">
            <span>拓展支持</span>
          </div>
          <el-form ref="batchConfigForm" :model="batchConfig" label-width="100px" style="width:300px">
            <el-form-item>
              <el-link type="primary">知识图谱</el-link>
            </el-form-item>
            <el-form-item>
              <el-link type="primary">QA系统</el-link>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <transition name="el-zoom-in-top">
      <el-card v-if="dataStatus.batchStatus==='处理完成'" shadow="hover" style="margin-top:30px">
        <div slot="header" class="clearfix" style="vertical-align:middle">
          <span>批处理结果</span>
        </div>
        <data-detail-table ref="result" :datasetid="dataStatus.resultDataset" :task-type="datasetInfo.taskType" />
      </el-card>
    </transition>

    <el-dialog
      title="模型调整"
      width="70%"
      fullscreen:true
      :visible.sync="batchConfig.show"
      style="top:-90px"
    >
      <el-row>
        <python-editor ref="pythonEditor" v-model="batchConfig.code" />
      </el-row>
      <el-row justify="space-between" style="margin-top:30px">
        <el-col :span="2" :offset="11">
          <el-button type="primary" @click="batchConfig.show=false">暂存调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>

</template>

<script>
import { datasetInfoFetch } from '@/api/common/dataset'
import { operatorsFetch } from '@/api/common/operator'
import { trainedmodelsFetch } from '@/api/common/model'
import { batchRun } from '@/api/process-manage/batch-process'
import PythonEditor from '@/components/PythonEditor'
import { calTime } from '@/utils'

import DataDetailTable from '@/views/process-manage/batch-process/components/data-detail-table'

export default {
  name: 'BatchManageTable',
  components: { PythonEditor, DataDetailTable },
  directives: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '处理完成': 'success',
        '处理中': 'primary',
        '未开始': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      datasetid: '',
      datasetInfo: {
        taskType: '',
        datasetid: '',
        taskName: ''
      },
      dataStatus: {
        batchStatus: '未开始',
        resultDataset: null,
        begintime: '',
        endtime: ''
      },
      dataInfo: {},
      operators: [],
      trainedmodels: [],
      batchConfig: {
        operatorSelect: '',
        trainedmodelSelect: '',
        operatorOn: false,
        show: false,
        code: ''
      },
      timer: null
    }
  },
  watch: {
    'dataStatus.batchStatus': {
      handler(newVal, oldVal) {
        if (newVal === '处理完成') {
          setTimeout(() => {
            this.$refs.result.getList()
          }, 300)
        }
      }
    }
  },
  created() {
    this.datasetid = this.$route.params.datasetid
    this.getInfo()
    this.getOpreators()
    this.getTrainedmodels()
    this.timer = setInterval(() => {
      this.getInfo()
    }, 1000 * 2)
  },
  mounted() {
    var height = document.documentElement.clientHeight
    this.$refs.container.style['min-height'] = height - 50 + 'px'
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getInfo() {
      datasetInfoFetch({ 'datasetid': this.datasetid }).then(response => {
        console.log(response.data)
        this.datasetInfo.taskType = response.data.taskType
        this.datasetInfo.taskName = response.data.taskName
        this.dataStatus.batchStatus = response.data.batchStatus
        this.dataStatus.resultDataset = response.data.resultDataset
        if (this.dataStatus.batchStatus !== '未开始') {
          this.dataStatus.begintime = response.data.begintime.$date
        }
        if (this.dataStatus.batchStatus === '已完成') {
          this.dataStatus.endtime = response.data.endtime.$date
        }
      })
    },
    getOpreators() {
      operatorsFetch({ 'type': 'all', 'operatorType': ['批处理算子'], 'operatorName': '', 'username': ['自己'], 'sort': '-id' }).then(response => {
        this.operators = response.data.items
      })
    },
    getTrainedmodels() {
      trainedmodelsFetch({ 'type': 'all', 'platType': ['Keras', 'Pytorch', 'Tensorflow1.X', 'Tensorflow2.X'], 'modelName': '', 'username': ['自己'], 'sort': '-id' }).then(response => {
        this.trainedmodels = response.data.items
      })
    },
    handleOperatorChange(val) {
      if (val !== '') {
        for (var i = 0; i < this.operators.length; i++) {
          if (this.operators[i]._id === val) {
            this.batchConfig.code = this.operators[i].code
            break
          }
        }
      }
    },
    handleBatchRun() {
      this.$refs.batchConfigForm.validate((valid) => {
        if (valid) {
          batchRun({ 'datasetid': this.datasetid, 'trainedmodelSelect': this.batchConfig.trainedmodelSelect, 'operatorOn': this.batchConfig.operatorOn, 'code': this.batchConfig.code }).then(response => {
          })
        }
      })
    },
    getCalTime() {
      if (this.dataStatus.batchStatus === '未开始') {
        return '未开始计时'
      } else if (this.dataStatus.batchStatus === '处理中') {
        return calTime(this.dataStatus.begintime - 8 * 60 * 60 * 1000)
      } else {
        return calTime(this.dataStatus.begintime, this.dataStatus.endtime)
      }
    }
  }
}
</script>

<style scoped>

.feature-config{
  height:330px
}

.feature-info{
  height:300px
}
</style>
