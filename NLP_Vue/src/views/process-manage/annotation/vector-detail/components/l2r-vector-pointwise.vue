<template>
  <div>
    <div>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>查询文本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px">
              {{ text.text1 }}
            </div>
          </el-card>
        </el-col>

        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>结果文本列表</span>
            </div>
            <el-table :data="textList" fit style="width: 100%">
              <el-table-column label="句子/段落">
                <template slot-scope="{row}">
                  <span>{{ row.text1 }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="程度" width="200px">
                <template slot-scope="{row}">
                  <el-select v-model="row.label" placeholder="选择程度词">
                    <el-option
                      v-for="item in tags"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
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
  name: 'L2rVectorPointwise',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},
  data() {
    return {
      tags: [],
      data: [],
      text: '',
      textList: []
    }
  },
  created() {
    this.tags = this.initTags
    this.data = this.initData
    this.text = this.data[0]
    for (var i = 1; i < this.data.length; i++) {
      this.textList.push(this.data[i])
    }
  },
  methods: {
    upload() {
      this.data = []
      this.text.label = 0
      this.data.push(this.text)
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
