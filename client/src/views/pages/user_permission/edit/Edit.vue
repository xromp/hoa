<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-permission-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>
    <vx-card v-if="edit_data">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Details" icon-pack="feather" icon="icon-user">
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
import EditTab     from './EditTab.vue'
import axios from '@/axios'

export default {
  components: {
    EditTab
  },
  data () {
    return {
      edit_data: null,
      data_not_found: false,
      token: localStorage.usertoken,
      activeTab: 0
    }
  },
  watch: {
  },
  methods: {
    async loadData() {
      const editId = this.$route.params.editId
      const result = await axios.get(`/permission/view/${editId}`, {
        headers: { 'Authorization': this.token }
      })

      if(typeof result['data'] === 'undefined') {
        this.data_not_found = true
      } else {
        this.edit_data = result['data']

        for (let i in result['data']) {
          let userModuleId = result['data'][i]['user_module_id']
          this.edit_data[userModuleId] = result['data'][i]
        } 
      }
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('role-list', 'list')
      this.showC = await mainHelper.cansee('role-create', 'create')
      this.showR = await mainHelper.cansee('role-read', 'read')
      this.showU = await mainHelper.cansee('role-update', 'update')
      this.showD = await mainHelper.cansee('role-delete', 'delete')

      if (!this.showU) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Permission Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }  
}

</script>
