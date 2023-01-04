<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="ToolIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Maintenance Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Location" v-model="data_local.location" type="location" v-validate="'required'" name="location" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Description" v-model="data_local.description" type="description" v-validate="'required'" name="description" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
            </div> 

            <div class="mt-4">
              <label class="text-sm pl-2">Scope</label>
              <vs-textarea label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.scope" type="text" v-validate="'required'" name="scope" :disabled="accessLevel < 97"/>
              <span class="text-danger text-sm"  v-show="errors.has('scope')">{{ errors.first('scope') }}</span>
            </div> 

            <div class="mt-4">
              <label class="text-sm pl-2">Preferred Timing</label>
              <vs-textarea label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.preferred_timing" type="text" v-validate="'required'" name="preferred_timing" :disabled="accessLevel < 97"/>
              <span class="text-danger text-sm"  v-show="errors.has('preferred_timing')">{{ errors.first('preferred_timing') }}</span>
            </div> 

            <update-file 
              :loadFile="loadFile" 
              :folderPath="folderPath" 
              :folderId="20"
              class="mb-4" 
            />

            <div class="mt-4" v-if="false">
              <label class="text-sm pl-2">Availability</label>
              <vs-textarea height="100px" label="" class="w-full vs-t-cna" v-model="data_local.availability" type="text" v-validate="'required'" name="availability" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="Edit3Icon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Maintenance Other Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <!-- <div class="mt-4">
              <label class="vs-input--label">Type</label>
              <v-select :options="optionType" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.rfp_type" name="rfp_type" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('rfp_type')">{{ errors.first('rfp_type') }}</span> 
            </div> -->

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Request No" v-model="data_local.request_no" type="request_no" v-validate="'required'" name="request_no" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('request_no')">{{ errors.first('request_no') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Status" v-model="data_local.m_request_status.name" type="text" v-validate="'required'" name="m_request_status" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('m_request_status')">{{ errors.first('m_request_status') }}</span>
            </div>

            <div class="mt-4" v-if="accessLevel > 96">
              <label class="text-sm pl-2">Manager's Notes</label>
              <vs-textarea class="w-full vs-t-cna" height="100px" label="" v-model="data_local.notes" v-validate="'required'" name="notes" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Request By" v-model="data_local.user.full_name" type="text" v-validate="'required'" name="full_name" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('full_name')">{{ errors.first('full_name') }}</span>
            </div> 

            <div class="mt-4" v-if="false">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Received By" v-model="request_to" type="text" v-validate="'required'" name="request_to" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('request_to')">{{ errors.first('request_to') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Date Created" v-model="data_local.createdAt" v-validate="'required'" name="createdAt" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('createdAt')">{{ errors.first('createdAt') }}</span>
            </div>  

          </div>
        </div>
      </div> 
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-6">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="PaperclipIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Request Details</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Property Name" v-model="data_local.property.name" type="text" v-validate="'required'" name="property_id" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>
            </div> 

            <div class="mt-4" v-if="false">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Issued By" v-model="issued_by" type="text" v-validate="'required'" name="issued_by" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('issued_by')">{{ errors.first('issued_by') }}</span> 
            </div>

            <div class="mt-4" v-if="false">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Issued By" v-model="data_local.issued_by_id" type="text" v-validate="'required'" name="issued_by_id" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('issued_by_id')">{{ errors.first('issued_by_id') }}</span> 
            </div>

            <div class="mt-6 d-inline">
              <label class="vs-input--label" v-if="qs.length == 0">No Questions To Show</label>
              <label class="vs-input--label" v-if="qs.length != 0">Questions</label><br>
              <div class="dt-available mt-2" v-for="(v, key) in qs">
                <div class="vx-row">
                  <div class="vx-col pr-0" style="width:40%">
                    <vs-textarea height="80px" :class="{'w-full':true, 'vs-t-cna':true}" label="Questions" v-model="v.question" type="text" v-validate="'required'" name="v-question" disabled/>
                  </div>
                  <div class="vx-col pr-0" style="width:40%">
                    <vs-textarea height="80px" :class="{'w-full':true, 'vs-t-cna':roleVal === 'admin'}" label="Response" v-model="v.response" type="text" v-validate="'required'" name="v-response" :disabled="roleVal === 'admin'"/>
                  </div>
                  <div class="vx-col" style="width:10%">
                    <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 40px;left: 10px;color: gray;" class="cursor-not-allowed w-full" />
                  </div>
                </div>
              </div>

              <div class="cursor-not-allowed">          
                <vs-button color="success" class="mr-4" @click="addQ" disabled>Add Question</vs-button>
              </div>                 
            </div>

            <hr class="mt-6">
            <div class="mt-6 d-inline">
              <label class="vs-input--label" v-if="qts.length == 0">No Quotes to Show</label>
              <label class="vs-input--label" v-if="qts.length != 0">Quotes</label><br>
              <div class="dt-available" v-if="qts.length != 0">
                <div class="vx-row">
                  <div class="vx-col pr-0 m-auto ml-0 mr-0" style="width:45%">
                    <label class="vs-input--label">Description</label>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <label class="vs-input--label">Quantity / Hrs</label>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <label class="vs-input--label">Amount per Qty</label>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <label class="vs-input--label">Total Amount</label>
                  </div>
                </div>                
              </div>
              <div class="dt-available mb-4" v-for="(v, key) in qts">
                <div class="vx-row mt-2 vs-qts">
                  <div class="vx-col pr-0" style="width:45%">
                    <vs-input class="w-full" label="" type="text" v-validate="'required'" name="v.description" v-model="v.description"/>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <vs-input class="w-full text-right" label="" type="number" v-validate="'required'" name="v.quantity" min="0" v-model="v.quantity" @change="calcTotal(v, key)"/>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <vs-input class="w-full text-right" label="" type="number" v-validate="'required'" name="v.sub_amount" min="0" v-model="v.sub_amount" @change="calcTotal(v, key)"/>
                  </div>
                  <div class="vx-col pr-0" style="width:15%">
                    <vs-input class="w-full text-right" label="" type="number" v-validate="'required'" name="v.total_amount" v-model="v.total_amount" disabled/>
                  </div>
                  <div class="vx-col" style="width:10%">
                    <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 7px;left: 10px;color: #ea5455;" class="cursor-pointer w-full" @click="deleteQT(key)"/>
                  </div>
                </div>
              </div>
              <div class="dt-available mb-4">
                <div class="vx-row mt-2 vs-qts">
                  <div class="vx-col pr-0" style="width:60%">
                    <vs-input class="w-full font-bold" placeholder="TOTAL" type="text" disabled/>
                  </div>
                  <div class="vx-col pr-0 font-bold" style="width:30%">
                    <vs-input class="w-full font-bold text-right" v-model="total_qoutation" type="number" disabled/>
                  </div>
                </div>
              </div>

              <div class="">          
                <vs-button color="success" class="mr-4" @click="addQT" :disabled="roleVal === 'admin'">Add Quote</vs-button>
              </div>                 
            </div>

            <div class="vx-row" v-if="false">
              <div class="vx-col w-full mt-5">
                  <label class="text-sm">Recipients</label>
                  <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio >
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">Vendor</vs-radio >
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="3" value="3" class="mr-4">No Action</vs-radio >
                  </div>
              </div>
              <div class="vx-col w-full">
                <div class="mt-4" v-if="data_local.assigned_to_type == 1">          
                  <v-select multiple :closeOnSelect="true" :options="optionStaff" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.rfp_recipients" name="rfp_recipients"/>
                  <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
                </div>

                <div class="mt-4" v-if="data_local.assigned_to_type == 2">          
                  <v-select multiple :closeOnSelect="true" :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-validate="'required'" v-model="data_local.rfp_recipients" name="rfp_recipients"/>
                  <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
                </div> 
              </div>
            </div>

            <div class="mt-4">
              <label class="text-sm">Vendor's Notes</label>
              <vs-textarea label="" class="w-full mt-4" v-model="data_local.other_notes" type="text" name="other_notes"/>
              <span class="text-danger text-sm"  v-show="errors.has('other_notes')">{{ errors.first('other_notes') }}</span>
            </div>

            <div class="mt-4">
              <label class="text-sm">Other Comments</label>
              <vs-textarea label="" :class="{'w-full':true, 'vs-t-cna':roleVal === 'admin'}" v-model="data_local.other_comments" type="text" name="other_comments" :disabled="roleVal === 'admin'"/>
              <span class="text-danger text-sm"  v-show="errors.has('other_comments')">{{ errors.first('other_comments') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-6">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">RFP Key Dates</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4" v-if="false">
              <vs-input class="w-full mt-4 cursor-not-allowed" label="Issued Date" v-model="data_local.rfp_issue_date" v-validate="'required'" name="rfp_issue_date" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('rfp_issue_date')">{{ errors.first('rfp_issue_date') }}</span>
            </div> 

            <div class="mt-4">
              <label class="text-sm">Ask Question(s) by Date</label>
              <flat-pickr v-model="data_local.send_question_date" :config="configETA" class="w-full cursor-not-allowed" v-validate="'required'" name="send_question_date" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('send_question_date')">{{ errors.first('send_question_date') }}</span>
            </div> 

            <div class="mt-4">
              <label class="text-sm">Due Date</label>
              <flat-pickr v-model="data_local.rfp_due_date" :config="configETA" class="w-full cursor-not-allowed" v-validate="'required'" name="rfp_due_date" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
            </div>

            <div class="mt-4">
              <label class="text-sm">Decision Date</label>
              <flat-pickr v-model="data_local.decision_date" :config="configETA" class="w-full cursor-not-allowed" v-validate="'required'" name="decision_date" disabled/>
              <span class="text-danger text-sm"  v-show="errors.has('decision_date')">{{ errors.first('decision_date') }}</span>
            </div>

          </div>
        </div>
      </div>    
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <!-- :disabled="this.data_local.is_submitted === 1" -->
          <vs-button color="success" class="ml-auto mt-2" @click="send_rfp" :disabled="this.data_local.is_submitted === 1" v-if="roleVal !== 'admin'">Submit</vs-button>
          <vs-button class="ml-4 mt-2" @click="save_changes">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel_back">Cancel</vs-button>
          <vs-button class="ml-4 mt-2" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import mainHelper from '@/mainHelper'
import common from '@/common'
const jwt = require('jsonwebtoken')
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const nowDateTime = new Date()
const decoded = jwt.verify(localStorage.usertoken, 'secret')  
import UpdateFile from '../../../components/files/UploadFile.vue'
import EventBus from '@/EventBus'

export default {
  components: {
    vSelect,
    flatPickr,
    UpdateFile
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 20,

      request_to: null,
      issued_by: null,
      qs: [],
      qts: [],
      
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      fileKey: [],
      

      configETA: {
        minDate: null,
        maxDate: null, 
        enableTime: false,
        dateFormat: 'F j, Y',
        "disable": [
            function(date) {
                // return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ]
      },
      configdateFromTimePicker: {
        enableTime: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "8:00",
        maxTime: "17:00",
        time_24hr: false,
        dateFormat: "h:i K"
      },
      configdateToTimePicker: {
        enableTime: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "8:00",
        maxTime: "17:00",
        time_24hr: false,
        dateFormat: "h:i K"
      },
      configFromdateTimePicker: {
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
      configTodateTimePicker: {
        minDate: null,
        "disable": [
          function(date) {
            // return true to disable
            return (date.getDay() === 0 || date.getDay() === 6);

          }
        ]
      },

      total_qoutation: 0,
      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify(this.data)),      

      optionMaintenanceType: [],
      optionVendorCategoryMaster: [],
      optionVendor: [],
      optionStaff: [],
      optionUser: [],
      optionBuilding: [],
      optionProperty: [],
      optionUnit: [],      
      optionRequestStatus: [],
      optionUrgency: [
        { id:'Low', name: 'Low' },
        { id:'Medium', name: 'Medium' },
        { id:'High', name: 'High' },
      ],

      statusOptions: [
        { label: 'Active',  value: 'active' },
        { label: 'Blocked',  value: 'blocked' },
        { label: 'Deactivated',  value: 'deactivated' }
      ],
      roleOptions: [
        { label: 'Admin',  value: 'admin' },
        { label: 'User',  value: 'user' },
        { label: 'Staff',  value: 'staff' }
      ],

      optionType: [
        { id: 0, name: 'Request', val: 'request'},
        { id: 1, name: 'Work Order', val: 'work-order'},
        { id: 2, name: 'Proposal', val: 'proposal'},
        { id: 3, name: 'Information', val: 'information'}
      ],
    }
  },
  computed: {
    folderPath() {
      return `docs/maintenance-order/gallery/${this.data_local.order_id}`
    },
    accessLevel() {
      const userAllData = JSON.parse(localStorage.userAllData)

      return userAllData.user_role.access_level
    },
    roleVal() {
      const userAllData = JSON.parse(localStorage.userAllData)
      
      return userAllData.user_role.val
    },
    status_local: {
      get () {
        return { label: this.capitalize(this.data_local.status),  value: this.data_local.status  }
      },
      set (obj) {
        this.data_local.status = obj.value
      }
    },
    role_local: {
      get () {
        return { label: this.capitalize(this.data_local.role),  value: this.data_local.role  }
      },
      set (obj) {
        this.data_local.role = obj.value
      }
    },
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    calcTotal(v, k) {
      v.total_amount = v.quantity * v.sub_amount
      this.qts[k]['quantity'] = parseFloat(v.quantity).toFixed(2)
      this.qts[k]['sub_amount'] = parseFloat(v.sub_amount).toFixed(2)
      this.qts[k]['total_amount'] = parseFloat(v.total_amount).toFixed(2)

      this.total_qoutation = 0
      this.qts.filter((res) => {
        this.total_qoutation = parseFloat(res.total_amount) + parseFloat(this.total_qoutation)
      })
      this.total_qoutation = parseFloat(this.total_qoutation).toFixed(2)
    },
    deleteDt(k) {      
      this.$delete(this.data_local.maintenance_request_dts, k)
      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })
    },
    addDt() {
      var newDt = {
        createdAt: null,
        deletedAt: null,
        end_time: null,
        maintenance_request_id: this.data_local.id,
        start_date: null,
        start_time: null,
        updatedAt: null
      }
      this.data_local.maintenance_request_dts.push(newDt)      
    },
    deleteQ(k) {
      this.$delete(this.qs, k)
      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })
    },
    addQ() {
      let q = {
        question: null,
        response: null
      }

      this.qs.push(q)
    },
    deleteQT(k) {
      this.$delete(this.qts, k)      

      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })

      this.total_qoutation = 0
      this.qts.filter((res) => {
        this.total_qoutation = parseFloat(res.total_amount) + parseFloat(this.total_qoutation)
      })
      this.total_qoutation = parseFloat(this.total_qoutation).toFixed(2)
    },
    addQT() {
      let q = {
        description: null,
        quantity: 0,
        sub_amount: 0,
        total_amount: 0
      }

      this.qts.push(q)
    },
    onFromTimeChange(selectedTime, timeStr, instance) {
      this.$set(this.configdateToTimePicker, 'minTime', common.convertT(timeStr, '2021-01-01') );     
    },
    onFromChange(selectedDates, dateStr, instance) {
      this.$set(this.configTodateTimePicker, 'minDate', dateStr);
    },
    onToChange(selectedDates, dateStr, instance) {
      this.$set(this.configFromdateTimePicker, 'maxDate', dateStr);
    },
    clearSelectAssign() {
      console.log('clearSelectAssign')
      this.data_local.rfp_recipients = null
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async loadData () {
      const editId = this.$route.params.editId
      this.qs = this.data_local.questions_to_vendor
      this.qts = this.data_local.qoutation

      this.total_qoutation = 0
      this.qts.filter((res) => {
        this.total_qoutation = parseFloat(res.total_amount) + parseFloat(this.total_qoutation)
      })
      this.total_qoutation = parseFloat(this.total_qoutation).toFixed(2)
      
      this.data_local.rfp_type = 2
      this.issued_by = this.optionUser.filter(res => res.id === this.data_local.issued_by_id)
      this.issued_by = this.data_local.issued_by_id === null ? null : this.issued_by[0]['full_name']

      this.request_to = this.optionUser.filter(res => res.id === this.data_local.request_to)
      this.request_to = this.data_local.request_to === null ? null : this.request_to[0]['full_name']
    },
    send_rfp() {
      this.data_local.issued_by_id = decoded.id
      this.data_local.rfp_issue_date = new Date()
      this.data_local.is_submitted = 1
      this.data_local.submitted_date = new Date()
      this.data_local.m_request_status.val = 'out_for_rfp_submitted'
      this.updateStatus('out_for_rfp_submitted')

      this.save_changes()
    },
    async updateStatus(val) {
      const editId = this.$route.params.editId
      this.data_local.m_request_status.val = val
      this.data_local.property_ref = localStorage.selectedPropertyRef

      await axios.post(`/maintenance/update-stat/${this.$route.params.editId}`, {
        token: this.token,
        data: this.data_local
      })
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = this.$route.params.editId
      this.data_local.property_ref = localStorage.selectedPropertyRef
      this.data_local.questions_to_vendor = this.qs
      this.data_local.qoutation = this.qts
      this.data_local.total_qoutation = this.total_qoutation
      this.data_local.m_request_status_val = 'out_for_rfp_review'

      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/maintenance/save/${editId}`, {
            data: this.data_local,
            token: this.token
          })
          .then(res => {
            if(res['data'] != 'access_denied' && res['data'] != '') {

              if(res['data']['message'] == 'success') {
                //uploading docs
                this.resDataLocal = res['data']['result']

                this.$vs.notify({
                  color: 'success',
                  title: 'Data Saved',
                  text: 'The selected data was successfully Saved'
                })
                // this.$router.push({name:'app-rfp-view', params: {viewId: editId }})
              } else {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Saving Data',
                  text: 'Something went wrong'
                })
              }

            } else {
              this.$vs.notify({
                color: 'danger',
                title: 'Error loading',
                text: 'Something went wrong'
              })
              this.$router.push({name:'app-rfp-view', params: {viewId: editId }})
            }

          })
          .catch(err => {
            this.$vs.notify({
              color: 'danger',
              title: 'Data Saving Error',
              text: 'The selected data was not saved'
            })
          }) 

          // uploading docs
          await axios.post(`/docs/table/save`, {
            rawFiles: this.rawFiles,
            token: this.token,
            id: editId,
            path: `docs/maintenance-order/gallery/${this.data_local.order_id}`,
            folderId: 20
          })

          // delete docs
          await axios.post(`/docs/table/delete`, {
            data: this.filesDel,
            token: this.token
          })

          this.$router.push({name:'app-rfp-list'})

        } catch(err) {
          reject(err.toString('utf8'));
        }      

      }) 
    },
    reset_data () {
      this.loadData()
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    cancel_back () {
      this.$router.go(-1)
    },
    async loadMaintenanceType () {
      const result = await axios.get(`/api/maintenanceType/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionMaintenanceType = result['data']
    },
    async loadVendorCategoryMaster () {
      const result = await axios.get(`/api/vendorCategoryMaster/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionVendorCategoryMaster = result['data']
    },
    async loadVendor () {
      const result = await axios.get(`/vendor/property/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionVendor = result['data']
    },
    async loadStaff () {
      const result = await axios.get(`/api/staff/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionStaff = result['data']      
    },
    async loadStaff () {
      const result = await axios.get(`/api/staff/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionStaff = result['data']      
    },
    async loadUser () {
      const result = await axios.get(`/api/user/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionUser = result['data']
    },
    async loadBuilding () {
      const result = await axios.get(`/api/building/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionBuilding = result['data']
    },
    async loadProperty () {
      const result = await axios.get(`/api/property/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionProperty = result['data']
    },
    async loadUnit () {
      const result = await axios.get(`/api/unit/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionUnit = result['data']
    },
    async loadRequestStatus () {
      const result = await axios.get(`/api/requestStatus/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionRequestStatus = result['data']
    }
  },
  async created () {   
    try {      
      await this.loadMaintenanceType()
      await this.loadVendorCategoryMaster()
      await this.loadVendor()
      await this.loadUser()
      await this.loadBuilding()
      await this.loadProperty()
      await this.loadUnit()
      await this.loadRequestStatus()
      await this.loadStaff()    
      await this.loadData()
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Maintenance Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })

    EventBus.$on('delete-file', res => {
      this.filesDel = res
    })
  }
}
</script>
<style>
div.vs-t-cna textarea, div.vs-t-cna {
  cursor: not-allowed;
}

div.vs-qts .vs-input-primary .vs-input--input:focus {
  border: 0px !important;
  border-bottom: 1px solid rgba(var(--vs-primary),1) !important;
}

div.vs-qts .vs-input--input {
  border-radius: 0px;
  border: 0px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
  background: none;
}

div.vs-qts input:disabled {
  font-weight: bold;
}

div.text-right .vs-input--input {
  text-align: right;
}
</style>