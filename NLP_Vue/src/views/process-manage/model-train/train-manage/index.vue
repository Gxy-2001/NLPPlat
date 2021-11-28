<template>
  <div>
    <train-manage-table />
  </div>
</template>

<script>
import TrainManageTable from './components/train-manage-table'

export default {
  name: 'TrainManage',
  components: { TrainManageTable },
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
