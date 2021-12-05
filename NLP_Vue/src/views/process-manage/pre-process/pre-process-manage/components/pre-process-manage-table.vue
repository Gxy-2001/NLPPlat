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
      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="承接步骤ID" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.previousProcessID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行参数" width="140px" align="center">
        <template slot-scope="{row}">
          <el-button type="success" plain size="mini" @click="handleParamsShow(row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" column-key="preprocessStatus" :filters="statusFilter" class-name="status-col"
                       width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.preprocessStatus | statusFilter">
            {{ row.preprocessStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Spark支持" width="120px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.sparkSupport" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div v-if="row.preprocessStatus==='已完成'">
            <el-button type="primary" size="mini" @click="handleManageData(row.id)">
              查看数据
            </el-button>
            <el-button size="mini" type="success" @click="handleDownload(row.id)">
              导出
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </div>
          <div v-if="row.preprocessStatus==='执行中'">
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
          <div v-if="row.preprocessStatus==='未开始'">
            <el-button type="primary" size="mini" @click="handleDealPreprocess(row,$index)">
              开始执行
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-around" style="margin-top:50px">
      <el-col :span="3" style="text-align:center"/>
      <el-col :span="4" style="text-align:center">
        <el-button type="primary" @click="preprocessAdd.show=true">新增步骤</el-button>
      </el-col>
      <el-col :span="4" style="text-align:center">
        <el-button type="primary">一键执行</el-button>
      </el-col>
      <el-col :span="4" style="text-align:center">
        <el-button type="primary" @click="featuresConstruction.show=true">特征集生成</el-button>
      </el-col>
      <el-col :span="4" style="text-align:center">
        <el-button type="primary" @click="pipelineConstruction.show=true">管道生成</el-button>
      </el-col>
      <el-col :span="5" style="text-align:center"/>
    </el-row>

    <!-- 新增步骤对话框 -->
    <el-dialog title="新增步骤" :visible.sync="preprocessAdd.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form ref="preprocessAddForm" :model="preprocessAdd" label-width="100px">
            <el-form-item label="选择步骤" prop="preprocessSelect"
                          :rules="[{ required: true, message: '请选择新增的步骤', trigger: 'blur' }]">
              <el-cascader
                v-model="preprocessAdd.preprocessSelect"
                :options="preprocessAdd.preprocessList"
                :props="{ expandTrigger: 'hover' }"
                placeholder="下一步需要执行的步骤"
              />
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" :content="preprocessAdd.preprocessTooltip" placement="right">
                <span style="cursor:pointer">移至此处查看描述</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="承接步骤" prop="previousProcessID"
                          :rules="[{ required: true, message: '请选择承接的步骤', trigger: 'blur' }]">
              <el-select v-model="preprocessAdd.previousProcessID" placeholder="从哪一步骤开始执行">
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="'ID:'+item.id+'  '+item.preprocessName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Spark支持">
              <el-switch v-model="preprocessAdd.sparkSwitch"/>
            </el-form-item>
            <el-form-item v-if="preprocessAdd.sparkSwitch===true" label="Spark Master">
              <el-input v-model="preprocessAdd.sparkMaster"/>
            </el-form-item>
            <el-form-item label="参数配置">
              <el-button type="success" plain size="small" @click="preprocessParams.show=true">点击配置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handlePreprocessAdd">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 参数配置对话框 -->
    <el-dialog title="参数配置" :visible.sync="preprocessParams.show" width="700px">
      <pre-process-params-set :key="preprocessAdd.preprocessSelect" :preprocess-name="preprocessAdd.preprocessSelect[1]"
                              @getPreprocessParams="getPreprocessParams"/>
    </el-dialog>

    <!-- 参数查看对话框 -->
    <el-dialog title="参数查看" :visible.sync="preprocessParamsShow.show" width="450px">
      <pre-process-params-show :params="preprocessParamsShow.params"/>
    </el-dialog>

    <!-- 数据导出对话框 -->
    <el-dialog title="数据导出" :visible.sync="preprocessDownload.show" width="450px">
      <el-form ref="preprocessDownloadForm" :model="preprocessDownload" label-width="120px">
        <el-form-item label="导出属性" prop="content" :rules="[{ required: true, message: '请选择需要导出的属性', trigger: 'blur' }]">
          <el-select v-model="preprocessDownload.content" placeholder="选择需要导出的属性">
            <el-option label="vectors" value="vectors"/>
            <el-option label="label_id" value="label_id"/>
            <el-option label="label" value="label"/>
            <el-option label="embedding" value="embedding"/>
            <el-option label="embedding_matrix" value="embedding_matrix"/>
            <el-option label="feature" value="feature"/>
            <el-option label="vocabs" value="vocabs"/>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="margin-left:40%" @click="confirmDownload">确认导出</el-button>
      </el-form>
    </el-dialog>

    <!-- 特征生成对话框 -->
    <el-dialog title="特征集生成配置" :visible.sync="featuresConstruction.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form ref="featuresConstructionForm" :model="featuresConstruction" label-width="120px">
            <el-form-item label="选择步骤" prop="preprocessID"
                          :rules="[{ required: true, message: '请选择预处理步骤', trigger: 'blur' }]">
              <el-select v-model="featuresConstruction.preprocessID" placeholder="由哪一步骤生成特征集">
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="'ID:'+item.id+'  '+item.preprocessName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择特征集属性">
              <el-checkbox-group v-model="featuresConstruction.columns">
                <el-checkbox label="label"/>
                <el-checkbox label="label_id"/>
                <el-checkbox label="vectors"/>
                <el-checkbox label="feature"/>
                <el-checkbox label="embedding"/>
                <el-checkbox label="embedding_matrix"/>
                <el-checkbox label="vocabs"/>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handleCopy()">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 管道生成对话框 -->
    <el-dialog title="管道生成配置" :visible.sync="pipelineConstruction.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form ref="pipelineConstruction" :model="pipelineConstruction" label-width="120px">
            <el-form-item label="选择步骤" prop="preprocessid"
                          :rules="[{ required: true, message: '请选择预处理步骤', trigger: 'blur' }]">
              <el-select v-model="pipelineConstruction.preprocessid" placeholder="由哪一步骤生成特征集" style="width:200px">
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="'ID:'+item.id+'  '+item.preprocessName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="管道名称" prop="pipelineName"
                          :rules="[{ required: true, message: '请填写管道名称', trigger: 'blur' }]">
              <el-input v-model="pipelineConstruction.pipelineName" placeholder="请填写管道名称" style="width:200px"/>
            </el-form-item>
            <el-form-item label="公开性" prop="publicity">
              <el-radio-group v-model="pipelineConstruction.publicity">
                <el-radio label="公开"/>
                <el-radio label="不公开"/>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handlePipelineConstruction()">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<script>

import {preprocessStatusFetch, preprocessAdd, preprocessDeal} from '@/api/process-manage/preprocess'
import {operatorsFetch} from '@/api/common/operator'
import {datasetCopy} from '@/api/common/dataset'
import {pipelineUpload} from '@/api/data-manage/pipeline'

import PreProcessParamsSet from './pre-process-params-set'
import PreProcessParamsShow from './pre-process-params-show'

import axios from 'axios'

export default {
  name: 'PreProcessManageTable',
  components: {PreProcessParamsSet, PreProcessParamsShow},
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
        datasetid: ''
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
      },
      timer: null
    }
  },
  watch: {
    'preprocessAdd.preprocessSelect': {
      deep: true,
      handler(newVal, oldVal) {
        this.preprocessParams.params = this.$store.state.preprocessParams[newVal[1]]
        this.preprocessAdd.preprocessTooltip = this.$store.state.preprocessParams[newVal[1] + '描述']
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.preprocessAdd.preprocessList = this.$store.state.preprocessParams.preprocessList
    this.getList()
    this.getOperators()
    this.timer = setInterval(() => {
      this.getList()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 信息获取系列函数
    getList() {
      preprocessStatusFetch(this.listQuery).then(response => {
        this.list = response.data.items
      })
    },
    getOperators() {
      operatorsFetch({
        'type': 'all',
        'operatorType': ['预处理算子'],
        'operatorName': '',
        'username': ['自己'],
        'sort': '-id'
      }).then(response => {
        var operators = {}
        operators['value'] = '自定义算子'
        operators['label'] = '自定义算子'
        operators['children'] = []
        for (var i = 0; i < response.data.items.length; i++) {
          operators['children'].push({
            'value': response.data.items[i].operatorName,
            'label': response.data.items[i].operatorName
          })
        }
        this.preprocessAdd.preprocessList.pop()
        this.preprocessAdd.preprocessList.push(operators)
      })
    },

    // 预处理管理系列函数
    handlePreprocessAdd() {
      this.$refs.preprocessAddForm.validate((valid) => {
        if (valid) {
          preprocessAdd({
            'datasetid': this.listQuery.datasetid,
            'preprocessAdd': this.preprocessAdd.preprocessSelect,
            'previousProcessID': this.preprocessAdd.previousProcessID,
            'sparkSupport': this.preprocessAdd.sparkSwitch,
            'preprocessParams': this.preprocessParams.params
          }).then(response => {
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
      preprocessDeal({'datasetid': this.listQuery.datasetid, 'preprocessIndex': $index}).then(response => {
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
              {
                params: {
                  'datasetid': this.listQuery.datasetid,
                  'preprocessid': this.preprocessDownload.preprocessid,
                  'content': this.preprocessDownload.content
                },
                headers: {'Authorization': 'Bearer ' + this.$store.state.user.token}
              })
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
      datasetCopy({
        'datasetInitid': this.listQuery.datasetid,
        'params': {
          'preprocessid': this.featuresConstruction.preprocessID,
          'attributes': this.featuresConstruction.columns
        },
        'datasetInitType': '预处理数据集',
        'copyDes': '特征数据集'
      }).then(response => {
        this.$refs.featuresConstructionForm.validate((valid) => {
          if (valid) {
            this.featuresConstruction.show = false
            this.$notify({
              title: '生成任务创建成功！',
              message: '即将生成至ID为' + response.data.datasetDesID + '的数据集中',
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
          pipelineUpload({
            'datasetid': this.listQuery.datasetid,
            'preprocessid': this.pipelineConstruction.preprocessid,
            'pipelineName': this.pipelineConstruction.pipelineName,
            'publicity': this.pipelineConstruction.publicity
          }).then(response => {
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
