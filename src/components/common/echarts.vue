<template>
    <div>
      <div id="main" :style="{width: 10+'rem', height: 10+'rem'}"></div>
    </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
export default {
  props: ['allList'],
  data () {
    return {
      List: [],
      List1: [],
      List2: []
    }
  },
  components: {},
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '2018-11',
          left: 100
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.List1
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '收益',
          data: this.List2,
          type: 'line',
          itemStyle: {
            normal: {
              label: {show: true}
            }
          }
        }]
      })
    }
  },
  mounted () {
    this.List = this.allList.reverse()
    for (let index = 0; index < this.List.length; index++) {
      const ee = this.List[index]
      this.List1.push(ee.Date)
      this.List2.push(ee.Price)
    }
    this.drawLine()
  }
}
</script>
<style scoped lang='scss'>
#main {
  padding: 0 0.265rem;
  text-align: center;
}
</style>
