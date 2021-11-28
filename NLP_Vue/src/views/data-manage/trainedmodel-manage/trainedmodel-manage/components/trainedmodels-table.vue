<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.modelName" placeholder="模型名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.platTypeSelect" placeholder="运行平台" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in platTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleTrainedmodelAdd">
        已训练模型上传
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
      <el-table-column label="模型名称" width="180px" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form>
              <el-form-item label="模型名称">
                <el-input v-model="row.modelName" />
              </el-form-item>
              <el-form-item label="模型描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.modelName }}</span>
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
      <el-table-column label="运行平台" column-key="platType" :filters="platTypeFilter" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.platType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="primary" size="mini" @click="handleManage(row)">
              查看模型
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

    <trainedmodel-upload ref="TrainedmodeleUpload" />

  </div>
</template>

<script>
import { datafileInfoUpdate } from '@/api/common/datafile'
import { trainedmodelsFetch } from '@/api/common/model'
import { writePermission } from '@/utils/permission'

import TrainedmodelUpload from './trainedmodel-upload'
import Pagination from '@/components/Pagination'
export default {
  name: 'TrainedmodelsTable',
  components: { Pagination, TrainedmodelUpload },
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
        modelName: '',
        username: ['自己', '他人'],
        platType: ['Tensorflow1.X', 'Tensorflow2.X', 'Keras', 'Pytorch']
      },
      searchQuery: {
        usernameSelect: '',
        platTypeSelect: ''
      },
      usernameOptions: ['自己', '他人'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      platTypeOptions: ['Tensorflow1.X', 'Tensorflow2.X', 'Keras', 'Pytorch'],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      platTypeFilter: [
        { text: 'Tensorflow1.X', value: 'Tensorflow1.X' },
        { text: 'Tensorflow2.X', value: 'Tensorflow2.X' },
        { text: 'Keras', value: 'Keras' },
        { text: 'Pytorch', value: 'Pytorch' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 数据获取系列函数
    getList() {
      this.listLoading = true
      trainedmodelsFetch(this.listQuery).then(response => {
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
      if (this.searchQuery.platTypeSelect === '') {
        this.listQuery.platType = ['Tensorflow1.X', 'Tensorflow2.X', 'Keras', 'Pytorch']
      } else {
        this.listQuery.platType = [this.searchQuery.platTypeSelect]
      }
      this.handleFilter()
    },
    // 资源管理系列函数
    handleTrainedmodelAdd() {
      this.$refs.TrainedmodeleUpload.showDialog()
    },
    handleManage(row) {
      this.$router.push('/data-manage/model-manage/codehub/' + row._id)
    },
    handleDelete(row) {
    },
    handleInfoVerity(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '训练模型文件', 'infos': { 'modelName': row.modelName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('资源文件信息修改成功！')
      })
    },
    handleCopy() {
      this.datasetCopy.copyDialogVisible = false
    },
    handlePublicityChange(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '训练模型文件', 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    // 工具系列函数
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
