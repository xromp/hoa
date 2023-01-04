<template>
  <div id="page-data-view">
    <vx-card title="Maintenance Information" class="mb-base">
      <!-- Avatar -->
      <div class="vx-row">
        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table> 
            <tr>
              <td class="font-semibold">Location</td>
              <td>{{ view_data.location }}</td>
            </tr>             
            <tr>
              <td class="font-semibold">Title</td>
              <td>{{ view_data.title }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Description</td>
              <td>{{ view_data.description }}</td>
            </tr> 
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2" v-if="accessLevel >= 96">
          <table>
            <tr>
              <td class="font-semibold">Type</td>
              <td>{{ rfp_type_name }}</td>
            </tr>  

            <tr>
              <td class="font-semibold">Request No</td>
              <td>{{ view_data.request_no }}</td>
            </tr> 

            <tr>
              <td class="font-semibold">Status</td>
              <td>{{ view_data.m_request_status.name }}</td>
            </tr>

            <tr v-if="accessLevel > 96">
              <td class="font-semibold">Manager's Notes</td>
              <td>{{ view_data.notes === null ||  view_data.notes === '' ? '--' : view_data.notes }}</td>
            </tr>     

            <tr>
              <td class="font-semibold">Requested By</td>
              <td>{{ view_data.user.first_name +' '+ view_data.user.last_name }}</td>
            </tr> 

            <tr>
              <td class="font-semibold">Received By</td>
              <td>{{ view_data.request_to === null ? 'Unseen' : request_to }}</td>
            </tr>  

            <tr v-if="accessLevel > 96">
              <td class="font-semibold">Assigned To</td>
              <td>{{ assigned_to_name === null ? 'Unassigned' : assigned_to_name }}</td>
            </tr>  

            <tr>
              <td class="font-semibold">Date Created</td>
              <td>{{ view_data.createdAt | date(true) }}</td>
            </tr>                  
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons" v-if="false" >          
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" 
          :disabled="!showU" @click="maintenanceType(0)">Edit <!-- crud -->
          </vs-button> 
           <vs-button icon-pack="feather" icon="icon-book-open" class="mr-4" 
          :disabled="!showU" @click="maintenanceType(1)">Work Order <!-- crud -->
          </vs-button> 
           <vs-button icon-pack="feather" icon="icon-file-text" class="mr-4"  
          :disabled="!showU" @click="maintenanceType(2)">RFP <!-- crud -->
          </vs-button> 
          <!-- <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
          :disabled="!showD">Delete
          </vs-button> -->
          <vs-button @click="popupActive=true" color="warning" type="border" class="" v-if="accessLevel >= 96">
            <feather-icon icon="SettingsIcon" svgClasses="h-4 w-4"/>
          Actions</vs-button>
        </div>

        <div class="vx-col w-full flex" id="account-manage-buttons" v-if="roleVal !== 'admin'">
          <!-- <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-rfp-edit', params: { editId: $route.params.viewId }}" v-if="is_seen && is_decline">Edit</vs-button> -->
          <vs-button color="danger" icon-pack="feather" icon="icon-check" class="mr-4" @click="reviewJob" :disabled="is_expire || is_decline || is_closed || is_completed">Review</vs-button>
          <vs-button color="gray" icon-pack="feather" icon="icon-x" class="mr-4" @click="updateStatus('out_for_rfp_decline')" :disabled="is_expire || is_decline || is_closed || is_completed">Decline</vs-button>
          <vs-button class="mr-2" @click="updateStatus('reopen')" color="warning" type="filled" v-if="is_decline">Reopen</vs-button>
          <div class="w-full" v-if="false">  
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

    <div class="vx-row" v-if="accessLevel >= 96">
      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Request Details" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">Property Name</td>
              <td v-if="view_data.property !== null">{{ view_data.property.name }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Issued By</td>
              <td>{{ issued_name }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Scope</td>
              <td>{{ view_data.scope === null ||  view_data.scope === '' ? '--' : view_data.scope }}</td>
            </tr>

            <tr>
              <td class="font-semibold">Other Comments</td>
              <td>{{ view_data.other_comments === null ||  view_data.other_comments === '' ? '--' : view_data.other_comments }}</td>
            </tr>
          </table>
        </vx-card>
      </div> 

      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="RFP Key Dates" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">Issued Date</td>
              <td v-if="view_data.rfp_issue_date !== null">{{new Date(view_data.rfp_issue_date) | date(true) }}</td>
              <td v-else>--</td>
            </tr>

            <tr>
              <td class="font-semibold">Send Question Date</td>
              <td v-if="view_data.send_question_date !== null">{{new Date(view_data.send_question_date) | date(true) }}</td>
              <td v-else>--</td>
            </tr>

            <tr>
              <td class="font-semibold">Due Date</td>
              <td v-if="view_data.rfp_due_date !== null">{{new Date(view_data.rfp_due_date) | date(true) }}</td>
              <td v-else>--</td>
            </tr>

            <tr>
              <td class="font-semibold">Decision Date</td>
              <td v-if="view_data.decision_date !== null">{{new Date(view_data.decision_date) | date(true) }}</td>
              <td v-else>--</td>
            </tr>
          </table>
        </vx-card>
      </div> 
    </div>

    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card title="RFP Response" class="mb-base">
          <vs-table stripe pagination :max-items="10" :data="questionsAndAnswers" >
            <vs-tr>
              <vs-td class="pointer-events-none font-semibold">Question</vs-td>
              <vs-td class="pointer-events-none font-semibold">Response</vs-td>
            </vs-tr>
            <vs-tr v-for="(value, key) in questionsAndAnswers">
              <vs-td v-if="value['question'] !== null">{{ value['question'] }}</vs-td> 
              <vs-td v-else>--</vs-td> 
              <vs-td v-if="value['response'] !== null">{{ value['response'] }}</vs-td> 
              <vs-td v-else>--</vs-td> 
            </vs-tr>
          </vs-table>
        </vx-card>
      </div> 

      <div class="vx-col w-full">
        <vx-card title="Quotations" class="mb-base">
          <vs-table stripe pagination :max-items="10" :data="rfpQoutes">
            <vs-tr>
              <vs-td class="pointer-events-none font-semibold">Description</vs-td>
              <vs-td class="pointer-events-none font-semibold">Quantity</vs-td>
              <vs-td class="pointer-events-none font-semibold">Sub Amount</vs-td>
              <vs-td class="pointer-events-none font-semibold">Total Amount</vs-td>
            </vs-tr>
            <vs-tr  v-for="(value, key) in rfpQoutes" > 
              <vs-td v-if="value['description'] !== null">{{value['description']}}</vs-td>
              <vs-td v-else>--</vs-td>
              <vs-td>{{ parseFloat(value['quantity']).toFixed(0) }}</vs-td>
              <vs-td>${{ parseFloat(value['sub_amount']).toFixed(2) }}</vs-td>
              <vs-td>${{ parseFloat(value['total_amount']).toFixed(2) }}</vs-td>
            </vs-tr>
          </vs-table>
        </vx-card>
      </div> 
    </div>

    <vx-card title="Files" class="mb-base">
      <div class="vx-row">
        <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
      </div>
    </vx-card>

    <vx-card title="RFP Lists" class="mb-base" v-if="false">
      <request-list class="mb-4" />
    </vx-card>

    <vx-card title="Tread: Internal Notes" class="mb-base">
      <thread-list requestType="rfp" class="mb-4" />
    </vx-card>

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-order-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vs-popup classContent="popup-example order-view-pop-f" title="Select Action" :active.sync="popupActive"> 
      <div class="vx-col w-full selectOption" style="overflow: hidden;"> 

        <div class="mt-6"> 
          <vs-button class="mr-2" @click="reOpen(16)" color="warning" type="filled" :disabled="view_data.is_assigned !== 1 && view_data.is_submitted !== 1 && view_data.m_request_status.val!=='completed' " v-if="!(accessLevel <= 96)">Reopen</vs-button>
          <vs-button class="mr-2" @click="updateStats(8)" color="success" type="filled" :disabled="view_data.m_request_status.val==='completed' ">Completed</vs-button>
          <vs-button class="mr-2" @click="updateStats(14)" color="gray" type="filled" :disabled="view_data.m_request_status.val==='closed'" v-if="!(accessLevel <= 96)">Close</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup v-if="false" :classContent="{'popup-example':true, 'order-view-pop-t':view_data.assigned_to_type < 3, 'order-view-pop-f':view_data.assigned_to_type==3}" title="Select Action" :active.sync="popupActive"> 
      <div class="vx-col w-full selectOption" style="overflow: hidden;"> 
        <div class="vx-row mb-base">    
          <div class="mt-4 w-full vx-col">
            <label class="text-sm">Assigned To</label>
            <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
              <vs-radio v-model="view_data.assigned_to_type" vs-value="1" value="1" class="mr-4" v-if="!(accessLevel <= 96)">Staff</vs-radio >
              <vs-radio v-model="view_data.assigned_to_type" vs-value="2" value="2" class="mr-4" v-if="!(accessLevel <= 96)">Vendor</vs-radio >
              <vs-radio v-model="view_data.assigned_to_type" vs-value="3" value="3" class="mr-4">No Action</vs-radio >
            </div>
          </div>  
        </div>

        <div class="vx-row mb-base" style="height:220px;" v-if="view_data.assigned_to_type<3">
          <div class="mt-4 w-full vx-col" v-if="view_data.assigned_to_type == 1">
            <label class="text-sm">Email</label>
            <v-select :options="optionStaff" :reduce="email => email.id" label="email" v-model="view_data.assigned_to" name="assigned_to" v-validate="'required'"/>
            <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
          </div>

          <div class="mt-4 w-full vx-col" v-if="view_data.assigned_to_type == 2">
            <label class="text-sm">Email</label>            
            <v-select :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-model="view_data.assigned_to" name="assigned_to" v-validate="'required'"/>
            <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
          </div>

          <div class="w-full vx-col" v-if="view_data.assigned_to_type < 3"> 
            <div class="vx-row">   
              <div class="w-1/2 vx-col" >
                <label class="vs-input--label">Estimated Date</label><br>
                <flat-pickr :config="configETA" v-model="view_data.eta_dt" placeholder="Select Date" :class="{'flatpickr-input':true, 'w-full':true }"/>
              </div>

              <div class="w-1/2 vx-col">
                <label class="text-sm">Direction</label>
                <vs-input class="w-full" v-model="view_data.direction" type="text" name="direction" v-validate="'required'"/>
                <span class="text-danger text-sm"  v-show="errors.has('direction')">{{ errors.first('direction') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>

    <!-- <div class="mt-6"> 
      <vs-button class="mr-2" @click="assignOrder" color="primary" type="filled" :disabled="view_data.assigned_to_type == 3 || this.view_data.assigned_to === null || view_data.m_request_status.val==='completed' ">Assign</vs-button>
      <vs-button class="mr-2" @click="reOpen(16)" color="warning" type="filled" :disabled="view_data.is_submitted !== 1 && view_data.m_request_status.val!=='completed' " v-if="!(accessLevel <= 96)">Reopen</vs-button>
      <vs-button class="mr-2" @click="updateStats(8)" color="success" type="filled" :disabled="view_data.assigned_to_type < 3 || view_data.m_request_status.val==='completed' ">Completed</vs-button>
      <vs-button class="mr-2" @click="updateStats(14)" color="gray" type="filled" :disabled="view_data.assigned_to_type < 3" v-if="!(accessLevel <= 96)">Closed</vs-button>
    </div> -->

    <!-- <tr>
      <td class="font-semibold">Recipient</td>
      <td>{{ view_data.rfp_recipients === null ||  view_data.rfp_recipients === '' ? '--' : view_data.rfp_recipients }}</td>
    </tr> -->

    <!-- <tr v-for="(v, k) in rfp_recipients">              
      <td class="font-semibold" v-if="k == 0">Recipients</td>
      <td class="font-semibold" v-else-if="k != 0"></td>
      <td v-if="v.business_name !== null">{{ v.business_name }}</td>
    </tr>  -->
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import ThreadList from '../../maintenance_thread/list/List.vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
const jwt = require('jsonwebtoken')

import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import ReadFile from '../../../components/files/ReadFile.vue'

export default {
  components: {
    ThreadList,
    'countdown': VueCountdown,    
    vSelect,
    flatPickr,
    ReadFile
  },
  data () {
    const token = localStorage.usertoken
    return {
      questionsAndAnswers: [],
      rfpQoutes: [],
      configETA: {
        enableTime: false,
        minDate: new Date(),
        maxDate: null, 
        dateFormat: 'F j, Y',
        "disable": [
            function(date) {
                // return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ]
      },

      optionStaff: [],
      optionVendor: [],
      request_to: null,
      popupActive: false,
      optionType: [
        { id: 0, name: 'Request', val: 'request'},
        { id: 1, name: 'Work Order', val: 'work-order'},
        { id: 2, name: 'Proposal', val: 'proposal'},
        { id: 3, name: 'Information', val: 'information'}
      ],

      // crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      token: token,
      is_seen: false,

      issued_name: null,
      
      //maintenance
      view_data: {
        assigned_to_name: null,
        eta_dt: null,
        direction: null,
        vendor_email: null,
        due_date: null,
        assigned_to_type: 3,
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
        assigned_to: null,
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
        },
      },
      data_not_found: false,

      files: [],
      fileKey: [],
      folderId: 21,
    }
  },
  computed: {
    accessLevel() {
      const userAllData = JSON.parse(localStorage.userAllData)

      return userAllData.user_role.access_level
    },    
    folderPath() {
      return `docs/maintenance-order/gallery/${this.view_data.order_id}`
    },
    roleVal() {
      const userAllData = JSON.parse(localStorage.userAllData)

      return userAllData.user_role.val
    },    
    rfp_type_name() {
      let type_name = null
      type_name = this.optionType.filter( r => r.id === parseInt(this.view_data.rfp_type) )

      return type_name.length === 0 ? '--' : type_name[0]['name']
    },
    is_expire(){
      const result =( new Date(this.view_data['rfp_due_date']) !== null ) && ( new Date(this.view_data['rfp_due_date']) <= new Date() )

      return result
    },
    is_decline() {
      const result = this.view_data['m_request_status']['val'] === 'out_for_rfp_decline' ? true:false

      return result
    },
    is_completed() {
      const result = this.view_data['m_request_status']['val'] === 'completed' ? true:false

      return result
    },
    is_closed() {
      const result = this.view_data['m_request_status']['val'] === 'closed' ? true:false

      return result
    },
    assigned_to_name() {
      try {
        let assigned = []
        if (this.view_data.assigned_to_type===1 && this.optionStaff.length!==0) {        
          assigned = this.optionStaff.filter(res => this.view_data.assigned_to === res.id) 

          return assigned.length === 0 ? '--' : assigned[0]['full_name']
        } else if (this.optionStaff.length!==0) {
          assigned = this.optionVendor.filter(res => this.view_data.assigned_to === res.id)

          return assigned.length === 0 ? '--' : assigned[0]['business_name']
        } 
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading RFP Page',
          text: err.toString('utf8')
        })
      }
    }
  },
  watch: { 
    rfpQoutes: function(newData, oldData) { 
      return newData
    },
    questionsAndAnswers: function(newData, oldData) { 
      return newData
    }
  },
  methods: {
    async loadRequestTo(){
      const {data} = await axios.get(`/user/view/${this.view_data.request_to}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      }) 

      this.request_to = data.length === 0 ? null : data[0]['full_name']   
    },
    async loadIssuedName(){
      const {data} = await axios.get(`/user/view/${this.view_data.issued_by_id}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      }) 

      this.issued_name = data.length === 0 ? null : data[0]['full_name']
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
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/maintenance/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-order-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading RFP Page',
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
    async reviewJob() {
      try {
        if (this.view_data.m_request_status.val === 'out_for_rfp_review' ||
          this.view_data.m_request_status.val === 'out_for_rfp_submitted') {
          const viewId = this.$route.params.viewId
          this.$router.push({name:'app-rfp-edit', params: {editId: viewId }})
        } else {
          await this.updateStatus('out_for_rfp_review')
        }
      } catch (err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading RFP Page',
          text: err.toString('utf8')
        })
      }
    },
    async updateStatus(val) {
      try {
        const viewId = this.$route.params.viewId
        const is_submitted = this.view_data.is_submitted
        this.view_data.m_request_status.val = val
        this.view_data.property_ref = localStorage.selectedPropertyRef

        await axios.post(`/maintenance/update-stat/${this.$route.params.viewId}`, {
          token: this.token,
          data: this.view_data
        })

        this.$vs.notify({
          color: 'success',
          title: 'Success',
          text: 'Status updated'
        })
        this.loadData()
        if ('out_for_rfp_review' !== val) return
        this.$router.push({name:'app-rfp-edit', params: {editId: viewId }})
      } catch(err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading RFP Page',
          text: err.toString('utf8')
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
        this.$router.push({name:'app-rfp-list'})
      } catch(err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading RFP Page',
          text: err.toString('utf8')
        })
      }
    },
    async loadStaff () {
      const result = await axios.get(`/user/property-manager/list`, {
        headers: { 
          'Authorization': this.token,
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      this.optionStaff = result['data']
    },
    async loadData () {      
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/maintenance/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      })
      
      this.view_data = result['data']
      this.view_data.createdAt = new Date(this.view_data.createdAt)
      this.view_data.resolved_date = new Date(this.view_data.resolved_date)
      this.view_data.assigned_to = JSON.parse(this.view_data.assigned_to)
      this.is_seen = result['data']['m_request_status']['val'] === 'out_for_rfp' ? true:false  
      this.questionsAndAnswers = JSON.parse(this.view_data.questions_to_vendor)   
      this.rfpQoutes = JSON.parse(this.view_data.qoutation)   

      

      if(result['data'] == 'access_denied' || result['data'] == '') {
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: 'Something went wrong'
        })
        // this.$router.push({name:'app-order-list'})
      }

      this.$vs.loading.close()   
    },
    async loadVendor () {
      const result = await axios.get(`/vendor/property/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionVendor = result['data']
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
      // crud
      this.showL = await mainHelper.cansee('maintenance-list', 'list')
      this.showC = await mainHelper.cansee('maintenance-create', 'create')
      this.showR = await mainHelper.cansee('maintenance-read', 'read')
      this.showU = await mainHelper.cansee('maintenance-update', 'update')
      this.showD = await mainHelper.cansee('maintenance-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadStaff()
      await this.loadVendor()
      await this.loadData()
      await this.loadIssuedName()
      await this.loadRequestTo()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading RFP Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  }
}

</script>

<style lang="scss">

div.order-view-pop-t {
  height: 420px;
}

div.order-view-pop-f {
  height: 220px;
}

div.selectOption ul.vs__dropdown-menu {
  height: 150px;
}

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

td.font-semibold {
  padding-right: 20px !important;
}
</style>
