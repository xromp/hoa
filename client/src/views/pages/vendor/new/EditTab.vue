<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="ToolIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Business Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Name" v-model="data_local.business_name" v-validate="'required'" name="business_name" />
              <span class="text-danger text-sm"  v-show="errors.has('business_name')">{{ errors.first('business_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Email" v-model="data_local.business_email" v-validate="'required'" name="business_email" />
              <span class="text-danger text-sm"  v-show="errors.has('business_email')">{{ errors.first('business_email') }}</span>    
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Phone" v-model="data_local.business_phone" v-validate="'required'" name="business_phone" />
              <span class="text-danger text-sm"  v-show="errors.has('business_phone')">{{ errors.first('business_phone') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Category</label>
              <v-select :options="optionVendorCategory" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.category_id" name="category_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('category_id')">{{ errors.first('category_id') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Service Radius" v-model="data_local.service_radius" v-validate="'required'" name="service_radius" />
              <span class="text-danger text-sm"  v-show="errors.has('service_radius')">{{ errors.first('service_radius') }}</span>
            </div> 
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="ToolIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Business Address</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address line 1" v-model="data_local.business_address_line_1" v-validate="'required'" name="business_address_line_1" />
              <span class="text-danger text-sm"  v-show="errors.has('business_address_line_1')">{{ errors.first('business_address_line_1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City" v-model="data_local.business_city" type="text" v-validate="'required'" name="business_city" />
              <span class="text-danger text-sm"  v-show="errors.has('business_city')">{{ errors.first('business_city') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State" v-model="data_local.business_state" v-validate="'required'" name="business_state" />
              <span class="text-danger text-sm"  v-show="errors.has('business_state')">{{ errors.first('business_state') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Zip" v-model="data_local.business_zip" type="text" v-validate="'required'" name="business_zip" />
              <span class="text-danger text-sm"  v-show="errors.has('business_zip')">{{ errors.first('business_zip') }}</span>
            </div>

          </div>
        </div>
      </div>



      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="ToolIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Billing Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Email" v-model="data_local.billing_email" v-validate="'required'" name="text" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_email')">{{ errors.first('billing_email') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Phone" v-model="data_local.billing_phone" v-validate="'required'" name="text" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_phone')">{{ errors.first('billing_phone') }}</span>    
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address line 1" v-model="data_local.billing_address_line_1" type="text" v-validate="'required'" name="billing_address_line_1" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_address_line_1')">{{ errors.first('billing_address_line_1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City" v-model="data_local.billing_city" type="text" v-validate="'required'" name="billing_city" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_city')">{{ errors.first('billing_city') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State" v-model="data_local.billing_state" type="text" v-validate="'required'" name="billing_state" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_state')">{{ errors.first('billing_state') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Zip" v-model="data_local.billing_zip" type="text" v-validate="'required'" name="billing_zip" />
              <span class="text-danger text-sm"  v-show="errors.has('billing_zip')">{{ errors.first('billing_zip') }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="ToolIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Documents</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Business License" v-model="data_local.business_license" v-validate="'required'" name="text" />
              <span class="text-danger text-sm"  v-show="errors.has('business_license')">{{ errors.first('business_license') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Expiration" v-model="data_local.business_license_exp" v-validate="'required'" name="text" type="date" />
              <span class="text-danger text-sm"  v-show="errors.has('business_license_exp')">{{ errors.first('business_license_exp') }}</span>    
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Insurance License" v-model="data_local.insurance_license" type="text" v-validate="'required'" name="insurance_license" />
              <span class="text-danger text-sm"  v-show="errors.has('insurance_license')">{{ errors.first('insurance_license') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Expiration" v-model="data_local.insurance_license_exp" v-validate="'required'" name="insurance_license_exp" type="date"/>
              <span class="text-danger text-sm"  v-show="errors.has('insurance_license_exp')">{{ errors.first('insurance_license_exp') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Bond" v-model="data_local.bond_docs" type="text" v-validate="'required'" name="bond_docs" />
              <span class="text-danger text-sm"  v-show="errors.has('bond_docs')">{{ errors.first('bond_docs') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Bond Expiration" v-model="data_local.bond_docs_exp" v-validate="'required'" name="bond_docs_exp" type="date" />
              <span class="text-danger text-sm"  v-show="errors.has('bond_docs_exp')">{{ errors.first('bond_docs_exp') }}</span>
            </div>

          </div>
        </div>
      </div>

    </div>


    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit('a')" :disabled="!validateForm">Save and New</vs-button>
          <vs-button class="ml-4 mt-2" @click="submit('b')" :disabled="!validateForm">Save and Close</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '../../../../axios'

export default {
  components: {
    vSelect
  },
  data () {
    return {
      token: localStorage.usertoken,

      optionUser: [],
      optionProperty: [],
      optionVendorCategory: [],

      //vendor
      data_local: {
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        user_id: '',
        available_units: '',
        available_building: '',
        property_id: ''
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
    }
  },
  methods: {
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
    save_changes (loc) {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = -1
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/vendor/save/${editId}`, {
              data: this.data_local,
              token: this.token
            })
            .then(res => {    
              if(res['data'] != 'access_denied' && res['data'] != '') {

                if(res['data'] == 'success') {
                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully saved'
                  })

                  if (loc=='a') {
                    setTimeout(() => {
                      window.location.href = "/vendors/new";
                    },500)
                  } else {
                    this.$router.push({name:'app-vendor-list'})
                  }

                } else {
                  this.$vs.notify({
                    color: 'danger',
                    title: 'Saving Data',
                    text: 'Something went wrong'
                  })
                }

              } else {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
                this.$router.push({name:'app-vendor-list'})
              }

            })
            .catch(err => {
              this.$vs.notify({
                color: 'danger',
                title: 'Data Saving Error',
                text: 'The selected data was not saved'
              })
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

      }) 
    },
    reset_data () {
      //vendor
      this.data_local['name'] = ''
      this.data_local['email'] = ''
      this.data_local['phone'] = ''
      this.data_local['password'] = ''      
      this.data_local['address'] = ''
      this.data_local['user_id'] = ''
      this.data_local['available_units'] = ''
      this.data_local['available_building'] = ''
      this.data_local['property_id'] = ''
      
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    update_avatar () {
      // You can update avatar Here
      // For reference you can check dataList example
      // We haven't integrated it here, because data isn't saved in DB
    },
    loadUser () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/user/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadUser ', res)
        this.optionUser = res
      })
    },
    loadProperty () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/property/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadProperty ', res)
        this.optionProperty = res
      })
    },   
    loadVendorCategory () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/vendorCategoryMaster/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadVendorCategory ', res)
        this.optionVendorCategory = res
      })
    },     
  },
  created () {
    this.loadUser()
    this.loadProperty()    
    this.loadVendorCategory()
  }
}
</script>
