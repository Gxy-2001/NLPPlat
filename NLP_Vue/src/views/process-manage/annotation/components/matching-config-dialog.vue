<template>
  <div>
    <el-form>
      <el-form-item label="共同标注">
        <el-radio-group v-model="annotationPublicity">
          <el-radio-button label="允许" />
          <el-radio-button label="不允许" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="display:block;margin:0 auto" @click="handleSubmit">提交任务</el-button>
  </div>
</template>

<script>
import { annotationConfig } from '@/api/process-manage/annotation'
export default {
  name: 'MatchingConfigDialog',
  props: ['clickid'],
  data() {
    return {
      id: '',
      annotationFormat: {
        type: ''
      },
      annotationPublicity: '不允许'
    }
  },
  created() {
    this.id = this.clickid
  },
  methods: {
    init() {
    },
    handleSubmit() {
      annotationConfig({ 'id': this.id, 'annotationPublicity': this.annotationPublicity, 'annotationFormat': this.annotationFormat }).then(response => {
        this.$notify({
          title: '配置成功',
          message: '可以开始进行标注。',
          type: 'success',
          duration: 2000
        })
        this.$emit('configDialogClose')
      })
    }

  }
}
</script>

<style scoped>
</style>
