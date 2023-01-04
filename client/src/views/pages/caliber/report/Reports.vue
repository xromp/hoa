
<template>
  <div id="page-data-edit">
    <vx-card>

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs class="tab-action-btn-fill-conatiner">

          <vs-tab label="Balance Sheet" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <BalanceSheetReport></BalanceSheetReport>
            </div>
          </vs-tab>

          <vs-tab label="Income Statement" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <IncomeStatementReport></IncomeStatementReport>
            </div>
          </vs-tab>

          <vs-tab label="Maintenance Requests" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <MaintenanceReport></MaintenanceReport>
            </div>
          </vs-tab>   

          <vs-tab label="Delinquency" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <DelinquencyReport></DelinquencyReport>
            </div>
          </vs-tab> 

          <vs-tab label="Tasks" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <TasksReport></TasksReport>
            </div>
          </vs-tab> 

          <vs-tab label="Management" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <ManagementReport></ManagementReport>
            </div>
          </vs-tab> 
        </vs-tabs>

      </div>

    </vx-card>

  </div>
</template>

<style scoped>
  .vs-tab {
    color: lightgray !important;
    border: 2px solid lightgray;
    border-bottom: 0px;
    border-radius: 10px 10px 0px 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 10px;
  }

  .vs-tab__indicator {
    display: none !important;
  }

  .vs-tab--active {
    color: white !important;
    background: #040456;
  }

  .vs-separator--horizontal {
    height: 7px;
    background: #040456; 
  }
</style>

<script>
import api from '@/caliber-api'
import MaintenanceReport from '../../../../components/caliber/MaintenanceReport.vue'
import DelinquencyReport from '../../../../components/caliber/DelinquencyReport.vue'
import TasksReport from '../../../../components/caliber/TasksReport.vue'
import BalanceSheetReport from '../../../../components/caliber/BalanceSheetReport.vue'
import IncomeStatementReport from '../../../../components/caliber/IncomeStatementReport.vue'
import ManagementReport from '../../../../components/caliber/ManagementReport.vue'
import mainHelper from '@/mainHelper'

export default {
  components: {
    BalanceSheetReport,
    IncomeStatementReport,
    MaintenanceReport,
    DelinquencyReport,
    TasksReport,
    ManagementReport
  },
  props: ['id'],

  data () {
    return {
      token: localStorage.usertoken,
      tab: 'bs',
      search: '',
      headers: [
        {
          text: 'Date',
          align: 'left',
          sortable: true,
          value: 'PostingDate'
        },
        {
          text: 'Description',
          align: 'left',
          sortable: true,
          value: 'Description'
        },
        {
          text: 'Amount',
          align: 'left',
          sortable: true,
          value: 'Amount'
        },
        {
          text: 'Balance',
          align: 'left',
          sortable: true,
          value: 'Balance'
        },
        {
          text: 'TAcctID',
          align: 'left',
          sortable: true,
          value: 'TAcctID'
        }
      ],
      loading: true,
      arrItems: [],
      arrAccounts: [],
      arrTransactions: [],
      model: {},
      dialog: false
    }
  },
  async created () {
    await mainHelper.auth(this.token)
    this.refresh()
  },
  methods: {
    async refresh () {
      //console.log("inside refersf");
      this.loading = false
      return
      this.loading = true
      var intUnitId = this.id
      this.arrAccounts = await api.getUnitAccounts(intUnitId)
      if (this.arrAccounts.length > 0) {
        var obj1stAccount = this.arrAccounts[0]
        this.arrTransactions = obj1stAccount.arrTransactions
      }
      //this.arrItems = this.objModel.arrLevels;
      console.log('inside refersf')
      this.loading = false
    },
    async populatePostToEdit (post) {
      this.model = Object.assign({}, post)
    },
    async savePost () {
      if (this.model.id) {
        await api.updatePost(this.model.id, this.model)
      } else {
        await api.createPost(this.model)
      }
      this.model = {} // reset form
      await this.refresh()
    },
    async deletePost (id) {
      if (confirm('Are you sure you want to delete this post?')) {
        // if we are editing a post we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deletePost(id)
        await this.refresh()
      }
    },
    async showTransactions (intAccountId) {
      this.loading = true
      this.arrTransactions = await api.getUnitAccountTransactions(intAccountId)
      this.loading = false
    }
  }
}
</script>
