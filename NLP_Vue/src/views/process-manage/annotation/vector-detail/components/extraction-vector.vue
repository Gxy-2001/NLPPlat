<template>
  <div>
    <div>
      <el-row>
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>文&nbsp;&nbsp;&nbsp;&nbsp;本</span>
            </div>
            <div ref="textShow" style="line-height:27.5px" @mouseup="textSelect">
              {{ text }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>实&nbsp;&nbsp;&nbsp;&nbsp;体</span>
            </div>
            <el-collapse v-model="tags.activeEntityTags" @change="handleChange">
              <el-collapse-item v-for="item in tags.entityTags" :key="item" :title="item" :name="item">
                <el-tag v-for="entityTag in label.entities[item]" :key="entityTag" :type="entityTag.type" closable effect="dark" :disable-transitions="false" style="margin:5px 10px;cursor:pointer" @close="handleCloseEntityTag(entityTag,item)" @click="handleSelectEntityTag(entityTag,item)">{{ entityTag.text }}</el-tag>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:center">
              <span>关&nbsp;&nbsp;&nbsp;&nbsp;系</span>
            </div>
            <el-collapse v-model="tags.activeRelationTags" @change="handleChange">
              <el-collapse-item v-for="item in tags.relationTags" :key="item" :title="item" :name="item">
                <el-tag v-for="relationTag in label.relations[item]" :key="relationTag" type="success" closable effect="dark" :disable-transitions="false" style="margin:5px 10px;" @close="handleCloseEntityTag(entityTag,item)">{{ relationTag.entity1.text+"-"+relationTag.entity2.text }}</el-tag>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <el-dialog
      title="选择实体"
      :visible.sync="extractionDialogVisible"
      width="30%"
    >
      <el-button v-for="item in tags.entityTags" :key="item" type="primary" @click="entitySelectChange(item)">{{ item }}</el-button>
    </el-dialog>

    <el-dialog
      title="选择关系"
      :visible.sync="relationDialogVisible"
      width="30%"
    >
      <el-button v-for="item in tags.relationTags" :key="item" type="primary" @click="relationSelectChange(item)">{{ item }}</el-button>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ExtractionVector',
  components: { },
  props: { initData: { default: [] }, initTags: { default: {}}},
  data() {
    return {
      tags: {
        entityTags: [],
        relationTags: [],
        activeEntityTags: [],
        activateRelationTags: []
      },
      data: {},
      text: '',
      label: {
        entities: {},
        relations: {}
      },
      extractionDialogVisible: false,
      relationDialogVisible: false,
      tempEntity: {
        text: '',
        start: '',
        end: ''
      },
      tempRelation: {
        entity1: {},
        entity2: {},
        count: 0
      }
    }
  },
  created() {
    this.data = this.initData
    // 初始化label
    this.tags.entityTags = this.initTags['entityTags']
    this.tags.relationTags = this.initTags['relationTags']
    this.tags.activeEntityTags = this.tags.entityTags
    this.tags.activeRelationTags = this.tags.relationTags
    // 初始化向量
    this.text = this.data.text1
    if (this.data.label === '') {
      for (var entityTag of this.tags.entityTags) {
        this.label.entities[entityTag] = []
      }
      for (var relationTag of this.tags.relationTags) {
        this.label.relations[relationTag] = []
      }
    } else {
      this.label = this.data.label
    }
  },
  mounted() {
    this.drawEntities()
  },
  methods: {
    upload() {
      this.data.label = this.label
      this.$emit('upload', this.data)
    },
    entitySelectChange(item) {
      this.label.entities[item].push({ ...this.tempEntity })
      this.drawEntitiy(this.tempEntity.start + 1, this.tempEntity.end + 1)
      var text = window.getSelection()
      text.empty()
      this.extractionDialogVisible = false
    },
    handleCloseEntityTag(entityTag, item) {
      this.label.entities[item].splice(this.label.entities[item].indexOf(entityTag), 1)
      this.$forceUpdate()
    },
    handleSelectEntityTag(entityTag, item) {
      if (this.tempRelation.count === 0) {
        entityTag.type = 'danger'
        this.tempRelation.entity1 = entityTag
        this.tempRelation.count = 1
      } else {
        entityTag.type = 'danger'
        this.tempRelation.entity2 = entityTag
        this.tempRelation.count = 0
        this.relationDialogVisible = true
      }
      this.$forceUpdate()
    },
    relationSelectChange(item) {
      this.label.relations[item].push({ 'entity1': this.tempRelation.entity1, 'entity2': this.tempRelation.entity2 })
      this.relationDialogVisible = false
      this.tempRelation.entity1.type = null
      this.tempRelation.entity2.type = null
      this.$forceUpdate()
    },
    textSelect() {
      var text = window.getSelection()
      var textAnchorNode = text.anchorNode
      if (text.toString() !== '') {
        var start = text.anchorOffset - 1
        var end = text.focusOffset - 1
        if (start > end) {
          [start, end] = [end, start]
        }
        var textShow = this.$refs.textShow
        var textNodeList = textShow.childNodes
        var nodeLen = 0
        for (var i = 0; i < textNodeList.length; i++) {
          var node = textNodeList[i]
          if (node.contains(textAnchorNode)) {
            start = start + nodeLen
            end = end + nodeLen
            break
          }
          nodeLen = nodeLen + node.textContent.length
        }
        this.tempEntity.start = start
        this.tempEntity.end = end
        this.tempEntity.text = text.toString()
        this.extractionDialogVisible = true
      }
    },
    drawEntities() {
      for (var i = 0; i < this.tags.entityTags.length; i++) {
        var tag = this.tags.entityTags[i]
        for (var j = 0; j < this.label.entities[tag].length; j++) {
          var entity = this.label.entities[tag][j]
          this.drawEntitiy(entity.start + 1, entity.end + 1)
        }
      }
    },
    drawEntitiy(start, end) {
      var textShow = this.$refs.textShow
      var textNodeList = textShow.childNodes
      var nodeLen = 0
      for (var i = 0; i < textNodeList.length; i++) {
        var node = textNodeList[i]
        if (nodeLen + node.textContent.length > start) {
          var range = document.createRange()
          range.setStart(node, start - nodeLen)
          range.setEnd(node, end - nodeLen)
          var selectionContents = range.extractContents()
          var span = document.createElement('span')
          span.style.color = 'blue'
          span.appendChild(selectionContents)
          range.insertNode(span)
          break
        }
        nodeLen = nodeLen + node.textContent.length
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
</style>
