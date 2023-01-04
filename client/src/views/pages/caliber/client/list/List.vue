
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

        <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-dashed border-primary mt-4" @click="importClient">
            <feather-icon icon="UploadCloudIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Import</span>
        </div>

        <!-- ADD NEW -->
        <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-not-allowed flex items-center justify-center text-lg font-medium text-base text-dark border border-solid border-dark mt-4">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-dark">Add New</span>
        </div>

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
          <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
          <!-- <vs-button class="mb-4 md:mb-0" @click="gridApi.exportDataAsCsv()">Export as CSV</vs-button> -->
      </div>


      <!-- AgGrid Table -->
      <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
      <ag-grid-vue
        style="margin: auto; text-alignment:center;"
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
import CellRendererDate from './cell-renderer/CellRendererDate.vue'

import axios from '@/axios'
import api from '@/caliber-api'

export default {
  components: {
    AgGridVue,
    vSelect,    
    // Cell Renderer
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions,
    CellRendererDate
  },
  data () {
    const token = localStorage.usertoken
    return {
      loading: true,
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
        // BillingAddress1
        // BillingAddress2
        // BillingAddress3
        // BillingCity
        // BillingCountry
        // BillingFax
        // BillingPhone
        // BillingState
        // BillingZip
        // ClientID
        // ClientName
        // Code
        // DateCreated
        // LastModified
        // LegalName
        // OfficialAddress1
        // OfficialAddress2
        // OfficialAddress3
        // OfficialCity
        // OfficialCountry
        // OfficialCounty
        // OfficialFax
        // OfficialPhone
        // OfficialState
        // OfficialZip
        // Status
        // Website

        // {
        //   headerName: 'ID',
        //   field: 'id',
        //   width: 200,
        //   filter: true,
        //   checkboxSelection: false,
        //   headerCheckboxSelectionFilteredOnly: true,
        //   headerCheckboxSelection: false,
        //   cellRendererFramework: 'CellRendererLink'
        // },
        {
          //caliber-invoice
          headerName: 'Client ID',
          field: 'ClientID',
          width: 150,
          filter: true,
          cellRendererFramework: 'CellRendererLink'
        },
        {
          //caliber-invoice
          headerName: 'Code',
          field: 'Code',
          width: 150,
          filter: true
        },
        {
          //caliber-invoice
          headerName: 'Client Name',
          field: 'ClientName',
          width: 500,
          filter: true
        },
        {
          //caliber-invoice
          headerName: 'Date Created',
          field: 'DateCreated',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererDate'
        },
        {
          //caliber-invoice
          headerName: 'Last Modified',
          field: 'LastModified',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererDate'
        },
        // {
        //   //caliber-invoice
        //   headerName: 'Actions',
        //   field: 'transactions',
        //   width: 200,
        //   cellRendererFramework: 'CellRendererActions'
        // }
      ],

      // Cell Renderer Components
      components: {
        CellRendererLink,
        CellRendererStatus,
        CellRendererVerified,
        CellRendererActions
      },
      objStatusMap: {
        '9': 'Ready To Pay',
        '13': 'Fully Paid',
        '10': 'Rejected',
        '7': 'MgrApproved'
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
    importClient() {
      this.$router.push({name:'app-caliber-client-import'})
    },
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
      this.$router.push("/caliber/client/new")
    },
    async refresh () {
      try {    
        let propertyF = await axios.get('/api/property/list/ref', {
          headers: 
          { 
            'Authorization': localStorage.usertoken,
            'property_ref': localStorage.selectedPropertyRef
          }
        })

        console.log('localStorage.selectedPropertyRef ', localStorage.selectedPropertyRef)
        console.log('propertyF ', propertyF)

        let cid = propertyF['data'][0]['caliber_client_id']


        var d = await axios.get('/caliber/api', {
          headers: { 
            'Authorization': this.token,
            'caliber-url': `api/v2/client/${cid}`
            // api/v2/clientlist
            // clientlist        
            // client/27/clientcontacts
            // client/27/contacts/all
            // client/27/units
            // client/27/vendors
            // client/27/invoices
            // client/27/billingrecords/all
            // client/27/transactionaccounts
          },
        })

        this.listData = d['data']
        this.loading = false
        console.log('this.listData ', this.listData)
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.loading = false
      }             
    },getStatus(str){
      const strStatus = this.objStatusMap[str];
      if(strStatus){
        return strStatus +";"+str;
      }
      return str;
    }    
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
    // this.refresh()
    this.listData = []
    this.loading = false
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
</style>
