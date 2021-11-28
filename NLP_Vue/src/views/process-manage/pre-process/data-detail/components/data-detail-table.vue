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
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本1" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text1 }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskType==='文本关系分析'" label="文本2" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.text2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160px">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="small"
            icon="el-icon-search"
            @click="handleEdit(row)"
          >
            标注查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { preprocessVectorsFetch } from '@/api/process-manage/preprocess'
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
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      taskType: '',
      annotationStatus: '',
      groupOn: 'off',
      listQuery: {
        datasetid: null,
        preprocessid: null,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.preprocessid = this.$route.params.preprocessid
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await preprocessVectorsFetch(this.listQuery)
      this.list = data.items
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
</style>
