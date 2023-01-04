<template>
  <div>
    Maintenance KnowledgeBase
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
      <template v-slot:item.KBItems="{ item }">
        {{ getKBItems(item) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/caliber-api";

export default {
  name: "MaintenanceViolationsKB",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "CategoryName",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },

        {
          text: "KBItems",
          align: "left",
          sortable: true,
          value: "KBItems",
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
      this.arrItems = await api.getClientMaintenanceKB(intClientId);
      this.loading = false;
    },
    getKBItems(item){
      try{
         return item.KBItems.map(obj=>obj.ItemName).join(",");
      }catch(e){
          return "n/a";
      }


    }
  },
};
</script>
