
<template>
  <div id="page-data-view">
    <vx-card title="Equipment Details" class="mb-base">
      <!-- Avatar -->
      <div class="vx-row">

        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table>
            <tr>
              <td class="font-semibold">Device Name</td>
              <td>{{ view_data.device_name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Category</td>
              <td>{{ view_data.category }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Components</td>
              <td>{{ view_data.components }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Files</td>
              <td>{{ view_data.files }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Serviced By</td>
              <td v-if="view_data.vendor !== null">{{ view_data.vendor.email }}</td>
            </tr>    
            <tr>
              <td class="font-semibold">Model No</td>
              <td>{{ view_data.model_no }}</td>
            </tr>        
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>            
            <tr>
              <td class="font-semibold">Part No</td>
              <td>{{ view_data.part_no }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Unit Price</td>
              <td>{{ view_data.unit_price }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Service Reminders</td>
              <td>{{ view_data.service_reminders }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Notes</td>
              <td>{{ view_data.notes }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Created</td>
              <td>{{ view_data.createdAt | date(true) }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Updated</td>
              <td>{{ view_data.updatedAt | date(true) }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons">
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-equipment-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
          <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
        </div>
      </div>
    </vx-card>

    <vx-card title="Images" class="mb-base">
      <!-- Avatar -->
      <div class="vx-row">
        <!-- Information - Col 1 -->
        <!-- reading docs -->
        <div class="vx-col flex-1">
          <div class="flex items-start flex-col sm:flex-row">
            <div v-if="files.length > 0" v-for="(item, file) in files">
              <span class="flex">                
                <img :src="item"  class="mt-4 mr-8 rounded h-24 w-24" @click="showMultiple(file)" />
              </span>
            </div>
            <p v-if="files.length == 0">No files uploaded</p>
          </div>
        </div>
        <!-- /Information - Col 1 -->
      </div>
    </vx-card>    

    <div class="vx-row">
      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Location" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">Location Name</td>              
            </tr>
            <tr>
              <td>{{ view_data.location_name }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Location Description</td>              
            </tr>
            <tr>
              <td>{{ view_data.location_description }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Longtitude</td>              
            </tr>
            <tr>
              <td>{{ view_data.longtitude }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Latitude</td>              
            </tr>
            <tr>
              <td>{{ view_data.latitude }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Input Location</td>              
            </tr>
            <tr>
              <td>{{ view_data.input_location }}</td>
            </tr>
          </table>
        </vx-card>
      </div> 

      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Warranty" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold mr-4">Warranty Start</td>              
            </tr>
            <tr>
              <td>{{ view_data.warranty_start }}</td>
            </tr>
            <tr>
              <td class="font-semibold mr-4">Warranty End</td>              
            </tr>
            <tr>
              <td>{{ view_data.warranty_end }}</td>
            </tr>
            <tr>
              <td class="font-semibold mr-4">Standard Warranty</td>              
            </tr>
            <tr>
              <td>{{ view_data.standard_warranty }}</td>
            </tr>
            <tr>
              <td class="font-semibold mr-4">Extended Warranty</td>              
            </tr>
            <tr>
              <td>{{ view_data.extended_warranty }}</td>
            </tr>
            <tr>
              <td class="font-semibold mr-4">Expiration Reminder</td>              
            </tr>
            <tr>
              <td>{{ view_data.expiration_reminder }}</td>
            </tr>
          </table>
        </vx-card>
      </div> 
    </div>

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-equipment-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vue-easy-lightbox
      :visible="visible"
      :imgs="files"
      :index="index"
      @hide="handleHide"
    ></vue-easy-lightbox>
  </div>
</template>

<script>
import axios from '../../../../axios'

export default {
  components: {
  },
  data () {
    const token = localStorage.usertoken
    return {
      imgs: '',  // Img Url , string or Array of string
      visible: false,
      index: 0,   // default: 0

      token: token,
      
      //equipment
      view_data: {
        device_name: '',
        service_reminders: '',
        category: '',
        files: '',
        serviced_by: '',
        model_no: '',
        part_no: '',
        unit_price: '',
        location_name: '',
        location_description: '',
        longtitude: '',
        latitude: '',
        input_location: '',
        warranty_start: '',
        warranty_end: '',
        standard_warranty: '',
        extended_warranty: '',
        expiration_reminder: '',
        notes: '',
        createdAt: '',
        updatedAt: ''
      },       
      data_not_found: false,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: []      
    }
  },
  computed: {
  },
  methods: {
    showMultiple(k) {
      this.index = k  // index of imgList
      this.show()
    },
    show() {
      this.visible = true
    },
    handleHide() {
      this.visible = false
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.device_name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/equipment/delete/${viewId}`, {
              token: this.token
            })
            .then(res => {        
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
              } else {
                this.$router.push({name:'app-equipment-list'})
                this.showDeleteSuccess()
              }

            })
            .catch(err => {              
              reject(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.data_local = res[0]
        })
      })
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    //reading docs
    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    async loadData () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.get(`/equipment/view/${viewId}`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
                this.$router.push({name:'app-equipment-list'})
              } else {
                resolve(res['data'][0])
              }

              this.$vs.loading.close()
            })
            .catch(err => {
              this.data_not_found = true
              this.$vs.loading.close()
            }) 

            //reading docs
            this.tableRead = await axios.post(`/docs/table/read/`, {
              token: this.token,
              path: `docs/maintenance-equipment/gallery/${viewId}`,
              document_folder_id: 8
            })

            //reading docs
            for (const [key, value] of Object.entries(this.tableRead.data.uploadedD)) {
              var imgB64 = this._arrayBufferToBase64( value.data.Body.data )
              var imgAsc = imgB64.toString('ascii')
              this.files.push("data:image/png;base64, " + imgAsc)
              this.fileKey.push(value.key)
            }
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        // d.then((res) => {
        //   this.view_data = res[0]
        // })
      })

      this.view_data = await d
      this.view_data.createdAt = new Date(this.view_data.createdAt)
      this.view_data.updatedAt = new Date(this.view_data.updatedAt)
    }
  },
  created () {
    this.loadData()
  }
}

</script>

<style lang="scss">
.vel-modal[data-v-1f17a952] {
  z-index: 100000 !important;
}

#avatar-col {
  width: 10rem;
}

#page-data-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: .8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width:370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }


@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }

}

.avatar-img {
  position: relative;
  width: 230px;
  overflow: hidden;
  padding-top: 230px;
}

.avatar-img img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
}

</style>
