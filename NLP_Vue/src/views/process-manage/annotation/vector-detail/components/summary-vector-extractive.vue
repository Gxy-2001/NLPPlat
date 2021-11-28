<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文本内容</span>
            </div>
            <el-table :data="textList" fit style="width: 100%">

              <el-table-column
                type="index"
                width="60px"
                label="序号"
                align="center"
              />

              <el-table-column label="句子/段落">
                <template slot-scope="{row}">
                  <span>{{ row.text1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="选择摘要" width="200px">
                <template slot-scope="{row}">
                  <el-checkbox v-model="row.label" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SummaryVectorExtractive',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},

  data() {
    return {
      textList: []
    }
  },
  created() {
    this.textList = this.initData
    for (var i = 0; i < this.textList.length; i++) {
      if (this.textList[i].label === '') {
        this.textList[i].label = false
      }
    }
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
</style>
