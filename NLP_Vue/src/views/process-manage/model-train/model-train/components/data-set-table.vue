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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleModelAdd">
        模型添加
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
      <el-table-column label="公开性" width="180px" align="center">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.publicity" :disabled="!permissionCheck(row.username)" @change="handlePublicityChange(row)">
            <el-radio-button label="公开" />
            <el-radio-button label="不公开" />
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
      <el-table-column label="任务状态" column-key="trainStatus" :filters="statusFilter" class-name="status-col" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.trainStatus | statusFilter">
            {{ row.trainStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              训练管理
            </el-button>
            <el-button size="mini" type="success" @click="handleDataVenation(row)">
              数据脉络
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

    <el-dialog
      title="拷贝至"
      :visible.sync="datasetCopy.copyDialogVisible"
      width="30%"
    >
      <div style="text-align:center;width:100%;">
        <el-radio-group v-model="datasetCopy.copyDes">
          <el-radio label="特征数据集" border>当前步骤</el-radio>
        </el-radio-group>
      </div>
      <div style="text-align:center;margin-top:20px">注：不会拷贝训练模型</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { datasetCopy, datasetListFetch, datasetDelete, datasetInfoUpdate } from '@/api/common/dataset'
import { writePermission } from '@/utils/permission'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataSetTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已完成': 'success',
        '训练中': 'primary',
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
      listQuery: {
        page: 1,
        limit: 20,
        sort: '-id',
        taskName: '',
        datasetType: '特征数据集',
        username: ['自己', '他人'],
        taskType: [],
        trainStatus: ['未开始', '训练中', '已完成']
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      taskTypeOptions: [],
      usernameOptions: ['自己', '他人'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      trainStatusOptions: ['未开始', '训练中', '已完成'],
      taskTypeFilter: [],
      statusFilter: [
        { text: '已完成', value: '已完成' },
        { text: '训练中', value: '训练中' },
        { text: '未开始', value: '未开始' }
      ],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      downloadLoading: false,
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '特征数据集',
        datasetInitid: ''
      },
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
  mounted() {
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
