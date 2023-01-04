<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-portfolio-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert> 

    <vx-card v-if="data_not_found===1">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Parent Organization Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>
          <vs-tab label="Settings" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <setting-edit-tab class="mt-4" :data="JSON.parse(edit_data.fuze_obj)" />
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import EditTab     from './EditTab.vue'
import SettingEditTab from './SettingEditTab.vue';
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    EditTab,
    SettingEditTab,
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
      const editId = this.$route.params.editId
      const {data} = await axios.get(`/user-org/portfolio/view/${editId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if (data[0].length === 0) {
        this.data_not_found = 2
        throw new Error('Unable to find Parent Organization')
      } else {
        this.data_not_found = 1
        this.edit_data = data[0]
      }
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('portfolio-list', 'list')
      this.showC = await mainHelper.cansee('portfolio-create', 'create')
      this.showR = await mainHelper.cansee('portfolio-read', 'read')
      this.showU = await mainHelper.cansee('portfolio-update', 'update')
      this.showD = await mainHelper.cansee('portfolio-delete', 'delete')

      if (!this.showU) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      setTimeout(() => { this.$vs.loading.close() },3000)
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Parent Org Page',
        text: err.toString('utf8')
      })
      setTimeout(() => { this.$vs.loading.close() },3000)
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}

</script>
