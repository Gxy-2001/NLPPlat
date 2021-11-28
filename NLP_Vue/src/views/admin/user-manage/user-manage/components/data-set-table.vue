<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.userStatusSelect" placeholder="用户状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleModelAdd">
        用户添加
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
      <el-table-column label="用户名称" width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.username }}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ (row.datetime.$date-8*60*60*1000) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" column-key="userStatus" :filters="statusFilter" class-name="status-col" width="160px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div>
            <el-button type="primary" size="mini" @click="handleManage(row)">
              用户管理
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { datasetCopy, datasetDelete, datasetInfoUpdate } from '@/api/common/dataset'
import { usersFetch } from '@/api/admin/user'
import { writePermission } from '@/utils/permission'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataSetTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '封禁': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        type: 'part',
        username: '',
        userStatus: ['正常', '封禁']
      },
      searchQuery: {
        userStatusSelect: ''
      },
      userStatusOptions: ['正常', '封禁'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      statusFilter: [
        { text: '正常', value: '正常' },
        { text: '封禁', value: '封禁' }
      ],
      timer: null
    }
  },
  created() {
    this.getList()
    this.timer = setInterval(() => {
      this.getList()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
  },
  methods: {
    // 数据获取系列函数
    getList() {
      usersFetch(this.listQuery).then(response => {
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
      if (this.searchQuery.userStatusSelect === '') {
        this.listQuery.userStatus = this.userStatusOptions
      } else {
        this.listQuery.userStatus = [this.searchQuery.userStatusSelect]
      }
      this.handleFilter()
    },
    // 数据集管理系列函数
    handleManage(row) {
      this.$router.push('/process-manage/model-train/train-manage/' + row._id)
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
    handleInfoVerity(row) {
      datasetInfoUpdate({ 'datasetid': row._id, 'infos': { 'taskName': row.taskName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('任务信息修改成功！')
      })
    },
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/features-dataset/' + row._id)
    },
    handleProcessManage() {
      this.$router.push('/process-manage/chart/' + '模型训练')
    },
    handleCopy() {
      this.datasetCopy.copyDialogVisible = false
      datasetCopy({ 'datasetInitType': '特征数据集', 'datasetInitid': this.datasetCopy.datasetInitid, 'copyDes': this.datasetCopy.copyDes }).then(response => {
        this.getList()
        this.$notify({
          title: '拷贝任务创建成功！',
          message: '即将拷贝至ID为' + response.data.datasetDesID + '的数据集中',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleModelAdd() {
      this.$router.push('/data-manage/model-manage/codehub/' + '-1')
    },
    handlePublicityChange(row) {
      datasetInfoUpdate({ 'datasetid': row._id, 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    // 工具系列函数
    copyDialogShow(row) {
      this.datasetCopy.datasetInitid = row._id
      this.datasetCopy.copyDialogVisible = true
    },
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
