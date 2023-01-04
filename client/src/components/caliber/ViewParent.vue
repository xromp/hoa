<template></template>

<script>
export default {

  data(){
      return {
        objOrigModel:{}
      }
  },
  props: {
    strRoleId: {
      type: String,
      required: false
    },
    strPMCId: {
      type: String,
      required: false
    },
    strPropertyId: {
      type: String,
      required: false
    },
    strUnitId: {
      type: String,
      required: false
    }
  },
  methods: {
    async deleteRow(objProps, strResourceName, strResource) {
      let objRow = objProps.row;
      const bln = window.confirm("Are you sure you want to delete this "+strResourceName);
      if (!bln) {
        return;
      }
      let intId = objRow.id;
      let strTargetUrl = this.getTargetUrl();
      let strUrl = strTargetUrl + `${strResource}/${intId}`;
      try {
        await this.$myAxios.execute("DELETE", strUrl);
      } catch (e) {}

      await this.load();
    },
    getTargetUrl() {
      let strUrl = "";
      if (this.strPMCId) {
        strUrl = `/pmcs/${this.strPMCId}/`;
      } else if (this.strPropertyId) {
        strUrl = `/properties/${this.strPropertyId}/`;
      } else if (this.strPropertyId) {
        strUrl = `/units/${this.strUnitId}/`;
      }
      return strUrl;
    },
    getRoleHomeUrl() {
      let strUrl = this.getTargetUrl();

      strUrl = `/r/${this.strRoleId}` + strUrl;
      return strUrl;
    }
  }
};
</script>

<style>
</style>