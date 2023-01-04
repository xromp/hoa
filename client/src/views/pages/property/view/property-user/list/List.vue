
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

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
        <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
      </div>

      <vs-popup classContent="popup-example" title="Add Property User" :active.sync="popupActive2">
        <div class="vx-col w-full h-full">
          <div>
            <label class="vs-input--label">User Email</label>
            <v-select :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="value1" name="value1" class="inputx" disabled/>
            <span class="text-danger text-sm"  v-show="errors.has('value1')">{{ errors.first('value1') }}</span>
          </div>
          <div>
            <label class="vs-input--label">Property</label>
            <v-select multiple :options="optionProperty" :reduce="name => name.id" label="name" v-validate="'required'" v-model="value2" name="value2" class="inputx"/>
              <span class="text-danger text-sm"  v-show="errors.has('value2')">{{ errors.first('value2') }}</span>
          </div>

          <div class="mt-6">            
            <vs-button class="mr-2" @click="newRecordProperty" color="primary" type="filled" :disabled="!validateForm">Add</vs-button>
          </div>
        </div>

      </vs-popup>       


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
      optionProperty: [],

      value1: '',
      value2: [],
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
          headerName: 'Code',
          field: 'property.code',
          width: 200,
          filter: true,
          // cellRendererFramework: 'CellRendererLink'
        },
        {
          headerName: 'Name',
          field: 'property.name',
          width: 200,
          filter: true          
        },
        {
          headerName: 'Type',
          field: 'property.property_type',
          width: 200,
          filter: true          
        },
        // {
        //   headerName: 'Address',
        //   field: 'user.address_line_1',
        //   width: 800,
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
      return !this.errors.any() && this.value1 !== '' && this.value2.length !== 0
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
      this.$router.push("/amenities/new")
    },
    async newRecordProperty() {
      console.log('this.validateForm ', this.validateForm)
      if (!this.validateForm) return
      // save property_manager
      await axios.post(`/property-user/add/-1`, {              
        token: this.token,
        data: {
          user_id: this.$route.params.viewId,
          property_id: this.value2,
          pmc_id: decoded.pmc_id,
        }
      })

      this.popupActive2 = false
      this.$vs.notify({
        color: 'success',
        title: 'Data Saved',
        text: 'The selected data was successfully saved'
      })
      this.loadListData()
    },
    loadUser () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/user/list`, {
              headers: { 
                'Authorization': this.token, 
                'property_ref': localStorage.selectedPropertyRef,
                pmc_id: decoded.pmc_id
              }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadUser ', res)
        this.optionUser = res
      })
    },
    loadProperty () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/property/pmc/list`, {
              headers: { 'Authorization': this.token, pmc_id: decoded.pmc_id }
            })
            .then(res => {    
              console.log('res property ', res)
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res property ', res)
        this.optionProperty = res
      })
    },
    loadListData() {
      const viewId = decoded.pmc_id
      var d = new Promise(async(resolve, reject)  => {
        try {    
            await axios.get(`/property-user/property/list/${this.$route.params.viewId}`, {
                headers: { 
                  'Authorization': this.token,
                  'pmc_id': viewId,
                  'property_ref': localStorage.selectedPropertyRef
                }
              })
              .then(res => { 
                if(res['data'] != 'access_denied') {
                  resolve(res['data'])  
                } else {
                  this.$router.push({name:'page-not-authorized'})
                }
                this.$vs.loading.close()
                this.value1 = parseInt(this.$route.params.viewId)
                this.value2 = []
              })
              .catch(err => {
                this.$vs.loading.close()
                console.log(err)
              }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.listData = res

          console.log('this.listData ', this.listData)
        })
      })      
    }    
  },
  mounted () {
    EventBus.$on('property-user-list', res => {
      this.listData = res
    })
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
  created () {
    this.loadUser()
    this.loadProperty()
    this.loadListData()
 }
}

</script>

<style lang="scss">
.popup-example {
  height:300px;
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
</style>
