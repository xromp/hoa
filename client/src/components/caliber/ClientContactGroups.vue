<template>
  <div>
    Client Contact Groups
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
  name: "ClientContactGroups",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "ClientContactGroupID",
          align: "left",
          sortable: true,
          value: "ClientContactGroupID",
        },
        {
          text: "GroupName",
          align: "left",
          sortable: true,
          value: "GroupName",
        },
        {
          text: "ArcCommittee",
          align: "left",
          sortable: true,
          value: "ArcCommittee",
        },
        {
          text: "DateCreated",
          align: "left",
          sortable: true,
          value: "DateCreated",
        },
       
        {
          text: "LastModified",
          align: "left",
          sortable: true,
          value: "LastModified",
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
      this.arrItems = await api.getClientContactGroups(intClientId);
      this.loading = false;
    },
  },
};
</script>
