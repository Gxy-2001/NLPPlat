<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="datasetList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @filter-change="filterChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属者" column-key="username" :filters="usernameFilter" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="235px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" column-key="type" :filters="typeFilter" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div>
            <el-button type="primary" size="mini" @click="handleManage(row)">
              查看
            </el-button>
            <el-button size="mini" type="success" @click="handleDataVenation(row)">
              数据脉络
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

const taskTypeOptions = [
  { key: '训练数据集', display_name: '训练数据集' },
  { key: '预处理数据集', display_name: '预处理数据集' },
  { key: '特征数据集', display_name: '特征数据集' },
  { key: '批处理数据集', display_name: '批处理数据集' },
  { key: '批处理特征集', display_name: '批处理特征集' },
  { key: '结果数据集', display_name: '结果数据集' },
  { key: '预处理管道对象', display_name: '预处理管道对象' },
  { key: '训练模型对象', display_name: '训练模型对象' }
]

const calendarTypeKeyValue = taskTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'DataSetTable',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已就绪': 'success',
        '解析中': 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: ['datasetList'],
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
        datasetType: '训练数据集',
        username: ['自己', '他人'],
        taskType: ['通用单文本分类', '情感分析/意图识别', '实体关系抽取', '文本关系分析', '文本摘要', '文本排序学习'],
        analyseStatus: ['解析中', '已就绪']
      },
      taskTypeOptions,
      downloadLoading: false,
      taskTypeFilter: [
        { text: '通用单文本分类', value: '通用单文本分类' },
        { text: '情感分析/意图识别', value: '情感分析/意图识别' },
        { text: '实体关系抽取', value: '实体关系抽取' },
        { text: '文本关系分析', value: '文本关系分析' },
        { text: '文本摘要', value: '文本摘要' },
        { text: '文本排序学习', value: '文本排序学习' }
      ],
      venationTypeMap: {
        '训练数据集': 'original-dataset',
        '预处理数据集': 'preprocess-dataset',
        '特征数据集': 'features-dataset',
        '训练模型对象': 'trainedmodel',
        '批处理数据集': 'original-batch-dataset',
        '批处理特征集': 'features-batch-dataset',
        '预处理管道对象': 'pipeline',
        '结果数据集': 'result-batch-dataset'
      }
    }
  },
  created() {
    this.list = this.datasetList
    console.log(this.datasetList)
  },
  methods: {
    getList() {
      this.list = this.datasetList
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
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/' + this.venationTypeMap[row.type] + '/' + row.id)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
    }
  }
}
</script>
