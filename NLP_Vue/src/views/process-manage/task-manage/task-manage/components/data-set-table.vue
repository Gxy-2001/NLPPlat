<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.taskName" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.taskTypeSelect" placeholder="任务类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
      v-loading="listLoading"
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
      <el-table-column label="任务名称" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起者" column-key="username" :filters="usernameFilter" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起数据集" column-key="datasetName" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.datasetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行时间" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taskStatus==='已完成'?getCalTime(row.datetime.$date,row.endtime.$date):getCalTime(row.datetime.$date-8*60*60*1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" column-key="taskType" :filters="taskTypeFilter" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.taskType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" column-key="taskStatus" :filters="statusFilter" class-name="status-col" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="row.taskStatus | statusFilter">
            {{ row.taskStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div>
            <el-button type="primary" size="mini" @click="handleForward(row)">
              跳转
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              停止
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { datasetDelete, datasetInfoVerify } from '@/api/common/dataset'
import { tasksFetch } from '@/api/process-manage/task-manage'
import { calTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const taskTypeOptions = [
  { key: '数据接入', display_name: '数据接入' },
  { key: '数据集拷贝', display_name: '数据集拷贝' },
  { key: '模型训练', display_name: '模型训练' },
  { key: '批处理', display_name: '批处理' }

]

const calendarTypeKeyValue = taskTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'DataSetTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已完成': 'success',
        '执行中': 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        taskName: '',
        taskType: ['数据接入', '数据集拷贝', '模型训练', '批处理'],
        taskStatus: ['执行中', '已完成']
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      taskTypeOptions,
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      downloadLoading: false,
      taskTypeFilter: [
        { text: '数据接入', value: '数据接入' },
        { text: '数据集拷贝', value: '数据集拷贝' },
        { text: '模型训练', value: '模型训练' },
        { text: '批处理', value: '批处理' }
      ],
      statusFilter: [
        { text: '执行中', value: '执行中' },
        { text: '已完成', value: '已完成' }
      ],
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '',
        datasetInitid: ''
      },
      timer: null
    }
  },
  created() {
    this.getList()
    this.timer = setInterval(() => {
      this.getList()
    }, 1000 * 5)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getList() {
      tasksFetch(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
    },
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
    handleManage(row) {
      this.$router.push('/process-manage/data-set/data-detail/' + row._id)
    },
    copyDialogShow(row) {
      this.datasetCopy.datasetInitid = row._id
      this.datasetCopy.copyDes = ''
      this.datasetCopy.copyDialogVisible = true
    },
    handleDelete(row) {
      datasetDelete({ 'datasetid': row._id, 'datasetType': '训练数据集' }).then(response => {
        this.$notify({
          title: '删除成功',
          message: '已从训练数据集中移除',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleInfoVerity(id, taskName, desc) {
      datasetInfoVerify({ 'datasetid': id, 'taskName': taskName, 'desc': desc }).then(response => {
        document.body.click()
        this.$message.success('任务信息修改成功！')
        this.getList()
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    filterChange(obj) {
      this.listQuery[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]]
      this.getList()
    },
    handleSearch() {
      if (this.searchQuery.usernameSelect === '') {
        this.listQuery.username = ['自己', '他人']
      } else {
        this.listQuery.username = [this.searchQuery.usernameSelect]
      }
      if (this.searchQuery.taskTypeSelect === '') {
        this.listQuery.taskType = ['通用单文本分类', '情感分析/意图识别', '实体关系抽取', '文本关系分析', '文本摘要', '文本排序学习']
      } else {
        this.listQuery.taskType = [this.searchQuery.taskTypeSelect]
      }
      this.handleFilter()
    },
    handleForward(row) {
      switch (row.taskType) {
        case '数据接入':
          this.$router.push('/process-manage/data-set')
          break
        case '数据集拷贝':
          break
        case '模型训练':
          this.$router.push('/process-manage/model-train')
          break
        case '批处理':
          this.$router.push('/process-manage/batch-process')
          break
      }
    },
    handleProcessManage() {
      this.$router.push('/process-manage/chart/' + '任务管理')
    },
    getCalTime(time, endtime = '') {
      return calTime(time, endtime)
    }
  }
}
</script>
