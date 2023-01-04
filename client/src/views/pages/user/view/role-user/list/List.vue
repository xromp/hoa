<template>
  <div id="assign-access">
    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center">
        <!-- ITEMS PER PAGE -->
        <div class="flex-grow">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ listData.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : listData.length }} of {{ listData.length }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="gridApi.paginationSetPageSize(5)">
                <span>5</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="gridApi.paginationSetPageSize(10)">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="gridApi.paginationSetPageSize(20)">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="gridApi.paginationSetPageSize(25)">
                <span>25</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="gridApi.paginationSetPageSize(30)">
                <span>30</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <!-- ADD NEW -->
        <!-- <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary mt-4">
          <vs-button @click="assignAccessPopupActive=true" color="primary" type="border">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"></feather-icon>
            Add New
          </vs-button>
        </div> -->

        <vs-popup classContent="popup-example assign-access pop-up-style" title="Assign New User(s)" :active.sync="assignAccessPopupActive">
          <div class="vx-col w-full h-full assign-access pop-up-drop">
            <div class="assign-access pop-up-body">  
              <div>
                <label class="vs-input--label">User Email</label>
                <v-select multiple :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="user_id" name="user_id" class="inputx"/>
                <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
              </div> 
              <div class="mt-4">
                <label class="vs-input--label">Role</label>
                <v-select :options="optionRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="role_id" name="role_id" class="inputx"/>
                <span class="text-danger text-sm"  v-show="errors.has('role_id')">{{ errors.first('role_id') }}</span>
              </div>
              <div class="mt-4">
                <label class="vs-input--label">Parent Organization</label>
                <v-select :options="optionParentOrg" :reduce="name => name.id" label="name" v-validate="'required'" v-model="pmc_id" name="pmc_id" class="inputx" @change="loadPropertyOrg" @input="loadPropertyOrg()" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('pmc_id')">{{ errors.first('pmc_id') }}</span>
              </div>
              <div class="mt-4" v-if="optionProperty.length > 0 && property_id !== undefined">
                <label class="vs-input--label">Property</label>
                <v-select :options="optionProperty" :reduce="name => name.id" label="name"  v-model="property_id" name="property_id" class="inputx" @change="loadUnit" @input="loadUnit()"/>
              </div> 
              <!-- <div class="mt-4" v-if="optionUnit.length > 0">
                <label class="vs-input--label">Unit</label>
                <v-select :options="optionUnit" :reduce="number => number.id" label="number" v-model="unit_id" name="unit_id" class="inputx"/>
              </div> -->          
            </div>

            <div class="mt-6">            
              <vs-button class="mr-2" @click="saveChanges" color="primary" type="filled" :disabled="!validateForm">Add Existing User</vs-button>
              <vs-button class="mr-2 border border-solid text-primary" @click="newRecord" color="transparent" type="filled" >Create New User</vs-button>
              <vs-button @click="cancelRecord" color="gray" type="filled">Cancel</vs-button>
            </div>
          </div>

        </vs-popup>    

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
        <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
      </div>

      <!-- AgGrid Table -->
      <ag-grid-vue
        style="margin: auto; text-alignment:center; height: 500px;"
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="listData"
        rowSelection="multiple"
        colResizeDefault="shift"
        :animateRows="true"
        :floatingFilter="false"
        :pagination="true"
        :paginationPageSize="paginationPageSize"
        :suppressPaginationPanel="true"
        :enableRtl="$vs.rtl">
      </ag-grid-vue>

      <vs-pagination
        :total="totalPages"
        :max="7"
        v-model="currentPage">
      </vs-pagination>
    </div>
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
      optionUser: [],  
      optionRole: [],
      optionParentOrg: [],
      optionProperty: [],
      optionUnit: [],

      user_id: 0,
      role_id: 0,
      pmc_id: parseInt(localStorage.selectedParentOrg),
      property_id: 0,
      property_ref: '',
      unit_id: null,

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
        // {
        //   headerName: 'User',
        //   field: 'user.full_name',
        //   width: 250,
        //   filter: true
        // },
        // {
        //   headerName: 'Parent Org',
        //   field: 'pmc.name',
        //   width: 250,
        //   filter: true,
        // },
        // {
        //   headerName: 'Property',
        //   field: 'property.name',
        //   width: 250,
        //   filter: true
        // },
        {
          headerName: 'User Role',
          field: 'user_role.name',
          width: 450,
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
      this.user_id = 0
      this.role_id = 0
      this.assignAccessPopupActive = false
    },
    async saveChanges() {
      try {
        if (!this.validateForm) return
        // this.$vs.loading()
        const result = await axios.post(`/user-org/add`,
          { 
            data: {
              user_id: this.user_id,
              role_id: this.role_id, 
              pmc_id: this.pmc_id, 
              property_id: this.property_id, 
              unit_id: this.unit_id,
              type: 'assign'
            }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
        )

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))
        // this.$vs.loading()
        EventBus.$emit('side-menu-parent', true)

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     

        this.assignAccessPopupActive = false
        this.loadData()    
        this.loadRole()

        // this.$vs.loading.close()
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Assign Access Page',
          text: err.toString('utf8')
        })
        // this.$vs.loading.close()
      }
    },
    async loadData() {
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/user-org/list/${viewId}`, {
        headers: { 
          'Authorization': localStorage.usertoken
        }
      })

      if(result['data'] === 'access_denied') {
        // this.$vs.loading.close()
        this.loading = false
        // this.$router.push({name:'page-not-authorized'})
        return false
      } else {
        result['data'] = [...new Map(result['data'].map(item => [item['user_role_id'], item])).values()]
        this.listData = result['data']

        this.loading = false
        // this.$vs.loading.close()
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
      const result = await axios.get('/role/list/all', {
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

      this.optionRole = result['data']    
    },   
    async loadUser () {
      const result = await axios.get(`/user/all`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionUser = result['data']
    },
    async loadParentOrg() {
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
      this.loadUnit()
    },
    async loadUnit() {
      this.property_ref = this.optionProperty.filter(result => result.id === this.property_id).map(({ref}) => ref)
      const result = await axios.get('/unit/list', {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': this.property_ref,
          'parent_org_id': this.pmc_id
        }
      })

      this.optionUnit = result['data']
      this.unit_id = this.optionUnit.length === 0 ? null : this.optionUnit[0]['id']
    }    
  },
  mounted () {
    EventBus.$on('user-org-list', async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== `/managements/list`) return
      console.log(`/managements/list`)
      await this.loadData()
      // await this.loadRole()
      // await this.loadUser()
      // await this.loadParentOrg() 
    })
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log('/users/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log('/users/view/')
      await this.loadData()
    }) 
    EventBus.$on('update-scope',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log('/users/view/')
      await this.loadData()
    }) 

    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  async created () {
    try {
      // this.$vs.loading.close()
      this.loadData()

      // await this.loadRole()
      // await this.loadUser()
      // await this.loadParentOrg()
      // await this.loadPropertyOrg()
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
    height: 500px;
  }

  div.assign-access.pop-up-body {
    height: 400px;
  }
</style>