
<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-user-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="edit_data">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Information" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <edit-tab-info class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>
          <vs-tab label="Password Reset" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab-account class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>  
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import EditTabAccount     from './EditTabAccount.vue'
import EditTabInfo     from './EditTabInfo.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    EditTabAccount,
    EditTabInfo
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
      data_not_found: false,
      token: localStorage.usertoken,
      activeTab: 0
    }
  },
  watch: {
    activeTab () {
      this.fetch_edit_data(this.$route.params.editId)
    }
  },
  methods: {
    async loadData() {
      const editId = this.$route.params.editId      
      const {data} = await axios.get(`/user/view/${editId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })      

      if (typeof data[0] === 'undefined') {
        this.data_not_found = true
      } else {
        this.edit_data = data[0]
      }
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      const showP = await mainHelper.cansee(this.$route.meta.slug, 'update')

      if (!showP) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading User Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}

</script>
