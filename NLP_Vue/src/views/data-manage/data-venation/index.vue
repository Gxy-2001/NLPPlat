<template>
  <div>
    <data-chart @datasetListShow="datasetListShow" />
    <el-dialog
      v-if="datasetList.show"
      title="数据集详情"
      :visible.sync="datasetList.show"
      width="900px"
    >
      <data-set-table :dataset-list="datasetList.list" />
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import dataChart from './components/data-chart'
import DataSetTable from './components/data-set-table'

export default {
  name: 'Home',
  components: { dataChart, DataSetTable },
  data() {
    return {
      datasetList: {
        show: false,
        list: []
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    datasetListShow(list) {
      this.datasetList.list = list
      this.datasetList.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
