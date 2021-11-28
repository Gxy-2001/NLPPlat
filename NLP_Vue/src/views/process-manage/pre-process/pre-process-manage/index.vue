<template>
  <div class="app-container">
    <pre-process-manage-table />
  </div>
</template>

<script>
import PreProcessManageTable from './components/pre-process-manage-table'

export default {
  name: 'PreProcessManage',
  components: { PreProcessManageTable },
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
