<template>
  <div>
    Work Orders <v-spacer></v-spacer>
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
  name: "ClientChartsOfAccounts",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "CategoryName",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },
        {
          text: "ItemName",
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
          text: "ProblemDate",
          align: "left",
          sortable: true,
          value: "ProblemDate",
        },

        {
          text: "Status",
          align: "left",
          sortable: true,
          value: "Status",
        },

        {
          text: "VendorID",
          align: "left",
          sortable: true,
          value: "VendorID",
        },

        {
          text: "WorkOrderNumber",
          align: "left",
          sortable: true,
          value: "WorkOrderNumber",
        },
         {
          text: "DeadlineDate",
          align: "left",
          sortable: true,
          value: "DeadlineDate",
        },

        {
          text: "Estimate",
          align: "left",
          sortable: true,
          value: "Estimate",
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
      this.arrItems = await api.getClientWorkOrders(intClientId);
      this.loading = false;
    },
  },
};
</script>
