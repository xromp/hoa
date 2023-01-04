
<template>

  <div id="page-data-list">
    <!-- <vx-card title="Open Approvals" class="mb-base"> -->
      <!-- <div class="vx-card p-6"> -->
        <div class="flex items-end" style="margin-bottom: 20px;">
          <feather-icon icon="AlertCircleIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Pending Approvals</span>
        </div>
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

      <!-- </div> -->
    <!-- </vx-card> -->
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'

// Cell Renderer
import CellRendererLink from './cell-renderer/CellRendererLink.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'
import CellRendererDate from './cell-renderer/CellRendererDate.vue'
import CellRendererStatus from './cell-renderer/CellRendererStatus.vue'
import ExportCSV from './ExportCSV.vue'

export default {
  components: {
    AgGridVue,
    vSelect,    
    // Cell Renderer
    CellRendererLink,
    CellRendererActions,
    CellRendererDate,
    CellRendererStatus,

    ExportCSV,
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true,
    },
    isApprovalCreator: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    const token = localStorage.usertoken
    return {
      token: token,
      listData: this.data,
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
          headerName: 'Status',
          field: 'self_status',
          width: 150,
          filter: true,
          cellRendererFramework: 'CellRendererStatus'
        },
        {
          headerName: 'Type',
          field: 'type_name',
          width: 100,
          filter: true,
          cellRendererFramework: 'CellRendererLink'
        },
        {
          headerName: 'Reference',
          field: 'reference_no',
          width: 150,
          filter: true
        },
        {
          headerName: 'Completed',
          field: 'completed_count',
          width: 150,
          filter: true
        },
        {
          headerName: 'Outstanding',
          field: 'pending_count',
          width: 150,
          filter: true,
        },
        {
          headerName: 'Date Sent',
          field: 'createdAt',
          width: 200,
          filter: true,
          cellRendererFramework: 'CellRendererDate'
        },
         {
          headerName: 'Days Outstanding',
          field: 'outstanding_days',
          width: 200,
          filter: true,
        },
        {
          headerName: 'Created By',
          field: 'user.full_name',
          width: 200,
          filter: true,
        },
        {
          headerName: 'Actions',
          field: 'approval.user.full_name',
          width: 200,
          filter: true,
          hide: !this.isApprovalCreator,
          cellRendererFramework: 'CellRendererActions',
        },
      ],

      // Cell Renderer Components
      components: {
        CellRendererLink,
        CellRendererActions
      },
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
      this.$refs.filterCard.removeRefreshAnimation()
    },
    updateSearchQuery (val) {
      this.gridApi.setQuickFilter(val)
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
  watch:{
    data(approvals){
      this.listData = approvals;
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
