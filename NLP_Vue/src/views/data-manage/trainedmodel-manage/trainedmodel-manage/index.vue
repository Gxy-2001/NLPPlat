<template>
  <div>
    <trainedmodels-table />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import TrainedmodelsTable from './components/trainedmodels-table'

export default {
  name: 'TrainedmodelManage',
  components: { TrainedmodelsTable },
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
