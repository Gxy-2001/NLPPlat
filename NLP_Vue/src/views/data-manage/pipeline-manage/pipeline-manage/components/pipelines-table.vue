<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.pipelineName" placeholder="管道名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.taskTypeSelect" placeholder="适用类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
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
      <el-table-column label="资源名称" width="180px" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form>
              <el-form-item label="管道名称">
                <el-input v-model="row.pipelineName" />
              </el-form-item>
              <el-form-item label="资源描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.pipelineName }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="归属者" column-key="username" :filters="usernameFilter" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公开性" width="180px" align="center">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.publicity" :disabled="!permissionCheck(row.username)" @change="handlePublicityChange(row)">
            <el-radio-button label="公开" />
            <el-radio-button label="不公开" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用任务类型" column-key="taskType" :filters="taskTypeFilter" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.taskType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              进入管道
            </el-button>
            <el-button type="primary" size="mini" @click="copyDialogShow(row)">
              拷贝
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="copyDialogShow(row)">
              拷贝
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { datafileInfoUpdate } from '@/api/common/datafile'
import { pipelinesFetch } from '@/api/common/pipeline'
import { writePermission } from '@/utils/permission'

import Pagination from '@/components/Pagination'

export default {
  name: 'PipelinesTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: 'part',
        sort: '-id',
        pipelineName: '',
        username: ['自己', '他人'],
        taskType: []
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      usernameOptions: ['自己', '他人'],
      taskTypeOptions: [],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      taskTypeFilter: []
    }
  },
  created() {
    this.taskTypeOptions = this.$store.state.taskTypes.taskType
    this.taskTypeFilter = this.$store.state.taskTypes.taskTypeFilter
    this.listQuery.taskType = this.$store.state.taskTypes.taskType
    this.getList()
  },
  methods: {
    // 数据获取系列函数
    getList() {
      this.listLoading = true
      pipelinesFetch(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1000)
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
        this.listQuery.taskType = this.taskTypeOptions
      } else {
        this.listQuery.taskType = [this.searchQuery.taskTypeSelect]
      }
      this.handleFilter()
    },
    // 资源管理系列函数
    handleManage(row) {
      this.$router.push('/data-manage/pipeline-manage/pipeline-detail/' + row._id)
    },
    handleDelete(row) {
    },
    handleInfoVerity(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '管道文件', 'infos': { 'pipelineName': row.pipelineName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('资源文件信息修改成功！')
      })
    },
    handlePublicityChange(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '管道文件', 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/' + row._id)
    },
    handleCopy() {
      this.datasetCopy.copyDialogVisible = false
    },
    // 工具系列函数
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
