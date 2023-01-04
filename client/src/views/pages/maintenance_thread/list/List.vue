
<template>

  <div id="page-data-list">
    <div class="mt-4">
      <vs-textarea height="150px" class="w-full mt-4" label="Message" v-model="data_local.message" type="message" v-validate="'required'" name="message" />
      <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
    </div>

    <div class="flex flex-end items-center">
      <div class="flex-grow"></div>
      <!-- ADD NEW -->
      <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary mt-0" @click="save_changes">
          <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
          <span class="ml-2 text-base text-primary">Save</span>
      </div>
    </div>

    <vs-list v-for="(value, key) in listData" class="thread-list">
       <vs-list-item :title="value.user.first_name +' '+ value.user.last_name"><span class="text-end">{{ value.createdAt | formatDate }} - {{ value.createdAt | formatTime }}</span>
        <template slot="avatar">
          <vs-avatar />
        </template>
      </vs-list-item>
      <vs-list-header :title="value.message" color="dark" class=""></vs-list-header>
    </vs-list>

    <vs-list class="thread-list" v-if="listData.length==0">
      <vs-list-item title="" subtitle="No data found.">
      </vs-list-item>
    </vs-list>

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
import common from '@/common'

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
      //thread
      data_local: {
        maintenance_request_id: this.$route.params.viewId,
        vendor_id: '',
        message: '',
        status: '',
        createdAt: null
      },

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
        flex: 1,
        wrapText: true,
        autoHeight: true,
        sortable: true,
        resizable: true,
      },
      rowHeight: 150,
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
        // {
        //   //thread
        //   headerName: 'Maintenance Request',
        //   field: 'maintenance_request.description',
        //   width: 400,
        //   filter: true          
        // },
        {
          //thread
          headerName: 'Service Provider',
          field: 'user.first_name',
          width: 400,
          filter: true
        },
        {
          //thread
          headerName: 'Message',
          field: 'message',
          width: 1000,
          filter: true
        },
        // {
        //   //thread
        //   headerName: 'Status',
        //   field: 'status',
        //   width: 200,
        //   filter: true
        // },
        // {
        //   //thread
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
  props: {
    requestType: {
      type: String,
      required: true
    },
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
      return !this.errors.any()
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
    async save_changes () {
      if (!this.validateForm) return

      this.$vs.loading()
      const editId = -1
      var maintenanceId = this.$route.params.viewId
      this.data_local.property_ref = localStorage.selectedPropertyRef
      this.data_local['maintenance_request_id'] = maintenanceId
      this.data_local.createdAt = common.setNewTZ(new Date())
      this.data_local.requestType = this.requestType

      const {data} = await axios.post(`/thread/save/${editId}`, {
        data: this.data_local,
        token: localStorage.usertoken
      })
      if(data == 'success') {
        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully saved'
        })
      } else {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: 'Something went wrong'
        })
      }            

      await this.loadData()
      setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    onColumnResized(params) {
      params.api.resetRowHeights();
    },
    onColumnVisible(params) {
      params.api.resetRowHeights();
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
      var maintenanceId = this.$route.params.viewId
      console.log(`maintenances/view/${maintenanceId}/thread/new`)
      this.$router.push(`/maintenances/view/${maintenanceId}/thread/new`)
    },
    async loadData() {
      const {data} = await axios.get(`/thread/list/${this.$route.params.viewId}`, {
        headers: { 'Authorization': this.token }
      })

      this.listData = data
      this.$vs.loading.close()
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
  mounted () {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

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
    try {
      this.$vs.loading()
      //crud
      // this.showL = await mainHelper.cansee('thread-list', 'list')
      // this.showC = await mainHelper.cansee('thread-create', 'create')
      // this.showR = await mainHelper.cansee('thread-read', 'read')
      // this.showU = await mainHelper.cansee('thread-update', 'update')
      // this.showD = await mainHelper.cansee('thread-delete', 'delete')

      await this.loadData()      
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Maintenance Thread Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  } 
}

</script>

<style lang="scss">

div.thread-list .list-titles {
  display: flex !important;
}

div.thread-list div.list-titles div.vs-list--title {
  margin-right: 10px;
}

div.thread-list div.list-titles div.vs-list--subtitle {
  display: contents;
}

div.thread-list .vs-list--header, .vs-list--title {
  font-weight: normal !important;
}

div.thread-list .vs-list--item {
  border-bottom: 0px;
}

div.thread-list div.vs-list--header .vs-list--title {
  margin-left: 20px;
}


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
 
#myGrid div.ag-cell {
  white-space: normal !important;
  text-overflow: unset !important;
  overflow: unset !important;
  overflow-wrap: anywhere !important;
}
</style>
