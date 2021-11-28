<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="preprocessDialog" class="demo-form-inline" label-width="100px">
        <el-form-item label="参数项">
          <el-select v-model="preprocessDialog.preprocessParamsSelect" placeholder="请选择要修改的参数">
            <el-option v-for="item in Object.keys(preprocessDialog.preprocessParams)" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="preprocessDialog.preprocessParamsSelect in preprocessDialog.preprocessParamsTools" label="参数值">
          <el-select v-model="preprocessDialog.preprocessParams[preprocessDialog.preprocessParamsSelect]" placeholder="请选择要修改的参数">
            <el-option v-for="item in preprocessDialog.preprocessParamsTools[preprocessDialog.preprocessParamsSelect]" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="参数值">
          <el-input v-model="preprocessDialog.preprocessParams[preprocessDialog.preprocessParamsSelect]" placeholder="参数值" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-left:7%;margin-right:7%">
      <span v-show="preprocessDialog.preprocessParamsSelect!==''" style="font-size:8px">{{ '参数含义： '+preprocessDialog.preprocessParamsIntroduction[preprocessDialog.preprocessParamsSelect] }}</span>
    </el-row>
    <el-row type="flex" justify="space-around" style="margin-top:30px">
      <el-col :span="10" style="text-align:right">
        <el-button type="primary" @click="confirmParams">确认配置</el-button>
      </el-col>
      <el-col :span="10" style="text-align:left">
        <el-button type="primary">保存为默认值</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { resourcesFetch } from '@/api/common/resource'

export default {
  name: 'PreProcessParamsDialog',
  components: { },
  directives: { },
  filters: {
  },
  props: {
    preprocessName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      preprocessDialog: {
        preprocessParams: {},
        preprocessParamsIntroduction: {},
        preprocessParamsTools: {},
        preprocessParamsSelect: ''
      },
      resourcesListQuery: {
        type: 'all',
        sort: '-id',
        resourceName: '',
        username: ['自己', '他人'],
        resourceType: ['停用词表']
      }
    }
  },
  created() {
    this.getParams()
    if (this.preprocessName === '去停用词') {
      this.getStopwordsList()
    }
  },
  methods: {
    getParams() {
      this.preprocessDialog.preprocessParams = this.$store.state.preprocessParams[this.preprocessName]
      this.preprocessDialog.preprocessParamsIntroduction = this.$store.state.preprocessParams[this.preprocessName + '参数说明']
      if ((this.preprocessName + '选项') in this.$store.state.preprocessParams) {
        this.preprocessDialog.preprocessParamsTools = this.$store.state.preprocessParams[this.preprocessName + '选项']
      }
    },
    getStopwordsList() {
      resourcesFetch(this.resourcesListQuery).then(response => {
        this.preprocessDialog.preprocessParamsTools['list'] = []
        for (var i = 0; i < response.data.items.length; i++) {
          this.preprocessDialog.preprocessParamsTools['list'].push(response.data.items[i]['resourceName'])
        }
      })
    },
    confirmParams() {
      this.$emit('getPreprocessParams', this.preprocessDialog.preprocessParams)
    }
  }
}
</script>
