<template>
  <div class="dndList">
    <div :style="{width:width}" class="dndList-list">
      <draggable :set-data="setData" :list="list" group="article" class="dragArea">
        <div v-for="element in list" :key="element.id" class="list-complete-item">
          <div class="list-complete-item-handle">
            (ID:{{ element.vectorid }}){{ element.text1 }}
          </div>
          <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -25px;margin-right:5px;" @click="handleSearch(element)">
              <i style="color:blue" class="el-icon-search" />
            </span>
          </div>
        </div>
      </draggable>
    </div>

    <el-dialog
      title="文本详细内容"
      :visible.sync="textShowDialog"
    >
      <span>{{ text }}</span>
    </el-dialog>

  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragList',
  components: { draggable },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      textShowDialog: false,
      text: ''
    }
  },
  methods: {
    isNotInlist(v) {
      return this.list.every(k => v.id !== k.id)
    },
    handleSearch(ele) {
      this.text = ele.text1
      this.textShowDialog = true
    },
    setData(dataTransfer) {
      dataTransfer.setData('Text', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 0px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 0px;
      min-height: 50px;
      padding-bottom: 0px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
