<template>
  <div class="app-container">

    <el-row style="margin-bottom:20px">
      <el-button type="primary" @click="dataCut.show=true">
        数据拆分
      </el-button>
      <el-button type="primary" @click="dataCleaningDialogShow()">
        数据清洗
      </el-button>
      <el-button type="success" @click="handleDataVenation()">
        数据脉络
      </el-button>
      <el-button type="primary" @click="handleSetAnnotation()">
        数据标注
      </el-button>
    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.group" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vectorid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="titleContain" label="标题" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text2" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-success"
            @click="confirmEdit(row)"
          >
            确认
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 数据清洗对话框 -->
    <el-dialog title="数据清洗" :visible.sync="dataCleaning.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form :model="dataCleaning" label-width="100px">
            <el-form-item label="清洗算子">
              <el-select v-model="dataCleaning.operatorSelect" placeholder="请选择清洗算子">
                <el-option v-for="item in operators" :key="item._id" :label="item.operatorName" :value="item._id" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handleDataCleaning">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 数据拆分对话框 -->
    <el-dialog title="数据拆分" :visible.sync="dataCut.show" width="500px">
      <el-row type="flex" justify="center">
        <el-col :span="18" style="text-align:left">
          <el-form :model="dataCut.level" label-width="100px">
            <el-form-item label="拆分级别">
              <el-radio-group v-model="dataCut.level">
                <el-radio label="句子">句子</el-radio>
                <el-radio label="段落">段落</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="拆分算法">
              <el-select v-model="dataCut.tool" placeholder="请选择算法">
                <el-option label="系统默认" value="系统默认" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px">
        <el-col :span="4" style="text-align:center">
          <el-button type="primary" @click="handleDataCut">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 数据标注对话框 -->
    <el-dialog title="标注任务配置" :visible.sync="annotation.configDialogShow">
      <component :is="annotation.dialogComponent" ref="annotationDialogComponent" :clickid="annotation.clickID" @configDialogClose="configDialogClose" />
    </el-dialog>

  </div>
</template>

<script>
import { datasetVectorsFetch, datasetInfoFetch, datasetVectorUpdate } from '@/api/common/dataset'
import { dataCut, dataCleaning } from '@/api/process-manage/data-set'
import { operatorsFetch } from '@/api/common/operator'

import Pagination from '@/components/Pagination'
import ExtractionConfigDialog from '@/views/process-manage/annotation/components/extraction-config-dialog'
import RelationAnalysisConfigDialog from '@/views/process-manage/annotation/components/relation-analysis-config-dialog'
import L2rConfigDialog from '@/views/process-manage/annotation/components/l2r-config-dialog'
import SummaryConfigDialog from '@/views/process-manage/annotation/components/summary-config-dialog'
import ClassificationConfigDialog from '@/views/process-manage/annotation/components/classification-config-dialog'
import SentimentAnalysisConfigDialog from '@/views/process-manage/annotation/components/sentiment-analysis-config-dialog'

export default {
  name: 'DataDetailTable',
  components: { Pagination, ExtractionConfigDialog, RelationAnalysisConfigDialog, L2rConfigDialog, SummaryConfigDialog, ClassificationConfigDialog, SentimentAnalysisConfigDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      taskType: null,
      datasetType: '',
      groupOn: 'off',
      titleContain: false,
      annotation: {
        configDialogShow: false,
        dialogComponent: '',
        clickID: '',
        status: ''
      },
      listQuery: {
        datasetid: null,
        page: 1,
        limit: 10,
        deleted: '未删除'
      },
      dataCut: {
        show: false,
        level: '句子',
        tool: ''
      },
      dataCleaning: {
        show: false,
        operatorSelect: ''
      },
      operators: []
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.id
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await datasetVectorsFetch(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false)
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total
      datasetInfoFetch({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.taskType = response.data.taskType
        this.groupOn = response.data.groupOn
        this.datasetType = response.data.datasetType
        if (response.data.datasetType === '训练数据集') {
          this.annotation.status = response.data.annotationStatus
        }
      })
      this.listLoading = false
    },
    confirmEdit(row) {
      row.edit = false
      datasetVectorUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': row.vectorid, 'vector': row }).then(response => {
        this.$message({
          message: '文本编辑成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDelete(row) {
      row.deleted = '已删除'
      datasetVectorUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': row.vectorid, 'vector': row }).then(response => {
        this.$message({
          message: '文本删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleDataCut() {
      dataCut({ 'datasetid': this.listQuery.datasetid, 'level': this.dataCut.level, 'tool': this.dataCut.tool }).then(response => {
        this.dataCut.show = false
        this.$message.success('数据拆分成功！')
        this.getList()
      })
    },
    handleDataVenation() {
      if (this.datasetType === '训练数据集') {
        this.$router.push('/data-manage/data-venation/original-dataset/' + this.listQuery.datasetid)
      } else {
        this.$router.push('/data-manage/data-venation/original-batch-dataset/' + this.listQuery.datasetid)
      }
    },
    configDialogClose() {
      this.annotation.configDialogShow = false
      this.$router.push('/process-manage/annotation/data-detail/' + this.listQuery.datasetid)
    },
    dataCleaningDialogShow() {
      operatorsFetch({ 'type': 'all', 'operatorType': ['数据清洗算子'], 'operatorName': '', 'username': ['自己'], 'sort': '-id' }).then(response => {
        this.operators = response.data.items
        this.dataCleaning.show = true
      })
    },
    handleDataCleaning() {
      dataCleaning({ 'datasetid': this.listQuery.datasetid, 'operatorid': this.dataCleaning.operatorSelect }).then(response => {
        this.$notify({
          title: '数据清洗任务开始！',
          message: '请耐心等待清洗完成',
          type: 'success',
          duration: 2000
        })
        this.dataCleaning = false
        this.$router.push('/process-manage/data-set')
      })
    },
    handleSetAnnotation() {
      if (this.annotation.status === '未开始') {
        this.annotation.configDialogShow = true
        this.annotation.clickID = this.listQuery.datasetid
        switch (this.taskType) {
          case '实体关系抽取':
            this.annotation.dialogComponent = ExtractionConfigDialog
            break
          case '文本关系分析':
            this.annotation.dialogComponent = RelationAnalysisConfigDialog
            break
          case '文本排序学习':
            this.annotation.dialogComponent = L2rConfigDialog
            break
          case '文本摘要':
            this.annotation.dialogComponent = SummaryConfigDialog
            break
          case '通用单文本分类':
            this.annotation.dialogComponent = ClassificationConfigDialog
            break
          case '情感分析/意图识别':
            this.annotation.dialogComponent = SentimentAnalysisConfigDialog
            break
        }
        this.$refs.annotationDialogComponent.init()
      } else {
        this.configDialogClose()
      }
    }
  }
}
</script>

<style scoped>
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
