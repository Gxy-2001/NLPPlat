<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'DayDataChart',
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
      default: () => new Array(31).fill(0)
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
    for (var i = 1; i <= 31; i++) {
      this.xIndex.push(i + '日')
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
          text: '当月流量监控'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xIndex
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: self.data,
          type: 'line',
          areaStyle: {}
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
