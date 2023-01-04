<template>
<div>
  <div class="vx-row">
    <!-- LEFT COL -->
    <div class="vx-col lg:w-2/3 w-full">
      <vx-card title="Credit Card Payment Details" class="mb-base">

        <form data-vv-scope="add-new-address">
            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.FirstName"
                    label="First Name*"
                    :rules="nameRules"
                    class="w-full mt-5"
                    :danger="firstNameR"
                    :danger-text="firstNameRM"
                  ></vs-input>
                </div>
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.LastName"
                    label="Last Name*"
                    :rules="nameRules"
                    class="w-full mt-5"
                    :danger="lastNameR"
                    :danger-text="lastNameRM"
                  ></vs-input>
                </div>
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.EmailAddress"
                    label="Email Address*"
                    :rules="nameRules"
                    class="w-full mt-5"
                    :danger="emailAddressR"
                    :danger-text="emailAddressRM"
                  ></vs-input>
                </div>                
            </div>

            <div class="vx-row">
              <div class="vx-col w-full mt-5">
                  <label class="vs-input--label">Address *</label>
                  <vue-google-autocomplete
                    id="address"
                    name="address"
                    v-model="objPayment.address"
                    aria-describedby="address-feedback"
                    class="vs-inputx vs-input--input normal w-full "
                    style="border: 1px solid rgba(0, 0, 0, 0.2)"
                    placeholder=""
                    types=address
                    ref=address    
                    v-validate="'required'"
                    v-on:placechanged="getAddressDataLine1"
                  ></vue-google-autocomplete>
              </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-select
                    autocomplete
                    label="Card Type*"
                    v-model="objPayment.CardType"
                    class="w-full mt-5"
                    :danger="cardTypeR"
                    :danger-text="cardTypeRM"
                    >
                    <vs-select-item :key="index" :value="item.name" :text="item.name" v-for="(item,index) in arrCardTypes" />
                  </vs-select>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.CardNumber"
                    label="Card Number*"
                    required
                    :rules="cardRules"
                    :error-message="errCard"
                    :error="isValidVal"
                    class="w-full mt-5"
                    :danger="cardR"
                    :danger-text="cardRM"
                  ></vs-input>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.ExpirationMonth"
                    label="Expiration Month*"
                    :rules="monthRules"
                    class="w-full mt-5"
                    :danger="monthR"
                    :danger-text="monthRM"
                  ></vs-input>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.ExpirationYear"
                    label="Expiration Year*"
                    required
                    :rules="yearRules"
                    class="w-full mt-5"
                    :danger="yearR"
                    :danger-text="yearRM"
                  ></vs-input>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-model="objPayment.CVV"
                    label="CVV*"
                    :rules="cvvRules"
                    class="w-full mt-5"
                    :danger="cvvR"
                    :danger-text="cvvRM"
                  ></vs-input>
                </div>
            </div>

            <!-- <vs-button 
              class="mt-6 ml-auto flex" 
              @click.prevent="handleSubmit">
              Pay Now
            </vs-button> -->
        </form>
      </vx-card>
    </div>

    <!-- RIGHT COL -->
    <div class="vx-col lg:w-1/3 w-full">
      <vx-card title="Invoice Details" >
        <div v-if="view_data.vendor">
            <p class="my-4">{{view_data.vendor.business_name}}</p>
            <p>{{ view_data.vendor.billing_address_line_1 }}</p>
            <p>{{ view_data.vendor.billing_city }}</p>
            <p>{{ view_data.vendor.billing_state }}</p>
            <p>{{ view_data.vendor.billing_country }}</p>
            <p>{{ view_data.vendor.billing_zip }}</p>

            <p class="my-4">{{view_data.vendor.billing_email}}</p>
            <p>{{view_data.vendor.billing_phone}}</p>
        </div>

        <vs-divider />

        <div class="vx-col w-1/1 text-left">
          <div class="invoice__invoice-detail mt-6">
              <h6>INVOICE NO.</h6>
              <p>{{ objPayment.invoice_no }}</p>

              <h6 class="mt-4">INVOICE DATE</h6>
              <p>{{ objPayment.createdAt }}</p>
          </div>
        </div>

        <vs-table hoverFlat class="w-1/1 ml-auto mt-4 mb-6" :data="objPayment.Amount">
            <vs-tr>
                <vs-th class="pointer-events-none">SUBTOTAL</vs-th>
                <vs-td>{{ objPayment.SubAmount }} USD</vs-td>
            </vs-tr>
            <vs-tr>
                <vx-tooltip
                  color="transaction-fee"
                  position="left">
                  <vs-th>
                    TRANSACTION FEE
                    <vs-avatar color="warning" text="?" class="cursor-pointer"/>
                  </vs-th>
                </vx-tooltip>
                <vs-td>{{ fee(objPayment.SubAmount) }} USD</vs-td>
            </vs-tr>
            <vs-tr>
                <vs-th class="pointer-events-none">TOTAL</vs-th>
                <vs-td>{{ objPayment.Amount }} USD</vs-td>
            </vs-tr>
        </vs-table>
        <ul class="vs-component vs-con-table w-1/1 ml-auto mt-4 mb-6 hoverFlat vs-table-primary">
          <li>
            <vs-checkbox v-model="objPayment.savePaymentMethod" class="mb-2">Save Payment Method (for future payments)</vs-checkbox>
          </li>
          <li>
            <vs-checkbox v-model="objPayment.isDefault">Make Default</vs-checkbox>
          </li>
        </ul>
        <vs-button class="w-full" @click="handleSubmit">Pay Now</vs-button>
      </vx-card>
    </div>
  </div>
