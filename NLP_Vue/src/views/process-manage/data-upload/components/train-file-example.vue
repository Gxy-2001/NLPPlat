<template>
  <div>
    <div>
      <el-radio-group v-model="switchFileType" style="margin-left:20px;margin-bottom:10px">
        <el-radio-button label="CSV" />
        <el-radio-button label="JSON" />
        <el-radio-button label="TXT" />
        <el-radio-button label="XLS" />
        <el-radio-button label="DOC" />
        <el-radio-button label="TSV" />
      </el-radio-group>
    </div>
    <el-table
      :data="fileTypeData"
      :show-header="false"
      style="width: 90%;margin:10px 20px"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-image
            :src="props.row.exampleImage"
            :fit="fit"
            :preview-src-list="[props.row.exampleImage]"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="taskType"
        label="任务类型"
        width="200"
      />
      <el-table-column
        prop="introduction"
        label="介绍"
      />
    </el-table>
  </div>
</template>

<script>

export default {

  name: 'TrainFileExample',
  data() {
    return {
      switchFileType: 'CSV',
      fileTypeData: [
      ]
    }
  },
  watch: {
    switchFileType: {
      handler: function(val, n) {
        switch (val) {
          case 'CSV':
          case 'TSV':
          case 'XLS':
            this.fileTypeData = [
              { 'taskType': '通用单文本分类', 'introduction': 'text1列为文本内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/1.png') },
              { 'taskType': '情感分析/意图识别', 'introduction': 'text1列为文本内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/1.png') },
              { 'taskType': '实体关系抽取', 'introduction': 'text1列为文本内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/1.png') },
              { 'taskType': '文本关系分析', 'introduction': 'text1列为文本1内容，必填。text2列为文本2内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/2.png') },
              { 'taskType': '文本摘要', 'introduction': 'text1列为文本内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/1.png') },
              { 'taskType': '文本排序学习', 'introduction': 'group为文本列表组编号，必填，每组第一个为查询文本。text1列为文本内容，必填。label列为标注，选填。title列为标题，选填。', 'exampleImage': require('@/assets/train_file_examples/3.png') }
            ]
            break
          case 'TXT':
          case 'DOC':
            this.fileTypeData = [
              { 'taskType': '通用单文本分类', 'introduction': '每段将被解析为一条文本。', 'exampleImage': require('@/assets/train_file_examples/4.png') },
              { 'taskType': '情感分析/意图识别', 'introduction': '每段将被解析为一条文本。', 'exampleImage': require('@/assets/train_file_examples/4.png') },
              { 'taskType': '实体关系抽取', 'introduction': '每段将被解析为一条文本。', 'exampleImage': require('@/assets/train_file_examples/4.png') },
              { 'taskType': '文本关系分析', 'introduction': '不支持该任务类型。' },
              { 'taskType': '文本摘要', 'introduction': '每段将被解析为一条文本。', 'exampleImage': require('@/assets/train_file_examples/4.png') },
              { 'taskType': '文本排序学习', 'introduction': '不支持该任务类型。' }
            ]
            break
          case 'JSON':
            this.fileTypeData = [
              { 'taskType': '通用单文本分类', 'introduction': 'JSON数组中每一个对象必须包含属性text1（文本内容），可包含属性label（标注）、title（标题）。', 'exampleImage': require('@/assets/train_file_examples/5.png') },
              { 'taskType': '情感分析/意图识别', 'introduction': 'JSON数组中每一个对象必须包含属性text1（文本内容），可包含属性label（标注）、title（标题）。', 'exampleImage': require('@/assets/train_file_examples/5.png') },
              { 'taskType': '实体关系抽取', 'introduction': 'JSON数组中每一个对象必须包含属性text1（文本内容），可包含属性label（标注）、title（标题）。。', 'exampleImage': require('@/assets/train_file_examples/5.png') },
              { 'taskType': '文本关系分析', 'introduction': 'JSON数组中每一个对象必须包含属性text1（文本1）、text2（文本2），可包含属性label（标注）、title（标题）。', 'exampleImage': require('@/assets/train_file_examples/5.png') },
              { 'taskType': '文本摘要', 'introduction': 'JSON数组中每一个对象必须包含属性text1（文本内容），可包含属性label（标注）、title（标题）。', 'exampleImage': require('@/assets/train_file_examples/5.png') },
              { 'taskType': '文本排序学习', 'introduction': 'JSON数组中每一个对象必须包含属性group（文本列表组编号，每组第一个为查询文本）、text1（文本内容），可包含属性label（标注）、title（标题）。', 'exampleImage': require('@/assets/train_file_examples/5.png') }
            ]
            break
          default:
            this.fileTypeData = []
            break
        }
      },
      immediate: true
    },
    methods: {
    }
  }
}
</script>

<style scoped>
</style>

