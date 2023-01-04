<template>
  <div>
Violations
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
      <template v-slot:item.VidolationDate="{ item }">
        {{formatDate(item.ViolationDate)}}
      </template>
     
       <template v-slot:item.CdlosedDate="{ item }">
        {{formatDate(item.ClosedDate)}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";


export default {
  name: "ClientOwners",

  data() {
    return {
      search: "",
      headers: [
        
        {
          text: "ViolationNumber",
          align: "left",
          sortable: true,
          value: "ViolationNumber",
        },{

        
          text: "Owner",
          align: "left",
          sortable: true,
          value: "Owner",
        },{
          text: "Address",
          align: "left",
          sortable: true,
          value: "Address",
        },
        
        {
          text: "CategoryName",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },{
          text: "ItemName",
          align: "left",
          sortable: true,
          value: "ItemName",
        },{
          text: "Inspector",
          align: "left",
          sortable: true,
          value: "Inspector",
        },{
          text: "Status",
          align: "left",
          sortable: true,
          value: "Status",
        },
        {
          text: "ViolationDate",
          align: "left",
          sortable: true,
          value: "ViolationDate",
        },
        {
          text: "ClosedDate",
          align: "left",
          sortable: true,
          value: "ClosedDate",
        },{
          text: "RequiredAction",
          align: "left",
          sortable: true,
          value: "RequiredAction",
        },{
          text: "NextAction",
          align: "left",
          sortable: true,
          value: "NextAction",
        },{
          text: "HasPictures",
          align: "left",
          sortable: true,
          value: "HasPictures",
        },{
          text: "HasLetters",
          align: "left",
          sortable: true,
          value: "HasLetters",
        }
      
      
        
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
      this.arrItems = await api.getClientViolations(intClientId);
      this.loading = false;
    },
  },
};
</script>
