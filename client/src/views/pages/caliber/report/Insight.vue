
<template>
  <div id="page-data-edit">
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6 pb-6">
        <vs-alert title="Insight" active="true" color="success" class="mt-3">
          This will automatically open a new tab for the Insight report viewing. If you are having issues accessing the link, please try to <a href @click="reload">reload</a> this page.
        </vs-alert>
      </div>
    </vx-card>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  methods: {
    async getInsightURL() {
      const { data } = await axios.get('/api/insight/auth', {
        headers: { 'Authorization': localStorage.usertoken }
      });
      return data.Insight_URL;
    },
    reload() {
      this.$router.go(0);
    }
  },
  async created () {
    this.$vs.loading();
    const url = await this.getInsightURL();
    window.open(url, '_blank');
    this.$vs.loading.close();
  }
}
</script>
