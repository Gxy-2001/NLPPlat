<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'ProcessChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    },
    process: {
      type: String,
      default: '未开始'
    }
  },
  data() {
    return {
      chart: null,
      processNodes: [
        {
          label: {
            formatter: '数据接入'
          },
          value: [0, 600]
        }, {
          label: {
            formatter: '数据查看'
          },
          value: [200, 600]
        }, {
          label: {
            formatter: '数据标注'
          },
          value: [400, 900]
        }, {
          label: {
            formatter: '预处理'
          },
          value: [600, 600]
        }, {
          label: {
            formatter: '模型训练'
          },
          value: [800, 900]
        }, {
          label: {
            formatter: '批处理'
          },
          value: [800, 300]
        }, {
          label: {
            formatter: '任务管理'
          },
          value: [500, 100]
        }
      ],
      indexNodes: [{
        value: [100, 600]
      }, {
        value: [300, 600]
      }, {
        value: [400, 300]
      }, {
        value: [500, 600]
      }, {
        value: [700, 600]
      }, {
        value: [900, 600]
      }],
      lines: [{
        coords: [[0, 600], [100, 600]]
      }, {
        coords: [[100, 600], [200, 600]]
      }, {
        coords: [[200, 600], [300, 600]]
      }, {
        coords: [[300, 600], [400, 900]],
        lineStyle: {
          curveness: 0.4
        }
      }, {
        coords: [[300, 600], [400, 300]],
        lineStyle: {
          curveness: -0.3
        }
      }, {
        coords: [[400, 900], [500, 600]],
        lineStyle: {
          curveness: 0.4
        }
      }, {
        coords: [[400, 300], [500, 600]],
        lineStyle: {
          curveness: -0.3
        }
      }, {
        coords: [[500, 600], [600, 600]]
      }, {
        coords: [[600, 600], [700, 600]]
      }, {
        coords: [[700, 600], [800, 900]],
        lineStyle: {
          curveness: 0.4
        }
      }, {
        coords: [[700, 600], [800, 300]],
        lineStyle: {
          curveness: -0.4
        }
      }, {
        coords: [[800, 900], [900, 600]],
        lineStyle: {
          curveness: 0.4
        }
      }, {
        coords: [[800, 300], [900, 600]],
        lineStyle: {
          curveness: -0.4
        }
      }],
      lineEffects: [],
      lineForward: []
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    modifyData() {
      switch (this.process) {
        case '数据接入':
          this.processNodes[0].rippleEffect = { 'scale': 2 }
          break
        case '数据查看':
          this.processNodes[1].rippleEffect = { 'scale': 2 }
          for (let i = 0; i < 1; i++) {
            this.indexNodes[i].itemStyle = { 'color': '#64d9d6' }
          }
          for (let i = 0; i < 2; i++) {
            if ('lineStyle' in this.lines[i]) {
              this.lines[i].lineStyle.color = '#64d9d6'
            } else {
              this.lines[i].lineStyle = { 'color': '#64d9d6' }
            }
            this.lineEffects.push(this.lines[i])
          }
          this.lineForward.push(this.lines[2], this.lines[3])
          break
        case '数据标注':
          this.processNodes[2].rippleEffect = { 'scale': 2 }
          for (let i = 0; i < 2; i++) {
            this.indexNodes[i].itemStyle = { 'color': '#64d9d6' }
          }
          for (let i = 0; i < 4; i++) {
            if ('lineStyle' in this.lines[i]) {
              this.lines[i].lineStyle.color = '#64d9d6'
            } else {
              this.lines[i].lineStyle = { 'color': '#64d9d6' }
            }
            this.lineEffects.push(this.lines[i])
          }
          this.lineForward.push(this.lines[5], this.lines[7])
          break
        case '预处理':
          this.processNodes[3].rippleEffect = { 'scale': 2 }
          for (let i = 0; i < 4; i++) {
            this.indexNodes[i].itemStyle = { 'color': '#64d9d6' }
          }
          for (let i = 0; i < 8; i++) {
            if ('lineStyle' in this.lines[i]) {
              this.lines[i].lineStyle.color = '#64d9d6'
            } else {
              this.lines[i].lineStyle = { 'color': '#64d9d6' }
            }
            this.lineEffects.push(this.lines[i])
          }
          this.lineForward.push(this.lines[8], this.lines[9])
          break
        case '模型训练':
          this.processNodes[4].rippleEffect = { 'scale': 2 }
          for (let i = 0; i < 5; i++) {
            this.indexNodes[i].itemStyle = { 'color': '#64d9d6' }
          }
          for (let i = 0; i < 10; i++) {
            if ('lineStyle' in this.lines[i]) {
              this.lines[i].lineStyle.color = '#64d9d6'
            } else {
              this.lines[i].lineStyle = { 'color': '#64d9d6' }
            }
            this.lineEffects.push(this.lines[i])
          }
          this.lineForward.push(this.lines[10])
          break
        case '批处理':
          this.processNodes[5].rippleEffect = { 'scale': 2 }
          for (let i = 0; i < 5; i++) {
            this.indexNodes[i].itemStyle = { 'color': '#64d9d6' }
          }
          for (let i = 0; i < 11; i++) {
            if (i !== 9) {
              if ('lineStyle' in this.lines[i]) {
                this.lines[i].lineStyle.color = '#64d9d6'
              } else {
                this.lines[i].lineStyle = { 'color': '#64d9d6' }
              }
              this.lineEffects.push(this.lines[i])
            }
          }
          break
        case '任务管理':
          this.processNodes[6].rippleEffect = { 'scale': 2 }
          break
      }
    },
    initChart() {
      this.modifyData()
      this.chart = echarts.init(this.$el, 'macarons')
      // 监听图标点击节点事件
      var self = this
      this.chart.on('click', function(params) {
        if (params.seriesName === '过程节点') {
          switch (params.data.label.formatter) {
            case '数据接入':
              self.$router.push('/process-manage/data-upload')
              break
            case '数据查看':
              self.$router.push('/process-manage/data-set')
              break
            case '数据标注':
              self.$router.push('/process-manage/annotation')
              break
            case '预处理':
              self.$router.push('/process-manage/pre-process')
              break
            case '模型训练':
              self.$router.push('/process-manage/model-train')
              break
            case '批处理':
              self.$router.push('/process-manage/batch-process')
              break
            case '任务管理':
              self.$router.push('/process-manage/task-manage')
              break
          }
        }
      })
      this.chart.setOption({
        tooltip: {
          show: false
        },
        xAxis: {
          show: false,
          type: 'value',
          min: 0,
          max: 900
        },
        yAxis: {
          show: false,
          type: 'value',
          min: 0,
          max: 1000
        },
        textStyle: {
          fontSize: 14
        },
        series: [{
          name: '过程节点',
          type: 'effectScatter',
          coordinateSystem: 'cartesian2d',
          symbol: 'rect',
          symbolSize: [80, 50],
          zlevel: 2,
          rippleEffect: {
            scale: 1
          },
          label: {
            show: true,
            fontSize: 15
          },
          itemStyle: {
            color: '#1890ff'
          },
          data: self.processNodes
        }, {
          name: '中间节点',
          type: 'effectScatter',
          coordinateSystem: 'cartesian2d',
          symbolSize: 30,
          zlevel: 2,
          rippleEffect: {
            scale: 1
          },
          itemStyle: {
            color: '#CC3399'
          },
          data: self.indexNodes
        }, {
          name: '连接线',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          zlevel: 0,
          effect: {
            show: false,
            period: 2,
            color: '#426ab3',
            symbolSize: 10,
            symbol: 'arrow',
            trailLength: 0
          },
          lineStyle: {
            width: 2,
            color: 'grey'
          },
          data: self.lines
        },
        {
          name: '连接效果',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          zlevel: 0,
          effect: {
            show: true,
            period: 2,
            color: '#64d9d6',
            symbolSize: 10,
            symbol: 'arrow',
            trailLength: 0
          },
          lineStyle: {
            width: 0
          },
          data: self.lineEffects
        },
        {
          name: '连接趋势',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          zlevel: 0,
          effect: {
            show: true,
            period: 2,
            color: '#CC3399',
            symbolSize: 10,
            symbol: 'arrow',
            trailLength: 0
          },
          lineStyle: {
            width: 0
          },
          data: self.lineForward
        }]
      })
    }
  }
}
</script>
