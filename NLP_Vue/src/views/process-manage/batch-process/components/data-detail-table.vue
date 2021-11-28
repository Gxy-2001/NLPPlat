<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%">

      <el-table-column v-if="taskType==='文本排序学习'|groupOn==='on'" width="60px" label="组" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vectorid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType!=='文本关系分析'" label="文本" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.originalText1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.originalText1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.originalText2 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='通用单文本分类'" label="处理结果" :show-overflow-tooltip="true" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :auto-scroll="false" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { datasetVectorsFetch } from '@/api/common/dataset'
import Pagination from '@/components/Pagination'

export default {
  name: 'DataDetailTable',
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
  props: ['datasetid', 'taskType'],
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      annotationStatus: '',
      groupOn: 'off',
      listQuery: {
        datasetid: null,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
  },
  methods: {
    async getList() {
      this.listQuery.datasetid = this.datasetid
      this.listLoading = true
      const { data } = await datasetVectorsFetch(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false)
        if ('title' in v) {
          this.titleContain = true
        }
        return v
      })
      this.total = data.total
      this.listLoading = false
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

.pagination-container {
  background: #fff;
  margin:0px;
  padding: 50px 16px;
}
</style>
