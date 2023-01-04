
<template>
  <div id="page-data-view">

      <vx-card title="Contacts Details" class="mb-base">
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
                <td class="font-semibold">Client ID</td>
                <td>{{ view_data.ClientID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Contact ID</td>
                <td v-if="view_data.ContactID !== null">{{ view_data.ContactID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Unit Account ID</td>
                <td v-if="view_data.UnitAccountID !== null">{{ view_data.UnitAccountID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Unit ID</td>
                <td v-if="view_data.UnitID !== null">{{ view_data.UnitID }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Display Name</td>
                <td>{{ view_data.DisplayName }}</td>
              </tr>
              <tr>
                <td class="font-semibold">First Name</td>
                <td v-if="view_data.Status !== null">{{ view_data.FirstName1 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Last Name</td>
                <td v-if="view_data.LastName1 !== null">{{ view_data.LastName1 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Date Created</td>
                <td>{{ view_data.DateCreated | date(true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Last Modified</td>
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
          <vx-card title="Phone Details" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Area Code</td>
                <td>{{ view_data['Phones'][0]['AreaCode'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Number</td>
                <td>{{ view_data['Phones'][0]['Number'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Phone ID</td>
                <td>{{ view_data['Phones'][0]['PhoneID'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Phone Type</td>
                <td>{{ view_data['Phones'][0]['PhoneType'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Phone Type Name</td>
                <td>{{ view_data['Phones'][0]['PhoneTypeName'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Ref ID</td>
                <td>{{ view_data['Phones'][0]['RefID'] }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Ref Type</td>
                <td>{{ view_data['Phones'][0]['RefType'] }}</td>
              </tr>              
            </table>
          </vx-card>
        </div> 

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Mailing Address" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Address1</td>
                <td>{{ view_data.MailingAddress.Address1 }}</td>
              </tr> 
              <tr>
                <td class="font-semibold">Address2</td>
                <td>{{ view_data.MailingAddress.Address2 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">AddressID</td>
                <td>{{ view_data.MailingAddress.AddressID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">City</td>
                <td>{{ view_data.MailingAddress.City }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Country</td>
                <td>{{ view_data.MailingAddress.Country }}</td>
              </tr>
              <tr>
                <td class="font-semibold">State</td>
                <td>{{ view_data.MailingAddress.State }}</td>
              </tr>
              <tr>
                <td class="font-semibold">UnitNumber</td>
                <td>{{ view_data.MailingAddress.UnitNumber }}</td>
              </tr>
              <tr>
                <td class="font-semibold">ZipCode</td>
                <td>{{ view_data.MailingAddress.ZipCode }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 
        
      </div>     

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

export default {
  components: {
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
            'caliber-url': `api/v2/contact/${viewId}`
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

        this.view_data = d['data']
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

.font-semibold {
  padding-right:30px;
}

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
