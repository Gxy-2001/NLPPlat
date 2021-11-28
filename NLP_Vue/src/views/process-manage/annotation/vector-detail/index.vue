<template>
  <div class="app-container">
    <div class="block">
      <el-row type="flex" justify="space-between">
        <el-col :span="2" style="text-align:center">
          <el-button type="primary" icon="el-icon-arrow-left" @click="handleBack">上一个</el-button>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <annotation-progress :id="listQuery.datasetid" />
        </el-col>
        <el-col :span="2" style="text-align:center">
          <el-button type="primary" @click="handleNext">下一个<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-col>
      </el-row>
      <component :is="annotationVectorComponent" ref="annotationVectorComponent" :init-tags="tags" :init-data="data" @upload="confirmUpload(data)" />
      <el-row type="flex" justify="space-between" style="margin-top:30px">
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" @click="handleBackToDetail">返回数据集</el-button>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>

import { datasetInfoFetch, datasetVectorFetch, datasetVectorUpdate, groupVectorsFetch, groupVectorsUpdate, datasetTotalInfoFetch } from '@/api/common/dataset'

import AnnotationProgress from '@/views/process-manage/annotation/components/annotation-progress'

import ExtractionVector from './components/extraction-vector'
import MatchingVector from './components/matching-vector'
import RelationAnalysisVector from './components/relation-analysis-vector'
import L2rVectorListwise from './components/l2r-vector-listwise'
import L2rVectorPointwise from './components/l2r-vector-pointwise'
import classificationVectorSingle from './components/classification-vector-single'
import classificationVectorMulti from './components/classification-vector-multi'

import SummaryVectorExtractive from './components/summary-vector-extractive'
import SummaryVectorAbstractive from './components/summary-vector-abstractive'
import SentimentAnalysisVectorAspect from './components/sentiment-analysis-vector-aspect'
import SentimentAnalysisVectorText from './components/sentiment-analysis-vector-text'
import SentimentAnalysisVectorSentence from './components/sentiment-analysis-vector-sentence'

