<template>
  <div>
    <div>
      <el-row>
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>查询文本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text['text1'] }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>结果文本列表</span>
            </div>
            <div style="line-height:27.5px">
              <drag-list :list="textList" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DragList from '@/components/DragList'

export default {
  name: 'L2rVectorListwise',
  components: { DragList },
  props: { initData: { default: [] }, initTags: { default: {}}},
  data() {
    return {
      text: '',
      textList: [],
      data: []
    }
  },
  created() {
    this.data = this.initData
    this.text = this.data[0]
    for (var i = 1; i < this.data.length; i++) {
      this.textList.push(this.data[i])
      if (this.textList[i - 1].label === '') {
        this.textList[i - 1].label = i
      }
    }
    this.textList.sort(function(a, b) { return a.label - b.label })
  },
  methods: {
    upload() {
      this.data = []
      this.text.label = 0
      this.data.push(this.text)
      for (var i = 1; i <= this.textList.length; i++) {
        this.textList[i - 1].label = i
      }
      for (var j = 0; j < this.textList.length; j++) {
        this.data.push(this.textList[j])
      }
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
</style>
