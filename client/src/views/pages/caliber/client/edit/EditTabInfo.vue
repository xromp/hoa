<template>
  <div id="data-edit-tab-account">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Personal Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-colw-full">

            <div class="mt-4">
              <label class="vs-input--label">Salutation</label>
              <v-select :options="optionSalutation" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.salutation_id" name="salutation_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('salutation_id')">{{ errors.first('salutation_id') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="First Name" v-model="data_local.first_name" type="first_name" v-validate="'required'" name="first_name" />
              <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Middle Name" v-model="data_local.middle_name" type="middle_name" v-validate="'required'" name="middle_name" />
              <span class="text-danger text-sm"  v-show="errors.has('middle_name')">{{ errors.first('middle_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Last Name" v-model="data_local.last_name" type="last_name" v-validate="'required'" name="last_name" />
              <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Suffix" v-model="data_local.suffix" type="suffix" v-validate="'required'" name="suffix" />
              <span class="text-danger text-sm"  v-show="errors.has('suffix')">{{ errors.first('suffix') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Phone 1" v-model="data_local.phone1" type="phone1" v-validate="'required'" name="phone1" />
              <span class="text-danger text-sm"  v-show="errors.has('phone1')">{{ errors.first('phone1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Phone 2" v-model="data_local.phone2" type="phone2" v-validate="'required'" name="phone2" />
              <span class="text-danger text-sm"  v-show="errors.has('phone2')">{{ errors.first('phone2') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Date of Birth" v-model="data_local.dob" type="date" v-validate="'required'" name="dob" />
              <span class="text-danger text-sm"  v-show="errors.has('dob')">{{ errors.first('dob') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Address</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address Line 1" v-model="data_local.address_line_1" type="address_line_1" v-validate="'required'" name="address_line_1" />
              <span class="text-danger text-sm"  v-show="errors.has('address_line_1')">{{ errors.first('address_line_1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Address Line 2" v-model="data_local.address_line_2" type="address_line_2" v-validate="'required'" name="address_line_2" />
              <span class="text-danger text-sm"  v-show="errors.has('address_line_2')">{{ errors.first('address_line_2') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Province" v-model="data_local.province" type="province" v-validate="'required'" name="province" />
              <span class="text-danger text-sm"  v-show="errors.has('province')">{{ errors.first('province') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City" v-model="data_local.city" type="city" v-validate="'required'" name="city" />
              <span class="text-danger text-sm"  v-show="errors.has('city')">{{ errors.first('city') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Country</label>
              <v-select :options="optionCountry" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.country_id" name="country_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('country_id')">{{ errors.first('country_id') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Postcode" v-model="data_local.postcode" type="postcode" v-validate="'required'" name="postcode" />
              <span class="text-danger text-sm"  v-show="errors.has('postcode')">{{ errors.first('postcode') }}</span>
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
      stats: [
        { label: 'Active',  value: '1' },
      ],

      optionSalutation: [],
      optionCountry: [],

      options: [
        { value: '1', label: 'Mr'},
        { value: '2', label: 'Ms'},
        { value: '3', label: 'Dr'},
      ],

      statusOptions: [
        { label: 'Active',  value: '1' },
        { label: 'Blocked',  value: '2' },
        { label: 'Deactivated',  value: '3' }
      ],
      salutationOptions: [
        { label: 'Mr',  value: '1' },
        { label: 'Ms',  value: '2' },
        { label: 'Drr.',  value: '3' }
      ]
    }
  },
  computed: {
    status_local: {
      get () {
        return { 
          label: this.stats.label,  
          value: this.stats.value  
        }
      },
      set (obj) {
        this.stats.value = obj.value
      }
    },
    salutation_local: {
      get () {
        return { 
          label: this.capitalize(this.data_local.salutation.name),  
          value: this.data_local.salutation_id  
        }
      },
      set (obj) {
        this.data_local.salutation_id = obj.value
        console.log('obj.value ', obj.value)
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
          await axios.post(`/user/save/${editId}`, {
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
                  this.$router.push({name:'app-user-view', params: {viewId: editId }})
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
                this.$router.push({name:'app-user-view', params: {viewId: editId }})
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
    loadSalutation () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/salutation/list`, {
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
        console.log('res salutation ', res)
        this.optionSalutation = res
      })
    },
    loadCountry () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/country/list`, {
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
        console.log('res country ', res)
        this.optionCountry = res
      })
    }
  },
  created () {
    this.loadSalutation()
    this.loadCountry()
  }
}
</script>
