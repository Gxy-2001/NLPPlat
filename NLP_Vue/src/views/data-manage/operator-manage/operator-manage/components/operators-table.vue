<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operatorName" placeholder="算子名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.operatorTypeSelect" placeholder="算子类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in operatorTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleOperatorAdd">
        算子添加
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
      <el-table-column label="算子名称" width="180px" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form>
              <el-form-item label="算子名称">
                <el-input v-model="row.operatorName" />
              </el-form-item>
              <el-form-item label="算子描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.operatorName }}</span>
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
      <el-table-column label="算子类型" column-key="operatorType" :filters="operatorTypeFilter" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.operatorType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              进入算子
            </el-button>
            <el-button type="primary" size="mini" @click="handleCopy(row)">
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
import { datafileInfoUpdate, datafileCopy } from '@/api/common/datafile'
import { operatorsFetch } from '@/api/common/operator'
import { writePermission } from '@/utils/permission'

import Pagination from '@/components/Pagination'

export default {
  name: 'OperatorsTable',
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
        sort: '-id',
        operatorName: '',
        username: ['自己', '他人'],
        operatorType: ['数据清洗算子', '预处理算子', '批处理算子']
      },
      searchQuery: {
        usernameSelect: '',
        operatorTypeSelect: ''
      },
      usernameOptions: ['自己', '他人'],
      operatorTypeOptions: ['数据清洗算子', '预处理算子', '批处理算子'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      operatorTypeFilter: [
        { text: '数据清洗算子', value: '数据清洗算子' },
        { text: '预处理算子', value: '预处理算子' },
        { text: '批处理算子', value: '批处理算子' }
      ],
      datasetCopy: {
        copyDialogVisible: false,
        copyDes: '',
        datasetInitid: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 数据获取系列函数
    getList() {
      console.log(this.listQuery)
      this.listLoading = true
      operatorsFetch(this.listQuery).then(response => {
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
        this.listQuery.username = this.usernameOptions
      } else {
        this.listQuery.username = [this.searchQuery.usernameSelect]
      }
      if (this.searchQuery.operatorTypeSelect === '') {
        this.listQuery.operatorType = this.operatorTypeOptions
      } else {
        this.listQuery.operatorType = [this.searchQuery.operatorTypeSelect]
      }
      this.handleFilter()
    },
    // 资源管理系列函数
    handleManage(row) {
      this.$router.push('/data-manage/operator-manage/codehub/' + row._id)
    },
    handleOperatorAdd() {
      this.$router.push('/data-manage/operator-manage/codehub/' + '-1')
    },
    handleCopy(row) {
      datafileCopy({ 'datafileInitid': row._id, 'datafileType': '算子文件' }).then(response => {
        this.$notify({
          title: '算子拷贝成功！',
          message: '拷贝至ID为' + response.data.datafileDesID + '的算子中',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDelete(row) {
    },
    handlePublicityChange(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '算子文件', 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    handleInfoVerity(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '算子文件', 'infos': { 'operatorName': row.operatorName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('资源文件信息修改成功！')
      })
    },
    handleDataVenation(row) {
      this.$router.push('/data-manage/data-venation/' + row._id)
    },
    // 工具系列函数
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
