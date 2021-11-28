<template>
  <div class="app-container">
    <pipeline-detail-table />
  </div>
</template>

<script>
import PipelineDetailTable from './components/pipeline-detail-table'

export default {
  name: 'PipelineDetail',
  components: { PipelineDetailTable },
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
