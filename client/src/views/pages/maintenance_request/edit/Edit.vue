<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-maintenance-requsts-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>
    <vx-card v-if="edit_data">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Maintenance Maintenance Details" icon-pack="feather" icon="icon-user">
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
import common from '@/common'
import mainHelper from '@/mainHelper' //crud

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
      const {data} = await axios.get(`/maintenance/view/${editId}`, {
        headers: { 
          'Authorization': this.token
        }
      })

      if(typeof data === 'undefined') {
        this.data_not_found = true
      } else {
        this.edit_data = data
        this.edit_data.assigned_to = JSON.parse(this.edit_data.assigned_to)
        this.edit_data.rfp_type = JSON.parse(this.edit_data.rfp_type)
        this.edit_data.questions_to_vendor = JSON.parse(this.edit_data.questions_to_vendor)
        this.edit_data.qoutation = JSON.parse(this.edit_data.qoutation)
        this.edit_data.createdAt = common.formatDate(new Date(this.edit_data.createdAt))
        this.edit_data.rfp_issue_date = this.edit_data.rfp_issue_date === null ? null : common.formatDate(new Date(this.edit_data.rfp_issue_date))
        this.edit_data.maintenance_request_dts.filter((res) => {
          res.start_date = new Date(res.start_date)
          res.start_time = common.formatTime2(new Date('2021-01-01 ' + res.start_time))
          res.end_time = common.formatTime2(new Date('2021-01-01 ' + res.end_time))
        })           
      }
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('maintenance-list', 'list')
      this.showC = await mainHelper.cansee('maintenance-create', 'create')
      this.showR = await mainHelper.cansee('maintenance-read', 'read')
      this.showU = await mainHelper.cansee('maintenance-update', 'update')
      this.showD = await mainHelper.cansee('maintenance-delete', 'delete')

      if (!this.showU) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Maintenance Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}

</script>
