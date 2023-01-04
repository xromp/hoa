<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
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

      <div class="vx-col md:w-1/2 w-full">
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

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">Save Changes</vs-button>
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
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify(this.data)),

      optionUser: [],
      optionProperty: [],
      optionVendorCategory: [],

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
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = this.$route.params.editId
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
                    text: 'The selected data was successfully Saved'
                  })
                  this.$router.push({name:'app-vendor-view', params: {viewId: editId }})
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
                this.$router.push({name:'app-vendor-view', params: {viewId: editId }})
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
      this.data_local = JSON.parse(JSON.stringify(this.data))
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
