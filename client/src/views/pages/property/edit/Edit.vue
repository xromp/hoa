<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-unit-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="data_not_found===1">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
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
      const { data } = await axios.get(`/property/view/${this.$route.params.editId}`, {
          headers: { 'Authorization': this.token },
          params: {
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': parseInt(localStorage.selectedParentOrg),
            'role_id': localStorage.selectedRoleId,
            'role_val': localStorage.selectedRoleVal
          }
      })

      if (data['pmc_id'] !== parseInt(localStorage.selectedParentOrg)) {
        this.data_not_found = 2
      } else {          
        this.data_not_found = 1
        this.edit_data = data        
        this.edit_data.BillingCountry = parseInt(this.edit_data.BillingCountry)
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('property-list', 'list')
      this.showC = await mainHelper.cansee('property-create', 'create')
      this.showR = await mainHelper.cansee('property-read', 'read')
      this.showU = await mainHelper.cansee('property-update', 'update')
      this.showD = await mainHelper.cansee('property-delete', 'delete')

      if (!this.showU) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Property Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/properties/edit/${this.$route.params.editId}`) return
      console.log('/properties/edit/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/properties/edit/${this.$route.params.editId}`) return
      console.log('/properties/edit/')
      await this.loadData()
    })   
  }
}

</script>
