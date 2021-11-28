<template>
  <div>
    <process-chart :process="process" />
  </div>
</template>

<script>
import processChart from '@/components/ProcessManageChart'

export default {
  name: 'ProcessManageChart',
  components: { processChart },
  data() {
    return {
      process: ''
    }
  },
  computed: {
  },
  created() {
    this.process = this.$route.params.process
  }
}
</script>

<style lang="scss" scoped>
</style>
