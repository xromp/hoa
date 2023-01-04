<template>
  <div>
    Architechtural Items <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>

    <v-data-table :headers="headers" :items="arrItems" :search="search">
      <template v-slot:item.MailingAddress="{ item }"> </template>
      <template v-slot:item.Phones="{ item }"> </template>
      <template v-slot:item.EmailAddresses="{ item }"> </template>
      <template v-slot:item.MailingMatrices="{ item }"> </template>
      <template v-slot:item.UnitAddress="{ item }"> </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";

export default {
  name: "ClientCostCenters",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "UnitID",
          align: "left",
          sortable: true,
          value: "UnitID",
        },
         {
          text: "Owner",
          align: "left",
          sortable: true,
          value: "Owner",
        },
 {
          text: "Address",
          align: "left",
          sortable: true,
          value: "Address",
        },{
          text: "Address",
          align: "left",
          sortable: true,
          value: "Address",
        },
        {
          text: "ApplicationNumber",
          align: "left",
          sortable: true,
          value: "ApplicationNumber",
        },

 {
          text: "RequestType",
          align: "left",
          sortable: true,
          value: "RequestType",
        },
        {
          text: "Status",
          align: "left",
          sortable: true,
          value: "Status",
        },

        {
          text: "StartDate",
          align: "left",
          sortable: true,
          value: "StartDate",
        },
        /* {
          text: "Address",
          align: "left",

          value: "Links",
        },*/
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
    async refresh() {
      var intClientId = 3;
      this.arrItems = await api.getClientArchitechturalItems(intClientId);
      this.loading = false;
    },
  },
};
</script>
