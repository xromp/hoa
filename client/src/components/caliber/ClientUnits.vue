<template>
  <div>
Client Units
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
          text: "UnitID",
          align: "left",
          sortable: true,
          value: "UnitID",
        },
        {
          text: "ClientID",
          align: "left",
          sortable: true,
          value: "ClientID",
        },{
          text: "GroupID",
          align: "left",
          sortable: true,
          value: "GroupID",
        },{
          text: "LotNumber",
          align: "left",
          sortable: true,
          value: "LotNumber",
        },{
          text: "UnitNumber",
          align: "left",
          sortable: true,
          value: "UnitNumber",
        },{
          text: "Address1",
          align: "left",
          sortable: true,
          value: "Address1",
        },{
          text: "Address2",
          align: "left",
          sortable: true,
          value: "Address2",
        },{
          text: "City",
          align: "left",
          sortable: true,
          value: "City",
        },{
          text: "State",
          align: "left",
          sortable: true,
          value: "State",
        },{
          text: "ZipCode",
          align: "left",
          sortable: true,
          value: "ZipCode",
        },/*{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },{
          text: "Vacant",
          align: "left",
          sortable: true,
          value: "Vacant",
        },*/
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
      this.arrItems = await api.getClientUnits(intClientId);
      this.loading = false;
    },
  },
};
</script>
