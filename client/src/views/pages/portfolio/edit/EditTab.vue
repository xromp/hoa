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
        <!-- <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">User Details</span>
        </div> -->
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
        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Email*" v-model="data_local.email" type="email" v-validate="'required'" name="email"/>
          <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>

        <!-- <div class="mt-4">
          <vs-input class="w-full mt-4" label="First name*" v-model="data_local.first_name" type="text" v-validate="'required'" name="first_name"/>
          <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
        </div> -->

        <!-- <div class="mt-4">
          <vs-input class="w-full mt-4" label="Last name*" v-model="data_local.last_name" type="text" v-validate="'required'" name="last_name"/>
          <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
        </div> -->

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Phone*" v-model="data_local.phone" type="phone" v-validate="'required'" name="phone" @keypress="isNumber"/>
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

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm || !is_dup">Save Changes</vs-button>
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

export default {
  components: {
    vSelect,
    VueGoogleAutocomplete
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      is_dup: true,
      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify(this.data)),

      optionClassification: [
        { name: 'Hotel',  id: '1', val: 'Hotel' },
        { name: 'Union',  id: '2', val: 'Union' },
        { name: 'Property Management',  id: '3', val: 'Property Management' }
      ],
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any()
      && this.data_local.name !== ''
    }
  },
  methods: {
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
    getAddressDataLine1: function (addressData, placeResultData) {
      const adStreet = typeof(addressData.street_number) === 'undefined' ? '' : addressData.street_number + ', '
      const adRoute = typeof(addressData.route) === 'undefined' ? '' : addressData.route + ' '
      const adAdmin1 = typeof(addressData.administrative_area_level_1) === 'undefined' ? '' : addressData.administrative_area_level_1 + ' '
      const adPostal = typeof(addressData.postal_code) === 'undefined' ? '' : addressData.postal_code + ' '
      this.data_local.address = adStreet + adRoute + addressData.locality + ' ' + adAdmin1 + adPostal + addressData.country
    }, 
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
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
          'old_name': this.data_local.old_name
        }
      })

      this.is_dup = !result.data.name
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        const editId = this.$route.params.editId
        const result = await axios.post(`/portfolio/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     
        this.$vs.loading()
        EventBus.$emit('side-menu-parent', true)   
        this.$router.push({name:'app-portfolio-view', params: {viewId: editId }})
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
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$refs.address.$refs.autocomplete.value = this.data_local.address
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    }
  }
}
</script>
