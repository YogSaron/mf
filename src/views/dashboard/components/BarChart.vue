<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getOutSumByMonth } from '@/api/integrate'
const animationDuration = 6000

export default {
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
    barData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null,
      barTotalData: []
    }
  },
  watch: {
    barData: function() {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
    this.loadingTotal()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    loadingTotal() {
      const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      getOutSumByMonth({ targetYear: '2018' }).then(response => {
        const { data } = response
        for (const ob of data) {
          arr[ob.mon - 1] = ob.totalAmount
        }
        this.barTotalData = arr
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['出货总额', this.barData.name],
          align: 'right',
          right: 10,
          top: 0
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月'
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '出货总额',
            type: 'bar',
            // stack: 'vistors',
            stack: null,
            // barWidth: '60%',
            data: this.barTotalData,
            itemStyle: {
              normal: {
                // color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  // textStyle: {
                  //   color: '#fff'
                  // },
                  position: 'top'
                }
              }
            },
            animationDuration
          },
          {
            name: this.barData.name,
            type: 'bar',
            data: this.barData.list,
            itemStyle: {
              normal: {
                // color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  // textStyle: {
                  //   color: '#fff'
                  // },
                  position: 'top'
                }
              }
            },
            animationDuration
          }
        ]
      })
    }
  }
}
</script>
