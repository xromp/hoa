<template>
  <div id="page-data-list">
    <vs-tabs class="tab-action-btn-fill-conatiner">
      <vs-tab label="Messaging" icon-pack="feather" icon="icon-message-square">
        <main-grid :listData="notifs.filter(({ is_automated }) => !is_automated)"/>
      </vs-tab>
      <vs-tab label="Alerts" icon-pack="feather" icon="icon-alert-triangle">
        <main-grid :listData="notifs.filter(({ is_automated }) => !!is_automated)"/>
      </vs-tab>
      <vs-tab label="All" icon-pack="feather" icon="icon-list">
        <main-grid :listData="notifs"/>
      </vs-tab>
    </vs-tabs>
    
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import MainGrid from './MainGrid.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
    AgGridVue,
    MainGrid,
  },
  data () {
    return {
      notifs: [],
    }
  },
  methods: {
    newRecord () {
      this.$router.push("/notifications/new")
    },
    async loadData() {
      this.$vs.loading()
      const { data } = await axios.get('/notification/received', {
        headers: { 'Authorization': localStorage.usertoken }
      });
      this.notifs = data;
      this.$vs.loading.close();
    }    
  },
  async created () {
    //crud
    this.showL = await mainHelper.cansee('notification-list', 'list')
    this.showC = await mainHelper.cansee('notification-create', 'create')
    this.showR = await mainHelper.cansee('notification-read', 'read')
    this.showU = await mainHelper.cansee('notification-update', 'update')
    this.showD = await mainHelper.cansee('notification-delete', 'delete')

    if (!this.showL) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Notification Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }

    await this.loadData()
    this.$vs.loading.close()
    this.loading = false
  },
  mounted () {    
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== '/notifications/received') return
        console.log('/notifications/received')
      await this.loadData()
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== '/notifications/received') return
      console.log('/notifications/received')
      await this.loadData()
    })
    EventBus.$on('update-notifications-received',async (result) => {
      if (this.$route.path !== '/notifications/received') return
      console.log('/notifications/received')
      await this.loadData()
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
