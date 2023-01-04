<template>
  <div>
    <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
    <h2>Balance Sheet</h2>

    <div align="center">
      <GChart
        type="PieChart"
        :data="chartData"
        :options="chartOptions"
        style="width: 900px; height: 500px;align='center'"
        align="center"
      />
      </div>
    
    <vs-table :data=headers>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><strong>Titled </strong></th>
            <th class="text-right"><strong>Description</strong></th>
            <th class="text-left"><strong>Amount</strong></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="objItem in arrItems">
            <tr style="background-color:#eee" :key="objItem.strName">
              <td>
                <strong>{{ objItem.strName }}</strong>
              </td>
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
    </vs-table>
  </div>
</template>

<script>
import api from '@/caliber-api'

import { GChart } from 'vue-google-charts'

export default {
  name: 'BalanceSheetReport',
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
      chartData: [
        ["",""]
      ],
      chartOptions: {
        chart: {
          title: 'Balance Sheet',
          subtitle: ''
        }
      },
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
 

    groupItems (arrItems) {
      let mapGroups = new Map()
      for (let objItem of arrItems) {
        let strCategory = objItem.AccountType
        if (!mapGroups.has(strCategory)) {
          mapGroups.set(strCategory, {
            strName: strCategory,
            arr: [],
            intCount: 0,
            fltBalance: 0
          })
        }

        let objGroup = mapGroups.get(strCategory)
        objGroup.intCount++
        objGroup.fltBalance += objItem.Balance
        objGroup.arr.push(objItem)
      }

      console.log(mapGroups)
      return mapGroups
    },
    async refresh () {
      //console.log("inside refersf");
      this.loading = true
      var intClientId = this.$route.params.viewId
      let arrItems = await api.getBalanceSheetItems(intClientId)
      let mapGroups = this.groupItems(arrItems)

      let arrEntries = mapGroups.entries()
      //arrEntries is a tuple [name,{category}]

      console.log(this.arrItems)

      let arrChartData = [['Item', 'Value']]

      let arrRows = []
      for (let arrEntry of arrEntries) {

        arrRows.push({
          strName: arrEntry[0],
          arr: arrEntry[1].arr
        })
        let intBalance = parseInt(arrEntry[1].fltBalance, 10)
        if (intBalance < 0) {
          intBalance = intBalance * -1
        }
        arrChartData.push([arrEntry[0], intBalance])
      }

      this.arrItems = arrRows
      this.chartData = arrChartData

      console.log('inside refersf')

      this.loading = false
    }
  }
}
</script>
