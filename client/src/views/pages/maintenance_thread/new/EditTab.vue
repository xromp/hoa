<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <!-- <div class="mt-4">
          <label class="vs-input--label">Maintenance Request</label>
          <v-select :options="optionMaintenance" :reduce="id => id.id" label="id" v-validate="'required'" v-model="data_local.maintenance_request_id" name="maintenance_request_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('maintenance_request_id')">{{ errors.first('maintenance_request_id') }}</span>
        </div>

        <div class="mt-4">
          <label class="vs-input--label">Vendor</label>
          <v-select :options="optionVendor" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.vendor_id" name="vendor_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('vendor_id')">{{ errors.first('vendor_id') }}</span>  
        </div> 

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Status" v-model="data_local.status" type="status" v-validate="'required'" name="status" />
          <span class="text-danger text-sm"  v-show="errors.has('status')">{{ errors.first('status') }}</span>
        </div>   --> 

        <div class="mt-4">
          <vs-textarea height="200px" class="w-full mt-4" label="Message" v-model="data_local.message" type="message" v-validate="'required'" name="message" />
          <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
        </div>
      </div>      
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '../../../../axios'
import common from '@/common'

export default {
  components: {
    vSelect
  },
  data () {
    return {
      token: localStorage.usertoken,

      optionMaintenance: [],
      optionVendor: [],

      //thread
      data_local: {
        maintenance_request_id: '',
        vendor_id: '',
        message: '',
        status: '',
        createdAt: null
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
    submit() {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes()
        }
      })
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = -1
      var maintenanceId = this.$route.params.viewId
      this.data_local.property_ref = localStorage.selectedPropertyRef
      this.data_local['maintenance_request_id'] = maintenanceId
      this.data_local.createdAt = common.setNewTZ(new Date())

      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/thread/save/${editId}`, {
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

                  // this.$router.push({path:`/maintenances/view/${maintenanceId}`})
                  this.$router.go(-1)
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
                this.$router.push({name:'app-thread-list'})
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
      //thread
      this.data_local['maintenance_request_id'] = ''
      this.data_local['vendor_id'] = ''
      this.data_local['message'] = ''
      this.data_local['status'] = ''      
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
    loadMaintenance () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/maintenance/list`, {
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
        console.log('res loadMaintenance ', res)
        this.optionMaintenance = res
      })
    },
    loadVendor () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/vendor/list`, {
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
        console.log('res loadVendor ', res)
        this.optionVendor = res
      })
    }
  },
  created () {
    this.loadMaintenance()
    this.loadVendor()
  }
}
</script>
