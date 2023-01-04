<template>
  <div class="container line-chart">
    <line-chart title="Maintenance Jobs by Status" :chartData="chartData"/>
  </div>
</template>

<script>
import axios from '@/axios'
import LineChart from '../common/graph/line-chart.vue'

export default {
  name: 'LineChartContainer',
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartData: null,
    gradient: null,
  }),
  mounted () {
    this.loaded = false
    try {
      const data = {
        labels: new Array(7).fill(null).map((v, i)=> (i+1).toString()),
        datasets: [{
          label: "Jobs",
          data: new Array(7).fill(null).map((v, i)=> Math.floor(Math.random() * 100)),
          backgroundColor: "gradient",
          borderColor: "rgba(1, 116, 188, 0.50)",
          pointBackgroundColor: "rgba(171, 71, 188, 1)"
        }]
      }
      this.chartData = data;
      this.loaded = true;
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
<style scoped>
  .line-chart {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>