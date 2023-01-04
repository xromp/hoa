<template>
  <div>
    <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
        <h2>Deliquency Report</h2>

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
import api from "@/caliber-api";
import { GChart } from 'vue-google-charts'

export default {
  name: "DeliquencyReport",
  components: {
    GChart
  },
  data() {
    return {
      chartData: [['', '']],
      chartOptions: {
        chart: {
          title: 'Delinquency Report',
          subtitle: ''
        }
      },
      search: "",
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "DisplayName",
        },
        {
          text: "UnitAccountID",
          align: "left",
          sortable: true,
          value: "UnitAccountID",
        },
        {
          text: "AccountNumber",
          align: "left",
          sortable: true,
          value: "AccountNumber",
        },

        {
          text: "GroupName",
          align: "left",
          sortable: true,
          value: "GroupName",
        },
        {
          text: "Address",
          align: "left",

          value: "Address",
        },
        {
          text: "City",
          align: "left",
          sortable: true,
          value: "City",
        },
        {
          text: "State",
          align: "left",
          sortable: true,
          value: "State",
        },
        {
          text: "Zip",
          align: "left",
          sortable: true,
          value: "ZipCode",
        },
        {
          text: "Stage",
          align: "left",
          sortable: true,
          value: "StageName",
        },
        {
          text: "TAcct",
          align: "left",
          sortable: true,
          value: "TAcctName",
        },
        {
          text: "TAcctID",
          align: "left",
          sortable: true,
          value: "TAcctID",
        },
        {
          text: "Balance",
          align: "left",
          sortable: true,
          value: "Balance",
        },
      ],
      loading: true,
      arrItems: [],
      model: {},
      dialog: false,
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },

    groupItems(arrItems) {
      let mapGroups = new Map();
      for (let objItem of arrItems) {
        let strStage = objItem.StageName;
        if (!mapGroups.has(strStage)) {
          mapGroups.set(strStage, {
            intCount: 0,
          });
        }

        let objGroup = mapGroups.get(strStage);
        objGroup.intCount++;
      }

      console.log(mapGroups);
      return mapGroups;
    },
    async refresh() {
      //console.log("inside refersf");
      this.loading = true;
      var intClientId = 49;
      this.arrItems = await api.getDelinquencyItems(intClientId);
      let mapGroups = this.groupItems(this.arrItems);
      let arrEntries = mapGroups.entries();
      let arrChartData = [['Item', 'Value']]

      for (let arrEntry of arrEntries) {
         let intCount = parseInt(arrEntry[1].intCount, 10)
         arrChartData.push([arrEntry[0], intCount])
      }
      this.chartData = arrChartData


      

      this.loading = false;
    },
  },
};
</script>
