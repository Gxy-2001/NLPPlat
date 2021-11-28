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

              <el-table-column label="句子/段落">
                <template slot-scope="{row}">
                  <span>{{ row.text1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="情感/意图" width="200px">
                <template slot-scope="{row}">
                  <el-select v-model="row.label" placeholder="选择情感/意图">
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
  name: 'SentimentAnalysisVectorSentence',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},

  data() {
    return {
      tags: [],
      textList: []
    }
  },
  created() {
    this.textList = this.initData
    this.tags = this.initTags
  },
  methods: {
    upload() {
      this.$emit('upload', this.textList)
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
