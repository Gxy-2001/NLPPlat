<template>
  <div>
    <el-form>
      <el-form-item label="标注方式">
        <el-radio-group v-model="type">
          <el-radio-button label="单标签" />
          <el-radio-button label="多标签" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文本标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in textTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handletextClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="textInputVisible"
          ref="savetextTagInput"
          v-model="textInputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handletextInputConfirm"
          @blur="handletextInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showtextInput">+新标签</el-button>
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
  name: 'ClassificationConfigDialog',
  props: ['clickid'],
  data() {
    return {
      id: '',
      annotationPublicity: '不允许',
      textTags: [],
      textInputVisible: false,
      textInputValue: '',
      type: '单标签'
    }
  },
  created() {
    this.id = this.clickid
  },
  methods: {
    init() {
      this.textTags = []
      this.textInputVisible = false
      this.textInputValue = ''
    },
    handletextClose(tag) {
      this.textTags.splice(this.textTags.indexOf(tag), 1)
    },

    showtextInput() {
      this.textInputVisible = true
      this.$nextTick(_ => {
        this.$refs.savetextTagInput.$refs.input.focus()
      })
    },
    handletextInputConfirm() {
      const textInputValue = this.textInputValue
      if (textInputValue) {
        this.textTags.push(textInputValue)
      }
      this.textInputVisible = false
      this.textInputValue = ''
    },
    handleSubmit() {
      annotationConfig({ 'id': this.id, 'annotationPublicity': this.annotationPublicity, 'annotationFormat': { 'tags': this.textTags, 'type': this.type }}).then(response => {
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
