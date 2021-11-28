<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.taskName" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.taskTypeSelect" placeholder="任务类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-position" @click="handleProcessManage">
        过程脉络
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @filter-change="filterChange"
    >
      <el-table-column label="ID" prop="_id" sortable="custom" align="center" width="60px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" width="160px" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form>
              <el-form-item label="任务名称">
                <el-input v-model="row.taskName" />
              </el-form-item>
              <el-form-item label="任务描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.taskName }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="归属者" column-key="username" :filters="usernameFilter" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="共同标注" width="200px" align="center">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.annotationPublicity" :disabled="!permissionCheck(row.username)" @change="handlePublicityChange(row)">
            <el-radio-button label="允许" />
            <el-radio-button label="不允许" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" column-key="taskType" :filters="taskTypeFilter" width="160px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.taskType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标注状态" column-key="annotationStatus" :filters="statusFilter" class-name="status-col" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.annotationStatus | statusFilter">
            {{ row.annotationStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="280px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)&&row.annotationStatus==='未开始'">
            <el-button type="primary" size="mini" @click="handleSetAnnotation(row)">
              配置任务
            </el-button>
            <el-button size="mini" type="success" @click="handleDataVenation(row)">
              数据脉络
            </el-button>
          </div>
          <div v-else-if="row.annotationStatus==='标注中'">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              进入标注
            </el-button>
            <el-button type="danger" size="mini">
              取消标注
            </el-button>
            <el-button size="mini" type="success" @click="handleDataVenation(row)">
              数据脉络
            </el-button>
          </div>
          <div v-else-if="row.annotationStatus==='标注完成'">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              查看标注
            </el-button>
            <el-button type="primary" size="mini">
              导出标注
            </el-button>
            <el-button size="mini" type="success" @click="handleManage(row)">
              数据脉络
            </el-button>
          </div>
          <div v-else>
            <el-button size="mini" type="success" @click="handleManage(row)">
              数据脉络
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 标注任务配置对话框 -->
    <el-dialog title="标注任务配置" :visible.sync="configDialogShow">
      <component :is="dialogComponent" ref="dialogComponent" :clickid="clickID" @configDialogClose="configDialogClose" />
    </el-dialog>

  </div>
</template>

<script>
import { datasetListFetch, datasetInfoUpdate } from '@/api/common/dataset'
import { writePermission } from '@/utils/permission'

import ExtractionConfigDialog from '@/views/process-manage/annotation/components/extraction-config-dialog'
import RelationAnalysisConfigDialog from '@/views/process-manage/annotation/components/relation-analysis-config-dialog'
import L2rConfigDialog from '@/views/process-manage/annotation/components/l2r-config-dialog'
import SummaryConfigDialog from '@/views/process-manage/annotation/components/summary-config-dialog'
import ClassificationConfigDialog from '@/views/process-manage/annotation/components/classification-config-dialog'
import SentimentAnalysisConfigDialog from '@/views/process-manage/annotation/components/sentiment-analysis-config-dialog'
import MatchingConfigDialog from '@/views/process-manage/annotation/components/matching-config-dialog'

import Pagination from '@/components/Pagination'

export default {
  name: 'DatasetTable',
  components: { Pagination, ExtractionConfigDialog, RelationAnalysisConfigDialog, L2rConfigDialog, SummaryConfigDialog, ClassificationConfigDialog, SentimentAnalysisConfigDialog, MatchingConfigDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '标注完成': 'success',
        '标注中': 'primary',
        '未开始': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      dialogComponent: '',
      clickID: '',
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        taskName: '',
        datasetType: '标注数据集',
        username: ['自己', '他人'],
        taskType: [],
        annotationStatus: ['未开始', '标注中', '标注完成']
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      taskTypeOptions: [],
      usernameOptions: ['自己', '他人'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      annotationStatusOptions: ['未开始', '标注中', '标注完成'],
      taskTypeFilter: [],
      statusFilter: [
        { text: '标注完成', value: '标注完成' },
        { text: '标注中', value: '标注中' },
        { text: '未开始', value: '未开始' }
      ],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      downloadLoading: false,
      configDialogShow: false,
      timer: null
    }
  },
  created() {
    this.taskTypeOptions = this.$store.state.taskTypes.taskType
    this.taskTypeFilter = this.$store.state.taskTypes.taskTypeFilter
    this.listQuery.taskType = this.$store.state.taskTypes.taskType
    this.getList()
    this.timer = setInterval(() => {
      this.getList()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 数据获取系列函数
    getList() {
      datasetListFetch(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    // 数据筛选系列函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === '_id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    filterChange(obj) {
      if (obj[Object.keys(obj)[0]].length === 0) {
        this.listQuery[Object.keys(obj)[0]] = this[Object.keys(obj)[0] + 'Options']
      } else {
        this.listQuery[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]]
      }
      this.getList()
    },
    handleSearch() {
      if (this.searchQuery.usernameSelect === '') {
        this.listQuery.username = ['自己', '他人']
      } else {
        this.listQuery.username = [this.searchQuery.usernameSelect]
      }
      if (this.searchQuery.taskTypeSelect === '') {
        this.listQuery.taskType = this.$store.state.taskTypes.taskType
      } else {
        this.listQuery.taskType = [this.searchQuery.taskTypeSelect]
      }
      this.handleFilter()
    },
    // 数据集管理系列函数
    handleInfoVerity(row) {
      datasetInfoUpdate({ 'datasetid': row._id, 'infos': { 'taskName': row.taskName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('任务信息修改成功！')
        this.getList()
      })
    },
    handleSetAnnotation(row) {
      this.configDialogShow = true
      this.clickID = row._id
      switch (row.taskType) {
        case '实体关系抽取':
          this.dialogComponent = ExtractionConfigDialog
          break
        case '文本关系分析':
          this.dialogComponent = RelationAnalysisConfigDialog
          break
        case '文本排序学习':
          this.dialogComponent = L2rConfigDialog
          break
        case '文本摘要':
          this.dialogComponent = SummaryConfigDialog
          break
        case '文本配对':
          this.dialogComponent = MatchingConfigDialog
          break
        case '通用单文本分类':
          this.dialogComponent = ClassificationConfigDialog
          break
        case '情感分析/意图识别':
          this.dialogComponent = SentimentAnalysisConfigDialog
          break
      }
      this.$refs.dialogComponent.init()
    },
    handleManage(row) {
      this.$router.push('/process-manage/annotation/data-detail/' + row._id)
    },
    handlePublicityChange(row) {
      datasetInfoUpdate({ 'datasetid': row._id, 'infos': { 'annotationPublicity': row.annotationPublicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/original-dataset/' + row._id)
    },
    handleProcessManage() {
      this.$router.push('/process-manage/chart/' + '数据标注')
    },
    // 工具系列函数
    configDialogClose() {
      this.configDialogShow = false
      this.getList()
    },
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
