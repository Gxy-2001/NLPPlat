<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="序号" width="60px" align="center" type="index" />
      <el-table-column label="步骤名称" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤类别" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preprocessType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行参数" width="140px" align="center">
        <template slot-scope="{row}">
          <el-button type="success" plain size="mini" @click="handleParamsShow(row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Spark支持" width="120px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.sparkSupport" disabled />
        </template>
      </el-table-column>
      <el-table-column label="步骤描述" width="450px" align="center">
        <template slot-scope="{row}">
          {{ $store.state.preprocessParams[row.preprocessName+'描述'] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleDownload(row.id)">
            新增
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 参数查看对话框 -->
    <el-dialog title="参数查看" :visible.sync="preprocessParamsShow.show" width="450px">
      <pre-process-params-show :params="preprocessParamsShow.params" />
    </el-dialog>

  </div>

</template>

<script>

import { preprocessForPipelineFetch } from '@/api/data-manage/pipeline'
import { preprocessAdd, preprocessDeal } from '@/api/process-manage/preprocess'
import { operatorsFetch } from '@/api/common/operator'
import { datasetCopy } from '@/api/common/dataset'
import { pipelineUpload } from '@/api/data-manage/pipeline'

import PreProcessParamsShow from './pre-process-params-show'

import axios from 'axios'

export default {
  name: 'PipelineDetailTable',
  components: { PreProcessParamsShow },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已完成': 'success',
        '执行中': 'primary',
        '未开始': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: false,
      listQuery: {
        pipelineid: ''
      },
      preprocessAdd: {
        show: false,
        preprocessSelect: '',
        previousProcessID: '',
        sparkSwitch: false,
        sparkMaster: 'local[4]',
        preprocessList: [],
        preprocessTooltip: '暂未选择步骤'
      },
      preprocessParams: {
        show: false,
        preprocessShow: ''
      },
      preprocessParamsShow: {
        show: false,
        params: {}
      },
      featuresConstruction: {
        show: false,
        preprocessID: '',
        columns: ['label', 'label_id', 'feature']
      },
      preprocessDownload: {
        show: false,
        preprocesssid: '',
        content: ''
      },
      pipelineConstruction: {
        show: false,
        preprocessid: '',
        pipelineName: '',
        publicity: '不公开'
      }
    }
  },
  watch: {
  },
  created() {
    this.listQuery.pipelineid = this.$route.params.pipelineid
    this.preprocessAdd.preprocessList = this.$store.state.preprocessParams.preprocessList
    this.getList()
    this.getOperators()
  },
  methods: {
    // 信息获取系列函数
    getList() {
      preprocessForPipelineFetch(this.listQuery).then(response => {
        this.list = response.data.items
      })
    },
    getOperators() {
      operatorsFetch({ 'type': 'all', 'operatorType': ['预处理算子'], 'operatorName': '', 'username': ['自己'], 'sort': '-id' }).then(response => {
        var operators = {}
        operators['value'] = '自定义算子'
        operators['label'] = '自定义算子'
        operators['children'] = []
        for (var i = 0; i < response.data.items.length; i++) {
          operators['children'].push({ 'value': response.data.items[i].operatorName, 'label': response.data.items[i].operatorName })
        }
        this.preprocessAdd.preprocessList.pop()
        this.preprocessAdd.preprocessList.push(operators)
      })
    },

    // 预处理管理系列函数
    handlePreprocessAdd() {
      this.$refs.preprocessAddForm.validate((valid) => {
        if (valid) {
          preprocessAdd({ 'datasetid': this.listQuery.datasetid, 'preprocessAdd': this.preprocessAdd.preprocessSelect, 'previousProcessID': this.preprocessAdd.previousProcessID, 'sparkSupport': this.preprocessAdd.sparkSwitch, 'preprocessParams': this.preprocessParams.params }).then(response => {
            this.getList()
            this.preprocessAdd.show = false
          })
        }
      })
    },
    getPreprocessParams(params) {
      this.preprocessParams.params = params
      this.preprocessParams.show = false
    },
    handleDealPreprocess(row, $index) {
      preprocessDeal({ 'datasetid': this.listQuery.datasetid, 'preprocessIndex': $index }).then(response => {
        this.getList()
        this.$message({
          message: row.preprocessName + '开始执行'
        })
      })
    },
    handleManageData(preprocessid) {
      this.$router.push('/process-manage/pre-process/data-detail/' + this.listQuery.datasetid + '/' + preprocessid)
    },
    handleAddOperator() {
      this.$router.push('/data-manage/operator-manage/codehub/-1')
    },
    handleParamsShow(row) {
      if (row.preprocessParams) {
        this.preprocessParamsShow.params = row.preprocessParams
      } else {
        this.preprocessParamsShow.params = []
      }
      this.preprocessParamsShow.show = true
    },
    handleDownload(preprocessid) {
      this.preprocessDownload.preprocessid = preprocessid
      this.preprocessDownload.show = true
    },
    confirmDownload() {
      this.$refs.preprocessDownloadForm.validate((valid) => {
        if (valid) {
          axios
            .get(process.env.VUE_APP_BASE_API + '/process-manage/pre-process/datasets/ID/preprocesses/ID/download',
              { params: { 'datasetid': this.listQuery.datasetid, 'preprocessid': this.preprocessDownload.preprocessid, 'content': this.preprocessDownload.content },
                headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }})
            .then(response => {
              const fileName = response.headers['content-disposition']
              var url = window.URL.createObjectURL(new Blob([response.data]))
              const a = document.createElement('a')
              a.href = url
              a.setAttribute('download', fileName)
              a.click()
              window.URL.revokeObjectURL(url)
            })
          this.preprocessDownload.show = false
        }
      })
    },
    handleCopy() {
      datasetCopy({ 'datasetInitid': this.listQuery.datasetid, 'params': { 'preprocessid': this.featuresConstruction.preprocessID, 'attributes': this.featuresConstruction.columns }, 'datasetInitType': '预处理数据集', 'copyDes': '特征数据集' }).then(response => {
        this.$refs.featuresConstructionForm.validate((valid) => {
          if (valid) {
            this.featuresConstruction.show = false
            this.$notify({
              title: '生成成功',
              message: '可对生成的特征集进行训练。',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    },
    handlePipelineConstruction() {
      this.$refs.pipelineConstruction.validate((valid) => {
        if (valid) {
          pipelineUpload({ 'datasetid': this.listQuery.datasetid, 'preprocessid': this.pipelineConstruction.preprocessid, 'pipelineName': this.pipelineConstruction.pipelineName, 'publicity': this.pipelineConstruction.publicity }).then(response => {
            this.$notify({
              title: '管道生成成功',
              message: '可使用生成的管道处理批处理数据集。',
              type: 'success',
              duration: 2000
            })
            this.pipelineConstruction.show = false
          })
        }
      })
    }
  }
}
</script>
