
<template>
  <div id="page-data-view">
    <vx-card title="Maintanance Details" class="mb-base">
      <!-- Avatar -->
      <div class="vx-row">

        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table>
            <tr>
              <td class="font-semibold">Title</td>
              <td>{{ view_data.title }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Description</td>
              <td>{{ view_data.description }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Location</td>
              <td>{{ view_data.location }}</td>
            </tr>            
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>
            <tr>
              <td class="font-semibold">Urgency</td>
              <td>{{ view_data.urgency }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Status</td>
              <td>{{ view_data.m_request_status.name }}</td>
            </tr>
            <tr v-for="(dt, key) in view_data.maintenance_request_dts">              
              <td class="font-semibold" v-if="key == 0">Availability</td>
              <td class="font-semibold" v-else-if="key != 0"></td>
              <td>
                {{ new Date(dt.start_date) | date(true) }} ( {{ dt.start_time }} to {{ dt.end_time }} )
              </td>
            </tr>
            <tr>
              <td class="font-semibold">Due Date/Time</td>
              <td>{{ new Date(view_data.eta_dt) | date(true) }} {{ new Date(view_data.eta_dt) | time }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Notes</td>
              <td>{{ view_data.notes}}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons" v-if="roleName == 'Admin'">
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-maintenance-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
          <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
        </div>
        <div class="vx-col w-full flex" id="account-manage-buttons" v-else-if="roleName == 'Vendor'">
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-maintenance-edit', params: { editId: $route.params.viewId }}" v-if="is_seen">Edit</vs-button>
          <vs-button color="success" icon-pack="feather" icon="icon-check" class="mr-4" @click="acceptJob($route.params.viewId)" v-else-if="!is_seen">Accept</vs-button>
          <vs-button color="danger" icon-pack="feather" icon="icon-x" class="mr-4" @click="rejectJob($route.params.viewId)" v-if="!is_seen">Decline</vs-button>
          
          <div class="w-full" v-if="is_seen">  
            <div class="timerDue">
              <div style="width: auto;background: #e15e6d;border-radius: 5px;">
                
                <div class="count-down text-center">
                  <countdown :time="new Date(view_data.eta_dt).getTime() - new Date().getTime()">
                    <template slot-scope="props">
                      <div class="single-counter p-2">
                        <img src="@/assets/images/axp/timelog3.gif">
                      </div>

                      <div class="single-counter">
                        <span class="timer">{{ props.days }}</span>
                        <span>Days</span>
                      </div>

                      <div class="single-counter">
                        <span class="timer">{{ props.hours }}</span>
                        <span>Hours</span>
                      </div>

                      <div class="single-counter">
                        <span class="timer">{{ props.minutes }}</span>
                        <span>Minutes</span>
                      </div>

                      <div class="single-counter">
                        <span class="timer">{{ props.seconds }}</span>
                        <span>Seconds</span>
                      </div>
                    </template>
                  </countdown>
                </div>

              </div>
            </div>          
          </div>
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
        <vx-card title="User Information" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">User Email</td>
              <td v-if="view_data.user !== null">{{ view_data.user.email }}</td>
            </tr>
            <!-- <tr>
              <td class="font-semibold">Building</td>
              <td v-if="view_data.building !== null">{{ view_data.building.name }}</td>
            </tr> -->
            <tr>
              <td class="font-semibold">First Name</td>
              <td>{{ view_data.user.first_name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Last Name</td>
              <td>{{ view_data.user.last_name }}</td>
            </tr>
            <!-- <tr>
              <td class="font-semibold">Property</td>
              <td v-if="view_data.property !== null">{{ view_data.property.name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Unit No</td>
              <td v-if="view_data.unit !== null">{{ view_data.unit.number }}</td>
            </tr> -->
          </table>
        </vx-card>
      </div> 

      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Request Information" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold mr-4">Type</td>
              <td v-if="view_data.maintenance_type !== null">{{ view_data.maintenance_type.name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Category</td>
              <td v-if="view_data.vendor_category_master !== null">{{ view_data.vendor_category_master.name }}</td>
            </tr>
            <!-- <tr>
              <td class="font-semibold">Assigned To</td>
              <td v-if="view_data.vendor !== null">{{ view_data.vendor.name }}</td>
            </tr> -->
            <tr>
              <td class="font-semibold">Resolved Date</td>
              <td>{{ view_data.resolved_date | date(true) }}</td>
            </tr>
            <!-- <tr>
              <td class="font-semibold">Rfp Type</td>
              <td>{{ view_data.rfp_type }}</td>
            </tr> -->
            <!-- <tr>
              <td class="font-semibold">Is Seen</td>
              <td>{{ view_data.is_seen }}</td>
            </tr> -->
          </table>
        </vx-card>
      </div> 
    </div>

    <vx-card title="Threads" class="mb-base">
      <!-- Avatar -->
      <thread-list class="mb-4" />
    </vx-card>

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-maintenance-list'}" class="text-inherit underline">All Data</router-link>
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
import mainHelper from '@/mainHelper'
import ThreadList     from '../../maintenance_thread/list/List.vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
const jwt = require('jsonwebtoken')

export default {
  components: {
    ThreadList,
    'countdown': VueCountdown
  },
  data () {
    const token = localStorage.usertoken
    return {
      imgs: '',  // Img Url , string or Array of string
      visible: false,
      index: 0,   // default: 0

      token: token,
      roleName: '',
      is_seen: false,
      
      //maintenance
      view_data: {
        unit_resident_id: '',
        m_request_status_id: '',
        resolved_date: '',
        building_id: '',
        location: '',
        maintenance_type_id: '',
        urgency: '',
        description: '',
        image_filename: '',
        m_type_other_value: '',
        assigned_to: '',
        rfp_type: '',
        vendor_category_id: '',
        user_id: '',
        is_seen: '',
        property_id: '',
        unit_id: '',
        vendor: {
          name:'',
        },
        user: {
          name:'',
        }, 
        building: {
          name:'',
        }, 
        property: {
          name:'',
        },
        unit: {
          name:'',
        },
        maintenance_type: {
          name:'',
        },
        vendor_category_master: {
          name:'',
        }
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
        text: `You are about to delete "${this.view_data.id}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/maintenance/delete/${viewId}`, {
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
                // this.$router.push({name:'app-maintenance-list'})
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
            await axios.get(`/maintenance/view/${viewId}`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
                // this.$router.push({name:'app-maintenance-list'})
              } else {
                console.log('res load data ', res['data'])

                if (this.roleName == 'Vendor') {
                  this.is_seen = res['data'][0]['maintenance_request_vendor']['is_seen'] == 1 ? true:false
                  console.log('this.is_seen ', this.is_seen)
                }

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
              path: `docs/maintenance-request/gallery/${viewId}`,
              document_folder_id: 7
            })

            //reading docs
            for (const [key, value] of Object.entries(this.tableRead.data.uploadedD)) {
              var imgB64 = this._arrayBufferToBase64( value.data.Body.data )
              var imgAsc = imgB64.toString('ascii')
              this.files.push("data:image/png;base64, " + imgAsc)
              this.fileKey.push(value.key)
            }

            console.log('this.files ', this.files)
            console.log('this.fileKey ', this.fileKey)

            // console.log('this.tableRead ', this.tableRead.data.uploadedD)
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        // d.then((res) => {
        //   this.view_data = res[0]
        //   console.log('this.view_data ', this.view_data)
        // })
      })

      this.view_data = await d
      this.view_data.createdAt = new Date(this.view_data.createdAt)
      this.view_data.resolved_date = new Date(this.view_data.resolved_date)
      console.log('this.view_data ', this.view_data)
    },
    async loadUserPem() {
      var decoded = jwt.verify(this.token, 'secret')  
      const viewId = decoded.id
      var d = await axios.get(`/user/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      }) 
      const userD = d['data'][0]['user_role']['name']
      this.roleName = userD

      console.log('this.roleName ', this.roleName)
    },
    async acceptJob() {
      try {
        const viewId = this.$route.params.viewId
        const userAllData = JSON.parse(localStorage.userAllData)

        await axios.post(`/maintenance/accept/${viewId}`, {
          token: this.token,
          business_name: userAllData['vendor']['business_name']
        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job accepted.'
        })
        this.$router.push({name:'app-maintenance-list'})
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Loading Page',
          text: err
        })
      }
    },
    async rejectJob() {
      try {
        const viewId = this.$route.params.viewId
        const userAllData = JSON.parse(localStorage.userAllData)

        await axios.post(`/maintenance/reject/${viewId}`, {
          token: this.token,
          business_name: userAllData['vendor']['business_name']
        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job declined.'
        })
        this.$router.push({name:'app-maintenance-list'})
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Loading Page',
          text: err
        })
      }
    }
  },
  async created () {
    var showP = await mainHelper.cansee(this.$route.meta.slug, 'read')
    if (!showP) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }

    this.loadUserPem()
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

.timerDue {
  display: flex;
  justify-content: flex-end;
}

.single-counter {
  display: inline-block;
  position: relative;
  width: 50px;
  color: white;
  font-size: 10px;
  padding: 0px;
}

.single-counter .timer {
  font-size: 20px;
}
</style>
