<template>
  <div id="data-edit-tab-info">

    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
      <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="ArchiveIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Information</span>
        </div>
      </div>

      <div class="vx-col md:w-1/2 w-full">      
        <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="HomeIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Property Details</span>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input
        :danger="is_dup===false"
        danger-text="Parent Org name exist"
        val-icon-danger="icon-x"

        :success="is_dup"
        success-text="Parent Org name is valid"
        val-icon-success="icon-check"

        val-icon-pack="feather"
        class="w-full mt-4" label="Parent Org Name*"
        v-model="data_local.name" 
        autocomplete="chrome-off"
        v-validate="'required'" name="name" type="text" @blur="checkDuplicate()"
        />
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>

        <div class="mt-4">
          <label class="vs-input--label">Classification*</label>
          <v-select :options="optionClassification" :reduce="name => name.val" label="name" v-validate="'required'" v-model="data_local.classification" name="classification"/>
          <span class="text-danger text-sm"  v-show="errors.has('classification')">{{ errors.first('classification') }}</span> 
        </div>      

        <vs-textarea class="w-full mt-8" label="Notes" v-model="data_local.notes" name="notes" />
        <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>         
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Property Name*" v-model="data_local.property_name" v-validate="'required'" name="property_name" />
        <span class="text-danger text-sm"  v-show="errors.has('property_name')">{{ errors.first('property_name') }}</span>

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Phone*" v-model="data_local.phone" type="phone" v-validate="'required'" name="phone" @keypress="isNumber" @blur="validatePhone"/>
          <span class="text-danger text-sm"  v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
        </div>

        <div class="mt-4">
          <label class="vs-input--label">Address*</label>
          <vue-google-autocomplete
            @blur="getAddressDataLine1"
            id="address"
            name="address"
            v-model="data_local.address"
            aria-describedby="address-feedback"
            class="vs-inputx vs-input--input normal w-full"
            style="border: 1px solid rgba(0, 0, 0, 0.2)"
            placeholder=""
            types=address
            ref=address    
            v-validate="'required'"
            v-on:placechanged="getAddressDataLine1"
          ></vue-google-autocomplete>

          <span class="text-danger" v-if="errors.first('address')">Please re-type Address</span> 
        </div>
      </div>

    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <!-- Col Header -->
        <div class="flex items-end md:mt-6 mt-base">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">User Details</span>
        </div>
        
        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Email*" v-model="data_local.email" type="email" v-validate="'required'" name="email" @change="findUserByEmail"/>
          <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="First name*" v-model="data_local.first_name" type="text" v-validate="'required'" name="first_name"/>
          <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
        </div>

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Last name*" v-model="data_local.last_name" type="text" v-validate="'required'" name="last_name"/>
          <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
        </div>
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit" :disabled="!validateForm">Save</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import EventBus from '@/EventBus'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
const jwt = require('jsonwebtoken')
const decoded = jwt.verify(localStorage.usertoken, 'secret') 
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    vSelect,
    VueGoogleAutocomplete
  },
  data () {
    return {
      is_dup: null,

      address_line_1: null,
      token: localStorage.usertoken,

      optionClassification: [
        { name: 'Hotel',  id: '1', val: 'Hotel' },
        { name: 'Union',  id: '2', val: 'Union' },
        { name: 'Property Management',  id: '3', val: 'Property Management' }
      ],

      //portfolio
      data_local: {
        name: '',
        classification: 'Property Management',
        address: '',
        phone:'',
        notes:'',
        property_name: '',
        first_name: '',
        last_name: '',
      },

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
    validateForm () {
      return !this.errors.any()
      && this.data_local.name !== ''
      && this.is_dup
    }
  },
  methods: {
    validatePhone(){
      const allowedKey = /[+-.\()]/gi;
      const filtered =  this.data_local.phone.replace(allowedKey,'')

      if (isNaN(filtered)) {
        this.errors.add({
          field: 'phone',
          msg: 'This entry can ONLY contain numbers.'
        });
      }
    },
    isNumber: (evt) => {
      const allowedKey = ['+', '-', '(', ')', '.']
      evt = (evt) ? evt : window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode

      if ( charCode!==32 && !allowedKey.includes(evt.key) && (charCode < 48 || charCode > 57) ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    async getAddressDataLine1(addressData, placeResultData) {
      if (addressData === undefined && this.address_line_1 === null) {
        console.log('null')
        this.$refs.address.$refs.autocomplete.value = ''
      } else {
        this.data_local.address = this.$refs.address.$refs.autocomplete.value
        this.address_line_1 = this.$refs.address.$refs.autocomplete.value
      }
    },   
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    submit() {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes()
        }
      })
    },
    async checkDuplicate() {
      this.is_dup = null
      if (this.data_local.name === '') return

      const result = await axios.get('/portfolio/check-duplicate', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'name': this.data_local.name,
          'old_name': ''
        }
      })

      this.is_dup = !result.data.name
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()        

        const editId = -1
        const result = await axios.post(`/portfolio/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data.user_org_result))
        localStorage.removeItem('selectedParentOrg')
        localStorage.setItem('selectedParentOrg', result['data']['portfolio_result']['id'])

        await this.changePropertyOrg();

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully saved'
        })

        EventBus.$emit('side-menu-parent', true)
        EventBus.$emit('update-parent-id', true)
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Parent Org Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async changePropertyOrg() {
      const params = {
        'property_ref': localStorage.selectedPropertyRef,
        'parent_org_id': localStorage.selectedParentOrg,
        'role_id': localStorage.selectedRoleId,
        'role_val': localStorage.selectedRoleVal,
        'type': 'overflow'
      };
     
      const {data} = await axios.get('/user-org/property/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params
      })

      localStorage.removeItem('selectedPropertyRef')
      localStorage.setItem('selectedPropertyRef', data[0]['ref'])
      localStorage.removeItem('optionProperty')
      localStorage.setItem('optionProperty', JSON.stringify(data))

      await mainHelper.refreshToken();
    },
    reset_data () {
      //portfolio
      this.loadUser()
      this.data_local = {
        name: '',
        classification: 'Property Management',
        address: '',
        phone:'',
        notes:'',
        property_name: '',
        first_name: '',
        last_name: '',
      }
      this.$refs.address.$refs.autocomplete.value = ''
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadUser () {
      // this.data_local.first_name = decoded.first_name
      // this.data_local.last_name = decoded.last_name
      // this.data_local.email = decoded.email

      const result = await axios.get(`/user/all`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionUser = result['data']
    },
    async findUserByEmail(){
      const result = await axios.get(`/user/check-duplicate/${this.data_local.email}`, {
        headers: { 'Authorization': this.token }
      })

      this.data_local.first_name = result.data !== '' ? result.data.first_name : ''
      this.data_local.last_name = result.data !== '' ? result.data.last_name : ''
    }
  },
  async created () {   
    try {      
      // await this.loadUser()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Parent Org Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
}
</script>
