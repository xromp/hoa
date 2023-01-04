<template>
    <div id="invoice-page">

        <div class="flex flex-wrap items-center justify-between">
          <vx-input-group class="mb-base mr-3" v-if="false">
            <vs-input v-model="mailTo" placeholder="Email" />

            <template slot="append">
              <div class="append-text btn-addon">
                <vs-button type="border" @click="mailTo = ''" class="whitespace-no-wrap">Send Invoice</vs-button>
              </div>
            </template>
          </vx-input-group>
          <div class="vx-col w-full flex" id="account-manage-buttons">
            
          </div>

          <div class="flex items-center" v-if="permission.ar.update && !view_data.paid">
            <vs-button 
              icon-pack="feather" 
              icon="icon-edit" 
              class="mr-4" 
              :to="{name: 'app-billing-edit', params: { editId: $route.params.viewId }, query: { type: view_data.ledger_type }}" 
              :disabled="!permission.ar.update">
              Edit <!-- crud -->
            </vs-button> 
            <vs-button 
              type="border" 
              color="danger" 
              icon-pack="feather" 
              icon="icon-trash" 
              @click="confirmDeleteRecord" 
              :disabled="!permission.ar.delete"
              v-if="false">Delete
            </vs-button>            
          </div>
          <vs-alert color="success" icon="new_releases" v-if="view_data.paid">
            This invoice was <b>paid</b> by {{ optionalChaning(() => view_data.transaction_log.user.full_name) }} {{paidOn}}
          </vs-alert>
          <div class="flex text-right"  v-if="!view_data.paid && isRecipient && permission.payment.execute">
            <flutterwave-pay-button
              :tx_ref="generateReference()"
              :amount="totalAmount"
              currency='USD'
              payment_options="card,ussd"
              redirect_url=""
              class="vs-component vs-button mb-base mr-3 vs-button-warning vs-button-filled includeIcon"
              style=""
              :meta="JSON.stringify(view_data)"
              :customer="flutterwave.customer"
              :customizations="flutterwave.customizations"
              :callback="makePaymentCallback"
              :onclose="closedPaymentModal">
              Pay via Flutterwave
            </flutterwave-pay-button>
            <vx-input-group class="mb-base mb-base mr-3">
              <template slot="prepend">
                <div class="prepend-text btn-addon">
                  <vs-button 
                    icon-pack="feather" 
                    icon="icon-dollar-sign" 
                    color="success"
                    @click="payNow">
                    Pay Now
                  </vs-button>
                </div>
              </template>

              <v-select 
                :options="getOptionPaymentMethods"
                :reduce="name => name.id"
                label="name" 
                v-model="paymentMethodId" 
                name="paymentMethodId" 
                class="inputx"
                style="width: 300px"
                placeholder="Add Other Payment Method"/>
            </vx-input-group>
            <vs-button 
              class="mb-base mr-3" 
              icon-pack="feather" 
              icon="icon icon-file" 
              @click="printInvoice">
              Print</vs-button>
          </div>      
        </div>
        <vx-card id="invoice-container">

            <!-- INVOICE METADATA -->
            <div class="vx-row leading-loose p-base">
              <div class="vx-col w-1/3 mt-12">
                <div v-if="view_data.ledger_type === 'AR'">
                  <p><strong>{{optionalChaning(() => view_data.property.name)}}</strong></p>
                  <div>
                      <p>{{ optionalChaning(() => view_data.property.BillingAddress1) }}</p>
                      <p>{{ optionalChaning(() => view_data.property.BillingAddress2) }}</p>
                      <p>{{ optionalChaning(() => view_data.property.BillingAddress3) }}</p>
                      <p>{{ `${optionalChaning(() => view_data.property.BillingCity)} ${optionalChaning(() => view_data.property.BillingZip)}, ${optionalChaning(() => view_data.property.country_master.name)}` }}</p>
                  </div>    
                </div>
                <div v-else>
                  <div v-if="vendorDetails">
                    <div>
                        <strong><p>{{ vendorDetails.business_name }}</p></strong>
                        <p>{{ vendorDetails.billing_address_line_1 }}</p>
                        <p>{{ vendorDetails.billing_city }}</p>
                        <p>{{ `${vendorDetails.business_state} ${vendorDetails.business_zip}, ${optionalChaning(() =>vendorDetails.country_master.name)}` }}</p>
                    </div>
                    <div class="invoice__recipient-contact ">
                        <p class="flex items-center">
                            <feather-icon icon="MailIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2">{{ vendorDetails.email }}</span>
                        </p>
                        <p class="flex items-center">
                            <feather-icon icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2">{{ vendorDetails.phone }}</span>
                        </p>
                    </div>
                  </div>
                  <div v-else><i>-- No vendor account found --.</i></div>
                </div>
              </div>
              <!--   <div class="vx-col w-1/2 mt-base">
                    <img src="@/assets/images/logo/logo-axp.png" alt="vuexy-logo">
                </div> -->
                <div class="vx-col w-1/3"/>
                <div class="vx-col w-1/3 text-right">
                    <h3>Invoice</h3>
                    <div class="invoice__invoice-detail mt-6">
                      <p>
                        <span> <strong>{{ view_data.ledger_type === 'AR' ? optionalChaning(() => view_data.bill_lines[0].bill_type.name) : "" }} </strong></span>
                      </p>
                      <p>
                        <span><strong>Unit No:</strong> {{ optionalChaning(() =>view_data.unit.number) || "-" }} </span>
                      </p>
                      <p>
                        <span><strong>Invoice no. </strong></span>
                        <span>{{ view_data.invoice_no || 'N/A' }}</span>
                      </p>
                      <p>
                        <span><strong>Invoice Date </strong></span>
                        <span>{{ new Date(view_data.createdAt) | date(true) }}</span>
                      </p>
                      <p>
                        <span><strong>Due Date </strong></span>
                        <span>{{ new Date(view_data.due_date) | date(true) }}</span>
                      </p>
                    </div>
                </div>
                
                <div class="vx-col w-1/2 mt-12">
                  <p><strong>Bill To</strong></p>
                  <div v-if="view_data.ledger_type === 'AR'">
                    <div v-if="Object.keys(recipientDetails).length">
                      <div>
                          <p>{{ recipientDetails.full_name }}</p>
                          <p>{{ recipientDetails.address_line_1 }}</p>
                          <p>{{ recipientDetails.address_line_2 }}</p>
                          <p>{{ `${recipientDetails.province} ${recipientDetails.postcode}, ${optionalChaning(() =>recipientDetails.country_master.name)}` }}</p>
                      </div>
                      <div class="invoice__recipient-contact ">
                          <p class="flex items-center">
                              <feather-icon icon="MailIcon" svgClasses="h-4 w-4"></feather-icon>
                              <span class="ml-2">{{ recipientDetails.email }}</span>
                          </p>
                          <p class="flex items-center">
                              <feather-icon icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                              <span class="ml-2">{{ recipientDetails.phone1 }}</span>
                          </p>
                      </div>
                    </div>
                    <div v-else><i>-- No user account has been assigned on this unit. --</i></div>
                  </div>
                  <div v-else>
                    <p>{{optionalChaning(() => view_data.property.name)}}</p>
                    <div>
                        <p>{{ optionalChaning(() => view_data.property.BillingAddress1) }}</p>
                        <p>{{ optionalChaning(() => view_data.property.BillingAddress2) }}</p>
                        <p>{{ optionalChaning(() => view_data.property.BillingAddress3) }}</p>
                        <p>{{ `${optionalChaning(() => view_data.property.BillingCity)} ${optionalChaning(() => view_data.property.BillingZip)}, ${optionalChaning(() => view_data.property.country_master.name)}` }}</p>
                    </div> 
                  </div>
                </div>
                <div id="attach-file" class="vx-col w-1/2 mt-12">
                  <div style="float:right">
                    <p class="flex items-center"><strong>Attached file(s)</strong></p>
                    <read-file 
                      :folderPath="folderPath" 
                      :folderId="20"
                      class="vx-col mb-4" />
                  </div>
                </div>
            </div>

            <!-- INVOICE CONTENT -->
            <div>
              <ag-grid-vue
                style="margin: auto; text-alignment:center; color: #626262"
                ref="agGridTable"
                :key="forceRender"
                :gridOptions="gridOptions"
                class="ag-theme-material w-100 my-4"
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                :rowData="optionalChaning(() => view_data.bill_lines.map((e, i) => ({ ...e, paid: view_data.paid, item_no: i+1 })))"
                domLayout="autoHeight"
                colResizeDefault="shift"
                :animateRows="true"
                :floatingFilter="false"
                :suppressPaginationPanel="true"
                :enableRtl="$vs.rtl"
                rowHeight=30>
              </ag-grid-vue>
                <vs-table hoverFlat class="w-1/2 ml-auto mt-4">
                  <vs-tr>
                    <vs-th class="pointer-events-none">TOTAL</vs-th>
                    <vs-td>{{ totalAmount }} USD
                    </vs-td>
                  </vs-tr>
                  <template slot="no-data"><div></div></template>
                </vs-table>
            </div>
            <div class="vx-row leading-loose">
            <div class="vx-col w-1/2">
              <strong>Produced by:</strong> <img src="@/assets/images/logo/logo-axp.png" alt="vuexy-logo">
            </div>

            <!-- INVOICE FOOTER -->
            <div class="vx-col w-1/2 approval-widget">
              <approval 
                :items="approvals" 
                :reference_id="view_data.id"
                :reference_no="view_data.invoice_no"
                type="bill"
                class="mb-4" />
            </div>
          </div>
        </vx-card>

        <confirmation-payment 
          ref='confirmation-payment' 
          :payment="{ ...view_data, ...selectedPaymentMethod, paymentMethodId, billId: $route.params.viewId }"
        />
        <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
          <span>Data record with id: {{ $route.params.viewId }} not found. </span>
          <span>
            <span>Check </span><router-link :to="{name:'app-billing-list'}" class="text-inherit underline">All Data</router-link>
          </span>
        </vs-alert>        
    </div>
