<template>
  <div>
Chart of Accounts
    <v-spacer></v-spacer>
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
          text: "AccountID",
          align: "left",
          sortable: true,
          value: "AccountID",
        },
        {
          text: "AccountNumber",
          align: "left",
          sortable: true,
          value: "AccountNumber",
        },
        {
          text: "AccountName",
          align: "left",
          sortable: true,
          value: "AccountName",
        },

        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "Description",
        },

        {
          text: "AccountType",
          align: "left",
          sortable: true,
          value: "AccountType",
        },

        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "Name",
        },

        {
          text: "Balance",
          align: "left",
          sortable: true,
          value: "Balance",
        }
        /* {
          text: "Created",
          align: "left",
          sortable: true,
          value: "DateCreated",
        },

        {
          text: "Modified",
          align: "left",
          sortable: true,
          value: "DateModified",
        },*/
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
      this.arrItems = await api.getClientChartOfAccounts(intClientId);
      this.loading = false;
    },
  },
};
</script>
