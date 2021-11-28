<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.resourceName" placeholder="资源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.usernameSelect" placeholder="归属者" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in usernameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchQuery.resourceTypeSelect" placeholder="资源类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in resourceTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSearch">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResourceAdd">
        资源添加
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
              <el-form-item label="资源名称">
                <el-input v-model="row.resourceName" />
              </el-form-item>
              <el-form-item label="资源描述">
                <el-input v-model="row.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left:150px" @click="handleInfoVerity(row)">保存</el-button>
              </el-form-item>
            </el-form>
            <span slot="reference" class="link-type">{{ row.resourceName }}</span>
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
      <el-table-column label="资源类型" column-key="resourceType" :filters="resourceTypeFilter" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.resourceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="permissionCheck(row.username)">
            <el-button type="success" size="mini" @click="handleDownload(row)">
              导出资源
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

    <resource-upload ref="ResourceUpload" />
  </div>
</template>

<script>
import { datafileInfoUpdate } from '@/api/common/datafile'
import { resourcesFetch } from '@/api/common/resource'
import { writePermission } from '@/utils/permission'
import ResourceUpload from './resource-upload'
import Pagination from '@/components/Pagination'

import axios from 'axios'

export default {
  name: 'ResourcesTable',
  components: { Pagination, ResourceUpload },
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
        resourceName: '',
        username: ['自己', '他人'],
        resourceType: ['停用词表', '预训练向量', '通用资源']
      },
      searchQuery: {
        usernameSelect: '',
        resourceTypeSelect: ''
      },
      resourceTypeOptions: ['停用词表', '预训练向量', '通用资源'],
      usernameOptions: ['自己', '他人'],
      sortOptions: [{ label: 'ID升序', key: 'id' }, { label: 'ID降序', key: '-id' }],
      usernameFilter: [
        { text: '自己', value: '自己' },
        { text: '他人', value: '他人' }
      ],
      resourceTypeFilter: [
        { text: '停用词表', value: '停用词表' },
        { text: '预训练向量', value: '预训练向量' },
        { text: '通用资源', value: '通用资源' }
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
      resourcesFetch(this.listQuery).then(response => {
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
      if (this.searchQuery.resourceTypeSelect === '') {
        this.listQuery.resourceType = ['停用词表', '预训练向量', '通用资源']
      } else {
        this.listQuery.resourceType = [this.searchQuery.resourceTypeSelect]
      }
      this.handleFilter()
    },
    // 资源管理系列函数
    handleResourceAdd() {
      this.$refs.ResourceUpload.showDialog()
    },
    handleDelete(row) {
    },
    handlePublicityChange(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '资源文件', 'infos': { 'publicity': row.publicity }}).then(response => {
        this.$message.success('权限更改成功!')
      })
    },
    handleInfoVerity(row) {
      datafileInfoUpdate({ 'datafileid': row._id, 'datafileType': '资源文件', 'infos': { 'resourceName': row.resourceName, 'desc': row.desc }}).then(response => {
        document.body.click()
        this.$message.success('资源文件信息修改成功！')
      })
    },
    handleDownload(row) {
      axios
        .get(process.env.VUE_APP_BASE_API + '/data-manage/resource/resources/ID/download',
          { params: { 'resourceid': row._id },
            headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }})
        .then(response => {
          const fileName = response.headers['content-disposition']
          var url = window.URL.createObjectURL(new Blob([response.data]))
          const a = document.createElement('a')
          a.href = url
          a.setAttribute('download', fileName)
          a.click()
          window.URL.revokeObjectURL(url)
        })
    },
    // 工具系列函数
    permissionCheck(username) {
      return writePermission(username)
    }
  }
}
</script>
