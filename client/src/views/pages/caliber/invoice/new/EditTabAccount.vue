<template>
  <div id="data-edit-tab-info">

    <!-- Avatar Row -->
    <div class="vx-row">

      <div class="vx-col w-full">
        <div class="flex items-start flex-col sm:flex-row">
          <img :src="data_local.avatar" class="mr-8 rounded h-24 w-24" />
          <!-- <vs-avatar :src="data_localavatar" size="80px" class="mr-4" /> -->
          <div>
            <p class="text-lg font-medium mb-2 mt-4 sm:mt-0">{{ data_local.first_name  }}</p>
            <input type="file" class="hidden" ref="update_avatar_input" @change="update_avatar" accept="image/*">

            <!-- Toggle comment of below buttons as one for actual flow & currently shown is only for demo -->
            <vs-button class="mr-4 mb-4">Change Avatar</vs-button>
            <!-- <vs-button type="border" class="mr-4" @click="$refs.update_avatar_input.click()">Change Avatar</vs-button> -->

            <vs-button type="border" color="danger">Remove Avatar</vs-button>
          </div>
        </div>
      </div>
    </div>

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
        <vs-input class="w-full mt-4" label="Email" v-model="data_local.email" v-validate="'required'" name="email" type="email"/>
        <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

        <vs-input class="w-full mt-4" label="Is Activated" v-model="data_local.is_activated" v-validate="'required'" name="is_activated" />
        <span class="text-danger text-sm"  v-show="errors.has('is_activated')">{{ errors.first('is_activated') }}</span> 

        <vs-input class="w-full mt-4" label="Notes" v-model="data_local.notes" v-validate="'required'" name="notes" />
        <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>   
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Password" v-model="data_local.password" v-validate="'required'" name="password" type="password"/>
        <span class="text-danger text-sm"  v-show="errors.has('password')">{{ errors.first('password') }}</span>  

        <vs-input class="w-full mt-4" label="Confirm Password" v-model="data_local.confirm_password" v-validate="'required'" name="confirm_password" type="password"/>
        <span class="text-danger text-sm"  v-show="errors.has('confirm_password')">{{ errors.first('confirm_password') }}</span>

        <div class="mt-4">
          <label class="vs-input--label">User Role</label>
          <v-select :options="optionUserRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.user_role_id" name="user_role_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('user_role_id')">{{ errors.first('user_role_id') }}</span>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Personal Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

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

      <div class="vx-col w-full md:w-1/2 mt-4">
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

      optionSalutation: [],
      optionUserRole: [],
      optionCountry: [],

      //user
      data_local: {
        email: '',
        first_name: '',
        last_name: '',
        is_activated: '',
        password: '',
        confirm_password: '',
        profile_json: '',
        phone1: '',
        dob: '',
        middle_name: '',
        phone2: '',
        salutation_id: '',
        suffix: '',
        notes: '',
        avatar_filename: '',
        city: '',
        country_id: '',
        address_line_1: '',
        province: '',
        address_line_2: '',
        postcode: '',
        user_role_id: ''
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
                    text: 'The selected data was successfully saved'
                  })
                  

                  if (loc=='a') {
                    setTimeout(() => {
                      window.location.href = "/users/new";
                    },500)
                  } else {
                    this.$router.push({name:'app-user-list'})
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
                
                this.$router.push({name:'app-user-list'})
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
      //user
      this.data_local['email'] = ''
      this.data_local['first_name'] = ''
      this.data_local['last_name'] = ''
      this.data_local['password'] = ''
      this.data_local['profile_json'] = ''
      this.data_local['phone1'] = ''
      this.data_local['dob'] = ''
      this.data_local['middle_name'] = ''
      this.data_local['phone2'] = ''
      this.data_local['salutation_id'] = ''
      this.data_local['suffix'] = ''
      this.data_local['notes'] = ''
      this.data_local['city'] = ''
      this.data_local['country_id'] = ''
      this.data_local['address_line_1'] = ''
      this.data_local['province'] = ''
      this.data_local['address_line_2'] = ''
      this.data_local['postcode'] = ''
      this.data_local['user_role_id'] = ''
      
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
    },
    loadUserRole () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/userRole/list`, {
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
        console.log('res user role ', res)
        this.optionUserRole = res
      })
    }
  },
  created () {
    this.loadSalutation()
    this.loadCountry()
    this.loadUserRole()
  }
}
</script>
