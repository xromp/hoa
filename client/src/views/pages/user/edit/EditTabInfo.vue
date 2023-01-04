<template>
  <div id="data-edit-tab-info">

    <!-- Avatar Row -->
    <update-avatar 
      :loadFile="loadFile" 
      :folderPath="folderPath" 
      :folderId="folderId" 
      class="mb-4" 
      :defaultImg = "defaultImg"
    />

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Email" v-model="data_local.email" v-validate="'required'" name="email" />
        <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>


        <vs-input class="w-full mt-4" label="Notes" v-model="data_local.notes" name="notes" />

      </div>

      <!-- <div class="vx-col md:w-1/2 w-full">
        <vs-input
          ref="password"
          type="password"
          data-vv-validate-on="blur"
          v-validate="'required|min:6'"
          name="password"
          label="Password*"          
          placeholder="Password"
          v-model="password"
          class="w-full mt-4" />
        <span class="text-danger text-sm">{{ errors.first('password') }}</span>  

        <vs-input
          type="password"
          v-validate="'required|min:6|confirmed:password'"
          data-vv-validate-on="blur"
          data-vv-as="password"
          name="confirm_password"
          placeholder="Confirm Password"
          label="Confirm Password*"
          v-model="confirm_password"
          class="w-full mt-4" />
        <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
        
      </div> -->
    </div>


    <div class="vx-row mt-8">
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
              <vs-input class="w-full mt-4" label="Middle Name" v-model="data_local.middle_name" type="middle_name" name="middle_name" />
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
              <vs-input class="w-full mt-4" label="Phone No" v-model="data_local.phone1" type="phone1" v-validate="'required'" name="phone1" @keypress="isNumber" @blur="validatePhone"/>
              <span class="text-danger text-sm"  v-show="errors.has('phone1')">{{ errors.first('phone1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Secondary Phone No" v-model="data_local.phone2" type="phone2" name="phone2" @keypress="isNumber" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Date of Birth" v-model="data_local.dob" type="date" v-validate="'required'" name="dob" />
              <span class="text-danger text-sm"  v-show="errors.has('dob')">{{ errors.first('dob') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Emergency Contact Name" v-model="data_local.emergency_contact_name" name="emergency_contact_name" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Emergency Contact No" v-model="data_local.emergency_contact_no" name="emergency_contact_no" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Relation" v-model="data_local.relation" name="relation" />
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Mailing Address</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4">
              <label class="vs-input--label">Address Line 1*</label>
              <vue-google-autocomplete
                @blur="checkAdress('address_line_1')"
                id="address_line_1"
                name="address_line_1"
                v-model="data_local.address_line_1"
                aria-describedby="address-feedback"
                class="vs-inputx vs-input--input normal w-full"
                style="border: 1px solid rgba(0, 0, 0, 0.2)"
                placeholder=""
                types="address"
                ref="address_line_1"    
                v-validate="'required'"
                v-on:placechanged="getAddressData"
              ></vue-google-autocomplete>
              <span class="text-danger" v-if="errors.first('address_line_1')">Please re-type Address</span> 
            </div>

            <div class="mt-4">
              <vs-input autocomplete="chrome-off" class="w-full mt-4" label="Address Line 2" v-model="data_local.address_line_2" type="address_line_2" name="address_line_2" />
              <span class="text-danger text-sm"  v-show="errors.has('address_line_2')">{{ errors.first('address_line_2') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State / Province" v-model="data_local.province" type="province" v-validate="'required'" name="province" />
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
import axios from '@/axios'
import UpdateAvatar from '../../../components/files/UploadAvatar.vue'
import EventBus from '@/EventBus'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import UserOrgRole from '../common/user_org_role.vue';

export default {
  components: {
    vSelect,
    UpdateAvatar,
    UserOrgRole,
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
      //uploading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 3,
      defaultImg: '/img/avatar-s-11.4799a585.png',
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      tableRead: [],

      token: localStorage.usertoken,
      optionSalutation: [],
      optionCountry: [],
      data_local: JSON.parse(JSON.stringify(this.data)),
      password: '',
      confirm_password: '',
      permissions: [{
        users: {
          'read': true,
          'write': false,
          'create': false,
          'delete': false
        },
        posts: {
          'read': true,
          'write': true,
          'create': true,
          'delete': true
        },
        comments: {
          'read': true,
          'write': false,
          'create': true,
          'delete': false
        }
      }],

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
      return `docs/user/avatar/${this.data_local.id}`
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
    },
    userRoles() {
      const groupsByRole = this.data_local.user_org_roles.reduce((acc, value) => {
        if (acc.length 
            && acc[acc.length - 1][0].user_role_id === value.user_role_id) {
          acc[acc.length - 1].push(value);
        } else {
          acc.push([value]);
        }
        return acc;
      }, []);
      return groupsByRole.map(e => ({ 
          ...e[0], 
          ...JSON.parse(e[0].other_data_obj),
          pmc_id: parseInt(e[0].pmc_id),
        }));
    }
    
  },
  methods: {
    validatePhone(){
      const allowedKey = /[+-.\()]/gi;
      const filtered =  this.data_local.phone1.replace(allowedKey,'')

      if (isNaN(filtered)) {
        this.errors.add({
          field: 'phone1',
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
    checkAdress(type) {
      if (!this.$refs[type].$refs.autocomplete.value) {
        this.data_local[type] = null;
        this.$refs[type].$refs.autocomplete.value = null
      }
    },
    async getAddressData({ country, locality, postal_code }, { formatted_address }, type) {
      this.data_local[type] = formatted_address;
      this.data_local.postcode = postal_code;
      this.data_local.province = locality;
      const { id:country_id } = this.optionCountry.find(({ name }) => name === country);
      this.data_local.country_id = country_id;
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async save_changes () {
      try {
        const editId = this.$route.params.editId
        this.data_local.password = this.confirm_password
        if (!this.validateForm) return
        this.$vs.loading()

        const result = await axios.post(`/user/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        if (result['data']['error_message']) {
          this.$vs.notify({
            color: 'danger',
            title: 'Data Saved',
            text: result['data']['error_message']
          })
          this.$vs.loading.close()
          return false
        }

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: this.folderPath,
          folderId: this.folderId
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
        this.$router.go(-1)
      } 
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadSalutation() {
      const result = await axios.get(`/api/salutation/list`, {
        headers: { 
          'Authorization': this.token
        }
      })

      this.optionSalutation = result['data']
    },   
    async loadCountry() {
      const result = await axios.get(`/api/country/list`, {
        headers: { 
          'Authorization': this.token
        }
      })
      this.optionCountry = result['data']
    },
  },
  async created () {
    try {
      this.data_local.password = null
      this.data_local.email_old = this.data_local.email
      await this.loadSalutation()
      await this.loadCountry()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading User Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })

    EventBus.$on('delete-file', res => {
      this.filesDel = res
    })
    setTimeout(() => this.$refs.address_line_1.$el.setAttribute('autocomplete', 'disabled'), 1000);
  }
}
</script>