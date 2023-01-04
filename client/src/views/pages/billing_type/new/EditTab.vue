<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Name" v-model="data_local.name" type="text" v-validate="'required'" name="name" />
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>

        <vs-input class="w-full mt-4" label="Code" v-model="data_local.code" type="text" v-validate="'required'" name="code" />
        <span class="text-danger text-sm"  v-show="errors.has('code')">{{ errors.first('code') }}</span>
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

      //billing-type
      data_local: {
        name: '',
        code: ''
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
        const editId = -1
        const result = await axios.post(`/bill-type/save/${editId}`, 
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
      //billing-type
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
        title: 'Loading Billing Type Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {    
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/billing-types/new`) return
      console.log(`/billing-types/new`)
      await this.loadPropertyOrg()
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/billing-types/new`) return
      console.log(`/billing-types/new`)
      await this.loadPropertyOrg()
    })
  }
}
</script>
