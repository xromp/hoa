<template>
  <div>
Invoices
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
  name: "ClientInvoices",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "InvoiceNumber",
          align: "left",
          sortable: true,
          value: "InvoiceNumber",
        }, {
          text: "PayeeName",
          align: "left",
          sortable: true,
          value: "PayeeName",
        }, {
          text: "PayeeType",
          align: "left",
          sortable: true,
          value: "PayeeType",
        }, {
          text: "PayeeID",
          align: "left",
          sortable: true,
          value: "PayeeID",
        },
        
        {
          text: "Amount",
          align: "left",
          sortable: true,
          value: "Amount",
        },
         {
          text: "PONumber",
          align: "left",
          sortable: true,
          value: "PONumber",
        },{
          text: "InvoiceDate",
          align: "left",
          sortable: true,
          value: "InvoiceDate",
        },

        {
          text: "DueDate",
          align: "left",
          sortable: true,
          value: "DueDate",
        },{
          text: "Received",
          align: "left",
          sortable: true,
          value: "Received",
        },
        

        {
          text: "Recurring",
          align: "left",
          sortable: true,
          value: "Recurring",
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
      var intClientId = 4;
      this.arrItems = await api.getClientInvoices(intClientId);
      this.loading = false;
    },
  },
};
</script>
