
<template>
  <div>
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
      <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary mt-4" 
        @click="newRecord"
        v-if="permission.ap.create">
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary">Create Bill</span>
      </div>

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
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'
const jwt = require('jsonwebtoken')

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
    return {
      //crud
      permission: { ap: {} },
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
          //billing
          headerName: 'Invoice',
          field: 'invoice_no',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererLink',
          cellRendererParams: { type: 'AP' }
        },
        {
          //billing
          headerName: 'Vendor',
          field: 'vendor.business_name',
          width: 300,
          filter: true,
          hide: localStorage.selectedRoleVal === 'user',
        },
        {
          //billing
          headerName: 'Amount',
          field: 'total_amount',
          width: 200,
          filter: true
        },
        {
          //billing
          headerName: 'Due Date',
          field: 'due_date',
          width: 200,
          filter: true
        },        
        {
          //billing
          headerName: 'Status',
          field: 'paid',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererStatus'
        },
        {
          //billing
          headerName: 'Actions',
          field: 'transactions',
          width: 200,
          hide: !this.showU && !this.showD,
          cellRendererFramework: 'CellRendererActions',
          cellRendererParams: { type: 'AP' }
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
      this.$router.push('/billings/new?type=ap')
    },
    async loadPayables() {
      try {
        this.$vs.loading();
        const isTenant = this.permission.ap.list;
        const params = {
          ledger_type: 'AP'
        };
        if (isTenant) delete params.ledger_type;
        const { data } = await axios.get('/billing/list', {
          params,
          headers: { 'Authorization': localStorage.usertoken }
        })
        this.listData = data;
        this.$vs.loading.close();
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching AR',
          text: response.data.errors
        });
        this.$vs.loading.close();
      }
    }
  },
  mounted () {
    const reload = async (result) => {
      if (this.$route.path === `/billings/list/`)
      await this.loadPayables();
    };
    EventBus.$on('update-parent-id', reload);
    EventBus.$on('update-property-ref', reload);
    this.loadPayables()
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
    this.permission = {
      ap: {
        list: await mainHelper.cansee('account-receivable-list', 'list'),
        create: await mainHelper.cansee('account-receivable-create', 'create'),
        read: await mainHelper.cansee('account-receivable-read', 'read'),
        update: await mainHelper.cansee('account-receivable-update', 'update'),
        delete: await mainHelper.cansee('account-receivable-delete', 'delete'),
      },
    };
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