</template>

<script>
import Vue from 'vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import { optionalChaning } from '@/utils/DataHelper';
import EventBus from '@/EventBus'
import Approval from '../../../components/approval-widget/approval'
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'
import moment from 'moment';

import ReadFile from '../../../components/files/ReadFile.vue'
import ConfirmationPayment from './ConfirmationPayment.vue';
import CellRendererActions from './cell-renderer/CellRendererActions.vue'

const jwt = require('jsonwebtoken')

export default {
  components: {
    Approval,
    ReadFile,

    AgGridVue,
    vSelect,
    CellRendererActions,
    ConfirmationPayment,
  },
  data () {
    const token = localStorage.usertoken
    return {
      // crud
      permission: { 
        ar: {}, 
        ap: {},
        payment: {},
      },

      forceRender: 0,
      paymentMethodId: '',
      optionPaymentMethods: [],
      selectedPaymentMethod: {},
      roleName: localStorage.selectedRoleVal,
      token: token,
      mailTo: '',
      showPaymentConfirmation: false,
      currentComponent: '',
      view_data: {
        unit_resident_id: '',
        bill_type_id: '',
        amount: '',
        due_date: '',
        generated_date: '',
        from_date: '',
        to_date: '',
        description: '',
        payer_name: '',
        payer_email: '',
        payer_address: '',
        payer_phone: '',
        payee_name: '',
        payee_email: '',
        payee_phone: '',
        payee_address: '',
        status: '',
        bill_config_id: '',
        unit_id: '',
        property_id: '',
        id: 0,
        invoice_no: '',
      },
      approvals: [],
      recipientDetails: {},
      vendorDetails: {},
      data_not_found: false,
      billings: [],
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      columnDefs: [
        {
          headerName: 'No',
          field: 'item_no',
          width: 100,
          filter: true,
        },
        {
          headerName: 'Description',
          field: 'description',
          width: 400,
          filter: true,
        },
        {
          headerName: 'Amount',
          field: 'amount',
          filter: true,
          cellStyle: {textAlign: "right"},
          type: 'numericColumn',
        }
      ],
    }
  },
  computed: {
    flutterwave() {
      return {
        customizations: {  
          title: `${optionalChaning(() => this.view_data.bill_lines[0].bill_type.name)}`,
          description: 'Customization Description', 
          logo: `${location.origin}/logo-axp.png`,
        },
        customer: {
          name: optionalChaning(() => this.recipientDetails.full_name),
          email: optionalChaning(() => this.recipientDetails.email),
          phone_number: optionalChaning(() => this.recipientDetails.phone1), 
        },
        redirect_url: `${location.origin}/billings/view`,
      }
    },
    totalAmount() {
      const options = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      };
      const amount = this.view_data.bill_lines.reduce((acc, obj) => { return parseFloat(acc) + parseFloat(obj.amount) }, 0);
      return Number(amount).toLocaleString('en', options);
    },
    getOptionPaymentMethods() {
      const type = {
        cc: 'Credit Card',
        ach: 'e-Check',
      }
      const payments = this.optionPaymentMethods
        .map(e => ({...e, name: `${type[e.method]} ${('************'+e.paymentReference.substr(-4))}`}));
      return [{ name: 'Add Other Payment Method' }, ...payments ];
    },
    paidOn() {
      return moment(this.view_data.transaction_log.createdAt).format('LLL');
    },
    folderPath() {
      return `docs/billing/${this.$route.params.viewId}`
    },
    isRecipient() {
      const { id } = JSON.parse(localStorage.userAllData);
      try {
        return this.view_data.unit.unit_users.find(({ user_id }) => user_id === id);  
      } catch (error) {
        return false;
      }
    },
    optionalChaning() {
      return optionalChaning;
    }
  },
  methods: {
     async makePaymentCallback(paymentCallback) {
       const data = {
         billId: this.$route.params.viewId,
        paymentCallback,
       }
       await axios.post(`/payment/flutterwave-payment-callback`, data, {
        headers: { 'Authorization': this.token }
      }) 
    },
    closedPaymentModal() {
      this.$router.go(0);
    },
    generateReference(){
      return this.$route.params.viewId;
    },
    payNow() {
      if (this.paymentMethodId) {
        const paymentMethod = this.optionPaymentMethods.find(({ id }) => id === this.paymentMethodId);
        this.selectedPaymentMethod = paymentMethod;
        return this.$refs['confirmation-payment'].show()
      } else {
        return this.$router.push({name: 'caliber-financial-new', params: { billId: this.$route.params.viewId }});
      }
    },
    printInvoice () {
      window.print()
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.invoice_no}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/billing/delete/${viewId}`, {
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
                this.$router.push({name:'app-billing-list'})
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
    async loadUserPem() {
      var decoded = jwt.verify(this.token, 'secret')  
      const viewId = decoded.id
      var d = await axios.get(`/user/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      }) 
      const userD = d['data'][0]['user_role']['val']
      this.roleName = localStorage.selectedRoleVal //userD

      console.log('this.roleName ', this.roleName)
    },
    async loadData () {
      try {
        const viewId = this.$route.params.viewId
        const { data } = await axios.get(`/billing/view/${viewId}`, {
          headers: { 'Authorization': this.token }
        })
        this.$vs.loading.close();
        this.view_data = data[0];
        this.recipientDetails = optionalChaning(()=> this.view_data.unit.unit_users[0].user);
        this.vendorDetails = optionalChaning(() => this.view_data.vendor);
        this.view_data.approval
          ? this.view_data.approval.approval_items
            .sort((a, b) => a.level - b.level)
            .map((v, i) =>this.$set(this.approvals, i, v))
          : [];
        this.forceRender +=1;
      } catch (error) {
        console.error({error})
      }
    },
    async loadPaymenyMethod () {
      const { data } = await axios.get(`/payment-method/get-current-user`, {
        headers: { 'Authorization': this.token }
      })
      this.optionPaymentMethods = data;
      this.paymentMethodId = this.optionPaymentMethods.length
        ? this.optionPaymentMethods.find(e => e.isDefault)['id'] 
        : null;
    },
  },
  async mounted () {
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
    await this.loadData()
    await this.loadPaymenyMethod();
    this.$emit('setAppClasses', 'invoice-page')
  },
  async created () {
    // crud

    this.permission = {
      ar: {
        list: await mainHelper.cansee('account-receivable-list', 'list'),
        create: await mainHelper.cansee('account-receivable-create', 'create'),
        read: await mainHelper.cansee('account-receivable-read', 'read'),
        update: await mainHelper.cansee('account-receivable-update', 'update'),
        delete: await mainHelper.cansee('account-receivable-delete', 'delete'),
      },
      ap: {
        list: await mainHelper.cansee('account-payable-list', 'list'),
        create: await mainHelper.cansee('account-payable-create', 'create'),
        read: await mainHelper.cansee('account-payable-read', 'read'),
        update: await mainHelper.cansee('account-payable-update', 'update'),
        delete: await mainHelper.cansee('account-payable-delete', 'delete'),
      },
      payment: {
        execute: await mainHelper.cansee('payment-execute', 'execute'),
      }
    };
    this.$set(this.columnDefs, 2, { ...this.columnDefs[2], width: this.permission.ar.update ? 400: 600 });
    this.$set(this.columnDefs, 3, { ...this.columnDefs[3], hide: !this.permission.ar.update });
    
    EventBus.$on('loadBill', async () => await this.loadData())
    if (!this.this.permission.ar.read) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
  }  
}
</script>

<style lang="scss">
.vs-table--tbody {
  z-index: 0!important;
}
@media print {
  .invoice-page {
    * {
      visibility: hidden;
    }

    .vs-table--tbody-table .tr-values td,
    p {
      font-size: 10px;
    }

    #content-area {
      margin: 0 !important;
    }

    .vs-con-table {
      .vs-con-tbody {
        overflow: hidden !important;
      }
    }
    #attach-file,
    .approval-widget {
      display: none;
    }

    #invoice-container,
    #invoice-container * {
      visibility: visible;
    }
    #invoice-container {
      position: absolute;
      left: 0;
      top: 0;
      box-shadow: none;
    }

    .ag-theme-material {
      font-size: 10px;
    }

    div[col-id=item_no] {
      width: 80px !important;
    }

    div[col-id=description] {
      width: 200px !important;
      left: 50px !important;
    }

    div[col-id=amount] {
      width: 200px !important;
      left: 400px !important;
    }
  }
}

@page {
  size: auto;
  margin: 0;
}
.vs-table--not-data {
  display: none;
}
.ag-theme-material .ag-cell {
  line-height: 32px;
}
</style>
