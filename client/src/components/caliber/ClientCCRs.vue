<template>
  <div>
    CCRs <v-spacer></v-spacer>
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
  name: "ClientCCRs",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "Code",
          align: "left",
          sortable: true,
          value: "Code",
        },

        {
          text: "Text",
          align: "left",
          sortable: true,
          value: "Text",
        },
        {
          text: "PageNumber",
          align: "left",
          sortable: true,
          value: "PageNumber",
        },
        {
          text: "Comment",
          align: "left",
          sortable: true,
          value: "Comment",
        }

      
        
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
      this.arrItems = await api.getClientCCRs(intClientId);
      this.loading = false;
    },
  },
};
</script>
