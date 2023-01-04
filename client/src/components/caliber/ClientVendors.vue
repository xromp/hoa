<template>
  <div>
    Client Vendors
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
  name: "ClientVendors",

  data() {
    return {
      search: "",
      headers: [
        /*{
          text: "VendorID",
          align: "left",
          sortable: true,
          value: "VendorID",
        },*/
        {
          text: "VendorType",
          align: "left",
          sortable: true,
          value: "VendorType",
        },
        {
          text: "CompanyName",
          align: "left",
          sortable: true,
          value: "CompanyName",
        },
        {
          text: "VendorCode",
          align: "left",
          sortable: true,
          value: "VendorCode",
        },
       
        {
          text: "Location",
          align: "left",
          sortable: true,
          value: "Location",
        }, {
          text: "PrimaryContactName",
          align: "left",
          sortable: true,
          value: "PrimaryContactName",
        }, {
          text: "Phone",
          align: "left",
          sortable: true,
          value: "Phone",
        },/* {
          text: "Mobile",
          align: "left",
          sortable: true,
          value: "Mobile",
        }, */{
          text: "Fax",
          align: "left",
          sortable: true,
          value: "Fax",
        }, {
          text: "Email",
          align: "left",
          sortable: true,
          value: "Email",
        }, {
          text: "Address1",
          align: "left",
          sortable: true,
          value: "Address1",
        }, {
          text: "City",
          align: "left",
          sortable: true,
          value: "City",
        }, {
          text: "VAcctNumber",
          align: "left",
          sortable: true,
          value: "VAcctNumber",
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
      //console.log("inside refersf");
      this.loading = true;
      var intClientId = 4;
      this.arrItems = await api.getClientVendors(intClientId);
      this.loading = false;
    },
  },
};
</script>
