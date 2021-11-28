<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文本关系标签</span>
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

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文本1标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in text1Tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handletext1Close(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="text1InputVisible"
          ref="savetext1TagInput"
          v-model="text1InputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handletext1InputConfirm"
          @blur="handletext1InputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showtext1Input">+新标签</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文本2标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in text2Tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handletext2Close(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="text2InputVisible"
          ref="savetext2TagInput"
          v-model="text2InputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handletext2InputConfirm"
          @blur="handletext2InputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showtext2Input">+新标签</el-button>
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
  name: 'RelationAnalysisConfigDialog',
  props: ['clickid'],
  data() {
    return {
      id: '',
      annotationPublicity: '不允许',
      textTags: [],
      textInputVisible: false,
      textInputValue: '',
      text1Tags: [],
      text1InputVisible: false,
      text1InputValue: '',
      text2Tags: [],
      text2InputVisible: false,
      text2InputValue: ''
    }
  },
  created() {
    this.id = this.clickid
  },
  methods: {
    init() {
      this.textTags = []
      this.text1Tags = []
      this.text2Tags = []
      this.textInputVisible = false
      this.text1InputVisible = false
      this.text2InputVisible = false
      this.textInputValue = ''
      this.text1InputValue = ''
      this.text2InputValue = ''
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

    handletext1Close(tag) {
      this.text1Tags.splice(this.text1Tags.indexOf(tag), 1)
    },

    showtext1Input() {
      this.text1InputVisible = true
      this.$nextTick(_ => {
        this.$refs.savetext1TagInput.$refs.input.focus()
      })
    },

    handletext1InputConfirm() {
      const text1InputValue = this.text1InputValue
      if (text1InputValue) {
        this.text1Tags.push(text1InputValue)
      }
      this.text1InputVisible = false
      this.text1InputValue = ''
    },
    handletext2Close(tag) {
      this.text2Tags.splice(this.text2Tags.indexOf(tag), 1)
    },

    showtext2Input() {
      this.text2InputVisible = true
      this.$nextTick(_ => {
        this.$refs.savetext2TagInput.$refs.input.focus()
      })
    },

    handletext2InputConfirm() {
      const text2InputValue = this.text2InputValue
      if (text2InputValue) {
        this.text2Tags.push(text2InputValue)
      }
      this.text2InputVisible = false
      this.text2InputValue = ''
    },
    handleSubmit() {
      annotationConfig({ 'id': this.id, 'annotationPublicity': this.annotationPublicity, 'annotationFormat': { 'type': '', 'tags': { 'textTags': this.textTags, 'text1Tags': this.text1Tags, 'text2Tags': this.text2Tags }}}).then(response => {
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
