<template>
  <div>
Client Contacts
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
      <template v-slot:item.MailingAddress="{ item }">
       
      </template>
      <template v-slot:item.Phones="{ item }">
       
      </template>
      <template v-slot:item.EmailAddresses="{ item }">
       
      </template>
      <template v-slot:item.MailingMatrices="{ item }">
       
      </template>
      <template v-slot:item.UnitAddress="{ item }">
       
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
          text: "DisplayName",
          align: "left",
          sortable: true,
          value: "DisplayName",
        },{
          text: "UnitAddress",
          align: "left",
          sortable: true,
          value: "UnitAddress",
        },{
          text: "MailingAddress",
          align: "left",
          sortable: true,
          value: "MailingAddress",
        },{
          text: "Phones",
          align: "left",
          sortable: true,
          value: "Phones",
        },{
          text: "Emails",
          align: "left",
          sortable: true,
          value: "EmailAddresses",
        },{
          text: "MailingMatrices",
          align: "left",
          sortable: true,
          value: "MailingMatrices",
        },
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
          text: "UnitAccountID",
          align: "left",
          sortable: true,
          value: "UnitAccountID",
        },{
          text: "AccountNumber",
          align: "left",
          sortable: true,
          value: "AccountNumber",
        },{
          text: "AccountNumber2",
          align: "left",
          sortable: true,
          value: "AccountNumber2",
        },{
          text: "IsCurrent",
          align: "left",
          sortable: true,
          value: "IsCurrent",
        },{
          text: "IsPrimaryOwner",
          align: "left",
          sortable: true,
          value: "IsPrimaryOwner",
        },{
          text: "IsOwner",
          align: "left",
          sortable: true,
          value: "IsOwner",
        },{
          text: "IsOccupant",
          align: "left",
          sortable: true,
          value: "IsOccupant",
        },{
          text: "IsRenter",
          align: "left",
          sortable: true,
          value: "IsRenter",
        },{
          text: "Is3rdParty",
          align: "left",
          sortable: true,
          value: "Is3rdParty",
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
      this.arrItems = await api.getClientContacts(intClientId);
      this.loading = false;
    },
  },
};
</script>
