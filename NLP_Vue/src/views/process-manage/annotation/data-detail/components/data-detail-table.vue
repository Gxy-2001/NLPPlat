<template>
  <div class="app-container">

    <el-row style="margin-bottom:20px">
      <el-col :span="4">
        <el-button v-if="annotationStatus!=='标注完成'" type="primary" @click="handleCompleteAnnotation()">
          完成标注
        </el-button>
        <el-button v-if="annotationStatus==='标注完成'" type="primary" @click="handleCopy()">
          拷贝至预处理
        </el-button>
      </el-col>
      <el-col :span="8">
        <annotation-progress :id="listQuery.datasetid" />
      </el-col>

    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vectorid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标注已完成" :show-overflow-tooltip="true" width="100px" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.label!==''" type="success" icon="el-icon-check" circle style="cursor:default" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120px">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(row)"
          >
            标注
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { datasetCopy, datasetVectorsFetch, datasetInfoFetch } from '@/api/common/dataset'
import { completeAnnotationStatus } from '@/api/process-manage/annotation'
import Pagination from '@/components/Pagination'
import AnnotationProgress from '@/views/process-manage/annotation/components/annotation-progress'

export default {
  name: 'DataDetailTable',
  components: { Pagination, AnnotationProgress },
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
      taskType: '',
      annotationStatus: '',
      annotationFormat: {},
      groupOn: 'off',
      listQuery: {
        datasetid: null,
        page: 1,
        limit: 10,
        deleted: '未删除'
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.id
    this.getList()
    this.getInfo()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await datasetVectorsFetch(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total

      this.listLoading = false
    },
    getInfo() {
      datasetInfoFetch({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.taskType = response.data.taskType
        this.groupOn = response.data.groupOn
        this.annotationFormat = response.data.annotationFormat
        this.annotationStatus = response.data.annotationStatus
      })
    },
    handleCompleteAnnotation() {
      completeAnnotationStatus({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.$message.success('标注任务提交成功！')
        this.getInfo()
      })
    },
    handleCopy() {
      datasetCopy({ 'datasetInitType': '训练数据集', 'datasetInitid': this.listQuery.datasetid, 'copyDes': '预处理数据集' }).then(response => {
        this.$notify({
          title: '拷贝任务创建成功',
          message: '即将拷贝至ID为' + response.data.datasetDesID + '的数据集中',
          type: 'success',
          duration: 2000
        })
      })
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    handleEdit(row) {
      if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
        this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + Math.floor(Number(row.group) / 2) * 2)
      } else if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 1) {
        this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + row.group)
      } else {
        this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + row.vectorid)
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
