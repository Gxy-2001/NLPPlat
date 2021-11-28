<template>
  <el-progress :text-inside="true" :stroke-width="35" :percentage="(100*(1-processController.nolabel/processController.all)).toFixed(1)" />
</template>

<script>
import { fetchAnnotationProgress } from '@/api/process-manage/annotation'

export default {
  name: 'AnnotationProgress',
  props: ['id'],
  data() {
    return {
      datasetid: '',
      processController: {
        all: null,
        nolabel: null
      }
    }
  },
  created() {
    this.datasetid = this.id
    this.getProgress()
  },
  methods: {
    getProgress() {
      fetchAnnotationProgress({ 'datasetid': this.datasetid }).then(response => {
        this.processController.all = response.data.allCount
        this.processController.nolabel = response.data.nolabelCount
      })
    }
  }
}
</script>

<style scoped>
</style>
