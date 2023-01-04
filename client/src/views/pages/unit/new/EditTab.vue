<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Number" v-model="data_local.number" type="text" v-validate="'required'" name="number" />
        <span class="text-danger text-sm"  v-show="errors.has('number')">{{ errors.first('number') }}</span>

        <div class="mt-4">
          <label class="vs-input--label">Property*</label>
          <v-select :options="optionProperty" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.building_id" name="building_id" class="inputx" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('building_id')">{{ errors.first('building_id') }}</span>
        </div>
      </div>

      <!-- <div class="vx-col md:w-1/2 w-full"> -->
        <!-- <vs-input class="w-full mt-4" label="Unit Square Feet" v-model="data_local.unit_square_feet" type="unit_square_feet" v-validate="'required'" name="unit_square_feet" />
        <span class="text-danger text-sm"  v-show="errors.has('unit_square_feet')">{{ errors.first('unit_square_feet') }}</span>

        <vs-input type="number"  class="w-full mt-4" label="HOA Fee" v-model="data_local.hoa_fee" v-validate="'required'" name="hoa_fee" />
        <span class="text-danger text-sm"  v-show="errors.has('hoa_fee')">{{ errors.first('hoa_fee') }}</span>

        <vs-input class="w-full mt-4" label="Parking Stall Number" v-model="data_local.parking_stall_number" type="parking_stall_number" v-validate="'required'" name="parking_stall_number" />
        <span class="text-danger text-sm"  v-show="errors.has('parking_stall_number')">{{ errors.first('parking_stall_number') }}</span> -->
      <!-- </div>       -->
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

export default {
  components: {
    vSelect
  },
  data () {
    return {
      token: localStorage.usertoken,

      optionProperty: [],

      //unit
      data_local: {
        number: null,
        building_id: null,
        unit_square_feet: '',
        // hoa_fee: '',
        parking_stall_number: '',
        wine_locker_number: '',
        storage_unit_number: '',
        surfboard_storage: '',
        bike_storage: '',
        kayak_storage_number: '',
        boat_storage_number: '',
        unit_status_id: 0,
        is_high_security: 0,
        high_security_note: '',
        votes_pci: '',
        maint_fee: '',
        reserve_fee: '',
        rec_fee: ''
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
      ],

      // uploading docs
      files: [],
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    isNumber: (evt) => {
      evt = (evt) ? evt : window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
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
    async save_changes () {
      try {
        this.$vs.loading()
        if (!this.validateForm) return
        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.parent_org_id = parseInt(localStorage.selectedParentOrg)

        const editId = -1
        const result = await axios.post(`/unit/save/${editId}`, 
          { 
            data: this.data_local 
          }, { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': this.token
            }
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

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      //unit
      this.data_local['message'] = ''
      this.data_local['property_ref'] = ''
      this.data_local['title'] = ''
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadPropertyOrg() {
      const result = await axios.get('/user-org/property/list', {
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

      this.optionProperty = result.data
      this.optionProperty.filter((res) => {
        this.data_local.building_id = localStorage.selectedPropertyRef == res['ref'] ? res['id'] : this.data_local.building_id
      })
    } 
  },
  async created () {
    try {
      await this.loadPropertyOrg()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Unit Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {    
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/units/new`) return
      console.log(`/units/new`)
      await this.loadPropertyOrg()
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/units/new`) return
      console.log(`/units/new`)
      await this.loadPropertyOrg()
    })
  }
}
</script>
