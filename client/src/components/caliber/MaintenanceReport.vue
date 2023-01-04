<template>
  <div>
    <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
    <h2>Maintenance Requests Report</h2>

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
  name: 'MaintenanceReport',
  components: {
    GChart
  },
  data () {
    return {
      /*chartData: [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
      ],*/
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
          text: 'Location',
          align: 'left',
          sortable: true,
          value: 'Location'
        },
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
          text: 'ProblemDate',
          align: 'left',
          sortable: true,
          value: 'ProblemDate'
        },
        {
          text: 'Status',
          align: 'left',
          sortable: true,
          value: 'Status'
        },
        {
          text: 'DeadlineDate',
          align: 'left',
          sortable: true,
          value: 'DeadlineDate'
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
        let strCategory = objItem.CategoryName
        if (!mapGroups.has(strCategory)) {
          mapGroups.set(strCategory, {
            strName: strCategory,

            intCount: 0
          })
        }

        let objGroup = mapGroups.get(strCategory)
        objGroup.intCount++
      }

      console.log(mapGroups)
      return mapGroups
    },
    async refresh () {
      //console.log("inside refersf");

      this.loading = true
      this.arrItems = await api.getMaintenanceItems()


      let mapGroups = this.groupItems(this.arrItems)

      let arrEntries = mapGroups.entries()
      //arrEntries is a tuple [name,{category}]

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
