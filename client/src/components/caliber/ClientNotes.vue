<template>
  <div>
    Notes
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
  name: "ClientNotes",

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
          text: "CategoryName",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },
        {
          text: "Type",
          align: "left",
          sortable: true,
          value: "Type",
        },
        {
          text: "Note",
          align: "left",
          sortable: true,
          value: "Note",
        },

        {
          text: "Author",
          align: "left",
          sortable: true,
          value: "Author",
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
      var intClientId = 3;
      this.arrItems = await api.getClientNotes(intClientId);
      this.loading = false;
    },
  },
};
</script>
