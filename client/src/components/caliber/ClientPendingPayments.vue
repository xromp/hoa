<template>
  <div>
    Pending Payments <v-spacer></v-spacer>
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
          text: "PaymentID",
          align: "left",
          sortable: true,
          value: "PaymentID",
        },

        {
          text: "ClientName",
          align: "left",
          sortable: true,
          value: "ClientName",
        },
        {
          text: "PaymentGLAccountID",
          align: "left",
          sortable: true,
          value: "PaymentGLAccountID",
        },
        {
          text: "PayeeName",
          align: "left",
          sortable: true,
          value: "PayeeName",
        },

        {
          text: "PayeeType",
          align: "left",
          sortable: true,
          value: "PayeeType",
        },
        {
          text: "CheckNumber",
          align: "left",
          sortable: true,
          value: "CheckNumber",
        },

        {
          text: "PaymentDate",
          align: "left",
          sortable: true,
          value: "PaymentDate",
        },

        {
          text: "Amount",
          align: "left",
          sortable: true,
          value: "Amount",
        },

        {
          text: "Memo",
          align: "left",
          sortable: true,
          value: "Memo",
        },
         {
          text: "PayerAddress",
          align: "left",
          sortable: true,
          value: "PayerAddress",
        },

        {
          text: "RemitAddress",
          align: "left",
          sortable: true,
          value: "RemitAddress",
        },{
          text: "MailingAddress",
          align: "left",
          sortable: true,
          value: "MailingAddress",
        },{
          text: "PayeeAddress",
          align: "left",
          sortable: true,
          value: "PayeeAddress",
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
      this.arrItems = await api.getClientPendingPayments(intClientId);
      this.loading = false;
    },
  },
};
</script>
