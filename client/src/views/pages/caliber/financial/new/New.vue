<template>
  <div v-if="!blnIsPaymentInProgress">
    <vx-card title="Payment Type*" class="mb-base" v-if="hideP" v-model="hideP">
      <div class="vx-row">
        <div class="vx-col lg:w-2/3 w-full">
            <div class="flex flex-wrap mt-1">
              <vs-radio  v-model="objPayment.paymentType" vs-value="cc" class="mr-4 mb-2">Credit Card</vs-radio >
              <vs-radio  v-model="objPayment.paymentType" vs-value="ach" class="mr-4 mb-2">e-Check</vs-radio >         
            </div>
        </div>
      </div>
    </vx-card>
    
    <template v-if="objPayment.paymentType == 'ach'">
      <FuzeACHPaymentForm></FuzeACHPaymentForm>
    </template>

    <template v-if="objPayment.paymentType == 'cc'">
      <FuzeCCPaymentForm></FuzeCCPaymentForm>
    </template>
    <template v-if="blnIsPaymentInProgress">
      <q-progress-circular indeterminate color="purple"></q-progress-circular>
      Payment in progress..
    </template>


  <div v-if="!hideP">  
    <div class="vx-row">
      <div class="vx-col lg:w-2/3 w-full">
        <vx-card title="Credit Card Payment Details" class="mb-base">

          <form data-vv-scope="add-new-address">
              <div class="vx-row">
                  <div class="vx-col w-full">
                    <vs-input
                      v-model="objData.FirstName"
                      label="First Name*"
                      :rules="nameRules"
                      class="w-full mt-5"
                      :danger="firstNameR"
                      :danger-text="firstNameRM"
                    ></vs-input>
                  </div>
                  <div class="vx-col w-full">
                    <vs-input
                      v-model="objData.LastName"
                      label="Last Name*"
                      :rules="nameRules"
                      class="w-full mt-5"
                      :danger="lastNameR"
                      :danger-text="lastNameRM"
                    ></vs-input>
                  </div>
                  <div class="vx-col w-full">
                    <vs-input
                      v-model="objData.email"
                      label="Email*"
                      :rules="nameRules"
                      class="w-full mt-5"
                      :danger="emailR"
                      :danger-text="emailRM"
                    ></vs-input>
                  </div>
              </div>
              <div class="vx-row">
                  <div class="vx-col w-full">
                      <vs-input
                        v-model="objData.phone1"
                        label="Phone"
                        prefix="$"
                        class="w-full mt-5"
                        :danger="phone1R"
                        :danger-text="phone1RM"
                      ></vs-input>
                  </div>
              </div>
              <div class="vx-row">
                  <div class="vx-col w-full mt-5">
                      <label class="vs-input--label">Address</label>
                      <vue-google-autocomplete
                        id="address"
                        name="address"
                        v-model="objData.address"
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
                      <vs-input
                        v-model="objData.Amount"
                        label="Amount"
                        prefix="$"
                        :rules="amountRules"
                        class="w-full mt-5 cursor-not-allowed"
                        :danger="amountR"
                        :danger-text="amountRM"
                        disabled
                      ></vs-input>
                  </div>
              </div>

          </form>
        </vx-card>
      </div>

      <!-- RIGHT COL -->
      <div class="vx-col lg:w-1/3 w-full">
        <vx-card title="Service Provider Details">
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

          <vs-button class="w-full" @click="checkP()">Pay Now</vs-button>
        </vx-card>
      </div>
    </div>

  </div>

  </div>
