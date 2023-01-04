
<template>
  <vue-apex-charts type="pie" height="350" :options="pieChart.chartOptions" :series="pieChart.series"></vue-apex-charts>
</template>

<script>

export default {
  data() {
    return {
      themeColors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
      pieChart: {
        series: [44, 55, 13, 43],
        chartOptions: {
          labels: ['Team A', 'Team B', 'Team C', 'Team D'],
          colors: themeColors,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      }
    }
  }
}
</script>
