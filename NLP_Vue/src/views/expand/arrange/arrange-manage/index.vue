<template>
  <div>
    <arrange-manage-table />
  </div>
</template>

<script>
import arrangeManageTable from './components/arrange-manage-table'

export default {
  name: 'ArrangeManage',
  components: { arrangeManageTable },
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
