<template>
  <div>
     Delinquencies
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
      
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";

export default {
  name: "ClientOwners",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "DisplayName",
          align: "left",
          sortable: true,
          value: "DisplayName",
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
          sortable: true,
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
          text: "ZipCode",
          align: "left",
          sortable: true,
          value: "ZipCode",
        },
        {
          text: "StageName",
          align: "left",
          sortable: true,
          value: "StageName",
        },
        {
          text: "TAcctName",
          align: "left",
          sortable: true,
          value: "TAcctName",
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
    async refresh() {
      //console.log("inside refersf");
      this.loading = true;
      var intClientId = 3;
      this.arrItems = await api.getClientDelinquencies(intClientId);
      this.loading = false;
    },
  },
};
</script>
