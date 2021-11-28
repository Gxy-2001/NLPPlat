<template>
  <div class="app-container">
    <div class="switch-container">
      <el-radio-group v-model="switchDataComponent">
        <el-radio-button label="数据集" />
        <el-radio-button label="回收站" />
      </el-radio-group>
    </div>
    <div>
      <component :is="dataComponent" />
    </div>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import DataDetailTable from './components/data-detail-table'
import DataRubbishTable from './components/data-rubbish-table'

export default {
  name: 'DataDetail',
  components: { DataDetailTable, DataRubbishTable },
  data() {
    return {
      switchDataComponent: '数据集'
    }
  },
  computed: {
    dataComponent: function() {
      if (this.switchDataComponent === '数据集') {
        return 'DataDetailTable'
      } else if (this.switchDataComponent === '回收站') {
        return 'DataRubbishTable'
      }
      return ''
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .switch-container{
    margin:0px 0px 0px 20px
  }
}
</style>
