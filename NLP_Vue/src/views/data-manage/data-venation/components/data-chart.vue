<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { venationFetch } from '@/api/data-manage/venation'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'DataChart',
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
    }
  },
  data() {
    return {
      listQuery: {
        type: '',
        nodeid: ''
      },
      venation: {},
      chart: null,
      chartStyle: {
        dataNode: {
          color: '#1676A7',
          symbol: 'circle',
          symbolSize: [110, 75]
        }
      },
      venationTypeMap: {
        'original-dataset': '训练数据集',
        'preprocess-dataset': '预处理数据集',
        'features-dataset': '特征数据集',
        'trainedmodel': '训练模型对象',
        'original-batch-dataset': '批处理数据集',
        'features-batch-dataset': '批处理特征集',
        'pipeline': '预处理管道对象',
        'result-batch-dataset': '结果数据集'
      }
    }
  },
  created() {
    this.listQuery.type = this.venationTypeMap[this.$route.params.type]
    this.listQuery.nodeid = this.$route.params.nodeid
    this.getVenation()
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
    getVenation() {
      venationFetch(this.listQuery).then(response => {
        this.venation = response.data.venation
      })
    },
    venationListToString(venationList) {
      var str = ''
      for (var i = 0; i < venationList.length; i++) {
        str = str + 'ID(' + venationList[i].id + ') ' + venationList[i].name + ' ' + venationList[i].datetime + '<br>'
      }
      return str
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // 监听图标点击节点事件
      var self = this
      this.chart.on('click', function(params) {
        if (params.componentType === 'series') {
          if (params.seriesType === 'graph') {
            if (params.dataType === 'node') {
              switch (params.name) {
                case '训练数据集':
                  break
                case '预处理数据集':
                  break
              }
              self.$emit('datasetListShow', self.venation[params.name])
            }
          }
        }
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var str = self.venationListToString(self.venation[params.name])
            return str
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        hoverAnimation: true,
        textStyle: {
          fontSize: 14
        },
        series: [{
          name: '数据管理',
          type: 'graph',
          layout: 'none',
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0, 0],
          lineStyle: {
            normal: {
              color: '#000000',
              opacity: 1,
              width: 1
            }
          },
          itemStyle: {
            normal: { color: this.chartStyle.dataNode.color }
          },
          symbol: this.chartStyle.dataNode.symbol,
          symbolSize: this.chartStyle.dataNode.symbolSize,
          data: [{
            name: '训练数据集',
            x: 0,
            y: 500
          }, {
            name: '预处理数据集',
            x: 500,
            y: 500
          }, {
            name: '特征数据集',
            x: 1500,
            y: 500
          }, {
            name: '预处理管道对象',
            x: 1000,
            y: 750
          }, {
            name: '批处理特征集',
            x: 1500,
            y: 1000
          }, {
            name: '训练集',
            x: 2000,
            y: 250
          }, {
            name: '验证集',
            x: 2000,
            y: 500
          }, {
            name: '测试集',
            x: 2000,
            y: 750
          }, {
            name: '训练模型对象',
            x: 2500,
            y: 500
          }, {
            name: '批处理数据集',
            x: 0,
            y: 1000
          }, {
            name: '结果数据集',
            x: 3000,
            y: 1000
          }],
          links: [{
            source: 0,
            target: 1
          }, {
            source: 1,
            target: 2
          }, {
            source: 1,
            target: 3
          }, {
            source: 3,
            target: 4
          }, {
            source: 2,
            target: 5
          }, {
            source: 2,
            target: 6
          }, {
            source: 2,
            target: 7
          }, {
            source: 5,
            target: 8
          }, {
            source: 6,
            target: 8
          }, {
            source: 7,
            target: 8
          }, {
            source: 4,
            target: 10
          }, {
            source: 8,
            target: 10
          }, {
            source: 9,
            target: 4
          }]
        }]
      })
    }
  }
}
</script>
