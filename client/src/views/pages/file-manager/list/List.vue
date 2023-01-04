
<template>

  <div id="page-data-list">
    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center">

        <!-- ITEMS PER PAGE -->
        <div class="flex-grow">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ folders.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : folders.length }} of {{ folders.length }}</span>
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
          @click="addNewFolder" v-if="false"> <!--crud showC-->
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary" >Add New Folder</span> 
        </div>

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
          <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
          <!-- <vs-button class="mb-4 md:mb-0" @click="gridApi.exportDataAsCsv()">Export as CSV</vs-button> -->
      </div>


      <!-- AgGrid Table -->
      <ag-grid-vue
        style="margin: auto; text-alignment:center; height: 500px;"
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="folders"
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
import { AgGridVue } from 'ag-grid-vue';
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import vSelect from 'vue-select';
import EventBus from '@/EventBus'

// Cell Renderer
import CellRendererFolder from './cell-renderer/CellRendererFolder';
import axios from '@/axios';
import mainHelper from '@/mainHelper' //crud
import CellRendererDate from './cell-renderer/CellRendererDate.vue'

export default {
  components: {
    AgGridVue,
    vSelect,
    CellRendererFolder,
    CellRendererDate
  },
  data () {
    const token = localStorage.usertoken
    return {
      roleVal: localStorage.selectedRoleVal,
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      //crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      token,
      folders: [],
      searchQuery: '',

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
          field: 'name',
          width: 700,
          filter: true,
          cellRendererFramework: 'CellRendererFolder',
        },
        // {
        //   headerName: 'Size',
        //   field: '-',
        //   width: 200,
        //   filter: true
        // },
        {
          headerName: 'Last Modified',
          field: 'updatedAt',
          width: 300,
          filter: true,
          cellRendererFramework: 'CellRendererDate'
        }
      ],
    }
  },
  methods: {
    addNewFolder () {
      this.$router.push("/files/new")
    },
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val);
    },
    async loadFolders() {
      const { data } = await axios.get(`/file-manager`, {
        headers: { 'Authorization': localStorage.usertoken },
      });

      this.folders = this.isAdmin 
        ? data.filter(res => res.val === 'financials' || res.val === 'general') 
        : data.filter(res => res.val === 'general');
      this.$vs.loading.close();
    }
  },
 async mounted () {
    const reload = async (result) => {
      if (this.$route.path === `/files/list/`) {
        await this.loadFolders()
      };
    };

    EventBus.$on('update-property-ref',async (result) => {
      if (
        this.$route.path !== '/amenities/list' &&
        this.$route.path !== '/properties/view/ref'
      ) return
      console.log('/files/list/')
      reload
    })

    await this.loadFolders();
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
    }
  },
  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
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
  async created () {
    // crud
    this.showL = await mainHelper.cansee('file-manager-list', 'list')
    this.showC = await mainHelper.cansee('file-manager-create', 'create')
    this.showR = await mainHelper.cansee('file-manager-read', 'read')
    this.showU = await mainHelper.cansee('file-manager-update', 'update')
    this.showD = await mainHelper.cansee('file-manager-delete', 'delete')

    if (!this.showL) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
  },
  watch: {
    nameFilter (obj) {
      this.setColumnFilter('name', obj.value)
    },
  },
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
