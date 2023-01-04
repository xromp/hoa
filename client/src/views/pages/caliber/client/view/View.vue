
<template>
  <div id="page-data-view">

      <vx-card title="Client Details" class="mb-base">
        <!-- Avatar -->
        <div class="vx-row">

          <!-- Information - Col 1 -->
          <!-- <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr v-for="(vd, index) in view_data">
                <td class="font-semibold">{{ index }}</td>
                <td>{{ vd }}</td>
              </tr>
            </table>
          </div> -->
          <!-- /Information - Col 1 -->

          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">ClientID</td>
                <td>{{ view_data.ClientID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">LegalName</td>
                <td v-if="view_data.LegalName !== null">{{ view_data.LegalName }}</td>
              </tr>
              <tr>
                <td class="font-semibold">ClientName</td>
                <td v-if="view_data.ClientName !== null">{{ view_data.ClientName }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Website</td>
                <td v-if="view_data.Website !== null">{{ view_data.Website }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Code</td>
                <td>{{ view_data.Code }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Status</td>
                <td v-if="view_data.Status !== null">{{ view_data.Status }}</td>
              </tr>
              <tr>
                <td class="font-semibold">DateCreated</td>
                <td>{{ view_data.DateCreated | date(true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">LastModified</td>
                <td>{{ view_data.LastModified | date(true) }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-user-edit', params: { editId: $route.params.viewId }}" disabled>Edit</vs-button>
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" disabled>Delete</vs-button>
          </div>
        </div>
      </vx-card>

      <div class="vx-row">
        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Office Details" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">OfficialAddress1</td>
                <td>{{ view_data.OfficialAddress1 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialAddress2</td>
                <td>{{ view_data.OfficialAddress2 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialAddress3</td>
                <td>{{ view_data.OfficialAddress3 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialCity</td>
                <td>{{ view_data.OfficialCity }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialCountry</td>
                <td>{{ view_data.OfficialCountry }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialFax</td>
                <td>{{ view_data.OfficialFax }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialPhone</td>
                <td>{{ view_data.OfficialPhone }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialState</td>
                <td>{{ view_data.OfficialState }}</td>
              </tr>
              <tr>
                <td class="font-semibold">OfficialZip</td>
                <td>{{ view_data.OfficialZip }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Billing Details" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">BillingAddress1</td>
                <td>{{ view_data.BillingAddress1 }}</td>
              </tr> 
              <tr>
                <td class="font-semibold">BillingAddress2</td>
                <td>{{ view_data.BillingAddress2 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingAddress3</td>
                <td>{{ view_data.BillingAddress3 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingCity</td>
                <td>{{ view_data.BillingCity }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingCountry</td>
                <td>{{ view_data.BillingCountry }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingFax</td>
                <td>{{ view_data.BillingFax }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingPhone</td>
                <td>{{ view_data.BillingPhone }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingState</td>
                <td>{{ view_data.BillingState }}</td>
              </tr>
              <tr>
                <td class="font-semibold">BillingZip</td>
                <td>{{ view_data.BillingZip }}</td>
              </tr>
            </table>
          </vx-card>
        </div>         
      </div>  

      <vx-card title="Contact Details" class="mb-base">
        <list-tab class="mt-4" />
      </vx-card> 

      <vx-card title="Report" class="mb-base">
        <report class="mt-4" />
      </vx-card>      

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-user-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

  </div>
</template>

<script>
import axios from '@/axios'
import api from '@/caliber-api'
import ListTab from '../../contact/list/List.vue'
import Report from '../../report/Reports.vue'

export default {
  components: {
    ListTab,
    Report
  },
  data () {
    const token = localStorage.usertoken
    return {
      token: token,
      
      //user
      view_data: {
        BillingAddress1: '',
        BillingAddress2: '',
        BillingAddress3: '',
        BillingCity: '',
        BillingCountry: '',
        BillingFax: '',
        BillingPhone: '',
        BillingState: '',
        BillingZip: '',
        ClientID: '',
        ClientName: '',
        Code: '',
        DateCreated: '',
        LastModified: '',
        LegalName: '',
        OfficialAddress1: '',
        OfficialAddress2: '',
        OfficialAddress3: '',
        OfficialCity: '',
        OfficialCountry: '',
        OfficialCounty: '',
        OfficialFax: '',
        OfficialPhone: '',
        OfficialState: '',
        OfficialZip: '',
        Status: '',
        Website: ''
      },
      data_not_found: false
    }
  },
  computed: {
  },
  methods: {
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.email}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/user/delete/${viewId}`, {
              token: this.token
            })
            .then(res => {        
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
              } else {
                this.$router.push({name:'app-user-list'})
                this.showDeleteSuccess()
              }

            })
            .catch(err => {              
              reject(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.data_local = res[0]
        })
      })
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    async loadData() {
      const viewId = this.$route.params.viewId
      // this.view_data = await api.getInvoiceDetails(viewId)
      // const arrDocuments = await api.getDocumentsForInvoice(viewId)

      // console.log('this.view_data ', this.view_data)
      // console.log('arrDocuments ', arrDocuments)

      try {    
        var d = await axios.get('/caliber/api', {
          headers: { 
            'Authorization': this.token,
            'caliber-url': `api/v2/client/${viewId}`
            // 'caliber-url': `api/v2/unitaccount/${viewId}/transactions`
            // clientlist        
            // client/27/clientcontacts
            // client/27/contacts/all
            // client/27/units
            // client/27/vendors
            // client/27/invoices
            // client/27/billingrecords/all
            // client/27/transactionaccounts
          },
        })

        this.view_data = d['data'][0]
        this.loading = false
        console.log('this.view_data ', this.view_data)
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.loading = false
      }       
    }
  },
  created () {
    this.loadData()
  }
}

</script>

<style lang="scss">
#avatar-col {
  width: 10rem;
}

#page-data-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: .8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width:370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }


@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }

}

.avatar-img {
  position: relative;
  width: 230px;
  overflow: hidden;
  padding-top: 230px;
}

.avatar-img img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
}

</style>
