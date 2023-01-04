<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Device Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Device Name" v-model="data_local.device_name" type="device_name" v-validate="'required'" name="device_name" />
              <span class="text-danger text-sm"  v-show="errors.has('device_name')">{{ errors.first('device_name') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Category</label>
              <v-select v-validate="'required'" :options="optionVendorCategoryMaster" :reduce="name => name.name" label="name" v-model="data_local.category" name="category"/>
              <span class="text-danger text-sm"  v-show="errors.has('category')">{{ errors.first('category') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Components</label>
              <v-select multiple :options="optionEquipment" :reduce="device_name => device_name.id" label="device_name" v-model="data_local.components" name="components"/>
              <span class="text-danger text-sm"  v-show="errors.has('components')">{{ errors.first('components') }}</span>
              <span class="text-danger text-sm"  v-show="errors.has('components')">{{ errors.first('components') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Files" v-model="data_local.files" type="files" name="files" />
              <span class="text-danger text-sm"  v-show="errors.has('files')">{{ errors.first('files') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Serviced By</label>
              <v-select :options="optionVendor" :reduce="email => email.id" label="email" v-model="data_local.serviced_by" name="serviced_by"/>
              <span class="text-danger text-sm"  v-show="errors.has('serviced_by')">{{ errors.first('serviced_by') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Model No" v-model="data_local.model_no" type="model_no" name="model_no" />
              <span class="text-danger text-sm"  v-show="errors.has('model_no')">{{ errors.first('model_no') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Part No" v-model="data_local.part_no" type="part_no" name="part_no" />
              <span class="text-danger text-sm"  v-show="errors.has('part_no')">{{ errors.first('part_no') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Unit Price" v-model="data_local.unit_price" type="unit_price" name="unit_price" />
              <span class="text-danger text-sm"  v-show="errors.has('unit_price')">{{ errors.first('unit_price') }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Reminders</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Service Reminders" v-model="data_local.service_reminders" type="date" name="service_reminders" />
              <span class="text-danger text-sm"  v-show="errors.has('service_reminders')">{{ errors.first('service_reminders') }}</span>
            </div>

            <div class="mt-4">
              <vs-textarea class="w-full mt-4" label="Notes" v-model="data_local.notes" type="notes" name="notes" />
              <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
            </div>            

          </div>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Location</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Location Name" v-model="data_local.location_name" type="location_name" name="location_name" />
              <span class="text-danger text-sm"  v-show="errors.has('location_name')">{{ errors.first('location_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Location Description" v-model="data_local.location_description" type="location_description" name="location_description" />
              <span class="text-danger text-sm"  v-show="errors.has('location_description')">{{ errors.first('location_description') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Longtitude" v-model="data_local.longtitude" type="longtitude" name="longtitude" />
              <span class="text-danger text-sm"  v-show="errors.has('longtitude')">{{ errors.first('longtitude') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Latitude" v-model="data_local.latitude" type="latitude" name="latitude" />
              <span class="text-danger text-sm"  v-show="errors.has('latitude')">{{ errors.first('latitude') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Input Location" v-model="data_local.input_location" type="input_location" name="input_location" />
              <span class="text-danger text-sm"  v-show="errors.has('input_location')">{{ errors.first('input_location') }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Warranty</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Warranty Start" v-model="data_local.warranty_start" type="date" name="warranty_start" />
              <span class="text-danger text-sm"  v-show="errors.has('warranty_start')">{{ errors.first('warranty_start') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Warranty End" v-model="data_local.warranty_end" type="date" name="warranty_end" />
              <span class="text-danger text-sm"  v-show="errors.has('warranty_end')">{{ errors.first('warranty_end') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Standard Warranty" v-model="data_local.standard_warranty" type="date" name="standard_warranty" />
              <span class="text-danger text-sm"  v-show="errors.has('standard_warranty')">{{ errors.first('standard_warranty') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Extended Warranty" v-model="data_local.extended_warranty" type="date" name="extended_warranty" />
              <span class="text-danger text-sm"  v-show="errors.has('extended_warranty')">{{ errors.first('extended_warranty') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Expiration Reminder" v-model="data_local.expiration_reminder" type="date" name="expiration_reminder" />
              <span class="text-danger text-sm"  v-show="errors.has('expiration_reminder')">{{ errors.first('expiration_reminder') }}</span>
            </div>

          </div>
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

      optionVendor: [],
      optionVendorCategoryMaster: [],
      optionEquipment: [],

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
          await axios.post(`/equipment/save/${editId}`, {
              data: this.data_local,
              token: this.token
            })
            .then(res => {
              if(res['data'] != 'access_denied' && res['data'] != '') {

                if(res['data']['message'] == 'success') {
                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully Saved'
                  })
                  this.$router.push({name:'app-equipment-view', params: {viewId: editId }})
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
                this.$router.push({name:'app-equipment-view', params: {viewId: editId }})
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
    loadVendorCategoryMaster () {
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
        console.log('res loadVendorCategoryMaster ', res)
        this.optionVendorCategoryMaster = res
      })
    },
    loadOptionEquipment () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/part/list`, {
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
        console.log('res loadOptionEquipment ', res)
        this.optionEquipment = res
      })
    },    
    loadVendor () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/vendor/list`, {
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
    },
  },
  created () {
    this.loadVendor()
    this.loadVendorCategoryMaster()
    this.loadOptionEquipment()
  }
}
</script>
