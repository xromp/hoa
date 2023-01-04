<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.editId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-order-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="data_not_found===1">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab :label="label" icon-pack="feather" icon="icon-user">
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
import common from '@/common'
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
      const {data} = await axios.get(`/order/view/${editId}?formType=${this.approvalType}`, {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.viewedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if(data.length === 0) {
        this.data_not_found = 2
      } else {        
        this.data_not_found = 1
        this.edit_data = data
        this.edit_data.assigned_to = parseInt(this.edit_data.assigned_to)
        this.edit_data.rfp_type = JSON.parse(this.edit_data.rfp_type)
        this.edit_data.questions_to_vendor = JSON.parse(this.edit_data.questions_to_vendor)
        this.edit_data.qoutation = JSON.parse(this.edit_data.qoutation)
        this.edit_data.rfp_recipients = JSON.parse(this.edit_data.rfp_recipients)
        this.edit_data.createdAt = common.formatDate(new Date(this.edit_data.createdAt))
        this.edit_data.rfp_issue_date = this.edit_data.rfp_issue_date === null ? null : common.formatDate(new Date(this.edit_data.rfp_issue_date))
        this.edit_data.approvals = this.edit_data.approval 
          ? this.edit_data.approval.approval_items.sort((a, b) => a.level - b.level) : []

        this.edit_data.maintenance_request_dts.filter((res) => {
          res.start_date = new Date(res.start_date)
          res.start_time = common.formatTime2(new Date('2021-01-01 ' + res.start_time))
          res.end_time = common.formatTime2(new Date('2021-01-01 ' + res.end_time))
        })
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('order-list', 'list')
      this.showC = await mainHelper.cansee('order-create', 'create')
      this.showR = await mainHelper.cansee('order-read', 'read')
      this.showU = await mainHelper.cansee('order-update', 'update')
      this.showD = await mainHelper.cansee('order-delete', 'delete')

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
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  computed: {
    label() {
      return parseInt(this.$route.query.t) === 0 ? 'Maintenance Order Details' : 
      parseInt(this.$route.query.t) === 1 ? 'Work Order Details' : 'RFP Details'
    },
    approvalType() {
      const typeMapping = {
        '0': 'mo',
        '1': 'wo',
        '2': 'rfp',
      };
      return typeMapping[this.$route.query.t];
    },
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/orders/edit/${this.$route.params.editId}`) return
      console.log(`/orders/edit/${this.$route.params.editId}`)
      await this.loadData()
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/orders/edit/${this.$route.params.editId}`) return
      console.log(`/orders/edit/${this.$route.params.editId}`)
      await this.loadData()
    })
  }
}

</script>
