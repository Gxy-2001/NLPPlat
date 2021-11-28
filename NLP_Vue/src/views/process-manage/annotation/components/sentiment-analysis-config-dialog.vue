<template>
  <div>

    <el-form>
      <el-form-item label="标注类别">
        <el-radio-group v-model="annotationFormat.type">
          <el-radio-button label="句子级" />
          <el-radio-button label="篇章级" />
          <el-radio-button label="aspect级" />
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-if="annotationFormat.type==='aspect级'">aspect词典</span>
        <span v-else>情感标签/意图标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in annotationFormat.tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handletagsClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="tagsInputVisible"
          ref="saveTagsInput"
          v-model="tagsInputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handletagsInputConfirm"
          @blur="handletagsInputConfirm"
        />
        <div v-else style="display:inline-block">
          <el-button v-if="annotationFormat.level==='aspect级'" class="button-new-tag" size="small" @click="showtagsInput">+新aspect</el-button>
          <el-button v-else class="button-new-tag" size="small" @click="showtagsInput">+新情感/意图</el-button>
        </div>
      </div>
    </el-card>

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
  name: 'SentimentAnalysisConfigDialog',
  props: ['clickid'],
  data() {
    return {
      id: '',
      annotationPublicity: '不允许',
      annotationFormat: {
        type: 'aspect级',
        tags: []
      },
      tagsInputVisible: false,
      tagsInputValue: ''
    }
  },
  created() {
    this.id = this.clickid
  },
  methods: {
    init() {
      this.annotationFormat.tags = []
      this.tagsInputVisible = false
      this.tagsInputValue = ''
    },
    handletagsClose(tag) {
      this.annotationFormat.tags.splice(this.annotationFormat.tags.indexOf(tag), 1)
    },

    showtagsInput() {
      this.tagsInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagsInput.$refs.input.focus()
      })
    },

    handletagsInputConfirm() {
      const tagsInputValue = this.tagsInputValue
      if (tagsInputValue) {
        this.annotationFormat.tags.push(tagsInputValue)
      }
      this.tagsInputVisible = false
      this.tagsInputValue = ''
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag{
    line-height: 30px;
    height: 32px;
    margin-top:2px;
    margin-bottom:12px
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top:2px;
    margin-bottom:12px
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-top:2px;
    margin-bottom:12px
  }
  .box-card{
    margin-top: 10px;
    margin-bottom: 40px;
  }
</style>
