<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    title: String,
    chartData: Object,
  },
  data() {
    return {
      gradient: null,
    }
  },
  mounted() {
  },
  methods: {
    renderLineChart() {
      this.renderChart(
        {
          labels: this.chartData.labels,
          datasets: this.chartData.datasets.map(prop => ({ ...prop,  backgroundColor: this.getBackground(prop.backgroundColor)})),
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: this.title
          }
        }
      );
    },
    getBackground(color) {
      if (color === "gradient") {
        this.gradient = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);

        this.gradient.addColorStop(0, "rgba(0, 231, 255, 0.9)");
        this.gradient.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
        this.gradient.addColorStop(1, "rgba(0, 231, 255, 0)");
        return this.gradient;
      } else {
        return color;
      }
      
    }
  },
  watch: {
    chartData() {
      this.$data._chart.update();
      this.renderLineChart();
    }
  }
};
</script>

<style>

</style>