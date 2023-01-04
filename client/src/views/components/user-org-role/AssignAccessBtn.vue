<template>
<div>  
  <vs-button @click="assignAccessPopupActive=true" color="primary" type="border" class="add-access-btn">
    <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"></feather-icon>
    Add Access
  </vs-button>
  
  <vs-popup classContent="popup-example assign-access pop-up-style" title="Add Access" :active.sync="assignAccessPopupActive">
    <div class="vx-col w-full h-full assign-access pop-up-drop">
      <div class="assign-access pop-up-body"> 
        <div class="vx-col p-4">
          <vs-alert :active="email_exist" color="danger" icon-pack="feather" icon="icon-info">
            <span class="p-4">This <b>user exists already</b>, do you wish to assign them to a role or unit within this property?</span>
          </vs-alert>
        </div> 
        <div>
          <label class="vs-input--label">User Email</label>
          <vs-input class="w-full mt-4" v-model="user_email" type="text" name="user_email" disabled/>

          <!-- <v-select :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="user_id" name="user_id" class="inputx" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span> -->
        </div> 
        <div class="mt-4">          
          <!-- <label class="vs-input--label">Parent Organization</label> -->
          <!-- <vs-input class="w-full mt-4" v-model="pmc_name" type="text" name="pmc_name" disabled/> -->

          <label class="vs-input--label">Parent Organization</label>
          <v-select :options="optionParentOrg" :reduce="name => name.id" label="name" v-validate="'required'" v-model="pmc_id" name="pmc_id" class="inputx" @change="loadPropertyOrg" @input="loadPropertyOrg()"/>
          <span class="text-danger text-sm"  v-show="errors.has('pmc_id')">{{ errors.first('pmc_id') }}</span>
        </div>
        <div class="mt-4" v-if="optionProperty.length > 0 && property_id !== undefined">
          <label class="vs-input--label">Property</label>
          <v-select :options="optionProperty" :reduce="name => name.id" label="name"  v-model="property_id" name="property_id" class="inputx" @change="loadUnit" @input="loadUnit()"/>
        </div> 
        <div :class="{'mt-4':true, 'assign-access-role':optionRole.length> 1}">
          <label class="vs-input--label">User Type</label>
          <v-select :options="optionRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="role_id" name="role_id" class="inputx" @change="loadUnit" @input="loadUnit()"/>
          <span class="text-danger text-sm"  v-show="errors.has('role_id')">{{ errors.first('role_id') }}</span>
        </div>        
        <div class="mt-4" v-if="optionUnit.length > 0 && showUnit">
          <label class="vs-input--label">Unit</label>
          <v-select :options="optionUnit" :reduce="number => number.id" label="number" v-model="unit_id" name="unit_id" class="inputx"/>
        </div>          
      </div>

      <div class="mt-6">            
        <vs-button class="mr-2" @click="saveChanges" color="primary" type="filled" :disabled="!validateForm">Add</vs-button>
        <!-- <vs-button class="mr-2 border border-solid text-primary" @click="newRecord" color="transparent" type="filled" >Create New User</vs-button> -->
        <vs-button @click="cancelRecord" color="gray" type="filled">Cancel</vs-button>
      </div>
    </div>
  </vs-popup>    
</div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'

// Cell Renderer
import CellRendererLink from './cell-renderer/CellRendererLink.vue'
import CellRendererStatus from './cell-renderer/CellRendererStatus.vue'
import CellRendererVerified from './cell-renderer/CellRendererVerified.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'

import axios from '@/axios'
import EventBus from '@/EventBus'
import mainHelper from '@/mainHelper' //crud
const jwt = require('jsonwebtoken')
var decoded = jwt.verify(localStorage.usertoken, 'secret') 

