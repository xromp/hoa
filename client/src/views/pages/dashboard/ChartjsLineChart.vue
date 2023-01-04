<!-- =========================================================================================
    File Name: ChartLineChart.vue
    Description: Create line chart
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vx-card title="Renters per Property" class="mb-base">
        <div class="mt-5">
            <chartjs-component-line-chart :height="100" :data="data" :options="options"></chartjs-component-line-chart>
        </div>
    </vx-card>
</template>

<script>
import ChartjsComponentLineChart from './charts-components/ChartjsComponentLineChart.vue'
export default {
  data () {
    return {
      data: {
        labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Finite HOA',
            borderColor: '#FF9F43',
            fill: false
          }
          // {
          //   data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
          //   label: 'Windward Covez',
          //   borderColor: '#7367F0',
          //   fill: false
          // }, {
          //   data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
          //   label: 'Pacifica Honolulu',
          //   borderColor: '#28C76F',
          //   fill: false
          // }, {
          //   data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
          //   label: 'Windward Passage',
          //   borderColor: '#EA5455',
          //   fill: false
          // }, {
          //   data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
          //   label: 'The Watermark Waikiki',
          //   borderColor: '#FF9F43',
          //   fill: false
          // }, {
          //   data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
          //   label: 'One Archer Lane',
          //   borderColor: '#1E1E1E',
          //   fill: false
          // }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Renters per Property'
        }
      }
    }
  },
  components: {
    ChartjsComponentLineChart
  }
}
</script>
