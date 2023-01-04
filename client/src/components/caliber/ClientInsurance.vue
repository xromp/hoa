<template>
  <div>
Insurance
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
  name: "ClientInsurance",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "InsuranceType",
          align: "left",
          sortable: true,
          value: "InsuranceType",
        },
        
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "Name",
        },
         {
          text: "InsuranceCompany",
          align: "left",
          sortable: true,
          value: "InsuranceCompany",
        },{
          text: "PolicyNumber",
          align: "left",
          sortable: true,
          value: "PolicyNumber",
        },

        {
          text: "BeginDate",
          align: "left",
          sortable: true,
          value: "BeginDate",
        },{
          text: "ExpirationDate",
          align: "left",
          sortable: true,
          value: "ExpirationDate",
        },
        

        {
          text: "Amount",
          align: "left",
          sortable: true,
          value: "Amount",
        },

        {
          text: "Deductible",
          align: "left",
          sortable: true,
          value: "Deductible",
        },

        {
          text: "AgentName",
          align: "left",
          sortable: true,
          value: "AgentName",
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
      this.arrItems = await api.getClientInsurance(intClientId);
      this.loading = false;
    },
  },
};
</script>
