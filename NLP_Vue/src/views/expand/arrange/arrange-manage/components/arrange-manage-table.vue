<template>
  <div ref="container" class="app-container" style="background-color:#f0f3f5;">

    <el-row type="flex" justify="space-between" :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="feature-config">
          <div slot="header" class="clearfix" style="vertical-align:middle">
            <span>部署信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form ref="form" :model="arrangeInfo" label-width="100px" style="width:300px">
                <el-form-item label="部署ID">
                  <el-tag type="warning" effect="dark">{{ arrangeid }}</el-tag>
                </el-form-item>
                <el-form-item label="部署名称">
                  <el-tag effect="dark">{{ arrangeInfo.arrangeName }}</el-tag>
                </el-form-item>
                <el-form-item label="适用类型">
                  <el-tag effect="dark">{{ arrangeInfo.taskType }}</el-tag>
                </el-form-item>
                <el-form-item label="调用接口">
                  <el-link type="primary">{{ arrangeInfo.url }}</el-link>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form ref="form" :model="arrangeInfo" label-width="100px" style="width:300px">
                <el-form-item label="部署状态">
                  <el-tag effect="dark" :type="arrangeInfo.arrangeStatus | statusFilter">{{ arrangeInfo.arrangeStatus }}</el-tag>
                </el-form-item>
                <el-form-item label="预处理管道">
                  <el-tag effect="dark">{{ arrangeInfo.pipeline===''?'未选择':arrangeInfo.pipeline }}</el-tag>
                </el-form-item>
                <el-form-item label="训练模型">
                  <el-tag effect="dark">{{ arrangeInfo.trainedmodel==''?'未选择': arrangeInfo.trainedmodel }}</el-tag>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="feature-config" shadow="hover">
          <div slot="header" class="clearfix" style="vertical-align:middle">
            <span>部署控制</span>
          </div>
          <el-button type="primary" style="margin:30px 0px 0px 50px" @click="handleStatusChange()">{{ arrangeInfo.arrangeStatus==='关闭'?'开始运行':'停止运行' }}</el-button>
          <el-button type="success" style="margin:30px 0px 0px 50px">调用记录</el-button>
          <el-button type="primary" style="margin:30px 0px 0px 50px">权限设置</el-button>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="feature-config" shadow="hover">
          <cur-data-chart :data="parseInt(arrangeMonitor.curData)" />
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-between" :gutter="20" style="margin-top:25px">
      <el-col :span="24">
        <el-card class="feature-config" shadow="hover">
          <hour-data-chart :data="arrangeMonitor.hourData" />
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-between" :gutter="20" style="margin-top:25px">
      <el-col :span="24">
        <el-card class="feature-config" shadow="hover">
          <day-data-chart :data="arrangeMonitor.dayData" />
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import { arrangeFetch, arrangeMonitorFetch } from '@/api/expand/arrange'
import { datafileInfoUpdate } from '@/api/common/datafile'

import { calTime } from '@/utils'

import CurDataChart from './cur-data-chart'
import HourDataChart from './hour-data-chart'
import DayDataChart from './day-data-chart'

export default {
  name: 'ArrangeManageTable',
  components: { CurDataChart, HourDataChart, DayDataChart },
  directives: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '运行中': 'success',
        '关闭': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      arrangeid: '',
      arrangeInfo: {
        arrangeStatus: '',
        arrangeName: '',
        taskType: '',
        pipeline: '',
        trainedmodel: ''
      },
      arrangeMonitor: {
        dateData: [],
        hourData: [],
        curData: ''
      },
      timer: null
    }
  },
  watch: {
  },
  created() {
    this.arrangeid = this.$route.params.arrangeid
    this.timer = setInterval(this.getInfo, 500)
    this.getInfo()
  },
  mounted() {
    var height = document.documentElement.clientHeight
    this.$refs.container.style['min-height'] = height - 50 + 'px'
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getInfo() {
      arrangeFetch({ 'arrangeid': this.arrangeid }).then(response => {
        this.arrangeInfo = response.data
      })
      arrangeMonitorFetch({ 'arrangeid': this.arrangeid }).then(response => {
        this.arrangeMonitor = response.data
      })
    },
    handleStatusChange() {
      var newStatus = (this.arrangeInfo.arrangeStatus === '关闭' ? '运行中' : '关闭')
      datafileInfoUpdate({ 'datafileid': this.arrangeid, 'datafileType': '部署', 'infos': { 'arrangeStatus': newStatus }}).then(response => {
        this.$message.success('部署' + newStatus + '!')
        this.getInfo()
      })
    },
    getCalTime() {
      if (this.dataStatus.arrangeStatus === '未开始') {
        return '未开始计时'
      } else if (this.dataStatus.arrangeStatus === '处理中') {
        return calTime(this.dataStatus.begintime - 8 * 60 * 60 * 1000)
      } else {
        return calTime(this.dataStatus.begintime, this.dataStatus.endtime)
      }
    }
  }
}
</script>

<style scoped>

.feature-config{
  height:330px
}

.feature-info{
  height:300px
}
</style>
