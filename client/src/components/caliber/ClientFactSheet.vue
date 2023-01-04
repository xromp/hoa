<template>
  <div>
    Fact Sheet <v-spacer></v-spacer>
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
  name: "ClientBillingRecords",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "Field",
          align: "left",
          sortable: true,
          value: "Field",
        },

        {
          text: "Value",
          align: "left",
          sortable: true,
          value: "Value",
        },
        {
          text: "DisplayOrder",
          align: "left",
          sortable: true,
          value: "DisplayOrder",
        },
        {
          text: "DashboardLevel",
          align: "left",
          sortable: true,
          value: "DashboardLevel",
        },

        {
          text: "Fixed",
          align: "left",
          sortable: true,
          value: "Fixed",
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
    async refresh() {
      var intClientId = 3;
      this.arrItems = await api.getClientFactSheet(intClientId);
      this.loading = false;
    },
  },
};
</script>
