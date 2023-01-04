
<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-user-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="data_not_found===1">
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
import EventBus from '@/EventBus'

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
      this.$vs.loading()
      const editId = this.$route.params.editId
      const {data} = await axios.get(`/user/view/${editId}`, {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if (typeof data[0] === 'undefined') {
        this.data_not_found = 2
      } else {
        this.data_not_found = 1
        this.edit_data = data[0];
        // this.edit_data['user_roles'] = this.mapUserOrgRole(this.edit_data.user_org_roles);
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    mapUserOrgRole(roles) {
      if (!roles.length) 
      return [{
        pmc_id: '',
        properties: '',
        user_role_id: '',
      }];

      const groupsByRole = roles.reduce((acc, value) => {
        if (acc.length 
            && acc[acc.length - 1][0].user_role_id === value.user_role_id) {
          acc[acc.length - 1].push(value);
        } else {
          acc.push([value]);
        }
        return acc;
      }, []);
      return groupsByRole.map(e => ({ 
          ...e[0], 
          ...JSON.parse(e[0].other_data_obj),
          pmc_id: parseInt(e[0].pmc_id),
        }));
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('user-list', 'list')
      this.showC = await mainHelper.cansee('user-create', 'create')
      this.showR = await mainHelper.cansee('user-read', 'read')
      this.showU = await mainHelper.cansee('user-update', 'update')
      this.showD = await mainHelper.cansee('user-delete', 'delete')

      if (!this.showU) {
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
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/users/edit/${this.$route.params.editId}`) return
      console.log('/users/edit/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/users/edit/${this.$route.params.editId}`) return
      console.log('/users/edit/')
      await this.loadData()
    })   
  }
}

</script>
