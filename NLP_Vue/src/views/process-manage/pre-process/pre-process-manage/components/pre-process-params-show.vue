<template>
  <div>
    <el-table
      :data="preprocessParams"
      style="width: 100%"
    >
      <el-table-column
        prop="paramName"
        label="参数"
        width="200"
        align="center"
      />
      <el-table-column
        prop="paramValue"
        label="参数值"
        width="200"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'PreProcessParamsShow',
  components: { },
  directives: { },
  filters: {
  },
  props: ['params'],
  data() {
    return {
    }
  },
  computed: {
    preprocessParams: function() {
      var params = []
      for (var i = 0; i < Object.keys(this.params).length; i++) {
        params.push({ 'paramName': Object.keys(this.params)[i], 'paramValue': this.params[ Object.keys(this.params)[i]] })
      }
      return params
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
