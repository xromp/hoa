<template>
  <div>
    Directory Contacts<v-spacer></v-spacer>
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
  name: "ClientDirectoryContacts",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "PayeeName",
          align: "left",
          sortable: true,
          value: "PayeeName",
        },
        {
          text: "Address1",
          align: "left",
          sortable: true,
          value: "Address1",
        },
        {
          text: "Address2",
          align: "left",
          sortable: true,
          value: "Address2",
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
          text: "Zip",
          align: "left",
          sortable: true,
          value: "Zip",
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
      var intClientId = 3;
      let objResponse =  await api.getClientDirectoryContacts(intClientId);
      this.arrItems = objResponse.Directory;
      this.loading = false;
    },
  },
};
</script>
