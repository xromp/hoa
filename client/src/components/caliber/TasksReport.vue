<template>
  <div>
    <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
    <h2>Tasks Report</h2>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>

    <div align="center">
      <GChart
        type="PieChart"
        :data="chartData"
        :options="chartOptions"
        style="width: 900px; height: 500px;align='center'"
        align="center"
      />
    </div>

    <v-data-table :headers="headers" :items="arrItems" :search="search">
      <template v-slot:item.name="{ item }">
        <router-link :to="'/structures/' + item.id">{{
          item.name.toUpperCase()
        }}</router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from '@/caliber-api'
import { GChart } from 'vue-google-charts'

export default {
  name: 'TasksReport',
 components: {
    GChart
  },
  data () {
    return {
      chartData: [['', '']],
      chartOptions: {
        chart: {
          title: 'Maintenance Report',
          subtitle: ''
        }
      },
      search: '',
      headers: [
        {
          text: 'Category',
          align: 'left',
          sortable: true,
          value: 'CategoryName'
        },
        {
          text: 'Item',
          align: 'left',
          sortable: true,
          value: 'ItemName'
        },
        {
          text: 'Inspector',
          align: 'left',
          sortable: true,
          value: 'Inspector'
        },

        {
          text: 'Status',
          align: 'left',
          sortable: true,
          value: 'Status'
        },
        {
          text: 'Location',
          align: 'left',

          value: 'Location'
        }
      ],
      loading: true,
      arrItems: [],
      model: {},
      dialog: false
    }
  },
  async created () {
    this.refresh()
  },
  methods: {
   

    groupItems (arrItems) {
      let mapGroups = new Map()
      for (let objItem of arrItems) {
        let strItemName = objItem.CategoryName
        if (!mapGroups.has(strItemName)) {
          mapGroups.set(strItemName, {
            intCount: 0
          })
        }

        let objGroup = mapGroups.get(strItemName)
        objGroup.intCount++
      }

      console.log(mapGroups)
      return mapGroups
    },
    async refresh () {
      //console.log("inside refersf");
      this.loading = true
      var intClientId = 3
      this.arrItems = await api.getWorkOrders(intClientId)
      let mapGroups = this.groupItems(this.arrItems)
      let arrEntries = mapGroups.entries()
      let arrChartData = [['Item', 'Value']]

      for (let arrEntry of arrEntries) {
        let intCount = parseInt(arrEntry[1].intCount, 10)
        arrChartData.push([arrEntry[0], intCount])
      }
      this.chartData = arrChartData
      this.loading = false
    }
  }
}
</script>
