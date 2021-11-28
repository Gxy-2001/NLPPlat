<template>
  <div>
    <div>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;&nbsp;&nbsp;&nbsp;1</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text1 }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文本关系标签</span>
            </div>
            <div>
              <el-checkbox-group v-model="label.text">
                <el-checkbox-button v-for="item in tags.textTags" :key="item" :label="item" />
              </el-checkbox-group>
            </div>
          </el-card>
          <el-row>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                  <span>文本1标签</span>
                </div>
                <div>
                  <el-checkbox-group v-model="label.text1" size="mini">
                    <el-checkbox-button v-for="item in tags.text1Tags" :key="item" :label="item" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                  <span>文本2标签</span>
                </div>
                <div>
                  <el-checkbox-group v-model="label.text2" size="mini">
                    <el-checkbox-button v-for="item in tags.text2Tags" :key="item" :label="item" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;&nbsp;&nbsp;&nbsp;2</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text2 }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RelationAnalysisVector',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},
  data() {
    return {
      data: [],
      tags: {
        textTags: [],
        text1Tags: [],
        text2Tags: []
      },
      text1: '',
      text2: '',
      label: {
        text: [],
        text1: [],
        text2: []
      }
    }
  },
  created() {
    this.data = this.initData
    this.tags = this.initTags
    this.text1 = this.data.text1
    this.text2 = this.data.text2
    if (this.data.label !== '') {
      this.label = this.data.label
    }
    this.getTags()
  },
  methods: {
    upload() {
      this.data.label = this.label
      this.$emit('upload', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.box-card{
  margin:20px 10px 0px 10px
}

::v-deep{
  .el-checkbox-button__inner{
    border-left: 1px solid #DCDFE6;
    margin:10px;
}
}
</style>
