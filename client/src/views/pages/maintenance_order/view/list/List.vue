
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

    <div class="p-6">

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
        <!-- <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary mt-4" @click="newRecord" v-if="showC"> --> <!--crud-->
            <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span>
        </div> -->

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
          <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
      </div>


      <!-- AgGrid Table -->
      <vs-progress :indeterminate="loading" v-show="loading" color="primary"></vs-progress>
      <div class="vx-row">
        <div class="vx-col md:w-3/4 mb-base">
          <ag-grid-vue
            style="text-alignment:center; height: 500px;"
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="ag-theme-material w-100 my-4 ag-grid-table"
            :defaultColDef="defaultColDef"
            rowSelection="single"
            colResizeDefault="shift"
            :animateRows="true"
            :floatingFilter="false"
            :pagination="true"
            :paginationPageSize="paginationPageSize"
            :suppressPaginationPanel="true"
            :enableRtl="$vs.rtl"
            @selection-changed="onSelectionChanged">
          </ag-grid-vue>

          <vs-pagination
            :total="totalPages"
            :max="7"
            v-model="currentPage" />
        </div>
        <div class="vx-col md:w-1/4 mb-base" style="padding:0" v-if="listData.length">
          <approval
            :key="forceRender"
            :items="approvalData.items" 
            :reference_id="approvalData.id"
            :reference_no="approvalData.requestNo"
            :title="approvalData.title"
            :other_data_obj="approvalData.otherDataObj"
            type="rfp"
            class="mb-4" />
        </div>
      </div>
    </div>
    
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'
import Approval from '../../../../components/approval-widget/approval.vue'

// Cell Renderer
import CellRendererLink from './cell-renderer/CellRendererLink.vue'
import CellRendererStatus from './cell-renderer/CellRendererStatus.vue'
import CellRendererVerified from './cell-renderer/CellRendererVerified.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'
import CellRendererDate from './cell-renderer/CellRendererDate.vue'
import CellRendererNumber from './cell-renderer/CellRendererNumber.vue'


import axios from '@/axios'
import common from '@/common'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    AgGridVue,
    vSelect,
    Approval,

    // Cell Renderer
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions,
    CellRendererDate,
    CellRendererNumber,
  },
  data () {
    const token = localStorage.usertoken
    return {
      //crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      token: token,
      listData: [],
      loading: true,

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
      approvalData: {
        items: [],
        id: 0,
        requestNo: '',
      },
      forceRender: 0,

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
          //maintenance-requests
          headerName: 'Request No',
          field: 'request_no',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererLink'
        },
        {
          //maintenance-requests
          headerName: 'Name',
          field: 'vendor.business_name',
          width: 250,
          filter: true
        },
        {
          //maintenance-requests
          headerName: 'Total Quote',
          field: 'total_qoutation',
          width: 150,
          filter: true,
          cellRendererFramework: 'CellRendererNumber'
        },
        {
          //maintenance-requests
          headerName: 'Submitted Date',
          field: 'submitted_date',
          width: 200,
          filter: true,
          // cellRendererFramework: 'CellRendererDate'
        },                
        {
          //maintenance-requests
          headerName: 'Status',
          field: 'm_request_status.name',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererStatus'
        },
        {
          headerName: '',
          field: '',
          width: 100,
          checkboxSelection: true,
        },
        // {
        //   //maintenance-requests
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
    optionalChaning(fn) {
      try { return fn(); }
      catch (e) {}
    },
    async onSelectionChanged({ api }) {
      const isSelected = !!api.getSelectedNodes().length;
      if (isSelected) {
        const { data } = api.getSelectedNodes()[0];
        this.approvalData = {
          id: data.id,
          requestNo: data.request_no,
          title: `Approval for RFP ${data.request_no} - ${data.vendor.business_name}`,
          otherDataObj: { order_id: data.order_id },
        };
        this.$set(this.approvalData, 'items', this.optionalChaning(() => data.approval.approval_items) || [])
        await axios.patch(`/maintenance/select-approval`, {...data, for_approval: isSelected},
          { headers: { 'Authorization': this.token } });
      } else {
        this.approvalData = {
          items: [],
          id: 0,
          requestNo: '',
        };
        const data = {
          id: 0,
          order_id: this.$route.params.viewId,
          for_approval: isSelected
        };
        await axios.patch(`/maintenance/select-approval`, data,
          { headers: { 'Authorization': this.token } });
      }
      
      this.forceRender +=1;
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
      this.$router.push("/maintenance-requests/new")
    },
    async loadData() {
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/maintenance/list/${viewId}`, {
        headers: { 
          'Authorization': this.token,
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      if(result['data'] === 'access_denied') {
        this.$vs.loading.close()
        this.$router.push({name:'page-not-authorized'})
        return false
      } else {
        this.listData = result['data'].filter((r) => {
          // r.request_no = r.request_no + '-' + r.id
          r.submitted_date = r.submitted_date === null ? '--' : common.formatDate(r.submitted_date) 
          return r
        })
        this.loading = false
      }
      this.gridOptions.api.setRowData(this.listData);
      this.gridApi.forEachNode(node => {
        node.setSelected(node.data.for_approval);
      });
    }
  },
  mounted () {
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  sockets: {
    connect: function() {
      this.isConnected = true;
      console.log('connected', this.sockets, this.$socket);
      this.emitUserSocket();
    },
    disconnect: function() {
      this.isConnected = false;
      console.log('disconnected');
    },
    'notify-user': function () {
      this.loadData()
    }
  },
  async created () {
    try { 
      this.$vs.loading()

      //crud
      this.showL = await mainHelper.cansee('order-list', 'list')
      this.showC = await mainHelper.cansee('maintenance-create', 'create')
      this.showR = await mainHelper.cansee('maintenance-read', 'read')
      this.showU = await mainHelper.cansee('maintenance-update', 'update')
      this.showD = await mainHelper.cansee('maintenance-delete', 'delete')

      if (!this.showL) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Maintenance Page',
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
</style>
