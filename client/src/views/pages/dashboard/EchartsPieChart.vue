<!-- =========================================================================================
  File Name: EchartsPieChart.vue
  Description: Create bar chart
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vx-card title="Renters per Property" class="mb-base">
    <div class="mt-5">
      <e-charts autoresize :options="pie" ref="pie" auto-resize />
    </div>
  </vx-card>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/pie'

export default {
  data () {
    return {
      pie: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Finite HOA']
          // data: ['Windward Cove', 'Pacifica Honolulu', 'Windward Passage', 'The Watermark Waikiki', 'One Archer Lane']
        },
        series: [
          { 
            name: 'Access source',  
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            color: ['#FF9F43', '#28C76F', '#EA5455', '#87ceeb', '#7367F0'],
            data: [
              { value: 0  , name: 'Finite HOA' }
              // { value: 335, name: 'Windward Cove' },
              // { value: 310, name: 'Pacifica Honolulu' },
              // { value: 234, name: 'Windward Passage' },
              // { value: 135, name: 'The Watermark Waikiki' },
              // { value: 1548, name: 'One Archer Lane' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  components: {
    ECharts
  },
  mounted () {
    let dataIndex = -1
    const pie = this.$refs.pie
    const dataLen = pie.options.series[0].data.length
    // setInterval(() => {
      pie.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex
      })
      dataIndex = (dataIndex + 1) % dataLen
      pie.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex
      })
      pie.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex
      })
    // }, 0)
  }
}
</script>
