<template>
  <div>
    
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

    <canvas id="delinquencyChart" height="70"></canvas>

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
var Chart = require("chart.js");
import "chartjs-plugin-colorschemes";
//https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html

export default {
  name: "DeliquencyReport",

  data() {
    return {
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
      let arrLabels = [];
      let arrValues = [];
      for (let arrEntry of arrEntries) {
        arrLabels.push(arrEntry[0]);
        arrValues.push(arrEntry[1].intCount);
      }

      console.log("inside refersf");

      var ctx = document.getElementById("delinquencyChart").getContext("2d");
      var data = {
        datasets: [
          {
            data: arrValues,
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: arrLabels,
      };
      var myChart = new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
          plugins: {
            colorschemes: {
              scheme: "brewer.Paired12",
            },
          },
        },
      });

      this.loading = false;
    },
  },
};
</script>
