<template>
  <div>
    Billing Records
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
  name: "ClientBillingRecords",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "BillingRecordID",
          align: "left",
          sortable: true,
          value: "BillingRecordID",
        },
        
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "Name",
        },
         {
          text: "Amount",
          align: "left",
          sortable: true,
          value: "Amount",
        },{
          text: "TAcctID",
          align: "left",
          sortable: true,
          value: "TAcctID",
        },

        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "Description",
        },{
          text: "Frequency",
          align: "left",
          sortable: true,
          value: "Frequency",
        },
        

        {
          text: "StartDate",
          align: "left",
          sortable: true,
          value: "StartDate",
        },

        {
          text: "EndDate",
          align: "left",
          sortable: true,
          value: "EndDate",
        },

        {
          text: "CostCenterID",
          align: "left",
          sortable: true,
          value: "CostCenterID",
        },
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
      this.arrItems = await api.getClientBillingRecords(intClientId);
      this.loading = false;
    },
  },
};
</script>
