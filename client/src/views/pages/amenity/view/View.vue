<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-amenity-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <vx-card title="Template Details" class="mb-base">
        <!-- Avatar -->
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Name</td>
                <td>{{ view_data.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Color</td>
                <td>{{ view_data.amenity_color }}</td>
              </tr>
              <tr>
                <td class="font-semibold"></td>
                <td><vs-input class="w-full h-10 rounded-lg mb-8" v-model="view_data.amenity_color" type="color" name="amenity_color" disabled/></td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Property</td>
                <td v-if="view_data.property !== undefined">{{ view_data.property.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Updated</td>
                <td>{{ new Date(view_data.updatedAt) | date(true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Created</td>
                <td>{{ new Date(view_data.createdAt) | date(true) }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-amenity-edit', params: { editId: $route.params.viewId }}" 
            :disabled="!showU">Edit <!-- crud -->
            </vs-button> 
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD" v-if="false">Delete <!-- crud -->
            </vs-button>          
          </div>

        </div>

      </vx-card>
        <div class="vx-row">
          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Other Information" class="mb-base">
              <table>
                <tr>
                  <td class="font-semibold">Max People Allowed</td>
                  <td>{{ view_data.max_user_allowed }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Min Time</td>
                  <td v-if="min_hours[0]['name'] !== undefined">{{ min_hours[0]['name'] }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Max Time</td>
                  <td v-if="max_hours[0]['name'] !== undefined">{{ max_hours[0]['name'] }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Buffer Time</td>
                  <td v-if="buffer_time[0]['name'] !== undefined">{{ buffer_time[0]['name'] }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Booking Limit</td>
                  <td>{{ view_data.booking_limit }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Booking Limit Unit</td>
                  <td v-if="booking_limit_unit.length > 0">{{ booking_limit_unit[0]['name'] }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Deposit</td>
                  <td>{{ view_data.deposit_amount }}</td>
                </tr>               
              </table>
            </vx-card>
          </div> 

          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Notification" class="mb-base">
              <table>
                <tr>
                  <td class="font-semibold">Booking Message</td>
                  <td>{{ view_data.booking_message }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Terms and Conditions</td>
                  <td>{{ view_data.terms_conditions }}</td>
                </tr>
              </table>
            </vx-card>
          </div> 
          
        </div>        

      <vx-card title="Files" class="mb-base">
        <div class="vx-row">
          <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
        </div>
      </vx-card>

      <!-- Content Row -->
      <vx-card class="mb-base">
          <div class="vx-col w-full">      
            <div class="flex items-end md:mt-8">
              <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="w-5 h-5" />
              <span class="leading-none font-medium">Hours of Operation</span>
            </div>
            <div class="vx-row w-full mt-4">
              <div class="w-full vx-col">
                <vs-table stripe :data="optionHours" :class="{'hours-of-operation':false}">
                  <template slot="thead">
                    <vs-th>Day</vs-th>
                    <vs-th>24 Hours</vs-th>
                    <vs-th>Operational Hours</vs-th>
                  </template>

                  <template>
                    <vs-tr v-for="(currentD, indexD) in optionOperationalDays" :key="indexD">
                      <vs-td>{{currentD.name}}</vs-td>
                      <vs-td>
                        <vs-switch vs-icon-on="check" v-model="view_data.operational_days_json[indexD]['is_all_day']" color="warning" vs-value="m-yes" disabled>
                          <span slot="off"></span>
                        </vs-switch>
                      </vs-td>
                      <vs-td>
                        <vs-chip color="#24c1a0" v-for="(current, index) in view_data.operational_days_json[indexD]['val']" :key="index">
                          {{current}}
                        </vs-chip>
                      </vs-td>
                    </vs-tr>
                  </template>
                </vs-table>        
              </div>
            </div>       
          </div>
      </vx-card> 
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'
import ReadFile from '../../../components/files/ReadFile.vue'

export default {
  components: {
    ReadFile
  },
  data () {
    const token = localStorage.usertoken
    return {
      // crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      token: token,

      optionHours: [
        { id:1, name: 'None' },
        { id:2, name: '15 Mins' },
        { id:3, name: '30 Mins' },
        { id:4, name: '45 Mins' },   
        { id:5, name: '1 Hour' },
        { id:6, name: '2 Hours' },
        { id:7, name: '3 Hours' },
        { id:8, name: '4 Hours' },
        { id:9, name: '5 Hours' },
        { id:10, name: '6 Hours' },
        { id:11, name: '7 Hours' },
        { id:12, name: '8 Hours' }
      ],

      optionBookingLimitUnit: [
        { id:0, name: 'None' },
        { id:1, name: 'Daily' },
        { id:2, name: 'Weekly' },
        { id:3, name: 'Monthly' },
        { id:4, name: 'Annual' }
      ],

      optionOperationalDays: [
        { id:'0', name: 'Sunday' },
        { id:'1', name: 'Monday' },
        { id:'2', name: 'Tuesday' },
        { id:'3', name: 'Wednesday' },
        { id:'4', name: 'Thursday' },
        { id:'5', name: 'Friday' },
        { id:'6', name: 'Saturday' }
      ],
      //amenity
      view_data: {
        name: '',
        max_hours: '',
        is_deposit_required: '',
        amount: '',
        is_key_required: '',
        approved_color: '',
        requested_color: '',
        blocked_color: '',
        amenity_color: '',
        buffer_time: '',
        available_from_time: '',
        available_to_time: '',
        deposit_amount: '',
        booking_message: '',
        terms_conditions: '',
        inventory_items_json: [],
        is_all_day: '',
        operational_days_json: [      
          { id:'1', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'2', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'3', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'4', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'5', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'6', val: [], op_start_time:[], op_end_time:[], is_all_day:false },
          { id:'7', val: [], op_start_time:[], op_end_time:[], is_all_day:false }
        ],
        buffer_time_unit: '',
        booking_limit: '',
        booking_limit_unit: ''
      },
      data_not_found: 0,

      //reading docs
      files: [],
      fileKey: [],
      folderId: 31
    }
  },
  watch: {
  },
  computed: {
    folderPath() {
      return `docs/amenity/gallery/${this.$route.params.viewId}`
    },
    min_hours() {
      return this.optionHours.filter(res => 
        this.view_data['min_hours'] === res['id']
      )
    },
    max_hours() {
      return this.optionHours.filter(res => 
        this.view_data['max_hours'] === res['id']
      )
    },
    buffer_time() {
      return this.optionHours.filter(res => 
        parseInt(this.view_data['buffer_time']) === res['id']
      )
    },
    booking_limit_unit() {
      return this.optionBookingLimitUnit.filter(res => 
        parseInt(this.view_data['booking_limit_unit']) === res['id']
      )
    }
  },
  methods: {
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/amenity/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        // this.$router.push({name:'app-amenity-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Amenity Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    async loadData () {
      this.$vs.loading()
      const viewId = this.$route.params.viewId
      const loadData = await axios.get(`/amenity/view/${viewId}`, {
        headers: { 
          'Authorization': this.token, 
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      if (loadData['data'].length === 0)  {
        this.data_not_found = 2
      } else {          
        this.data_not_found = 1
        loadData['data'][0]['operational_days_json'] = JSON.parse(loadData['data'][0]['operational_days_json'])
        loadData['data'][0]['inventory_items_json'] = JSON.parse(loadData['data'][0]['inventory_items_json'])
        this.view_data = loadData['data'][0]
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('amenity-list', 'list')
      this.showC = await mainHelper.cansee('amenity-create', 'create')
      this.showR = await mainHelper.cansee('amenity-read', 'read')
      this.showU = await mainHelper.cansee('amenity-update', 'update')
      this.showD = await mainHelper.cansee('amenity-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Amenity Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/amenities/view/${this.$route.params.viewId}`) return
      console.log('/amenities/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/amenities/view/${this.$route.params.viewId}`) return
      console.log('/amenities/view/')
      await this.loadData()
    })   
  },   
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

div.vx-card__body table td.font-semibold {
  padding-right:30px;
}

div.vs-con-input input[type=color] {
  padding: 0px !important;
  height: 2.5rem !important;
  border-radius: 5px;
}

</style>
