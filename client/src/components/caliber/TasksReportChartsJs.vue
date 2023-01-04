<template>
  <div>
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

    <canvas id="tasksChart" height="70"></canvas>

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
  name: "TasksReport",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "Category",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },
        {
          text: "Item",
          align: "left",
          sortable: true,
          value: "ItemName",
        },
        {
          text: "Inspector",
          align: "left",
          sortable: true,
          value: "Inspector",
        },

        {
          text: "Status",
          align: "left",
          sortable: true,
          value: "Status",
        },
        {
          text: "Location",
          align: "left",

          value: "Location",
        }
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
        let strItemName = objItem.CategoryName;
        if (!mapGroups.has(strItemName)) {
          mapGroups.set(strItemName, {
            intCount: 0,
          });
        }

        let objGroup = mapGroups.get(strItemName);
        objGroup.intCount++;
      }

      console.log(mapGroups);
      return mapGroups;
    },
    async refresh() {
      //console.log("inside refersf");
      this.loading = true;
      var intClientId = 3;
      this.arrItems = await api.getWorkOrders(intClientId);
      let mapGroups = this.groupItems(this.arrItems);
      let arrEntries = mapGroups.entries();
      let arrLabels = [];
      let arrValues = [];
      for (let arrEntry of arrEntries) {
        arrLabels.push(arrEntry[0]);
        arrValues.push(arrEntry[1].intCount);
      }

      console.log(arrLabels);
      console.log(arrValues);

      console.log("inside refersf");

      var ctx = document.getElementById("tasksChart").getContext("2d");
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