export default {
  components: {
    AgGridVue,
    vSelect,

    // Cell Renderer
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions
  },
  props: {
  },  
  data () {
    const token = localStorage.usertoken
    return {
      email_exist: false,
      showUnit: false,
      asTenant: ['user', 'tenant', 'renter', 'guest'],
      optionUser: [],  
      optionRole: [],
      optionParentOrg: [],
      optionProperty: [],
      optionUnit: [],

      user_email: null,
      user_id: 0,
      role_id: 0,
      pmc_name: null,
      pmc_id: parseInt(localStorage.selectedParentOrg),
      property_id: 0,
      property_ref: '',
      unit_id: null,

      data_local: {
        unit_id: null,
        user_id: null,
      },      

      assignAccessPopupActive: false,
      token: token,
      listData: [],
      // Filter Options
      roleFilter: { label: 'All', value: 'all' },
      roleOptions: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Staff', value: 'staff' }
      ],

      statusFilter: { label: 'All', value: 'all' },
      statusOptions: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Deactivated', value: 'deactivated' },
        { label: 'Blocked', value: 'blocked' }
      ],

      isVerifiedFilter: { label: 'All', value: 'all' },
      isVerifiedOptions: [
        { label: 'All', value: 'all' },
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ],

      departmentFilter: { label: 'All', value: 'all' },
      departmentOptions: [
        { label: 'All', value: 'all' },
        { label: 'Sales', value: 'sales' },
        { label: 'Development', value: 'development' },
        { label: 'Management', value: 'management' }
      ],

      searchQuery: '',

      // AgGrid
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      columnDefs: [
        {
          headerName: 'User',
          field: 'user.full_name',
          width: 250,
          filter: true
        },
        {
          headerName: 'Parent Org',
          field: 'pmc.name',
          width: 250,
          filter: true,
        },
        {
          headerName: 'User Role',
          field: 'user_role.name',
          width: 200,
          filter: true
        },
        {
          headerName: 'Property',
          field: 'property.name',
          width: 200,
          filter: true
        },
        // {
        //   headerName: 'Unit',
        //   field: 'unit.number',
        //   width: 100,
        //   filter: true
        // },
        {
          headerName: 'Actions',
          field: 'transactions',
          width: 200,
          cellRendererFramework: 'CellRendererActions'
        }
      ],

      // Cell Renderer Components
      components: {
        CellRendererLink,
        CellRendererStatus,
        CellRendererVerified,
        CellRendererActions
      }
    }
  },
  watch: {
    roleFilter (obj) {
      this.setColumnFilter('role', obj.value)
    },
    statusFilter (obj) {
      this.setColumnFilter('status', obj.value)
    },
    isVerifiedFilter (obj) {
      const val = obj.value === 'all' ? 'all' : obj.value === 'yes' ? 'true' : 'false'
      this.setColumnFilter('is_verified', val)
    },
    departmentFilter (obj) {
      this.setColumnFilter('department', obj.value)
    }
  },
  computed: {    
    validateForm () {
      return !this.errors.any() && this.role_id !== 0 && this.user_id !== 0
    },
    paginationPageSize () {
      if (this.gridApi) return this.gridApi.paginationGetPageSize()
      else return 5
    },
    totalPages () {
      if (this.gridApi) return this.gridApi.paginationGetTotalPages()
      else return 0
    },
    currentPage: {
      get () {
        if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
        else return 1
      },
      set (val) {
        this.gridApi.paginationGoToPage(val - 1)
      }
    }
  },
  methods: {
    setColumnFilter (column, val) {
      const filter = this.gridApi.getFilterInstance(column)
      let modelObj = null

      if (val !== 'all') {
        modelObj = { type: 'equals', filter: val }
      }

      filter.setModel(modelObj)
      this.gridApi.onFilterChanged()
    },
    resetColFilters () {
      // Reset Grid Filter
      this.gridApi.setFilterModel(null)
      this.gridApi.onFilterChanged()

      // Reset Filter Options
      this.roleFilter = this.statusFilter = this.isVerifiedFilter = this.departmentFilter = { label: 'All', value: 'all' }

      this.$refs.filterCard.removeRefreshAnimation()
    },
    updateSearchQuery (val) {
      this.gridApi.setQuickFilter(val)
    },
    newRecord () {
      this.assignAccessPopupActive = false
      this.$router.push(`/users/new`)
    },
    cancelRecord() {
      this.user_id = this.$route.params.viewId
      this.role_id = 0
      this.assignAccessPopupActive = false
    },
    async saveChanges() {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        const result = await axios.post(`/user-org/add`,
          { 
            data: {
              user_id: [this.user_id],
              role_id: this.role_id, 
              pmc_id: this.pmc_id, 
              property_id: this.property_id, 
              unit_id: this.unit_id,
              type: 'assign'
            }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
        )

        this.data_local.user_id = [this.user_id]
        this.data_local.unit_id = this.unit_id
        if (this.unit_id !== null) {          
          await axios.post(`/unit-user/save/-1`,
            { data: this.data_local },
            { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
          )
        }

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))
        this.$vs.loading()
        EventBus.$emit('side-menu-parent', true)
        EventBus.$emit('update-scope', true)

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     

        this.assignAccessPopupActive = false
        // this.loadData()    
        this.loadRole()

        this.$vs.loading.close()

        if (!this.email_exist) return
        this.$router.push({name:'app-user-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Assign Access Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async loadData() {
      const result = await axios.get(`/user-org/list`, {
        headers: { 
          'Authorization': localStorage.usertoken
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg
        }
      })

      if(result['data'] === 'access_denied') {
        this.$vs.loading.close()
        this.loading = false
        // this.$router.push({name:'page-not-authorized'})
        return false
      } else {
        this.listData = result['data']
        this.loading = false
        this.$vs.loading.close()
      }
    },
    // async loadRole() {
    //   const result = await axios.get(`/user-org/get`, {
    //     headers: { 'Authorization': this.token },
    //     params: {
    //       'parent_org_id': localStorage.selectedParentOrg,
    //       'property_ref': localStorage.selectedPropertyRef,
    //       'role_id': localStorage.selectedRoleId,
    //       'role_val': localStorage.selectedRoleVal
    //     }
    //   })

    //   EventBus.$emit('side-menu-role', result.data.optionRoleOrg)
    // },


    async loadRole() {
      const result = await axios.get('/role/list/', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': this.property_ref,
          'parent_org_id': this.pmc_id,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionRole = result['data']    
    },   
    async loadUser (id) {
      const result = await axios.get(`/user/${parseInt(id)}`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      // this.optionUser = result['data']
      if (result.data.length === 0) return
      console.log('result.lengthresult.lengthresult.length ', result.data.length)
      this.user_email = result['data'][0]['email']
      this.user_id = parseInt(id)
    },
    async loadParentOrg() {
      // axios.get(`/user-org/portfolio/view/${localStorage.selectedParentOrg}`
      const result = await axios.get(`/user-org/portfolio/list`, {
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

      // this.pmc_id = localStorage.selectedParentOrg
      // this.pmc_name = result['data'][0]['name']
      this.optionParentOrg = result['data']
    },
    async loadPropertyOrg() {
      const result = await axios.get('/user-org/property/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': this.pmc_id,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionProperty = result.data
      this.property_id = this.optionProperty[0]['id']
      this.property_ref = this.optionProperty[0]['ref']
      this.role_id = 0
      this.loadRole()
    },
    async loadUnit() {
      this.unit_id = null
      let selectedRole = this.optionRole.filter(res => res.id === this.role_id).map(({val}) => val)
      this.showUnit = this.asTenant.includes(selectedRole[0])

      this.property_ref = this.optionProperty.filter(result => result.id === this.property_id).map(({ref}) => ref)
      const {data} = await axios.get('/unit/list', {
        headers: { 
          'Authorization': localStorage.usertoken
        },
        params: {
          'property_ref': this.property_ref,
          'parent_org_id': this.pmc_id
        }
      })

      let na = { id:0, number:'N/A' }
      this.optionUnit = data.length === 0 ? [] : [na, ...data]
      // this.unit_id = this.optionUnit.length === 0 ? null : this.optionUnit[0]['id']
    }    
  },
  mounted () {
    EventBus.$on('assign-form-active',async (result) => {
      this.email_exist = true
      this.assignAccessPopupActive=true
      this.user_id = result
      await this.loadUser(result)
    })      
    EventBus.$on('user-org-list', async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/managements/list`) return
      console.log(`/managements/list`)
      // await this.loadData()
      await this.loadUser(this.$route.params.viewId)
      await this.loadParentOrg() 
    })
    EventBus.$on('update-parent-id', async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      // if (this.$route.path !== `/managements/list`) return
      console.log(`/managements/list`)
      this.pmc_id = parseInt(localStorage.selectedParentOrg)
      this.role_id = 0
      // await this.loadData()
      await this.loadUser(this.$route.params.viewId)
      await this.loadParentOrg()  
      await this.loadPropertyOrg()
    })
    EventBus.$on('update-property-ref', async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000) 
    })
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  async created () {
    try {
      this.$vs.loading.close()
      // this.loadData()

      await this.loadUser(this.$route.params.viewId)
      await this.loadParentOrg()
      await this.loadPropertyOrg()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Assign Access Component',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  }  
}
</script>
<style lang="scss">
  #assign-access {
    .data-list-filters {
      .vs__actions {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-58%);
      }
    }
  }

  div.assign-access.pop-up-style {
    height: 580px;
  }

  div.assign-access.pop-up-body {
    height: 480px;
  }

  div.assign-access-role ul.vs__dropdown-menu {
    height: 150px;
  }

  div.assign-access .con-vs-alert {
    height: 60px !important;
  }
</style>