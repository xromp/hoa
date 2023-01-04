<template>
  <div class="vx-col w-full mt-4">
    <div class="flex items-end">
      <feather-icon icon="LockIcon" class="mr-2" svgClasses="w-5 h-5" />
      <span class="leading-none font-medium">User Roles</span>
    </div>
    <div class="mt-2 d-inline">
      <div class="dt-available mb-4"> <!-- :key="key" v-for="(user, key) in userRoles" -->
        <div class="vx-row">    
          <div class="vx-col w-1/2 mt-4">
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

          <div class="vx-col w-1/2 mt-4">
            <label class="vs-input--label">Parent Org*</label>
            <!-- <feather-icon
              icon="XCircleIcon" 
              svgClasses="h-6 w-6 mr-4 hover:text-primary cursor-pointer"
              class="cursor-pointer text-danger" 
              style="float: right"
              v-show="key !== 0"
              @click="deleteRole(key, user.id)"/>
            <feather-icon
              icon="PlusCircleIcon" 
              svgClasses="h-6 w-6 mr-4 hover:text-primary cursor-pointer"
              class="cursor-pointer text-success" 
              style="float: right"
              v-show="userRoles.length === key+1"
              @click="addRole()"/> --> 
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
        </div>

        <div class="vx-row">  
          <div class="vx-col w-1/2 mt-4">
            <label class="vs-input--label">Property*</label>
            <v-select
              v-model="data_local.property_id"
              v-validate="'required'" 
              label="name" 
              :options="propertyOptions" 
              :reduce="name => name.id" 
              name="property_id"
              type="text"
              autocomplete="off"
              @change="loadUnit" @input="loadUnit()"/>
            <span class="text-danger text-sm"  v-show="errors.has(`property_id`)">{{ errors.first(`property_id`) }}</span>
          </div>

          <div class="vx-col w-1/2 mt-4">
            <vs-input type="password" hidden/>
            <label class="vs-input--label">User Unit*</label>
            <v-select
              v-model="data_local.unit_id"
              label="number"
              v-validate="'required'" 
              :options="optionUnit" 
              :reduce="number => number.id" 
              name="unit_id"
              type="text"
              autocomplete="off"/>
            <span class="text-danger text-sm"  v-show="errors.has(`unit_id`)">{{ errors.first(`unit_id`) }}</span>
          </div>
        </div>

        <vs-divider border-style="dashed" color="success" class="mt-6 mb-2" v-show="userRoles.length > 1"/>
      </div>
    </div>
  </div>  
</template>

<script>
import vSelect from 'vue-select';
import axios from '@/axios';
import EventBus from '@/EventBus'

export default {
  props: {
    items: { 
      type: Array,
      required: true,
    },
  },
  components: {
    vSelect,
  },
  data() {
    return {
      token: localStorage.usertoken,
      pmcOptions: [],
      propertyOptions: [],
      roleOptions: [],
      optionUnit: [],
      data_local: {
        user_role_id: 0,
        parent_id: 0,
        property_id: 0,
        property_ref: '',
        unit_id: 0
      },

      userRoles: this.items
    }
  },
  methods: {
    getPropertyOptions (pmcId) {
      return pmcId 
        ? this.propertyOptions.filter(({ pmc_id }) => pmc_id === pmcId)
        : this.propertyOptions;
    },
    getRoleOptions({ excludeCurrentRole }) {
      const selectedRole = Array.from(this.userRoles);
      const selectedRoles = selectedRole
        .map(({ user_role_id }) => user_role_id)
        .filter( user_role_id => user_role_id !== excludeCurrentRole)
      const users = this.roleOptions
        .filter(({ id }) => !selectedRoles.includes(id))
        .map(({ id, name }) => ({ id, name }));
      return users;
    },
    getUnitOption(propertyId) {
      return this.optionUnit.filter(({building_id}) => propertyId === building_id)
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
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.propertyOptions = result.data
      this.data_local.property_id = this.propertyOptions[0]['id']
      this.data_local.property_ref = this.propertyOptions[0]['ref']
      this.loadUnit()
    },
    async loadUnit() {
      this.data_local.property_ref = this.propertyOptions.filter(result => result.id === this.data_local.property_id).map(({ref}) => ref)
      const result = await axios.get('/unit/list', {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': this.data_local.property_ref,
          'parent_org_id': this.data_local.parent_id
        }
      })

      this.optionUnit = result['data']
      this.data_local.unit_id = this.optionUnit.length === 0 ? 0 : this.optionUnit[0]['id']
    }, 
    deleteRole(k, id) {
      this.$delete(this.userRoles, k);
    },
    addRole() {
      const role = {
        user_role_id: '',
        pmc_id: '',
        property_id: '',
        unit_id: ''
      };
      this.userRoles.push(role);
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
      this.data_local.user_role_id = parseInt(localStorage.selectedRoleId)
    },
  },
  computed: {
    accessLevel() {
      const { user_role } = JSON.parse(localStorage.userAllData)
      return user_role.access_level;
    },
    getPMCOptions () {
      return this.pmcOptions;
    },
  },
  async created() {
    await this.loadUserRole();
    await this.loadParentOrg();
    await this.loadProperty();
    await this.loadUnit()
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/users/new`) return
      console.log(`/users/new`)
      await this.loadUserRole()
      await this.loadProperty();
      this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/users/new`) return
      console.log(`/users/new`)
      await this.loadUserRole()
      await this.loadProperty();
    })
  }
}
</script>