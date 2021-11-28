<template>
  <div>
    <div>
      <el-row>
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ data.text1 }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>摘要</span>
            </div>
            <div>
              <el-input
                v-model="data.label"
                type="textarea"
                :rows="7"
                placeholder="请输入摘要内容"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SummaryVectorAbstractive',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},

  data() {
    return {
      tags: [],
      data: ''
    }
  },
  created() {
    this.data = this.initData
  },
  methods: {
    upload() {
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
