<template>
  <div>
    Transaction Accounts <v-spacer></v-spacer>
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
  name: "ClientTransactionAccounts",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "TAcctID",
          align: "left",
          sortable: true,
          value: "TAcctID",
        },

        {
          text: "TAcctName",
          align: "left",
          sortable: true,
          value: "TAcctName",
        },
        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "Description",
        },
        {
          text: "InterestBearing",
          align: "left",
          sortable: true,
          value: "InterestBearing",
        },

        {
          text: "Balance",
          align: "left",
          sortable: true,
          value: "Balance",
        },
        {
          text: "Transactions",
          align: "left",
          sortable: true,
          value: "Transactions",
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
    async refresh() {
      var intClientId = 2;
      this.arrItems = await api.getClientTransactionAccounts(intClientId);
      this.loading = false;
    },
  },
};
</script>
