<template>
  <div>
    <pipelines-table />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import PipelinesTable from './components/pipelines-table'

export default {
  name: 'ResourceManage',
  components: { PipelinesTable },
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
