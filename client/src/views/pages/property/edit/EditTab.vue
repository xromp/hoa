<template>
  <div id="data-edit-tab-info">
    <!-- Avatar Row -->
    <update-avatar 
      :loadFile="loadFile" 
      :folderPath="folderPath" 
      :folderId="20" class="mb-4" 
      :defaultImg = "defaultImg"
    />

    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="InfoIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Account Information</span>
        </div>    
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Name*" v-model="data_local.name" v-validate="'required'" name="name" type="text"/>
          <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>
        </div>

        <!-- <div class="mt-4">
          <label class="vs-input--label">Caliber Client Name*</label>
          <v-select :options="optionCaliberClient" :reduce="ClientName => ClientName.ClientID" label="ClientName" v-validate="'required'" v-model="data_local.caliber_client_id" name="caliber_client_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('caliber_client_id')">{{ errors.first('caliber_client_id') }}</span>
        </div> -->

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Parent Org*" v-model="data_local.pmc.name" v-validate="'required'" name="pmc_name" type="text" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('pmc_name')">{{ errors.first('pmc_name') }}</span>
        </div>
      </div>

      <div class="vx-col w-full" 
        :class="[data_local.property_type === 'multiple' ? 'md:w-1/4': 'md:w-1/2']">
        <div class="mt-4">
          <label class="vs-input--label">Property Type*</label>
          <v-select 
            :options="optionPropertyType" 
            :reduce="name => name.val" 
            label="name" 
            v-validate="'required'" 
            v-model="data_local.property_type" 
            name="property_type"/>
          <span class="text-danger text-sm"  v-show="errors.has('property_type')">{{ errors.first('property_type') }}</span>
        </div>
      </div>
      <building-selection
        :buildings.sync="data_local.buildings" 
        :property_id="data_local.id"
        v-if="data_local.property_type === 'multiple'"/>
    </div>

    <!-- Content Row -->
    <div class="vx-row mt-4">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Primary Address</span>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Billing Address</span>
        </div>
      </div>
    </div>


    <!-- Content Row -->
    <div class="vx-row justify-end">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <div class="mt-2">
          <vs-checkbox v-model="is_copy_to_billing" @change="copyToBillingAddress">Use primary address</vs-checkbox>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2">
        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="vx-col w-full mt-4">
              <label class="vs-input--label">Address Line 1*</label>
              <vue-google-autocomplete
                @blur="getAddressDataLine1"
                id="address_line_1"
                name="address_line_1"
                v-model="data_local.address_line_1"
                aria-describedby="address_line_1-feedback"
                class="vs-inputx vs-input--input normal w-full"
                style="border: 1px solid rgba(0, 0, 0, 0.2)"
                placeholder=""
                type="address"
                ref=address_line_1    
                v-validate="'required'"
                v-on:placechanged="getAddressDataLine1"
              ></vue-google-autocomplete>

              <span class="text-danger">{{ errors.first('address_line_1') }}</span> 
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address Line 2" v-model="data_local.address_line_2" type="text" name="address_line_2" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('address_line_2')">{{ errors.first('address_line_2') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State / Province" v-model="data_local.state" type="text" name="state" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('state')">{{ errors.first('state') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City*" v-model="data_local.city" type="city" v-validate="'required'" name="city" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('city')">{{ errors.first('city') }}</span>
            </div>
            
            <div class="mt-4 country-option">
              <!-- <vs-input class="w-full mt-4" label="Country*" v-model="data_local.country" type="text" v-validate="'required'" name="country" />
              <span class="text-danger text-sm"  v-show="errors.has('country')">{{ errors.first('country') }}</span> -->

              <label class="vs-input--label">Country*</label>
              <v-select :options="optionCountry" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.country_id" name="country_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('country_id')">{{ errors.first('country_id') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Postcode*" v-model="data_local.postal_code" type="text" v-validate="'required'" name="postal_code" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('postal_code')">{{ errors.first('postal_code') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2">
        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="vx-col w-full mt-4">
              <label class="vs-input--label">Address Line 1*</label>
              <vue-google-autocomplete
                @blur="getBillingAddressDataLine1"
                id="BillingAddress1"
                name="BillingAddress1"
                v-model="data_local.BillingAddress1"
                aria-describedby="BillingAddress1-feedback"
                class="vs-inputx vs-input--input normal w-full"
                style="border: 1px solid rgba(0, 0, 0, 0.2)"
                placeholder=""
                type="address"
                ref=BillingAddress1    
                v-validate="'required'"
                v-on:placechanged="getBillingAddressDataLine1"
                :disabled="is_copy_to_billing"
              ></vue-google-autocomplete>
            </div>

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address Line 1*" v-model="data_local.BillingAddress1" type="text" v-validate="'required'" name="BillingAddress1" />
              <span class="text-danger text-sm"  v-show="errors.has('BillingAddress1')">{{ errors.first('BillingAddress1') }}</span>
            </div> -->

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address Line 2" v-model="data_local.BillingAddress2" type="text" name="BillingAddress2" :disabled="is_copy_to_billing" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingAddress2')">{{ errors.first('BillingAddress2') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State / Province" v-model="data_local.BillingState" type="text" name="BillingState" :disabled="is_copy_to_billing" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingState')">{{ errors.first('BillingState') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City*" v-model="data_local.BillingCity" type="text" v-validate="'required'" name="BillingCity" :disabled="is_copy_to_billing" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingCity')">{{ errors.first('BillingCity') }}</span>
            </div>
            
            <div class="mt-4 country-option">
              <!-- <vs-input class="w-full mt-4" label="Country*" v-model="data_local.BillingCountry" type="text" v-validate="'required'" name="BillingCountry" :disabled="is_copy_to_billing"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingCountry')">{{ errors.first('BillingCountry') }}</span> -->

              <label class="vs-input--label">Country*</label>
              <v-select :options="optionCountry" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.BillingCountry" name="BillingCountry" :disabled="is_copy_to_billing"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingCountry')">{{ errors.first('BillingCountry') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Postcode*" v-model="data_local.BillingZip" type="text" v-validate="'required'" name="BillingZip" :disabled="is_copy_to_billing" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('BillingZip')">{{ errors.first('BillingZip') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <!-- <vs-button class="ml-auto mt-2" @click="submit('a')" :disabled="!validateForm">Save and New</vs-button> -->
          <vs-button class="ml-4 mt-2" @click="submit('b')" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
const jwt = require('jsonwebtoken')
const token = localStorage.usertoken
const decoded = jwt.verify(token, 'secret')
import UpdateAvatar from '../../../components/files/UploadAvatar.vue'
import EventBus from '@/EventBus'
import mainHelper from '@/mainHelper' //crud
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import BuildingSelection from '../common/BuildingSelection';

export default {
  components: {
    vSelect,
    UpdateAvatar,
    VueGoogleAutocomplete,
    BuildingSelection,
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      is_copy_to_billing: false,

      //reading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 26,
      defaultImg: '/img/default-placeholder.a36832a1.png',
      rawFiles: [],
      resDataLocal: [],
      approvals: [],

      token: localStorage.usertoken,

      optionSalutation: [],
      optionUserRole: [],
      optionCountry: [],
      optionPropertyType: [
        { id: 1, name: 'Single', val: 'single'},
        { id: 2, name: 'Multiple', val: 'multiple'},
        { id: 3, name: 'Neighborhood Community', val: 'community'}
      ],
      optionCaliberClient: [],
      optionParentOrg: [],      
      data_local: JSON.parse(JSON.stringify(this.data)),

      statusOptions: [
        { label: 'Active',  value: 'active' },
        { label: 'Blocked',  value: 'blocked' },
        { label: 'Deactivated',  value: 'deactivated' }
      ],
      roleOptions: [
        { label: 'Admin',  value: 'admin' },
        { label: 'User',  value: 'user' },
        { label: 'Staff',  value: 'staff' }
      ]
    }
  },
  computed: {
    folderPath() {
      return `docs/property/avatar/${this.data_local.id}`
    },
    status_local: {
      get () {
        return { label: this.capitalize(this.data_local.status),  value: this.data_local.status  }
      },
      set (obj) {
        this.data_local.status = obj.value
      }
    },
    role_local: {
      get () {
        return { label: this.capitalize(this.data_local.role),  value: this.data_local.role  }
      },
      set (obj) {
        this.data_local.role = obj.value
      }
    },
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    copyToBillingAddress() {
      console.log('this.is_copy_to_billing ', this.is_copy_to_billing)
      if (this.is_copy_to_billing) {        
        this.$refs.BillingAddress1.autocompleteText = this.is_copy_to_billing ? this.data_local.address_line_1 : ''
        this.data_local.BillingAddress1   = this.is_copy_to_billing ? this.data_local.address_line_1 : ''
        this.data_local.BillingAddress2   = this.is_copy_to_billing ? this.data_local.address_line_2 : ''
        this.data_local.BillingCity       = this.is_copy_to_billing ? this.data_local.city : ''
        this.data_local.BillingState      = this.is_copy_to_billing ? this.data_local.state : ''
        this.data_local.BillingZip        = this.is_copy_to_billing ? this.data_local.postal_code : ''
        this.data_local.BillingCountry    = this.is_copy_to_billing ? this.data_local.country_id : ''
      } else {
        const data_local = JSON.parse(JSON.stringify(this.data))
        this.$refs.BillingAddress1.autocompleteText = data_local.address_line_1
        this.data_local.BillingAddress1   = data_local.address_line_1
        this.data_local.BillingAddress2   = data_local.address_line_2
        this.data_local.BillingCity       = data_local.city
        this.data_local.BillingState      = data_local.state
        this.data_local.BillingZip        = data_local.postal_code
        this.data_local.BillingCountry    = data_local.country_id
      }
    },
    getAddressDataLine1: function (addressData, placeResultData) {
      if (!addressData && !this.data_local.address_line_1) {
        setTimeout(() => {
          this.$refs.address_line_1.$refs.autocomplete.value = ''
          this.data_local.city = ''
          this.data_local.state = ''
          this.data_local.postal_code = ''
          this.data_local.country_id = 0
        }, 100)
      } else {
        console.log('getAddressDataLine1 ', addressData)
        const adStreet = !addressData.street_number ? '' : addressData.street_number + ', '
        const adRoute = !addressData.route ? '' : addressData.route
        const adAdmin1 = !addressData.administrative_area_level_1 ? '' : addressData.administrative_area_level_1
        const adPostal = !addressData.postal_code ? '' : addressData.postal_code
        
        this.$refs.address_line_1.$refs.autocomplete.value = adStreet + adRoute
        this.data_local.address_line_1 = adStreet + adRoute
        this.data_local.city = addressData.locality
        this.data_local.state = adAdmin1
        this.data_local.postal_code = adPostal
        const country = this.optionCountry.filter((r)=>r.name===addressData.country) 
        this.data_local.country_id = country[0]['id']
      }
    },  
    getBillingAddressDataLine1: function (addressData, placeResultData) {
      if (!addressData && !this.data_local.BillingAddress1) {
        setTimeout(() => {
          this.$refs.BillingAddress1.$refs.autocomplete.value = ''
          this.data_local.BillingCity = ''
          this.data_local.BillingState = ''
          this.data_local.BillingZip = ''
          this.data_local.BillingCountry = ''
        }, 100)
      } else {      
        console.log('getBillingAddressDataLine1 ', addressData)
        const adStreet = !addressData.street_number ? '' : addressData.street_number + ', '
        const adRoute = !addressData.route ? '' : addressData.route
        const adAdmin1 = !addressData.administrative_area_level_1 ? '' : addressData.administrative_area_level_1
        const adPostal = !addressData.postal_code ? '' : addressData.postal_code

        this.$refs.BillingAddress1.$refs.autocomplete.value = adStreet + adRoute
        this.data_local.BillingAddress1 = adStreet + adRoute
        this.data_local.BillingCity = addressData.locality
        this.data_local.BillingState = adAdmin1
        this.data_local.BillingZip = adPostal
        const country = this.optionCountry.filter((r)=>r.name===addressData.country) 
        this.data_local.BillingCountry = country[0]['id']
      }
    }, 
    openLoadingContained(){
      this.$vs.loading({
        background: 'rgba(255, 255, 255, .8)',
        color: 'black',
        container: ".loading-container-po",
        scale: 0.45
      })
      // this.loading = true
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    submit(loc) {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes(loc)
        }
      })
    },
    async save_changes () {
      try {
        const editId = this.$route.params.editId
        if (!this.validateForm) return
        this.$vs.loading()

        await axios.post(`/property/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: `docs/property/avatar/${this.data_local.id}`,
          folderId: 26
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))

      this.$refs.address_line_1.$refs.autocomplete.value = this.data_local.address_line_1
      this.$refs.BillingAddress1.$refs.autocomplete.value = this.data_local.BillingAddress1

      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadUserRole () {
      const result = await axios.get(`/api/userRole/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionUserRole = result['data']
    },
    async loadSalutation () {
      const result = await axios.get(`/api/salutation/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionSalutation = result['data']
    },
    async loadCountry () {
      const result = await axios.get(`/api/country/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionCountry = result['data']
    },
    async loadCaliberClient () {
      const result = await axios.get('/caliber/api', {
        headers: { 
          'Authorization': this.token,
          'caliber-url': 'api/v2/clientlist'
          // api/v2/clientlist
          // clientlist        
          // client/27/clientcontacts
          // client/27/contacts/all
          // client/27/units
          // client/27/vendors
          // client/27/invoices
          // client/27/billingrecords/all
          // client/27/transactionaccounts
        }
      })

      this.optionCaliberClient = result['data']
    },
    async loadParentOrg () {
      const result = await axios.get(`/user-org/portfolio/list`, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': this.token 
        },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal,
          'type': 'non-overflow'
        }
      })

      this.optionParentOrg = result['data']
    }
  },
  async created () {
    try {
      await this.loadCountry()
      await this.loadSalutation()
      await this.loadUserRole()
      await this.loadCaliberClient()
      await this.loadParentOrg()
      setTimeout(() => this.$refs.address_line_1.$el.setAttribute('autocomplete', 'disabled'), 1000);
      setTimeout(() => this.$refs.BillingAddress1.$el.setAttribute('autocomplete', 'disabled'), 1000);
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Property Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })

    EventBus.$on('delete-file', res => {
      this.filesDel = res
    })
  }
}
</script>
<style>
  div.loading-container-po div.con-vs-loading {
    min-height: 20px ;
  }
  div.country-option ul.vs__dropdown-menu {
    height: 150px;
  }
</style>
