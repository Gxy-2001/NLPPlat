<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'CurDataChart',
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
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      chart: null,
      timer: null
    }
  },
  created() {
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
          formatter: '{a} <br/>{b} : {c}'
        },
        title: {
          text: '即时流量监控'
        },
        series: [
          {
            name: '即时流量监控',
            type: 'gauge',
            detail: { formatter: '{value}' },
            data: [{ value: self.data, name: '调用次数' }]
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption()
    }
  }
}
</script>
