<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'EvaluationChart',
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
      default: '250px'
    },
    data: {
      type: Array,
      default: () => [0, 0, 0, 0]
    }
  },
  data() {
    return {
      chart: null,
      timer: null
    }
  },
  created() {
    console.log(this.data)
  },
  mounted() {
    var self = this
    this.$nextTick(() => {
      this.initChart()
      this.timer = setInterval(function() {
        self.setOption()
      }, 1000)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
  methods: {
    setOption() {
      var self = this
      this.chart.setOption({
        tooltip: {
          show: true
        },
        title: {
          text: '模型训练结果'
        },
        xAxis: {
          type: 'category',
          data: ['Accuracy', 'Precision', 'Recall', 'F1']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1
        },
        series: [{
          data: self.data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption()
    }
  }
}
</script>
