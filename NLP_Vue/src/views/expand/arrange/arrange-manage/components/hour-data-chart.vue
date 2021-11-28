<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'HourDataChart',
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
      default: '300px'
    },
    data: {
      type: Array,
      default: () => new Array(24).fill(0)
    }
  },
  data() {
    return {
      chart: null,
      timer: null,
      xIndex: []
    }
  },
  created() {
    for (var i = 0; i < 24; i++) {
      this.xIndex.push(i + ':00')
    }
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
          text: '当日流量监控'
        },
        xAxis: {
          type: 'category',
          data: this.xIndex
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: self.data,
          type: 'bar'
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