</template>
<script>
// import api from '../api'
import axios from '@/axios'
import ViewParent from "@/components/caliber/ViewParent"
import FuzeACHPaymentForm from "@/components/caliber/FuzeACHPaymentForm.vue"
import FuzeCCPaymentForm from '@/components/caliber/FuzeCCPaymentForm.vue'
import PaymentOverlay from '@/components/caliber/PaymentOverlay.vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {  
  props: ['id'],
  extends:ViewParent,
  components: {
    FuzeACHPaymentForm,
    FuzeCCPaymentForm,
    PaymentOverlay,
    VueGoogleAutocomplete
  },
  data () {
    return {
      firstNameR: null,
      firstNameRM: null,
      lastNameR: null,
      lastNameRM: null,
      emailR: null,
      emailRM: null,
      amountR: null,
      amountRM: null,
      phone1R: null,
      phone1RM: null,      
      addressR: null,
      addressRM: null,

      token: localStorage.usertoken,
      blnLoading: false,
      view_data: [],
      hideP: true,
      objData: [],
      objModel: {
        country_id: 0 
      },
      country_id: 0,
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
        v => parseInt(v) || 'Card number must be numeric',

        v => (v && v.length == 16) || 'Card Must have 16 digits'
      ],
      monthRules: [
        v => !!v || 'Expiry Month is required',
        v => parseInt(v) || 'Expiry Month must be numeric',

        v => (v && v <= 12) || 'Must be between 1 to 12'
      ],
      yearRules: [
        v => !!v || 'Expiry Year is required',
        v => parseInt(v) || 'Expiry Year must be numeric',

        v => (v && parseInt(v) >= 2019) || 'Must be 2019 or higher'
      ],
      cvvRules: [
        v => !!v || 'CVV is required',
        v => parseInt(v) || 'CVV must be numeric',

        v => (v && v.length == 3) || 'CVV Must have 3 digits'
      ],
      zipcodeRules: [],
      arrCardTypes: ['Visa', 'MasterCard', 'American Express', 'Discover'],
      objCCPayment: {},
      objPayment: {
        paymentType: ''
      }
    }
  },
  async created () {
    this.refresh()
    this.checkC()
    this.loadData()
  },
  methods: {
    getAddressDataLine1: function (addressData, placeResultData) {
      this.objData.address = addressData
      const adStreet = typeof(addressData.street_number) === 'undefined' ? '' : addressData.street_number + ', '
        const adRoute = typeof(addressData.route) === 'undefined' ? '' : addressData.route
        const adAdmin1 = typeof(addressData.administrative_area_level_1) === 'undefined' ? '' : addressData.administrative_area_level_1
        const adPostal = typeof(addressData.postal_code) === 'undefined' ? '' : addressData.postal_code
        
        // this.data_local.business_address_line_1 = adStreet + adRoute
        // this.data_local.business_city = addressData.locality
        // this.data_local.business_state = adAdmin1
        // this.data_local.business_zip = adPostal
        // this.data_local.business_country = addressData.country

        this.objModel.customerCity = addressData.locality == null ? 'NA' : addressData.locality
        this.objModel.customerAddress = adStreet + adRoute
    }, 
    async getPaymentProviders(){
      await api.getPaymentProviders();
    },
    async checkC () {
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.get('/api/countryAf/list', {
              headers: { 'Authorization': this.token }
            })
            .then(res => { 
              if(res['data'] != 'access_denied') {
                resolve(res['data'])  
              } else {
                this.$router.push({name:'page-not-authorized'})
              }
              this.$vs.loading.close()
            })
            .catch(err => {
              this.$vs.loading.close()
              console.log(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      
      })

      const objC = await d
      const c_id = objC['country_id']
      // const c_id = 4

      var valObjCountry = await objC['data'].filter(function(elem){
        if(elem.country_master_id == c_id) {
          return elem.code;       
        }
      })

      this.hideP = valObjCountry.length > 0 ? false : this.hideP
      this.objPayment.paymentType = valObjCountry.length > 0 ? '' : 'cc'
      this.objModel.customerCountry = valObjCountry[0]['code']
    },
    isValid() {
      this.err = false

      this.firstNameR = this.objData.FirstName === undefined || this.objData.FirstName === "" ? true : false
      this.firstNameRM = this.firstNameR ? 'First Name is required' : null
      this.err = this.firstNameR ? true : this.err

      this.lastNameR = this.objData.LastName === undefined || this.objData.LastName === "" ? true : false
      this.lastNameRM = this.lastNameR ? 'Last Name is required' : null
      this.err = this.lastNameR ? true : this.err

      this.emailR = this.objData.email === undefined || this.objData.email === "" ? true : false
      this.emailRM = this.emailR ? 'Email is required' : null
      this.err = this.emailR ? true : this.err

      this.phone1R = this.objData.phone1 === undefined || this.objData.phone1 === "" ? true : false
      this.phone1RM = this.phone1R ? 'Phone is required' : null
      this.err = this.phone1R ? true : this.err

      this.addressR = this.objData.address === undefined || this.objData.address === "" ? true : false
      this.addressRM = this.addressR ? 'Address is required' : null
      this.err = this.addressR ? true : this.err
    },
    async checkP () {
      this.isValid()
      console.log('submit', this.err)
      this.blnLoading = true;

      setTimeout(() => {
        this.blnLoading = false;
      }, 2000);

      if (this.err) {
        console.log('returning')
        return
      }

      if (!this.hideP) {        
        this.objModel.customerName = this.objData['FirstName']
        this.objModel.customerLastname = this.objData['LastName']
        this.objModel.customerEmail = this.objData['email']        
        this.objModel.customerPhone = this.objData['phone1']
        this.objModel.amountToCharge = this.objData.Amount
      }

      console.log('this.objModel ', this.objModel)
      console.log('this.objData ', this.objData)
      console.log('this.objData[FirstName] ', this.objData['FirstName'])
      
      this.blnLoading = true

      try {    
        const port = await axios.post(`/billing/portfolio-reg/`, {
          token: this.token,
          data: this.objModel
        })
        console.log('port ', port)
        console.log('port ', port.data.body.link)
        window.location.href = port.data.body.link
      } catch(err) {
        console.log('err ', err)
      }



      // this.objModel.id = ''
      // this.objModel.userId = this.$store.getters['user/objUser']['id']
      // this.objModel.invoiceId = objDatas.obj.rd.id
      // this.objModel.type = 'af'
      // this.objModel.amount = objDatas.obj.rd.amountToCharge
      // this.objModel.status = objDatas.obj.rd.status

      // let objRequest = {
      //   objModel: this.objModel
      // };

      // let strTargetUrl = this.getTargetUrl();
      // let strUrl = strTargetUrl + "invoice";
      // console.log('strUrl af ', strUrl)

      // const objInvoice = await this.$myAxios.execute("POST", strUrl, objRequest);

      // console.log('objDatas af ', objDatas)
      // console.log('this.objModel ', this.objModel)      
      // console.log('objInvoice af ', objInvoice)

      // window.location.href = objDatas.obj.rd.link
    },    
    async makePayment () {
      const blnValid = this.$refs.paymentForm.validate()
      console.log(blnValid)

      //alert("here");
      if (!blnValid) {
        console.log('retingin')
        //return;
      }
      console.log(this.objCCPayment)
      const objResponse = await api.payCC(this.objCCPayment)
      console.log(objResponse)
      //const objToken = await api.createCCToken(this.objCCPayment);
      //console.log(objToken);
    },
    goBack () {},
    async refresh () {
      //console.log("inside refersf");
      this.loading = true

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
          console.log('res d billing  ', res)
          this.objData.Amount = res[0]['total_amount']
          this.view_data = res[0]
          console.log('this.objData.Amount  ', this.objData.Amount)
        })
      })
    }
  }
}
</script>
