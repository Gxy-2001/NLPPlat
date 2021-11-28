<template>
  <div>
    <el-tabs type="card" @tab-click="handleNatureChange">
      <el-tab-pane label="vectors">
        <data-detail-table />
      </el-tab-pane>
      <el-tab-pane v-for="nature in Object.keys(natures)" :key="nature" ref="show" :label="nature">
        <el-row type="flex" class="row-bg" justify="space-around" style="margin-bottom:25px">
          <el-col :span="8">
            <el-row>
              <el-card class="box-card" shadow="hover" style="height:350px">
                <div slot="header" class="clearfix">
                  <span>文件上传或覆盖</span>
                </div>
                <div>
                  <el-form ref="form" :model="natureConfig" label-width="100px">
                    <el-form-item label="选择资源">
                      <el-select v-model="natureConfig.resourceSelect" placeholder="选择已上传的资源">
                        <el-option
                          v-for="item in resources"
                          :key="item._id"
                          :label="item.resourceName"
                          :value="item._id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="或" />
                    <el-form-item label="临时上传" prop="filelist">
                      <el-upload
                        :ref="nature"
                        class="upload-demo"
                        :action="natureConfig.uploadUrl"
                        :file-list="natureConfig.filelist"
                        :headers="natureConfig.headers"
                        :data="{'datasetid':listQuery.datasetid,'preprocessid':listQuery.preprocessid, 'nature':nature,'resourceSelect':natureConfig.resourceSelect}"
                        :limit="1"
                        :auto-upload="false"
                        style="height:60px"
                        :on-success="handleUploadSuccess"
                      >
                        <el-button type="primary">上传<i class="el-icon-upload el-icon--right" /></el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onUploadSubmit(nature)">确认导入</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-row>
            <el-row style="margin-top:15px;">
              <el-card class="box-card" shadow="hover" style="height:250px">
                <div slot="header" class="clearfix">
                  <span>文件信息</span>
                </div>
                <div>
                  <el-form ref="form" :model="natureConfig" label-width="120px">
                    <el-form-item label="属性含义">
                      {{ natures[nature] }}
                    </el-form-item>
                    <el-form-item label="文件名称">
                      {{ preprocessObj[nature]['filename'] }}
                    </el-form-item>
                    <el-form-item label="文件类型">
                      {{ preprocessObj[nature]['filetype'] }}
                    </el-form-item>
                    <el-form-item v-if="preprocessObj[nature]['filetype']==='npy文件'" label="数据Shape">
                      {{ preprocessObj[nature] ['fileshape'] }}
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="15">
            <el-card class="box-card" shadow="hover" style="height:615px">
              <div slot="header" class="clearfix" style="vertical-align:middle">
                <span>内容预览</span>
                <el-button type="text" style="float: right; padding: 3px 9px">导出文件</el-button>
              </div>
              <div>
                <el-table
                  :data="fileContent"
                  border
                  fit
                  empty-text="暂无文件"
                  style="width: 100%;"
                >
                  <el-table-column
                    label="行号"
                    type="index"
                    width="100"
                    align="center"
                  />
                  <el-table-column label="内容" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                      <span>{{ row }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDetailTable from './components/data-detail-table'

import { preprocessDataFetch, preprocessUpload } from '@/api/process-manage/preprocess'
import { resourcesFetch } from '@/api/common/resource'

export default {
  name: 'PreprocessDataDetail',
  components: { DataDetailTable },
  data() {
    return {
      listQuery: {
        datasetid: null,
        preprocessid: null
      },
      resourcesListQuery: {
        type: 'all',
        sort: '-id',
        resourceName: '',
        username: ['自己', '他人'],
        resourceType: ['停用词表', '预训练向量', '通用资源']
      },
      natureConfig: {
        resourceSelect: '',
        filelist: [],
        uploadUrl: process.env.VUE_APP_BASE_API + '/process-manage/pre-process/datasets/ID/preprocesses/ID/data',
        headers: { 'Authorization': 'Bearer ' + this.$store.state.user.token }
      },
      resources: [],
      natures: { 'feature': '特征', 'label': 'label映射后标签', 'label_id': '映射后标签id对应关系', 'embedding': '嵌入', 'embedding_matrix': '嵌入矩阵', 'vocabs': '字典/词典' },
      preprocessObj: {},
      fileContent: [],
      curNature: ''
    }
  },
  computed: {
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.preprocessid = this.$route.params.preprocessid
    this.getData()
    this.getResource()
  },
  mounted() {
  },
  methods: {
    getData() {
      return new Promise(resolve => {
        preprocessDataFetch(this.listQuery).then(response => {
          this.preprocessObj = response.data.preprocessObj
          this.fileContent = this.preprocessObj[this.curNature]['fileContent']
          resolve()
        })
      })
    },
    getResource() {
      return new Promise(resolve => {
        resourcesFetch(this.resourcesListQuery).then(response => {
          this.resources = response.data.items
          resolve()
        })
      })
    },
    onUploadSubmit(nature) {
      if (this.natureConfig.resourceSelect === '') {
        this.$refs[nature][0].submit()
      } else {
        preprocessUpload({ 'datasetid': this.listQuery.datasetid, 'preprocessid': this.listQuery.preprocessid, 'nature': nature, 'resourceSelect': this.natureConfig.resourceSelect }).then(response => {
          this.$message.success('文件导入成功！')
          this.getResource()
          this.getData()
        })
      }
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$message.success('上传成功！')
      } else {
        this.$message.error(response.message)
      }
      this.natureConfig.filelist = []
      this.getResource()
      this.getData()
    },
    handleNatureChange(tab) {
      this.natureConfig.resourceSelect = ''
      this.curNature = tab.label
      this.fileContent = this.preprocessObj[this.curNature]['fileContent']
    }
  }
}
</script>

<style scoped>

</style>
