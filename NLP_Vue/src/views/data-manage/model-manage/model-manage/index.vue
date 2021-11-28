<template>
  <div>
    <models-table />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import ModelsTable from './components/models-table'

export default {
  name: 'ModelManage',
  components: { ModelsTable },
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
