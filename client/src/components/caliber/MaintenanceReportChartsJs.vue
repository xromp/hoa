<template>
  <div>
    <h2>Maintenance Requests Report</h2>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>
    <canvas id="maintenanceChart" height="70"></canvas>

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

export default {
  name: 'MaintenanceReport',

  data () {
    return {
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

      console.log('inside refersf')

      let mapGroups = this.groupItems(this.arrItems)

      let arrEntries = mapGroups.entries()
      //arrEntries is a tuple [name,{category}]

      let arrLabels = []
      let arrValues = []

      for (let arrEntry of arrEntries) {
        arrLabels.push(arrEntry[0])
        arrValues.push(arrEntry[1].intCount)
      }


      var ctx = document.getElementById('maintenanceChart').getContext('2d')
      var data = {
        datasets: [
          {
            data: arrValues
          }
        ],

        // These labels appear in the legend and in the tooltips 
        //when hovering different arcs
        labels: arrLabels
      }
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
          plugins: {
            colorschemes: {
              scheme: 'brewer.Paired12'
            }
          }
        }
      })

      this.loading = false
    }
  }
}
</script>
