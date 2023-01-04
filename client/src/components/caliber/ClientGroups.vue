<template>
  <div>
Client Groups 
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
      <template v-slot:item.name="{ item }">
        <router-link :to="'/structures/' + item.id">{{
          item.name.toUpperCase()
        }}</router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";


export default {
  name: "ClientGroups",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "GroupName",
        },
        {
          text: "Code",
          align: "left",
          sortable: true,
          value: "GroupCode",
        },
        {
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
      //console.log("inside refersf");
      this.loading = true;
      var intClientId = 4;
      this.arrItems = await api.getClientGroups(intClientId);
      this.loading = false;
    },
  },
};
</script>
