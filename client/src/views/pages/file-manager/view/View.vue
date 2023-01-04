
<template>

  <div id="page-data-list">
    <vx-card title="Files" class="mb-base" v-if="showU"><!--crud-->
      <div class="vx-col w-full" style="overflow: hidden;"> 
        <div class="vx-row mb-base">    
          <div class="mt-4 w-full vx-col">
        
            <div class="flex items-start flex-col sm:flex-row">
              <input type="file" 
                multiple="multiple" 
                id="fileD" 
                class="hidden" 
                ref="uploadFileBilling" 
                @change="uploadFiles" 
                accept="application/pdf">
              <vs-button type="border" class="mr-4" 
                @click="$refs.uploadFileBilling.click()">
                Upload Files
              </vs-button>
              <vs-button 
                color="primary" 
                class="mr-4" 
                @click="saveFiles" 
                v-if="filesUploading.length > 0"
                > Save Files
              </vs-button>
            </div>

            <div class="vx-col w-full">
              <div class="flex items-start flex-col" v-if="filesUploading.length > 0">
                <vs-list v-bind:key="index" v-for="({ name, size}, index) in filesUploading">
                  <vs-list-item
                    :title="name"
                    :subtitle="size">
                    <template slot="avatar">
                      <feather-icon icon="XCircleIcon" 
                        class="cursor-pointer"
                        style="padding-right: 10px;"
                        @click="deleteFile(index)"
                      />
                    </template>
                  </vs-list-item>
                </vs-list>
                <p v-if="filesUploading.length === 0" class="mt-2">No files uploaded</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </vx-card>
    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center">

        <!-- ITEMS PER PAGE -->
        <div class="flex-grow">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ files.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : files.length }} of {{ files.length }}</span>
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
        :rowData="files"
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
import axios from '@/axios'
import EventBus from '@/EventBus'
import mainHelper from '@/mainHelper' //crud
import CellRendererFile from './cell-renderer/CellRendererFile';
import CellRendererActions from './cell-renderer/CellRendererActions';
import CellRendererDate from './cell-renderer/CellRendererDate.vue'

export default {
  components: {
    AgGridVue,
    vSelect,
    CellRendererFile,
    CellRendererActions,
    CellRendererDate
  },
  data () {
    const token = localStorage.usertoken;
    const folderId = this.$route.params.id;
    return {
      //crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      token,
      folderId,
      files: [],
      filesUploading: [],
      rawFiles: [],
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
          field: 'original_file_name',
          width: 600,
          filter: true,
          cellRendererFramework: 'CellRendererFile',
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
        },
        {
          headerName: 'Actions',
          field: 'original_file_name',
          width: 200,
          cellRendererFramework: 'CellRendererActions'
        }
      ],
    }
  },
  methods: {
    addNewFolder () {
      this.$router.push("/billings/files/add")
    },
    async uploadFiles() {
      this.$vs.loading();
      var formdata = new FormData();
      $.each($('#fileD')[0].files, function(i, file) {
        formdata.append('fileD_'+i, file);
      });
      formdata.append('token', this.token);
      formdata.append('folder_id', `${this.folderId}`);
      formdata.append('property_ref', localStorage.selectedPropertyRef);

      this.resUp = await axios.post(`/file-manager/upload-files`,  
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
      )

      for (const [key, { name, size }] of Object.entries(this.resUp.data.rawD)) {
        this.filesUploading.push({ 
          name,
          size: this.getFileSize(size),
        })
      }

      if (Array.isArray(this.resUp.data.uploadedD)) {
        for (const [key, value] of Object.entries(this.resUp.data.uploadedD)) {
          this.rawFiles.push(value)
        }
      } else {
        this.rawFiles[0] = this.resUp.data.uploadedD
      }
      this.$vs.loading.close()
    },
    async saveFiles() {
      this.$vs.loading()
      await axios.post(`/file-manager/save-uploaded-files`, {
        rawFiles: this.rawFiles,
        token: this.token,
        path: `docs/file-manager/${this.folderId}`,
        folderId: this.folderId,
        property_ref: localStorage.selectedPropertyRef
      })
      this.$vs.loading.close()
      this.$vs.notify({
        color: 'success',
        title: 'File(s) saved',
        text: 'The file(s) were successfully saved',
      })
      setTimeout(() => { 
        // this.$router.go(0);
        this.loadData()
        this.rawFiles = []
        this.filesUploading = []
        this.resUp = []
      }, 500);
      
    },
    deleteFile(i) {
      this.filesUploading.splice(i, 1);
      this.rawFiles.splice(i, 1);
    },
    getFileSize(size) {
      let sizeCopy = size,
        fSExt = new Array('Bytes', 'KB', 'MB', 'GB'), 
        i = 0;
      while( sizeCopy > 900) {
        sizeCopy/=1024;
        i++;
      }
      return `${(Math.round(sizeCopy*100)/100)} ${fSExt[i]}`;
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
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val);
    },
    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    async loadData() {
      try {
        const { data } = await axios.get(`/file-manager/${this.folderId}`, {
          headers: { 'Authorization': localStorage.usertoken },
        });
        this.files = data;
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'File Manager',
          text: response.data.errors
        })
        setTimeout(() => {
          window.location.href = "/files/list/";
        }, 2000);
      }
      this.$vs.loading.close();
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
  async mounted () {
    const reload = async (result) => {
      console.log(this.$route.path === `/files/${this.folderId}/`, this.$route.path, `/files/${this.folderId}/`)
      if (this.$route.path === `/files/${this.folderId}`)
      await this.loadData();
    };
    EventBus.$on('update-parent-id', reload);
    EventBus.$on('update-property-ref', reload);
    await this.loadData();
    this.gridApi = this.gridOptions.api
    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
      header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
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
      this.setColumnFilter('original_file_name', obj.value)
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
