<template>
  <div>
    <batch-manage-table />
  </div>
</template>

<script>
import batchManageTable from './components/batch-manage-table'

export default {
  name: 'BatchManage',
  components: { batchManageTable },
  data() {
    return {
    }
  },
  computed: {
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
