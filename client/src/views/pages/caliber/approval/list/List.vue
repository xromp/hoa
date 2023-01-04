
<template>

  <div id="page-data-list">
    <vx-card>
      <div class="vx-row">
        <div class="vx-col w-10/12"/>
        <div class="vx-col w-2/12 text-right">
          <export-csv/>
        </div>
      </div>
      
      <vs-tabs class="tab-action-btn-fill-conatiner">
        <vs-tab label="Position" icon-pack="feather" icon="icon-list">
          <div class="tab-text">
            <open-approvals
              :key="forceRender" 
              :data="listData.open" 
              :loading="loading"
              :isApprovalCreator="isApprovalCreator"
              />
          </div>
        </vs-tab>          
        <vs-tab label="History" icon-pack="feather" icon="icon-archive">
          <div class="tab-text">
            <history-approvals
            :key="forceRender"
            :data="listData.history" 
            :loading="loading"
            :isApprovalCreator="isApprovalCreator"/>
          </div>
        </vs-tab>          
      </vs-tabs>
    </vx-card>
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'
import axios from '@/axios'
import EventBus from '@/EventBus'

import OpenApprovals from './OpenApprovals.vue';
import HistoryApprovals from './HistoryApprovals.vue';
import ExportCsv from './ExportCSV.vue';

export default {
  components: {
    AgGridVue,
    vSelect,
    OpenApprovals,
    HistoryApprovals,
    ExportCsv,
  },
  data () {
    return {
      listData: {},
      loading: false,
      forceRender: 0,
    }
  },
  methods: {
    async loadApprovals () {
      try {
        this.$vs.loading();
        const { data } = await axios.get('/approval/open-history', {
          headers: { 'Authorization': localStorage.usertoken },
        });

        this.listData = data;
        this.loading = false;
        this.forceRender+=1;
        this.$vs.loading.close();
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.loading = false;
        this.$vs.loading.close();
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)             
    }
  },
  computed: {
    isApprovalCreator() {
      const { approver }= JSON.parse(localStorage.userAllData);
      return approver && approver.is_creator;
    }
  },
  async created() {
    await this.loadApprovals();
  },
  mounted () {
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== '/approval/list') return
      console.log('/approval/list')
      await this.loadApprovals()
    })
  }
}

</script>

<style lang="scss">
#page-data-list {
  .data-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}
</style>
