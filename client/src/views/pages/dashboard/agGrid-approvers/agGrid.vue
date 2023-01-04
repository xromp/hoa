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
          <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary">Add New</span> -->
          <vs-button @click="popupCreateDialog" color="primary" type="border">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"/>
          Add New</vs-button>
      </div>
      <!-- <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary mt-4" @click="newRecord">
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary">Add New</span>
      </div> -->

      <vs-popup classContent="popup-example" title="Add Approver" :active.sync="showCreateDialog">
        <div class="vx-col w-full h-full">
          <div class="mt-6">
            <label class="vs-input--label">Name</label>
            <v-select :options="optionUser" :reduce="email => email.id" label="name" v-validate="'required'" v-model="user_id" name="Name" class="inputx"/>
            <span class="text-danger text-sm"  v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
          </div>

          <div class="mt-6">
            <label class="vs-input--label">Property</label>
            <v-select :options="optionProperty" multiple :reduce="name => name.id" label="name" v-validate="'required'" v-model="property_id" name="Property" class="inputx"/>
              <span class="text-danger text-sm"  v-show="errors.has('Property')">{{ errors.first('Property') }}</span>
          </div>

          <div class="mt-6">
            <vs-checkbox v-model="is_creator">Approver creator</vs-checkbox>
          </div>

          <div class="mt-6">
            <vs-button class="mr-2" @click="submit" color="primary" type="filled" :disabled="!validateForm">Add Existing</vs-button>
            <vs-button class="border border-solid text-primary" @click="newRecord" color="transparent" type="filled" >Create New</vs-button>
          </div>
        </div>

      </vs-popup>      

      <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
      <div @load-approver="loadApprover"></div>
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
import CellRendererStatus from './cell-renderer/CellRendererStatus.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'
import axios from '@/axios'
import EventBus from '@/EventBus'
const jwt = require('jsonwebtoken')
var decoded = jwt.verify(localStorage.usertoken, 'secret') 

export default {
  components: {
    AgGridVue,
    vSelect,

    // Cell Renderer
    CellRendererStatus,
    CellRendererActions
  },
  data () {
    const token = localStorage.usertoken
    return {
      optionUser: [],
      optionProperty: [],

      user_id: '',
      property_id: [],
      is_creator: false,
      showCreateDialog: false,
      popupActive3: false,

      token: token,
      listData: [],

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
          width: 300,
          filter: true,
        },
        {
          headerName: 'Property Name',
          field: 'property.name',
          width: 200,
          filter: true          
        },
        {
          headerName: 'Type',
          field: 'is_creator',
          width: 100,
          filter: true,
          cellRendererFramework: 'CellRendererStatus'     
        },
        {
          headerName: 'Actions',
          field: 'transactions',
          width: 200,
          cellRendererFramework: 'CellRendererActions',
          cellRendererParams: {
            optionUser: this.optionUser,
          }
        }
      ],

      // Cell Renderer Components
      components: {
        CellRendererStatus,
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
      return !this.errors.any() && this.user_id !== '' && this.property_id.length !== 0
    },
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
    newRecord () {
      this.showCreateDialog = false
      this.$router.push(`/users/new?r=pmcm&rid=19`)
    },
    popupCreateDialog() {
      this.showCreateDialog = true;
      this.user_id = '',
      this.property_id = [];
      this.is_creator = false;
    },
    async submit() {
      console.log('this.validateForm ', this.validateForm)
      if (!this.validateForm) return
      
      try {
        const data = {
          user_id: this.user_id,
          property_id: this.property_id,
          is_creator: this.is_creator,
        };
        const headers = { 'Authorization': this.token };
        await axios.post(`/approver/save-approver`, data, { headers });
        this.showCreateDialog = false
        this.$vs.notify({
          color: 'success',
          title: 'Saving Approver',
          text: 'The selected data was successfully saved'
        })
        await this.loadApprover()
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Approver',
          text: response.data.errors,
        })
      }
      
      
    },
    async loadUser () {
      try {    
        const { data } = await axios.get(`/api/user/list`, {
          headers: { 
            'Authorization': this.token, 
            'property_ref': localStorage.selectedPropertyRef,
            pmc_id: decoded.pmc_id
          }
        });
        this.optionUser = data
          .filter(({ user_org_roles }) => !user_org_roles[0].is_clone)
          .map(user => ({ ...user, name: `${user.full_name} (${user.user_org_roles[0].user_role.name})`}));
      } catch({ message }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching Data',
          text: message,
        })
      }
    },
    async loadProperty () {
      try {    
        const { data } = await axios.get(`/property/all/${localStorage.selectedParentOrg}`, {
          headers: { 'Authorization': this.token }
        })
        this.optionProperty = data;
      } catch({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching Data',
          text: response.data.errors,
        })
      }
    },
    async loadApprover() {
      try {
        this.$vs.loading();
        const headers = { 'Authorization': this.token }
        const { data } = await axios.get('/approver/get-approvers', { headers })
        this.listData = data; 
        this.$vs.loading.close();
      } catch({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching Data',
          text: response.data.errors,
        });
        this.$vs.loading.close();
      }
    },
  },
  mounted () {
    const reload = async (result) => {
      if (this.$route.path === `/managements/list`)
      this.$router.go(0);
    };
    EventBus.$on('update-parent-id', reload);
    EventBus.$on('update-property-ref', reload);
    this.gridApi = this.gridOptions.api

    /* =================================================================
      NOTE:
      Header is not aligned properly in RTL version of agGrid table.
      However, we given fix to this issue. If you want more robust solution please contact them at gitHub
    ================================================================= */
    /* if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    } */
  },
  async created () {
    await this.loadApprover()
    await this.loadUser()
    await this.loadProperty()
    // this.loadListData()
  }
}

</script>

<style lang="scss">
.popup-example {
  height:300px;
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
