<template>
  <el-dialog
    title="生成部署"
    :visible.sync="show"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="2" />
      <el-col :span="16">
        <el-form ref="createForm" :model="createForm" label-width="100px">
          <el-form-item label="任务类型" prop="taskType" :rules="[{ required: true, message: '请选择任务类型', trigger: 'blur' }]">
            <el-select v-model="createForm.taskType" placeholder="请选择任务类型" style="width:400px">
              <el-option v-for="item in taskTypes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="预处理管道" prop="pipeline">
            <el-select v-model="createForm.pipeline" placeholder="请选择预处理管道" style="width:400px">
              <el-option v-for="item in pipelines" :key="item" :label="item.pipelineName" :value="item._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="已训练模型" prop="trainedmodel">
            <el-select v-model="createForm.trainedmodel" placeholder="请选择已训练的模型" style="width:400px">
              <el-option v-for="item in trainedmodels" :key="item" :label="item.modelName" :value="item._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="部署名称" prop="arrangeName" :rules="[{ required: true, message: '请填写部署名称', trigger: 'blur' }]">
            <el-input v-model="createForm.arrangeName" placeholder="请填写部署名称" style="width:400px" />
          </el-form-item>
          <el-form-item label="部署描述">
            <el-input v-model="createForm.desc" type="textarea" placeholder="选填" style="width:400px" />
          </el-form-item>
          <el-form-item label="公开性" prop="publicity" :rules="[{ required: true, message: '请选择公开性', trigger: 'blur' }]">
            <el-radio-group v-model="createForm.publicity">
              <el-radio label="公开" />
              <el-radio label="不公开" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:120px" @click="handleArrangeCerate()">确认部署</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" />
    </el-row>
  </el-dialog>
</template>

<script>
import { pipelinesFetch } from '@/api/common/pipeline'
import { trainedmodelsFetch } from '@/api/common/model'
import { arrangeCreate } from '@/api/expand/arrange'

export default {
  name: 'ArrangeCreate',
  props: [],
  data() {
    return {
      show: false,
      createForm: {
        taskType: '',
        pipeline: '',
        trainedmodel: '',
        arrangeName: '',
        desc: '',
        publicity: ''
      },
      taskTypes: [],
      pipelines: [],
      trainedmodels: []
    }
  },
  watch: {
    'createForm.taskType': {
      deep: true,
      handler: function(newV, oldV) {
        this.pipelinesFetch(newV)
        this.trainedmodelsFetch()
      }
    }
  },
  created() {
    this.taskTypes = this.$store.state.taskTypes.taskType
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.show = true
    },
    pipelinesFetch(taskType) {
      pipelinesFetch({ 'taskType': [taskType], 'type': 'all', 'username': ['自己'], 'pipelineName': '' }).then(response => {
        this.pipelines = response.data.items
      })
    },
    trainedmodelsFetch() {
      trainedmodelsFetch({ 'type': 'all', 'platType': ['Keras', 'Pytorch', 'Tensorflow1.X', 'Tensorflow2.X'], 'modelName': '', 'username': ['自己'], 'sort': '-id' }).then(response => {
        this.trainedmodels = response.data.items
      })
    },
    handleArrangeCerate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          arrangeCreate(this.createForm).then(response => {
            this.show = false
            this.$notify({
              title: '部署任务创建成功！',
              message: '可以运行该部署并调用接口使用',
              type: 'success',
              duration: 2000
            })
            this.$parent.getList()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