export default {
  name: 'DataDetail',
  components: { AnnotationProgress, ExtractionVector, MatchingVector, RelationAnalysisVector, L2rVectorListwise, L2rVectorPointwise, classificationVectorSingle, classificationVectorMulti, SummaryVectorExtractive, SummaryVectorAbstractive, SentimentAnalysisVectorAspect, SentimentAnalysisVectorText, SentimentAnalysisVectorSentence },
  data() {
    return {
      taskType: '',
      annotationFormat: '',
      annotationVectorComponent: '',
      listQuery: {
        datasetid: '',
        id: ''
      },
      tags: '',
      data: '',
      max: '',
      min: ''
    }
  },
  computed: {
  },
  created() {
    this.listQuery.datasetid = this.$route.params.datasetid
    this.listQuery.id = this.$route.params.id
    this.getInfo()
  },
  methods: {
    getInfo() {
      datasetInfoFetch({ 'datasetid': this.listQuery.datasetid }).then(response => {
        this.taskType = response.data['taskType']
        this.annotationFormat = response.data.annotationFormat
        this.taskType = response.data.taskType
        this.tags = response.data.annotationFormat['tags']
        this.getVector()
        this.getTotalInfo()
      })
    },
    getVector() {
      if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
        this.data = { 'group1': '', 'group2': '' }
        groupVectorsFetch({ 'datasetid': this.listQuery.datasetid, 'group': this.listQuery.id }).then(response => {
          this.data.group1 = response.data.vectors
          groupVectorsFetch({ 'datasetid': this.listQuery.datasetid, 'group': Number(this.listQuery.id) + 1 }).then(response => {
            this.data.group2 = response.data.vectors
            this.getComponent()
          })
        })
      } else if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 1) {
        groupVectorsFetch({ 'datasetid': this.listQuery.datasetid, 'group': this.listQuery.id }).then(response => {
          this.data = response.data.vectors
          this.getComponent()
        })
      } else {
        datasetVectorFetch({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.id }).then(response => {
          this.data = response.data.vector
          this.getComponent()
        })
      }
    },
    getTotalInfo() {
      datasetTotalInfoFetch({ 'datasetid': this.listQuery.datasetid, 'totalType': this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) }).then(response => {
        this.max = Number(response.data.max)
        this.min = Number(response.data.min)
      })
    },
    getComponent() {
      switch (this.taskType) {
        case '实体关系抽取':
          this.annotationVectorComponent = ExtractionVector
          break
        case '文本关系分析':
          this.annotationVectorComponent = RelationAnalysisVector
          break
        case '文本排序学习':
          if (this.annotationFormat.type === '列表标注') {
            this.annotationVectorComponent = L2rVectorListwise
          } else if (this.annotationFormat.type === '单点标注') {
            this.annotationVectorComponent = L2rVectorPointwise
          }
          break
        case '通用单文本分类':
          if (this.annotationFormat.type === '单标签') {
            this.annotationVectorComponent = classificationVectorSingle
          } else if (this.annotationFormat.type === '多标签') {
            this.annotationVectorComponent = classificationVectorMulti
          }
          break
        case '文本配对':
          this.annotationVectorComponent = MatchingVector
          break
        case '文本摘要':
          if (this.annotationFormat.type === '抽取式') {
            this.annotationVectorComponent = SummaryVectorExtractive
          } else if (this.annotationFormat.type === '生成式') {
            this.annotationVectorComponent = SummaryVectorAbstractive
          }
          break
        case '情感分析/意图识别':
          if (this.annotationFormat.type === 'aspect级') {
            this.annotationVectorComponent = SentimentAnalysisVectorAspect
          } else if (this.annotationFormat.type === '篇章级') {
            this.annotationVectorComponent = SentimentAnalysisVectorText
          } else {
            this.annotationVectorComponent = SentimentAnalysisVectorSentence
          }
          break
      }
    },
    upload() {
      this.$refs.annotationVectorComponent.upload()
    },
    confirmUpload(data) {
      if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
        groupVectorsUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.id, 'vectors': data.group1 }).then(response => {
        })
        groupVectorsUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': Number(this.listQuery.id) + 1, 'vectors': data.group2 }).then(response => {
        })
      } else if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 1) {
        groupVectorsUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.id, 'vectors': data }).then(response => {
        })
      } else {
        datasetVectorUpdate({ 'datasetid': this.listQuery.datasetid, 'vectorid': this.listQuery.id, 'vector': data }).then(response => {
        })
      }
    },
    handleBack() {
      this.upload()
      if (this.judgeFirst()) {
        this.$message.info('已是第一个标注任务！')
      } else {
        if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
          this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.id) - 2))
        } else {
          this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.id) - 1))
        }
      }
    },
    handleNext() {
      this.upload()
      if (this.judgeLast()) {
        this.$message.info('已完成所有标注任务！')
      } else {
        if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
          this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.id) + 2))
        } else {
          this.$router.push('/process-manage/annotation/vector-detail/' + this.listQuery.datasetid + '/' + (Number(this.listQuery.id) + 1))
        }
      }
    },
    handleBackToDetail() {
      this.upload()
      this.$router.push('/process-manage/annotation/data-detail/' + this.listQuery.datasetid)
    },
    judgeFirst() {
      if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
        if (Number(this.listQuery.id) - 2 < this.min) {
          return true
        }
      } else {
        if (Number(this.listQuery.id) - 1 < this.min) {
          return true
        }
      }
      return false
    },
    judgeLast() {
      if (this.$store.getters.groupModeFetch(this.taskType, this.annotationFormat.type) === 2) {
        if (Number(this.listQuery.id) + 2 > this.max) {
          return true
        }
      } else {
        if (Number(this.listQuery.id) + 1 > this.max) {
          return true
        }
      }
      return false
    }
  }
}
</script>
