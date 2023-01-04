<template>
  <div>
    Resale <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>
<template>
    {{strResale}}
    </template>
  </div>
</template>

<script>
import api from "@/caliber-api";

export default {
  name: "ClientResale",

  data() {
    return {
      search: "",
      loading: true,
      objData: {},
      model: {},
      dialog: false,
    };
  },
  computed:{
    strResale(){
      if(this.objData) {
        return JSON.stringify(this.objData);
      }
      return "n/a";
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      var intClientId = 3;
      this.objData = await api.getClientResale(intClientId);
      this.loading = false;
    },
  },
};
</script>