</div>
</template>

<style scoped>
  @media only screen and (max-width: 575px) {
    .txtTotal {
      font-size: 35px
    }
  }
</style>

<script>
import api from '@/caliber-api'
import ViewParent from "@/components/caliber/ViewParent"
import PaymentOverlay from '@/components/caliber/PaymentOverlay.vue'
import axios from '@/axios'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

let alerts = ''

export default {  
  props: ['id'],
  components: {
    PaymentOverlay,
    VueGoogleAutocomplete
  },
  extends:ViewParent,
  data () {
    return {
      token: localStorage.usertoken,
      amountR: null,
      amountRM: null,
      firstNameR: null,
      firstNameRM: null,
      emailAddressR: null,
      emailAddressRM: null,
      lastNameR: null,
      lastNameRM: null,
      cardTypeR: null,
      cardTypeRM: null,
      cardR: null,
      cardRM: null,
      monthR: null,
      monthRM: null,
      yearR: null,
      yearRM: null,
      cvvR: null,
      cvvRM: null,
      errCard: null,
      transaction: {
        cc: { rate: 0.0295, additional: 2.00 },
        ach: { rate: 0.015, additional: 2.00 }
      },

      objModel2 : {
        userId: '',
        invoiceId: '',
        type: '',
        amount: 0,
        status: ''
      },
      blnLoading: false,
      name: '',
      loading: true,
      blnIsPaymentInProgress: false,
      amountRules: [
        v => !!v || 'Amount is required',
        v => parseInt(v) || 'Amount must be numeric'
      ],
      cardTypeRules: [v => !!v || 'Card Type is required'],

      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 2) || 'Name must be more than 2 characters'
      ],
      cardRules: [
        v => !!v || 'Card is required',
        v => parseInt(v) || 'Card number must be numeric'
      ],
      monthRules: [
        v => !!v || 'Expiry Month is required',
        v => parseInt(v) || 'Expiry Month must be numeric',

        v => (v && v <= 12) || 'Must be between 1 to 12'
      ],
      yearRules: [
        v => !!v || 'Expiry Year is required',
        v => parseInt(v) || 'Expiry Year must be numeric',

        v => (v && parseInt(v) >= 19) || 'Must be 2019 or higher'
      ],
      cvvRules: [
        v => !!v || 'CVV is required',
        v => parseInt(v) || 'CVV must be numeric',

        v =>
          (v && (v.length == 3 || v.length == 4)) || 'CVV Must have 3-4 digits'
      ],
      zipcodeRules: [],
      arrCardTypes: [
        {name: 'Visa'}, 
        {name: 'MasterCard'},
        {name: 'American Express'},
        {name: 'Discover'}
      ],
      objPayment: {
        savePaymentMethod: true,
        isDefault: true,
      },
      isValidVal: false,
      errCard: '',
      view_data:[]
    }
  },
  created () {
    this.loadData()
    //this.refresh()
  },
  methods: {
    fee(amount) {
      const fee = (parseFloat(amount) * this.transaction['cc'].rate)
      + this.transaction['cc'].additional;
      return this.numberFormat(fee);
    },
    numberFormat(amount, options) {
      const option = {
        ...options,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      const formatter = new Intl.NumberFormat("en-US", option);
      return formatter.format(amount);
    },
    getAddressDataLine1: function (addressData, placeResultData) {
      // this.objPayment.address = addressData
      const adStreet = typeof(addressData.street_number) === 'undefined' ? '' : addressData.street_number + ', '
        const adRoute = typeof(addressData.route) === 'undefined' ? '' : addressData.route
        const adAdmin1 = typeof(addressData.administrative_area_level_1) === 'undefined' ? '' : addressData.administrative_area_level_1
        const adPostal = typeof(addressData.postal_code) === 'undefined' ? '' : addressData.postal_code
        
        // this.data_local.business_address_line_1 = adStreet + adRoute
        // this.data_local.business_city = addressData.locality
        // this.data_local.business_state = adAdmin1
        // this.data_local.business_zip = adPostal
        // this.data_local.business_country = addressData.country

        this.objPayment.StreetAddress = adStreet + adRoute
        this.objPayment.City = addressData.locality
        this.objPayment.State = adAdmin1
        this.objPayment.Zip = adPostal
        this.objPayment.Country = addressData.country
    }, 
    isValid() {
      this.$vs.loading()
      this.err = false
      
      this.cvvR = isNaN(this.objPayment.CVV) ? true : false
      this.cvvRM = this.cvvR ? 'CVV is required and must be numeric' : null
      this.err = this.cvvR ? true : this.err

      this.amountR = this.objPayment.Amount === undefined || this.objPayment.Amount === "" ? true : false
      this.amountRM = this.amountR ? 'Amount is required' : null
      this.err = this.amountR ? true : this.err

      this.emailAddressR = this.objPayment.EmailAddress === undefined || this.objPayment.EmailAddress === "" ? true : false
      this.emailAddressRM = this.emailAddressR ? 'Email Address is required' : null
      this.err = this.emailAddressR ? true : this.err

      this.firstNameR = this.objPayment.FirstName === undefined || this.objPayment.FirstName === "" ? true : false
      this.firstNameRM = this.firstNameR ? 'First Name is required' : null
      this.err = this.firstNameR ? true : this.err

      this.lastNameR = this.objPayment.LastName === undefined || this.objPayment.LastName === "" ? true : false
      this.lastNameRM = this.lastNameR ? 'Last Name is required' : null
      this.err = this.lastNameR ? true : this.err

      this.cardTypeR = this.objPayment.CardType === undefined || this.objPayment.CardType === "" ? true : false
      this.cardTypeRM = this.cardTypeR ? 'Card Type is required' : null
      this.err = this.cardTypeR ? true : this.err

      this.cardR = isNaN(this.objPayment.CardNumber) ? true : false
      this.cardRM = this.cardR ? 'Card Number is required and must be numeric' : null
      this.err = this.cardR ? true : this.err

      this.monthR = isNaN(this.objPayment.ExpirationMonth) ? true : false
      this.monthRM = this.monthR ? 'Expiration Month is required and must be numeric' : null
      this.err = this.monthR ? true : this.err

      this.yearR = isNaN(this.objPayment.ExpirationYear) ? true : false
      this.yearRM = this.yearR ? 'Expiry Year is required and must be numeric' : null
      this.err = this.yearR ? true : this.err

      var currentTime = new Date()
      var month = currentTime.getMonth() + 1
      var year = currentTime.getFullYear()

      if (this.objPayment.ExpirationMonth < 1 || this.objPayment.ExpirationMonth > 12) {        
        this.monthR = true
        this.monthRM = 'Must be between 1 to 12'
        this.err = true
      }

      if (this.objPayment.ExpirationYear < year) {
        this.yearR = true
        this.yearRM = 'Your card is expired'
        this.err = true
      } else {
        if (this.objPayment.ExpirationMonth < month) {
          this.monthR = true
          this.monthRM = 'Your card is expired'
          this.err = true
        }
      }

      if (this.objPayment.CVV < 4) {
        this.cvvR = true
        this.cvvRM = 'CVV Must have 3-4 digits'
        this.err = true
      }

      // if (this.objPayment.CardType == "American Express" && this.objPayment.CardNumber.length < 15) {
      //   this.errCard = 'Card Must have 15 digits'
      //   this.isValidVal = true
      // } else if(this.objPayment.CardType != "American Express" && this.objPayment.CardNumber.length < 16) {
      //   this.errCard = 'Card Must have 16 digits'
      //   this.isValidVal = true
      // }
      // else {
      //   this.isValidVal = false
      // }

      // console.log('this.objPayment.CardNumber.length ', this.objPayment.CardNumber.length)
      // v => !!v || 'Card is required',
      //        v => parseInt(v) || 'Card number must be numeric',

      //        v => (v && v.length == 16) || 'Card Must have 16 digits'
      
      
    },
    showNotif (position) {
      const { color, textColor, multiLine, icon, message, avatar } = alerts[
        Math.floor(Math.random(alerts.length) * 10) % alerts.length
      ]
      const random = Math.random() * 100

      const twoActions = random > 70
      const buttonColor = color ? 'white' : void 0

      this.$q.notify({
        color,
        textColor,
        icon: random > 30 ? icon : null,
        message,
        position,
        avatar,
        multiLine,
        actions: [
            // { label: 'Reply', color: buttonColor, handler: () => { /* console.log('wooow') */ } },
            { label: 'Dismiss', color: 'black', handler: () => { /* console.log('wooow') */ } }
          ],
        timeout: Math.random() * 5000 + 3000
      })
    },
    async handleSubmit () {      
      this.isValid()
      console.log('submit')
      this.blnLoading = true;

      setTimeout(() => {
        this.blnLoading = false;
      }, 500);

      // return;
      // const blnValid = this.$refs.paymentForm.validate()
      const blnValid = this.errCard

      if (this.err) {
        console.log('returning')
        setTimeout(() => {
          this.$vs.loading.close()
        }, 1000)
        return
      }

      this.blnLoading = true
      this.objPayment.method = 'cc';
      
      try {
        const { data } = await axios.post('/payment/process-payment', 
          { objPayment: this.objPayment, billId: this.view_data.id },
          { headers: {'Authorization': this.token }});

        if (data.status === 'success') {
          this.$vs.notify({
            color: 'success',
            title: 'Payment Submitted',
            text: 'The selected payment was successfully submitted'
          })
          this.$router.go(-1)
        } else {
          this.$vs.notify({
            color: 'danger',
            title: 'Payment Failed',
            text: data.message,
          })
          this.$vs.loading.close();
        }
        this.$vs.loading.close();
        this.blnLoading = false;


        // let objParams = Object.assign({}, this.objPayment)
        // const objResponse = await api.payCC(objParams)

        // this.objModel2.userId = 123
        // this.objModel2.invoiceId = objResponse.TransRefID
        // this.objModel2.type = 'fuzeCC'
        // this.objModel2.amount = this.objPayment.Amount
        // this.objModel2.status = objResponse.ResultDetail

        // let objRequest2 = {
        //   objModel: this.objModel2
        // };

        // let strTargetUrl2 = this.getTargetUrl();
        // let strUrl2 = strTargetUrl2 + "invoice";
        // const objInvoice2 = await this.$myAxios.execute("POST", strUrl2, objRequest2);

        alerts = [
          { color: 'green', message: 'Payment Successfully created!' },
        ]

        this.showNotif('top')
      } catch (e) {
        console.log('e ', e)
      } finally {
        this.blnLoading = false
        this.$vs.loading.close()
      }
    },
    goBack () {},
    async refresh () {
      //console.log("inside refersf");
      this.blnLoading = true

      this.blnLoading = false
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
    optionalChaning(fn) {
      try { return fn(); }
      catch (e) {}
    },
    loadData () {      
      const viewId = this.$route.params.billId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.get(`/billing/view/${viewId}`, {
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
              this.data_not_found = true
              this.$vs.loading.close()
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.view_data = res[0]
          this.objPayment.SubAmount = res[0]['total_amount']
          this.objPayment.Amount = this.numberFormat((parseFloat(res[0]['total_amount']) * 0.0295) + parseFloat(res[0]['total_amount']) + 2); 
          this.objPayment.invoice_no = res[0]['invoice_no']
          this.objPayment.createdAt = res[0]['createdAt']
          
          const { first_name, last_name, email, address_line_1 } = this.optionalChaning(() => this.view_data.unit.unit_users[0].user);
          this.objPayment.FirstName = first_name;
          this.objPayment.LastName = last_name;
          this.objPayment.EmailAddress = email;
          this.objPayment.address = address_line_1;
          
        })
      })
    }
  }
}
</script>
<style>
  .vs-tooltip-transaction-fee {
    background-image: url('../../assets/images/axp/billing/transaction-fee.png');
    width: 350px !important;
    height: 250px;
    background-size: 340px 240px;
    background-repeat: no-repeat;
    background-color: white;
    max-width: unset;
  }
</style>