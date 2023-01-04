
<template>
  <div id="page-data-edit">

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-billing-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="edit_data">

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Bill Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <account-receivable-edit-tab
                class="mt-4"
                :data="edit_data"
                v-if="type === 'AR'"/>
              <account-payable-edit-tab
                class="mt-4"
                :data="edit_data"
                v-if="type === 'AP'"/>
            </div>
          </vs-tab>          
        </vs-tabs>

      </div>

    </vx-card>
  </div>
</template>

<script>
import AccountReceivableEditTab from './AccountReceivableEditTab.vue'
import AccountPayableEditTab from './AccountPayableEditTab.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    AccountReceivableEditTab,
    AccountPayableEditTab,
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

      /*
        This property is created for fetching latest data from API when tab is changed

        Please check it's watcher
      */
      activeTab: 0
    }
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
  },
  watch: {
    activeTab () {
      this.fetch_edit_data(this.$route.params.editId)
    }
  },
  methods: {
    fetch_edit_data (editId) {
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.get(`/billing/view/${editId}`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
                this.$router.push({name:'app-billing-list'})
              } else {
                resolve(res['data'])
              }

              this.$vs.loading.close()
            })
            .catch(err => {
              this.$vs.loading.close()
              reject(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          if(typeof res[0] == 'undefined') {
            this.data_not_found = true
          } else {            
            this.edit_data = res[0]
            this.edit_data.approvals = this.edit_data.approval 
              ? this.edit_data.approval.approval_items.sort((a, b) => a.level - b.level) : []
          }
        }).catch(err => {
          if (err.response.status === 404) {
            this.edit_not_found = true
            return
          }
          reject(err) 
        })

      })
    }
  },
  async created () {
    // crud
    this.showL = await mainHelper.cansee('billing-list', 'list')
    this.showC = await mainHelper.cansee('billing-create', 'create')
    this.showR = await mainHelper.cansee('billing-read', 'read')
    this.showU = await mainHelper.cansee('billing-update', 'update')
    this.showD = await mainHelper.cansee('billing-delete', 'delete')

    if (!this.showU) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
    
    this.fetch_edit_data(this.$route.params.editId)
  }
}

</script>
