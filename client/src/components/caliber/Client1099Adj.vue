<template>
  <div>
    1099 Adj <v-spacer></v-spacer>
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
    
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";

export default {
  name: "ClientCharges",

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
          text: "ARTransactionID",
          align: "left",
          sortable: true,
          value: "ARTransactionID",
        },
        {
          text: "UnitAccountID",
          align: "left",
          sortable: true,
          value: "UnitAccountID",
        },
        {
          text: "PostingDate",
          align: "left",
          sortable: true,
          value: "PostingDate",
        },
        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "Description",
        },

        {
          text: "Amount",
          align: "left",
          sortable: true,
          value: "Amount",
        },
        {
          text: "RefNumber",
          align: "left",
          sortable: true,
          value: "RefNumber",
        },
        {
          text: "PaidInFullDate",
          align: "left",
          sortable: true,
          value: "PaidInFullDate",
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
      var intClientId = 3;
      this.arrItems = await api.getClient1099Adj(intClientId);
      this.loading = false;
    },
  },
};
</script>
