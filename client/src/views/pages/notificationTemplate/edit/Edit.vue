<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-notification-template-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="data_not_found===1">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Template Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>          
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import EditTab from './EditTab.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
    EditTab
  },
  data () {
    return {
      // crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      edit_data: null,
      data_not_found: 0,
      token: localStorage.usertoken,
      activeTab: 0
    }
  },
  watch: {
  },
  methods: {
    async loadData() {
      this.$vs.loading()
      const editId = this.$route.params.editId
      const {data} = await axios.get(`/notificationTemplate/view/${editId}`, {
        headers: { 'Authorization': this.token },
        params: { 'property_ref': localStorage.selectedPropertyRef }
      })

      if(typeof data[0] === 'undefined') {
        this.data_not_found = 2
      } else {   
        this.data_not_found = 1
        this.edit_data = data[0]
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }    
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('notification-template-list', 'list')
      this.showC = await mainHelper.cansee('notification-template-create', 'create')
      this.showR = await mainHelper.cansee('notification-template-read', 'read')
      this.showU = await mainHelper.cansee('notification-template-update', 'update')
      this.showD = await mainHelper.cansee('notification-template-delete', 'delete')

      if (!this.showU) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Notification Template Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/notification-templates/edit/${this.$route.params.editId}`) return
      console.log('/notification-templates/edit/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/notification-templates/edit/${this.$route.params.editId}`) return
      console.log('/notification-templates/edit/')
      await this.loadData()
    })   
  },  
}

</script>
