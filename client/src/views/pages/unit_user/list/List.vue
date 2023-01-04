<template>
  <div id="page-data-list">
    <!-- <vx-card ref="filterCard" title="Filters" class="data-list-filters mb-8" actionButtons @refresh="resetColFilters" @remove="resetColFilters">
      <div class="vx-row">
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Role</label>
          <v-select :options="roleOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="roleFilter" class="mb-4 md:mb-0" />
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Status</label>
          <v-select :options="statusOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="statusFilter" class="mb-4 md:mb-0" />
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Verified</label>
          <v-select :options="isVerifiedOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="isVerifiedFilter" class="mb-4 sm:mb-0" />
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Department</label>
          <v-select :options="departmentOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="departmentFilter" />
        </div>
      </div>
    </vx-card> -->

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
        <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary mt-4">
            <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span> -->
            <vs-button @click="popupActive2=true" color="primary" type="border">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"/>
            Add New</vs-button>
        </div>

      <vs-popup classContent="popup-example" title="Add New Owner Resident" :active.sync="popupActive2">
        <div class="vx-col w-full h-full pop-owner-resident">
          <div>  
            <div>
              <label class="vs-input--label">User Email</label>
              <v-select multiple :options="optionUser" :reduce="email => email.id" label="full_name" v-validate="'required'" v-model="data_local.user_id" name="user_id" class="inputx"/>
              <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
            </div>                 
          </div>

          <div class="mt-6">            
            <vs-button class="mr-2" @click="saveChanges" color="primary" type="filled" :disabled="!validateForm">Add Existing User</vs-button>
            <vs-button class="border border-solid text-primary" @click="newRecord" color="transparent" type="filled" >Create New User</vs-button>
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
        v-model="currentPage" />

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
  data () {
    const token = localStorage.usertoken
    return {
      //unit-user
      data_local: {
        property_id: null,
        unit_id: null,
        user_id: null,
        resident_type: '',
        purchase_date: null,
        move_in_date: null,
        move_out_date: null,
        status: '',
        resident_id: 0,
        resident_name: '',
        resident_email: '',
        resident_phone: '',
        move_in_note: '',
        move_out_note: '',
        is_primary: 0,
        contact_type: '',
        role_status: null,
        role_id: null
      },

      value1: '',
      value2: '',
      optionUser: [],
      optionProperty: [],
      optionUnit: [],
      optionRole: [],
      popupActive2: false,
      popupActive3: false,

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
          //unit-user
          headerName: 'Name',
          field: 'user.full_name',
          width: 250,
          filter: true,
        },
        {
          //unit-user
          headerName: 'User Email',
          field: 'user.email',
          width: 300,
          filter: true,
        },
        {
          //unit-user
          headerName: 'Phone',
          field: 'user.phone1',
          width: 200,
          filter: true
        },
        {
          //unit-user
          headerName: 'Unit',
          field: 'unit.number',
          width: 100,
          filter: true
        },
        {
          //unit-user
          headerName: 'Type',
          field: 'user.user_org_roles.0.user_role.name',
          width: 250,
          filter: true
        },
        {
          //unit-user
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
      return !this.errors.any() && this.data_local.user_id !== null
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
      this.data_local.unit_id = parseInt(this.$route.params.viewId)

      this.popupActive2 = false
      // this.$router.push(`/users/new?r=unr&rid=10&unid=${this.data_local.unit_id}`)
      this.$router.push(`/users/new`)
    },
    async saveChanges() {
      try {
        this.data_local.unit_id = parseInt(this.$route.params.viewId)
        if (!this.validateForm) return
        this.$vs.loading()
        await axios.post(`/unit-user/save/-1`,
          { data: this.data_local },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
        )

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     

        this.popupActive2 = false
        this.data_local.user_id = 0        
        this.loadData()      
        this.$vs.loading.close()
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Unit User Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async loadProperty () {
      const result = await axios.get('/property/list', {
        headers: { 'Authorization': this.token },
        params: { 
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': parseInt(localStorage.selectedParentOrg),
          'pmc_id': parseInt(localStorage.selectedParentOrg),
          'role_id': parseInt(localStorage.selectedRoleId),
          'role_val': localStorage.selectedRoleVal          
        }
      })

      this.optionProperty = result['data']
    },
    async loadUser () {
      const result = await axios.get(`/user/list`, {
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

      this.optionUser = result['data'].filter(({ user_org_role }) => !user_org_role.is_clone );
    },
    async loadData() {
      this.$vs.loading()
      const result = await axios.get(`/unit-user/list/${this.$route.params.viewId}`, {
        headers: { 
          'Authorization': this.token, 
          'role_val': 'tenant' 
        }
      })

      if(result['data'] === 'access_denied') {
        this.$vs.loading.close()
        this.loading = false
        this.$router.push({name:'page-not-authorized'})
        return false
      } else {
        this.listData = result['data']
        this.loading = false
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/units/view/${this.$route.params.viewId}`) return
      console.log(`/units/view/${this.$route.params.viewId}`)    
      await this.loadProperty()
      await this.loadUser()
      await this.loadData()
      this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/units/view/${this.$route.params.viewId}`) return
      console.log(`/units/view/${this.$route.params.viewId}`)
      await this.loadProperty()
      await this.loadUser()
      await this.loadData()
    })
    EventBus.$on('unit-user-list', result => {
      this.loadData()
    })
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('unit-list', 'list')
      this.showC = await mainHelper.cansee('unit-create', 'create')
      this.showR = await mainHelper.cansee('unit-read', 'read')
      this.showU = await mainHelper.cansee('unit-update', 'update')
      this.showD = await mainHelper.cansee('unit-delete', 'delete')

      if (!this.showL) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadProperty()
      await this.loadUser()
      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Unit User Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }  
}

</script>

<style lang="scss">
#page-data-list {
  .data-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}

div.pop-owner-resident ul.vs__dropdown-menu {
  height: 180px;
}
</style>
