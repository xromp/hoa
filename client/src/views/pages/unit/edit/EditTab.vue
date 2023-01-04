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
import EventBus from '@/EventBus'

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
      optionProperty: [],

      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify(this.data)),

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
    unit_number () {
      return this.data_local.number
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
    }
  },
  methods: {
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        const editId = this.$route.params.editId       
        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.parent_org_id = parseInt(localStorage.selectedParentOrg )
        const result = await axios.post(`/unit/save/${editId}`, 
          { data: this.data_local }, 
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }
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
      this.data_local = JSON.parse(JSON.stringify(this.data))
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
      this.data_local.unit_number = this.unit_number
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
    const editId = this.$route.params.editId  
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/units/edit/${editId}`) return
      console.log(`/units/edit/${editId}`)
      // await this.loadPropertyOrg()
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/units/edit/${editId}`) return
      console.log(`/units/edit/${editId}`)
      // await this.loadPropertyOrg()
    })      
  }
}
</script>
