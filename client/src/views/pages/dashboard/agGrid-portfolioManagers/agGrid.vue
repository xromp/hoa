<template>
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
          <vs-button 
            @click="showAddPMCManager" 
            color="primary" 
            type="border">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"/>
          Add New</vs-button>
      </div>

      <vs-popup classContent="popup-example" title="Add New User" :active.sync="showSuperAdminPopup">
        <div class="vx-col w-full h-full">
          <div>
            <label class="vs-input--label">User</label>
            <v-select multiple :options="optionUser" :reduce="email => email.id" label="full_name" v-validate="'required'" v-model="users" this.usersme="users" this.usersass="inputx"/>
          </div>

          <div class="mt-6">            
            <vs-button class="mr-2" @click="addUsers" color="primary" type="filled">Add</vs-button>
            <vs-button class="border border-solid text-primary" @click="routeToUserCreation" color="transparent" type="filled">Create New User</vs-button>
          </div>
        </div>

      </vs-popup>      

	    <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
	      <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
	  </div>


	  <!-- AgGrid Table -->
	  <ag-grid-vue
	    style="margin: auto; text-alignment:center; height: 400px;"
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


</template>	


<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'

// Store Module
import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

// Cell Renderer
import CellRendererLink from './cell-renderer/CellRendererLink.vue'
import CellRendererStatus from './cell-renderer/CellRendererStatus.vue'
import CellRendererVerified from './cell-renderer/CellRendererVerified.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'
import axios from '@/axios'
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
      optionUser: [],

      users: this.users,
      value2: '',
      showSuperAdminPopup: false,
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
          headerName: 'Name',
          field: 'user.full_name',
          width: 200,
          filter: true,
        },
        {
          headerName: 'Email',
          field: 'user.email',
          width: 200,
          filter: true          
        },
        {
          headerName: 'Address',
          field: 'user.address_line_1',
          width: 400,
          filter: true
        },
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
    usersData () {
      return this.$store.state.userManagement.portfolios      
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
    showAddPMCManager () {
      this.showSuperAdminPopup=true; 
      this.users = [];
      const excludeUsers = this.listData.map(({ user_id }) => user_id);
      this.optionUser = this.optionUser
        .filter(({ id }) => !excludeUsers.includes(id));
    },
    async addUsers () {
      try {
        const data = {
          pmc_id: decoded.pmc_id,
          users: this.users,
        };
        const headers = { 'Authorization': this.token }
        await axios.post(`/portfolio-manager/save`, data, { headers });
        await this.loadPMCManagers();
        this.showSuperAdminPopup = false;
        this.$vs.notify({
          color: 'success',
          title: 'Saving PMC Manager',
          text: 'Successfully saved.',
        })
      } catch ({ message }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving PMC Manager',
          text: message,
        })
      }
      
    },
    routeToUserCreation () {
      this.showSuperAdminPopup = false
      this.$router.push(`/users/new?r=pmcm&rid=19&pmcid=${decoded.pmc_id}`)
    },
    async loadUser () {
      try {
        const { data } = await axios.get(`/user/list`, {
            headers: { 
              'Authorization': this.token, 
              'property_ref': localStorage.selectedPropertyRef
            }
          });
        this.optionUser = data;
      } catch ({ message }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching PMC Manager',
          text: message,
        })
      }
    },
    async loadPMCManagers () {
      try {
        const { data } = await axios.get(`/portfolio-manager/list`, {
            headers: { 
              'Authorization': this.token, 
              'pmc_id': decoded.pmc_id
            }
          });
        this.listData = data;
      } catch ({ message }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching PMC Manager',
          text: message,
        })
      }
    },
  },
  mounted () {
    this.gridApi = this.gridOptions.api

    /* =================================================================
      NOTE:
      Header is not aligned properly in RTL version of agGrid table.
      However, we given fix to this issue. If you want more robust solution please contact them at gitHub
    ================================================================= */
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  async created () {
    await this.loadPMCManagers();
    await this.loadUser()
  }
}

</script>

<style lang="scss">
.popup-example {
  height:500px;
}

#page-user-list {
  .user-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}
</style>
