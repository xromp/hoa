<template>
  <div>
    DOC Hierarchy <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>

    <v-data-table :headers="headers" :items="arrItems" :search="search">
      <template v-slot:item.WebCategories="{ item }">
        {{ getWebCategories(item) }}
      </template>
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
          text: "CategoryName",
          align: "left",
          sortable: true,
          value: "CategoryName",
        },

        {
          text: "WebCategories",
          align: "left",
          sortable: true,
          value: "WebCategories",
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
    getWebCategories(item){
      try {
        return item.WebCategories.map(obj=>obj.CategoryName).join();
      } catch (e) {
        return "n/a";
      }
    },
    async refresh() {
      var intClientId = 3;
      this.arrItems = await api.getClientHierarchyDocs(intClientId);
      this.loading = false;
    },
  },
};
</script>
