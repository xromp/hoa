<template>
  <div>
    <h2>Balance Sheet</h2>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>

    <canvas id="balanceSheetChart" height="70"></canvas>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><strong>Title</strong></th>
            <th class="text-right"><strong>Description</strong></th>
            <th class="text-left"><strong>Amount</strong></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="objItem in arrItems">
            <tr style="background-color:#eee" :key="objItem.strName">
              <td><strong>{{ objItem.strName }}</strong></td>
              <td></td>
              <td></td>
            </tr>

            <template v-for="(objSubItem, index) in objItem.arr">
              <tr :key="objItem.strName + index">
                <td></td>
                <td class="text-right">{{ objSubItem.AccountName }}</td>
                <td class="text-left">{{ objSubItem.Balance }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import api from '@/caliber-api'
var Chart = require('chart.js')
import 'chartjs-plugin-colorschemes'

export default {
  name: 'BalanceSheetReport',

  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'DisplayName'
        },
        {
          text: 'UnitAccountID',
          align: 'left',
          sortable: true,
          value: 'UnitAccountID'
        },
        {
          text: 'AccountNumber',
          align: 'left',
          sortable: true,
          value: 'AccountNumber'
        },

        {
          text: 'GroupName',
          align: 'left',
          sortable: true,
          value: 'GroupName'
        },
        {
          text: 'Address',
          align: 'left',

          value: 'Address'
        },
        {
          text: 'City',
          align: 'left',
          sortable: true,
          value: 'City'
        },
        {
          text: 'State',
          align: 'left',
          sortable: true,
          value: 'State'
        },
        {
          text: 'Zip',
          align: 'left',
          sortable: true,
          value: 'ZipCode'
        },
        {
          text: 'Stage',
          align: 'left',
          sortable: true,
          value: 'StageName'
        },
        {
          text: 'TAcct',
          align: 'left',
          sortable: true,
          value: 'TAcctName'
        },
        {
          text: 'TAcctID',
          align: 'left',
          sortable: true,
          value: 'TAcctID'
        },
        {
          text: 'Balance',
          align: 'left',
          sortable: true,
          value: 'Balance'
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
    getRandomColor () {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },

    groupItems (arrItems) {
      let mapGroups = new Map()
      for (let objItem of arrItems) {
        let strCategory = objItem.AccountType
        if (!mapGroups.has(strCategory)) {
          mapGroups.set(strCategory, {
            strName: strCategory,
            arr: [],
            intCount: 0,
            fltBalance:0
          })
        }

        let objGroup = mapGroups.get(strCategory);
        objGroup.intCount++;
        objGroup.fltBalance += objItem.Balance;
        objGroup.arr.push(objItem);

      }

      console.log(mapGroups)
      return mapGroups
    },
    async refresh () {
      //console.log("inside refersf");
      this.loading = true
      var intClientId = 49
      let arrItems = await api.getBalanceSheetItems(intClientId)
      let mapGroups = this.groupItems(arrItems)

      let arrEntries = mapGroups.entries()
      //arrEntries is a tuple [name,{category}]

      console.log(this.arrItems)
      let arrLabels = []
      let arrValues = []

      let arrRows = []
      for (let arrEntry of arrEntries) {
        arrLabels.push(arrEntry[0])
        arrValues.push(arrEntry[1].fltBalance)
        arrRows.push({
          strName: arrEntry[0],
          arr: arrEntry[1].arr
        })
      }

      this.arrItems = arrRows

      console.log('inside refersf')

      var ctx = document.getElementById('balanceSheetChart').getContext('2d')
      var data = {
        datasets: [
          {
            data: arrValues
          }
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
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
