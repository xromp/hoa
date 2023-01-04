<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-role-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="data_not_found===1">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Role" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>
          <vs-tab label="Permission" icon-pack="feather" icon="icon-lock">
            <div class="tab-text">
              <edit-permission class="mt-4" :data="edit_permission" />
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import EditTab from './EditTab.vue'
import EditPermission from '../../user_permission/edit/EditTab.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
    EditTab,
    EditPermission
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
      edit_permission: [],
      data_not_found: 0,
      token: localStorage.usertoken,
      activeTab: 0
    }
  },
  watch: {
  },
  methods: {
    async loadData() {
      const editId = this.$route.params.editId
      const role = await axios.get(`/role/view/${editId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }        
      })

      if(role['data'].length === 0) {
        this.data_not_found = 2
      } else {
        this.data_not_found = 1
        this.edit_data = role['data']
        this.edit_permission  = JSON.parse(role['data']['permission'])
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
        title: 'Loading Role Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      console.log('this.$route.path ', this.$route.path)
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/user-types/edit/${this.$route.params.editId}`) return
      console.log('/user-types/edit/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      console.log('this.$route.path ', this.$route.path)
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/user-types/edit/${this.$route.params.editId}`) return
      console.log('/user-types/edit/')
      await this.loadData()
    })   
  }  
}

</script>
