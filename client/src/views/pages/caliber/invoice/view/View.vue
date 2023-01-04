
<template>
  <div id="page-data-view">

      <vx-card title="Invoice Details" class="mb-base">
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
                <td class="font-semibold">Payee Name</td>
                <td>{{ view_data.PayeeName }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Contact Address</td>
                <td v-if="view_data.ContactAddress !== null">{{ view_data.ContactAddress.OneLine }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Current Status</td>
                <td>{{ view_data.CurrentStatusText }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Paid Date</td>
                <td>{{ view_data.PaidDate }}</td>
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
          <vx-card title="Account Information" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Invoice ID</td>
                <td>{{ view_data.InvoiceID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Client ID</td>
                <td>{{ view_data.ClientID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Invoice Number</td>
                <td>{{ view_data.InvoiceNumber }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Amount</td>
                <td>{{ view_data.Amount }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Payment CC ID</td>
                <td>{{ view_data.PaymentCCID }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Amount Paid</td>
                <td>{{ view_data.AmountPaid }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Remaining Balance</td>
                <td>{{ view_data.RemainingBalance }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Date Created</td>
                <td>{{ view_data.DateCreated }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Last Modified</td>
                <td>{{ view_data.LastModified }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Other Details" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Manual Payment Date</td>
                <td>{{ view_data.ManualPaymentDate }}</td>
              </tr> 
              <tr>
                <td class="font-semibold">Invoice Date</td>
                <td>{{ view_data.InvoiceDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Due Date</td>
                <td>{{ view_data.DueDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Received Date</td>
                <td>{{ view_data.ReceivedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Validated Date</td>
                <td>{{ view_data.ValidatedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">On Hold Date</td>
                <td>{{ view_data.OnHoldDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">AP Approved Date</td>
                <td>{{ view_data.APApprovedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Mgr Approved Date</td>
                <td>{{ view_data.MgrApprovedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Board Approved Date</td>
                <td>{{ view_data.BoardApprovedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Ready To Pay Date</td>
                <td>{{ view_data.ReadyToPayDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Rejected Date</td>
                <td>{{ view_data.RejectedDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Rejected By Name</td>
                <td>{{ view_data.RejectedByName }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Rejected Reason</td>
                <td>{{ view_data.RejectedReason }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Posting Date</td>
                <td>{{ view_data.PostingDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Void Date</td>
                <td>{{ view_data.VoidDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Sch Start Date</td>
                <td>{{ view_data.SchStartDate }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Sch End Date</td>
                <td>{{ view_data.SchEndDate }}</td>
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
        email: '',
        first_name: '',
        last_name: '',
        is_activated: '',
        password: '',
        profile_json: '',
        phone1: '',
        dob: '',
        middle_name: '',
        phone2: '',
        salutation_id: '',
        suffix: '',
        notes: '',
        avatar_filename: '',
        city: '',
        country_id: '',
        address_line_1: '',
        province: '',
        address_line_2: '',
        postcode: '',
        user_role_id: '',
        user_role: {
          name: ''
        }
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
      this.view_data = await api.getInvoiceDetails(viewId)
      const arrDocuments = await api.getDocumentsForInvoice(viewId)

      console.log('this.view_data ', this.view_data)
      console.log('arrDocuments ', arrDocuments)
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
