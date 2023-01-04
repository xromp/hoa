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
      <div class="vx-col md:w-1/2 w-full user-create-info">
        <AssignAccessBtn></AssignAccessBtn>

        <vs-input
        :danger="is_dup===false"
        danger-text="Email exist"
        val-icon-danger="icon-x"

        :success="is_dup"
        success-text="Email is valid"
        val-icon-success="icon-check"

        val-icon-pack="feather"
        class="w-full mt-4" label="Email*"
        v-model="data_local.email" 
        ref="email"
        autocomplete="chrome-off"
        :disabled="loadEmail"
        v-validate="'required'" name="email" type="email" @blur="checkDuplicate()"
        />
        <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

        <!-- <vs-input class="w-full mt-4" label="Is Activated" v-model="data_local.is_activated" v-validate="'required'" name="is_activated" />
        <span class="text-danger text-sm"  v-show="errors.has('is_activated')">{{ errors.first('is_activated') }}</span>  -->

        <!-- <vs-input class="w-full mt-4" label="Notes" v-model="data_local.notes" v-validate="'required'" name="notes" />
        <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span> -->   
      </div>

      <div class="vx-col md:w-1/2 w-full mt-2">
        <div class="vx-row">    
          <div class="vx-col w-1/2">
            <vs-input type="password" hidden/>
            <label class="vs-input--label">User Role*</label>
            <v-select
              class="mt-2"
              v-model="data_local.user_role_id"
              label="name"
              v-validate="'required'" 
              :options="roleOptions" 
              :reduce="role => role.id" 
              name="user_role_id"
              type="text"
              autocomplete="off"/>
            <span class="text-danger text-sm"  v-show="errors.has(`user_role_id`)">{{ errors.first(`user_role_id`) }}</span>
          </div>

          <div class="vx-col w-1/2" v-if="false">
            <label class="vs-input--label">Parent Org*</label>
            <v-select
              class="mt-2"
              v-model="data_local.parent_id"
              v-validate="'required'" 
              label="name" 
              :options="pmcOptions" 
              :reduce="pmc => pmc.id"
              name="parent_id"
              type="text"
              disabled
              autocomplete="off"/>
            <span class="text-danger text-sm"  v-show="errors.has(`parent_id`)">{{ errors.first(`parent_id`) }}</span>
          </div>
        <!-- </div> -->

        <!-- <div class="vx-row">   -->
          <div class="vx-col w-1/2 mt-4" v-if="false">
            <label class="vs-input--label">Property</label>
            <v-select
              v-model="data_local.property_id"
              label="name" 
              :options="propertyOptions" 
              :reduce="name => name.id" 
              name="property_id"
              type="text"
              autocomplete="off"
              disabled
              @change="loadUnit" @input="loadUnit()"
              />
            <span class="text-danger text-sm"  v-show="errors.has(`property_id`)">{{ errors.first(`property_id`) }}</span>
          </div>

          <div class="vx-col w-1/2 mt-2">
            <vs-input type="password" hidden/>
            <label class="vs-input--label">Unit</label>
            <v-select
              v-model="data_local.unit_id"
              label="number" 
              :options="optionUnit" 
              :reduce="number => number.id" 
              name="unit_id"
              type="text"
              autocomplete="off"/>
          </div>
        </div>
      </div>

      <div class="vx-col md:w-1/2 w-full" v-if="false">
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
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-8">
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
              <v-select :options="optionSalutation" :reduce="name => name.id" label="name" v-model="data_local.salutation_id" name="salutation_id"/>              
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="First Name*" v-model="data_local.first_name" type="first_name" v-validate="'required'" name="first_name" />
              <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Middle Name" v-model="data_local.middle_name" type="middle_name" name="middle_name" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Last Name*" v-model="data_local.last_name" type="last_name" v-validate="'required'" name="last_name" />
              <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Suffix" v-model="data_local.suffix" type="suffix" name="suffix" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Phone No*" v-model="data_local.phone1" type="phone1" v-validate="'required'" name="phone1" @keypress="isNumber" @blur="validatePhone"/>
              <span class="text-danger text-sm"  v-show="errors.has('phone1')">{{ errors.first('phone1') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Secondary Phone No" v-model="data_local.phone2" type="phone2" name="phone2" @keypress="isNumber" />
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Date of Birth" v-model="data_local.dob" type="date" name="dob" />              
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

      <div class="vx-col w-full md:w-1/2 mt-8">
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
                autocomplete="address_line_1" 
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
              <vs-input class="w-full mt-4" label="Company Name" v-model="data_local.company_name" type="company_name" name="company_name" />
              <span class="text-danger text-sm"  v-show="errors.has('company_name')">{{ errors.first('company_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="State / Province" v-model="data_local.province" type="province" name="province" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('province')">{{ errors.first('province') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="City" v-model="data_local.city" type="city" name="city" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('city')">{{ errors.first('city') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Country</label>
              <v-select :options="optionCountry" :reduce="name => name.id" label="name" v-model="data_local.country_id" name="country_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('country_id')">{{ errors.first('country_id') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Postcode" v-model="data_local.postcode" type="postcode" name="postcode" autocomplete="chrome-off"/>
              <span class="text-danger text-sm"  v-show="errors.has('postcode')">{{ errors.first('postcode') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-8">
        <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="ToggleRightIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">User is Designated To Approve</span>
        </div>

        <div class="mt-4">
          <ul class="demo-alignment">
            <li>
              <vs-checkbox v-model="data_local.d_maintenance" color="success">Maintenance requests</vs-checkbox>
            </li>
            <li>
              <vs-checkbox v-model="data_local.d_reservation" color="success">Reservations</vs-checkbox>
            </li>
            <li>
              <vs-checkbox color="danger" disabled>Bulletin board posts</vs-checkbox>
            </li>
          </ul>
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
import axios from '@/axios'
const jwt = require('jsonwebtoken')
var token = localStorage.usertoken
var decoded = jwt.verify(token, 'secret')
import UpdateAvatar from '../../../components/files/UploadAvatar.vue'
import EventBus from '@/EventBus'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import UserOrgRole from '../common/user_org_role.vue';
import AssignAccessBtn from '@/views/components/user-org-role/AssignAccessBtn.vue'

export default {
  components: {
    vSelect,
    UpdateAvatar,
    UserOrgRole,
    VueGoogleAutocomplete,
    AssignAccessBtn
  },
  data () {
    return {
      loadEmail: true,
      is_dup: null,

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

      token: token,
      pmcId: decoded.pmc_id,

      propertyOptions: [],
      roleOptions: [],
      optionUnit: [],
      pmcOptions: [],

      optionSalutation: [],
      optionCountry: [],
      password: '',
      confirm_password: '',      

      //user
      data_local: {
        d_maintenance: false,
        d_reservation: false,
        d_bulletin: false,

        user_role_id: 0,
        parent_id: 0,
        property_id: 0,
        property_ref: '',
        unit_id: 0,

        email: '',
        first_name: '',
        last_name: '',
        is_activated: '',
        password: '',
        confirm_password: '',
        profile_json: '',
        phone1: '',
        dob: null,
        middle_name: '',
        phone2: '',
        salutation_id: 0,
        suffix: '',
        notes: '',
        avatar_filename: '',
        city: '',
        country_id: null,
        address_line_1: '',
        province: '',
        address_line_2: '',
        postcode: '',
        company_name: '',
        // user_role_id: this.$route.query.r == 'pmcm' || this.$route.query.r == 'unr' ? parseInt(this.$route.query.rid) : 0,
        // property_id: [],
        emergency_contact_name: '',
        relation: '',
        emergency_contact_no: '',
        pmc_id: null,
        // unit_id: [],
        user_roles: [{ pmc_id: '', property_id: '', user_role_id: '', unit_id:'' }],
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
    accessLevel() {
      const userAllData = JSON.parse(localStorage.userAllData)

      return userAllData.user_role.access_level
    },
    folderPath() {
      return `docs/user/avatar/-1`
    },    
    validateForm () {
      return !this.errors.any() 
      && this.data_local.user_role_id !== 0 
      && this.data_local.email !== ''
      && this.is_dup
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
    async checkDuplicate () {
      this.is_dup = null
      if (this.data_local.email === '') return

      const result = await axios.get(`/user/check-duplicate/${this.data_local.email}`, {
        headers: { 
          'Authorization': this.token, 
        }
      })

      this.is_dup = !result.data.email

      if (this.is_dup) return
      setTimeout(async () => { EventBus.$emit('assign-form-active', result.data.id) },1000)
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
        this.$refs[type].$refs.autocomplete.value = null;
      }
    },
    async getAddressData({ country, locality, postal_code, administrative_area_level_1 }, { formatted_address }, type) {
      this.data_local[type] = formatted_address;
      this.data_local.postcode = postal_code;
      this.data_local.province = administrative_area_level_1;
      this.data_local.city = locality
      const { id:country_id } = this.optionCountry.find(({ name }) => name === country);
      this.data_local.country_id = country_id;
    },
    async loadParentOrg() {
      const { data } = await axios.get(`/user-org/portfolio/list`, {
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
      this.pmcOptions = data
      this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
    },
    async loadProperty() {
      const result = await axios.get('/user-org/property/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': parseInt(localStorage.selectedParentOrg),
          'role_id': parseInt(localStorage.selectedRoleId),
          'role_val': localStorage.selectedRoleVal,
          'type': 'overflow'
        }
      })

      this.propertyOptions = result.data
      this.data_local.property_ref = localStorage.selectedPropertyRef
      const selectedProperty = this.propertyOptions.filter((result) =>
        result.ref === localStorage.selectedPropertyRef
      )
      this.data_local.property_id = selectedProperty[0]['id']
      // await this.setAddress(this.data_local.property_id);
      this.loadUnit()
    },
    async setAddress(id) {
      const { data } = await axios.get(`/property/view/${id}`, {
        headers: { 
          'Authorization': this.token, 
        }
      });
      const { address_line_1, address_line_2, city, state, postal_code, country_id } = data;
      this.data_local.address_line_1 = address_line_1;
      this.data_local.address_line_2 = address_line_2;
      this.data_local.city = city;
      this.data_local.province = state;
      this.data_local.postcode = postal_code;
      this.data_local.country_id = country_id;
    },
    async loadUnit() {
      this.data_local.unit_id = null
      this.data_local.property_ref = this.propertyOptions.filter(result => result.id === this.data_local.property_id).map(({ref}) => ref)
      const {data} = await axios.get('/unit/list', {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': parseInt(localStorage.selectedParentOrg)
        }
      })

      let na = { id:0, number:'N/A' }
      this.optionUnit = data.length === 0 ? [] : [na, ...data]
      this.data_local.unit_id = 0
      // this.data_local.unit_id = this.optionUnit.length === 0 ? 0 : this.optionUnit[0]['id']
    }, 
    async loadUserRole() {
      const result = await axios.get('/role/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.roleOptions = result['data']
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
    async save_changes (loc) {
      try {
        if (!this.is_dup) {          
          this.checkDuplicate()
          return false
        }

        if (!this.validateForm) return
        this.$vs.loading()
        // const unid = this.data_local.user_roles
        // .map(r => ( r.unit_id ))
        // this.data_local.unit_id = unid.flat()

        this.data_local.pmc_id = this.$route.query.pmcid === undefined ? this.pmcId : this.$route.query.pmcid
        this.data_local.password = this.confirm_password
        const editId = -1

        const result = await axios.post(`/user/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        this.resDataLocal = result['data']['result']

        if (result['data']['error_message']) {
          this.$vs.notify({
            color: 'danger',
            title: 'Saved',
            text: result['data']['error_message']
          })
          this.$vs.loading.close()
          return false
        }

        await axios.post(`/user-org/add`,
          { 
            data: {
              user_id: [this.resDataLocal.id],
              role_id: this.data_local.user_role_id, 
              pmc_id: this.data_local.parent_id, 
              property_id: this.data_local.property_id, 
              type: 'assign'
            }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
        )

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: this.resDataLocal.id,
          path: `docs/user/avatar/${this.resDataLocal.id}`,
          folderId: this.folderId
        })
        
        this.$vs.notify({
          color: 'success',
          title: 'Saved',
          text: 'New user type was successfully Saved'
        })

        if (loc === 'a') {
          window.location.href = "/users/new";
        } else {
          this.$vs.loading.close()
          this.$router.push({name:'app-user-list'})
        }
      } catch (err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
        this.$router.go(-1)
      }
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
      this.data_local['property_id'] = ''      
      this.data_local['pmc_id'] = ''      
      
      this.$vs.notify({
        color: 'orange',
        title: 'Edit',
        text: 'The selected user type details was reset'
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
      await this.loadSalutation()
      await this.loadCountry()

      await this.loadUserRole();
      await this.loadParentOrg();
      await this.loadProperty();
      await this.loadUnit()      
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading User Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/users/new`) return
      console.log(`/users/new`)
      this.data_local.user_role_id = null
      await this.loadUserRole()
      await this.loadProperty();
      this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/users/new`) return
      this.data_local.user_role_id = null
      console.log(`/users/new`)
      await this.loadUserRole()
      await this.loadProperty();
    })

    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })

    EventBus.$on('delete-file', res => {
      this.filesDel = res
    })
    setTimeout(() => {
      this.$refs.address_line_1.$el.setAttribute('autocomplete', 'disabled')
      this.loadEmail = !this.loadEmail 
    }, 1000);
  }  
}
</script>

<style>
  div.user-create-info .add-access-btn {
    display: none;
  }
</style>
