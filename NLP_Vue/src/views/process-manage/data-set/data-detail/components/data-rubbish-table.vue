<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.group" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vectorid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="titleContain" label="标题" width="250px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text1" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.text2" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click="handleRecycle(row)"
          >
            恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { datasetVectorsFetch, datasetInfoFetch } from '@/api/common/dataset'
import { editDataVector } from '@/api/process-manage/data-set'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataRubbishTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      taskType: null,
      groupOn: 'off',
      titleContain: false,
      listQuery: {
        datasetid: null,
        page: 1,
        limit: 10,
        deleted: '已删除'
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.id
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await datasetVectorsFetch(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total
      datasetInfoFetch({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.taskType = response.data.taskType
        this.groupOn = response.data.groupOn
      })
      this.listLoading = false
    },
    handleRecycle(row) {
      row.deleted = '未删除'
      editDataVector({ 'datasetid': this.listQuery.datasetid, 'vectorid': row.vectorid, 'vector': row }).then(response => {
        this.$message({
          message: '文本恢复成功！',
          type: 'success'
        })
        this.getList()
      })
    }
  }
}
</script>

<style scoped>
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
