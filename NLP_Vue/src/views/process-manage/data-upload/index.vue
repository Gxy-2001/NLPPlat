<template>
  <div class="app-container">
    <div class="switch-container">
      <el-radio-group v-model="switchDataSet">
        <el-radio-button label="训练数据集" />
        <el-radio-button label="批处理数据集" />
      </el-radio-group>
    </div>
    <div class="switch-container">
      <el-radio-group v-model="switchUploadMethod">
        <el-radio-button label="文件上传" />
        <el-radio-button label="接口导入" />
        <el-radio-button label="数据库导入" />
      </el-radio-group>
    </div>
    <div class="form-container">
      <keep-alive>
        <component :is="currentForm" />
      </keep-alive>
    </div>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import TrainFile from './components/train-file'
import BatchFile from './components/batch-file'

export default {
  name: 'DataUpload',
  components: { TrainFile, BatchFile },
  data() {
    return {
      switchDataSet: '训练数据集',
      switchUploadMethod: '文件上传'
    }
  },
  computed: {
    currentForm: function() {
      if (this.switchDataSet === '训练数据集') {
        switch (this.switchUploadMethod) {
          case '文件上传':
            return 'TrainFile'
        }
      } else if (this.switchDataSet === '批处理数据集') {
        switch (this.switchUploadMethod) {
          case '文件上传':
            return 'BatchFile'
        }
      }
      return ''
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .switch-container{
    margin:10px 0px 20px 40px
  }

  .form-container{
    margin:50px 0px 0px 0px
  }
}
</style>
