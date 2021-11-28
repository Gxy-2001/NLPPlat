<template>
  <div class="app-container">
    <div class="switch-container">
      <el-radio-group v-model="listQuery.switchDataset">
        <el-radio-button label="训练数据集" />
        <el-radio-button label="批处理数据集" />
      </el-radio-group>
    </div>
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDataUpload">
        数据接入
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-position" @click="handleProcessManage">
        过程脉络
      </el-button>
    </div>

    <!-- 主体表格 -->
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
      <el-table-column label="任务状态" column-key="analyseStatus" :filters="statusFilter" class-name="status-col" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.analyseStatus | statusFilter">
            {{ row.analyseStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="primary" size="mini" :disabled="row.analyseStatus!='已就绪'" @click="handleManage(row)">
              管理数据
            </el-button>
            <el-button size="mini" type="success" @click="handleDataVenation(row)">
              数据脉络
            </el-button>
            <el-button type="primary" size="mini" :disabled="row.analyseStatus!='已就绪'" @click="copyDialogShow(row)">
              拷贝
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" :disabled="row.analyseStatus==='解析中'" @click="handleManage(row)">
              查看数据
            </el-button>
            <el-button type="primary" size="mini" :disabled="row.analyseStatus==='解析中'" @click="copyDialogShow(row)">
              拷贝
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 训练数据集拷贝对话框 -->
    <el-dialog
      title="拷贝至"
      :visible.sync="datasetCopy.copyDialogVisible"
      width="30%"
    >
      <div style="text-align:center;width:100%;">
        <el-radio-group v-model="datasetCopy.copyDes">
          <el-radio label="训练数据集" border>当前步骤</el-radio>
          <el-radio label="预处理数据集" border>下一步骤（预处理）</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">确认</el-button>
      </div>
    </el-dialog>

    <!-- 批处理数据集拷贝对话框 -->
    <el-dialog
      title="拷贝至"
      :visible.sync="batchDatasetCopy.copyDialogVisible"
      width="30%"
    >
      <div style="text-align:center;width:100%;">
        <el-radio-group v-model="batchDatasetCopy.copyDes">
          <el-radio label="批处理数据集" border>当前步骤</el-radio>
          <el-radio label="批处理特征集" border>下一步骤（批处理）</el-radio>
        </el-radio-group>
      </div>
      <el-form v-if="batchDatasetCopy.copyDes==='批处理特征集'" ref="batchDatasetCopyForm" :model="batchDatasetCopy" label-width="120px" style="margin:40px 0px 30px 0px">
        <el-form-item label="管道选择" prop="pipeline" :rules="[{ required: true, message: '请选择预处理管道', trigger: 'blur' }]">
          <el-select v-model="batchDatasetCopy.pipeline" placeholder="请选择预处理管道">
            <el-option v-for="item in pipelines" :key="item._id" :label="item.pipelineName" :value="item._id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { datasetCopy, datasetListFetch, datasetDelete, datasetInfoUpdate } from '@/api/common/dataset'
import { pipelinesFetch } from '@/api/common/pipeline'
import { writePermission } from '@/utils/permission'

import Pagination from '@/components/Pagination'

export default {
  name: 'DataSetTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已就绪': 'success',
        '解析中': 'primary',
        '清洗中': 'primary'
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
        switchDataset: '训练数据集',
        page: 1,
        limit: 20,
        sort: '-id',
        taskName: '',
        datasetType: '训练数据集',
        username: ['自己', '他人'],
        taskType: [],
        analyseStatus: ['解析中', '已就绪']
      },
      searchQuery: {
        usernameSelect: '',
        taskTypeSelect: ''
      },
      taskTypeOptions: [],
      usernameOptions: ['自己', '他人'],
      analyseStatusOptions: ['解析中', '已就绪'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      taskTypeFilter: [],
      statusFilter: [
        { text: '解析中', value: '解析中' },
        { text: '已就绪', value: '已就绪' }
      ],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      downloadLoading: false,
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '训练数据集',
        datasetInitid: ''
      },
      batchDatasetCopy: {
        copyDialogVisible: false,
        copyDes: '批处理数据集',
        datasetInitid: '',
        pipeline: ''
      },
      pipelines: [],
      timer: null

    }
  },
  watch: {
    'listQuery.switchDataset': {
      handler(newVal, oldVal) {
        if (newVal === '训练数据集') {
          this.listQuery.datasetType = '训练数据集'
        } else {
          this.listQuery.datasetType = '批处理数据集'
        }
        this.getList()
      },
      deep: true
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
    pipelinesFetch(taskType) {
      pipelinesFetch({ 'taskType': [taskType], 'type': 'all', 'username': ['自己'], 'pipelineName': '' }).then(response => {
        this.pipelines = response.data.items
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
        this.listQuery.username = this.usernameOptions
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
      this.$router.push('/process-manage/data-set/data-detail/' + row._id)
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
      if (this.listQuery.switchDataset === '训练数据集') {
        this.$router.push('/data-manage/data-venation/original-dataset/' + row._id)
      } else {
        this.$router.push('/data-manage/data-venation/original-batch-dataset/' + row._id)
      }
    },
    handleProcessManage() {
      this.$router.push('/process-manage/chart/' + '数据查看')
    },
    handleCopy() {
      if (this.listQuery.switchDataset === '训练数据集') {
        this.datasetCopy.copyDialogVisible = false
        datasetCopy({ 'datasetInitType': '训练数据集', 'datasetInitid': this.datasetCopy.datasetInitid, 'copyDes': this.datasetCopy.copyDes }).then(response => {
          this.getList()
          this.$notify({
            title: '拷贝任务创建成功！',
            message: '即将拷贝至ID为' + response.data.datasetDesID + '的数据集中',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        var flag = true
        if (this.batchDatasetCopy.copyDes === '批处理特征集') {
          this.$refs.batchDatasetCopyForm.validate((valid) => {
            if (!valid) {
              flag = false
            }
          })
        }
        if (flag) {
          this.batchDatasetCopy.copyDialogVisible = false
          datasetCopy({ 'datasetInitType': '批处理数据集', 'datasetInitid': this.batchDatasetCopy.datasetInitid, 'copyDes': this.batchDatasetCopy.copyDes, 'params': { 'pipeline': this.batchDatasetCopy.pipeline }}).then(response => {
            this.getList()
            this.$notify({
              title: '拷贝任务创建成功！',
              message: '即将拷贝至ID为' + response.data.datasetDesID + '的数据集中',
              type: 'success',
              duration: 2000
            })
          })
        }
      }
    },
    handlePublicityChange(row) {
      datasetInfoUpdate({ 'datasetid': row._id, 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    // 工具系列函数
    // 数据集拷贝对话框弹出
    copyDialogShow(row) {
      if (this.listQuery.switchDataset === '训练数据集') {
        this.datasetCopy.datasetInitid = row._id
        this.datasetCopy.copyDialogVisible = true
      } else {
        this.batchDatasetCopy.datasetInitid = row._id
        this.batchDatasetCopy.copyDialogVisible = true
        this.pipelinesFetch(row.taskType)
      }
    },
    handleDataUpload() {
      this.$router.push('/process-manage/data-upload')
    },
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .switch-container{
    margin:0px 0px 20px 0px
  }
}
</style>
