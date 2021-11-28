<template>
  <div>
    <div>
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          <el-card v-for="vector in data.group1" :id="vector.vectorid" :ref="'left'+vector.vectorid" :key="vector.vectorid" style="margin-top:20px;cursor:pointer" shadow="hover" @click.native="handleSelect('left',vector.vectorid)">
            {{ vector.text1 }}
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card v-for="vector in data.group2" :id="vector.vectorid" :ref="'right'+vector.vectorid" :key="vector.vectorid" style="margin-top:20px;cursor:pointer" shadow="hover" @click.native="handleSelect('right',vector.vectorid)">
            {{ vector.text1 }}
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'

export default {
  name: 'MatchingVector',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},
  data() {
    return {
      data: '',
      relations: [],
      plumbIns: null,
      defaultConfig: {},
      left: null,
      right: null
    }
  },
  mounted() {
    this.plumbIns = jsPlumb.getInstance()
    this.defaultConfig = {
      // 对应上述基本概念
      anchor: ['Left', 'Right'],
      connector: ['Straight'],
      endpoint: 'Blank',
      // 添加样式
      paintStyle: { stroke: '#909399', strokeWidth: 2 } // connector
      // endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 2 } // endpoint
      // 添加 overlay，如箭头
      // overlays: [['Arrow', { width: 8, length: 8, location: 1 }]] // overlay
    }
    this.drawLines()
  },
  created() {
    this.data = this.initData
    if (this.data.group1[0].label !== '') {
      this.relations = this.data.group1[0].label
    }
  },
  methods: {
    upload() {
      for (var i = 0; i < this.data.group1.length; i++) {
        this.data.group1[i].label = 'Completed'
      }
      for (var j = 0; j < this.data.group2.length; j++) {
        this.data.group2[j].label = 'Completed'
      }
      this.data.group1[0].label = this.relations
      this.$emit('upload', this.data)
    },
    drawLines() {
      var self = this
      self.plumbIns.ready(function() {
        for (const item of self.relations) {
          self.plumbIns.connect({
            source: item[0],
            target: item[1]
          }, self.defaultConfig)
        }
      })
    },
    drawLine(source, target) {
      var self = this
      self.plumbIns.ready(function() {
        self.plumbIns.connect({
          source: source,
          target: target
        }, self.defaultConfig)
      })
    },
    deleteLines() {
      var self = this
      self.plumbIns.deleteEveryConnection()
    },
    handleSelect(side, vectorid) {
      if (side === 'left') {
        if (this.left === null) {
          this.left = vectorid
          this.$refs['left' + this.left.toString()][0].shadow = 'always'
        } else if (this.left === vectorid) {
          this.$refs['left' + this.left.toString()][0].shadow = 'hover'
          this.left = null
        } else {
          this.$refs['left' + this.left.toString()][0].shadow = 'hover'
          this.left = vectorid
          this.$refs['left' + this.left.toString()][0].shadow = 'always'
        }
      } else if (side === 'right') {
        if (this.right === null) {
          this.right = vectorid
          this.$refs['right' + this.right.toString()][0].shadow = 'always'
        } else if (this.right === vectorid) {
          this.$refs['right' + this.right.toString()][0].shadow = 'hover'
          this.right = null
        } else {
          this.$refs['right' + this.right.toString()][0].shadow = 'hover'
          this.right = vectorid
          this.$refs['right' + this.right.toString()][0].shadow = 'always'
        }
      }
      if (this.left !== null && this.right !== null) {
        var relation = [this.left.toString(), this.right.toString()]
        var flag = false
        for (var i = 0; i < this.relations.length; i++) {
          if (relation.toString() === this.relations[i].toString()) {
            this.relations.splice(i, 1)
            flag = true
            break
          }
        }
        if (!flag) {
          this.relations.push(relation)
        }
        this.deleteLines()
        this.drawLines()
        this.$refs['left' + this.left.toString()][0].shadow = 'hover'
        this.$refs['right' + this.right.toString()][0].shadow = 'hover'
        this.left = null
        this.right = null
      }
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

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }
  .state-item {
    width: 80px;
    height: 40px;
    color: #606266;
    background: #f6f6f6;
    border: 2px solid rgba(0, 0, 0, 0.05);
    text-align: center;
    line-height: 40px;
    font-family: sans-serif;
    border-radius: 4px;
    margin-right: 60px;
  }
  .line-wrap {
    display: flex;
    margin-bottom: 40px;
  }
</style>
