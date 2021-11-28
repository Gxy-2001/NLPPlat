<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>实体标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in entityTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleEntityClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="entityInputVisible"
          ref="saveEntityTagInput"
          v-model="entityInputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleEntityInputConfirm"
          @blur="handleEntityInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showEntityInput">+新标签</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>关系标签</span>
      </div>
      <div>
        <el-tag
          v-for="tag in relationTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleRelationClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="relationInputVisible"
          ref="saveRelationTagInput"
          v-model="relationInputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleRelationInputConfirm"
          @blur="handleRelationInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showRelationInput">+新标签</el-button>
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
  name: 'ExtractionConfigDialog',
  props: ['clickid'],
  data() {
    return {
      id: '',
      annotationPublicity: '不允许',
      entityTags: [],
      entityInputVisible: false,
      entityInputValue: '',
      relationTags: [],
      relationInputVisible: false,
      relationInputValue: ''
    }
  },
  created() {
    this.id = this.clickid
  },
  methods: {
    init() {
      this.entityTags = []
      this.relationTags = []
      this.entityInputVisible = false
      this.relationInputVisible = false
      this.entityInputValue = ''
      this.relationInputValue = ''
    },
    handleEntityClose(tag) {
      this.entityTags.splice(this.entityTags.indexOf(tag), 1)
    },

    showEntityInput() {
      this.entityInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveEntityTagInput.$refs.input.focus()
      })
    },

    handleEntityInputConfirm() {
      const entityInputValue = this.entityInputValue
      if (entityInputValue) {
        this.entityTags.push(entityInputValue)
      }
      this.entityInputVisible = false
      this.entityInputValue = ''
    },
    handleRelationClose(tag) {
      this.relationTags.splice(this.relationTags.indexOf(tag), 1)
    },

    showRelationInput() {
      this.relationInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveRelationTagInput.$refs.input.focus()
      })
    },

    handleRelationInputConfirm() {
      const relationInputValue = this.relationInputValue
      if (relationInputValue) {
        this.relationTags.push(relationInputValue)
      }
      this.relationInputVisible = false
      this.relationInputValue = ''
    },
    handleSubmit() {
      annotationConfig({ 'id': this.id, 'annotationPublicity': this.annotationPublicity, 'annotationFormat': { 'type': '', 'tags': { 'entityTags': this.entityTags, 'relationTags': this.relationTags }}}).then(response => {
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
