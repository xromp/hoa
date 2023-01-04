<template>
  <div id="order-new-tab">
    <div :class="{'wo-details':rfp_type===1}">    
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
                <vs-input :class="{ 'w-full':true, 'mt-4':true, 'cursor-not-allowed':accessLevel < 97 }" label="Location" v-model="data_local.location" type="location" v-validate="'required'" name="location" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
              </div> 

              <div class="mt-4">
                <vs-input :class="{ 'w-full':true, 'mt-4':true, 'cursor-not-allowed':accessLevel < 97 }" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
              </div> 

              <div class="mt-4">
                <vs-input :class="{ 'w-full':true, 'mt-4':true, 'cursor-not-allowed':accessLevel < 97 }" label="Description" v-model="data_local.description" type="description" v-validate="'required'" name="description" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
              </div> 

              <div class="mt-4">
                <label class="text-sm pl-2">Scope</label>
                <vs-textarea label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.scope" type="text" name="scope" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('scope')">{{ errors.first('scope') }}</span>
              </div> 

              <div class="mt-4">
                <label class="text-sm pl-2">Preferred Timing</label>
                <vs-textarea label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.preferred_timing" type="text" name="preferred_timing" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('preferred_timing')">{{ errors.first('preferred_timing') }}</span>
              </div>             

              <div class="mt-4" v-if="rfp_type === 0">
                <label class="text-sm pl-2">Availability</label>
                <vs-textarea label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.availability" type="text" v-validate="'required'" name="availability" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="vx-col w-full md:w-1/2 mt-4" v-if="!isTenant">
          <!-- Col Header -->
          <div class="flex items-end">
            <feather-icon icon="Edit3Icon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Maintenance Other Information</span>
          </div>

          <!-- Col Content -->
          <div>
            <div class="vx-col w-full">
              <div class="mt-4">
                <vs-input class="w-full mt-4 cursor-not-allowed" label="Request No" v-model="data_local.request_no" type="request_no" v-validate="'required'" name="request_no" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('request_no')">{{ errors.first('request_no') }}</span>
              </div> 

              <div class="mt-4">
                <vs-input class="w-full mt-4 cursor-not-allowed" label="Status" v-model="data_local.m_request_status.name" type="text" v-validate="'required'" name="m_request_status" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('m_request_status')">{{ errors.first('m_request_status') }}</span>
              </div>

              <div class="mt-4">
                <vs-input class="w-full mt-4 cursor-not-allowed" label="Request By" v-model="data_local.user.full_name" type="text" v-validate="'required'" name="full_name" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('full_name')">{{ errors.first('full_name') }}</span>
              </div> 

              <div class="mt-4">
                <vs-input class="w-full mt-4 cursor-not-allowed" label="Date Created" v-model="data_local.createdAt" v-validate="'required'" name="createdAt" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('createdAt')">{{ errors.first('createdAt') }}</span>
              </div>  

              <div class="mt-4" v-if="rfp_type === 1">
                <label class="text-sm">Due Date</label>
                <flat-pickr v-model="data_local.rfp_due_date" :config="configETA" class="w-full" v-validate="'required'" name="rfp_due_date" />
                <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
              </div>

              <div class="mt-4">          
                <label class="text-sm">Urgency</label>
                <v-select :closeOnSelect="true" :options="optionUrgency" :reduce="name => name.id" label="name" v-model="data_local.urgency" name="urgency"/>
                <span class="text-danger text-sm"  v-show="errors.has('urgency')">{{ errors.first('urgency') }}</span>
              </div> 

              <div class="mt-4">
                <label class="text-sm pl-2">Manager's Note</label>
                <vs-textarea :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" label="" v-model="data_local.notes" name="notes" :disabled="accessLevel < 97"/>
                <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
              </div> 

              <div class="vx-row" v-if="rfp_type === 1">
                <div class="vx-col w-full mt-5">
                  <label class="text-sm">Assigned To</label>
                  <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio >
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">Vendor</vs-radio >                  
                  </div>
                </div>

                <div class="vx-col w-full">
                  <div class="mt-4 select-assinged-to" v-if="data_local.assigned_to_type == 1">         
                    <v-select :closeOnSelect="true" :options="optionStaff" :reduce="email => email.id" label="email" v-model="data_local.assigned_to" name="assigned_to" v-validate="'required'"/>
                    <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
                  </div>

                  <div class="mt-4 select-assinged-to" v-if="data_local.assigned_to_type == 2">          
                    <v-select :closeOnSelect="true" :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-model="data_local.assigned_to" name="assigned_to" v-validate="'required'"/>
                    <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
                  </div> 
                </div>
              </div>

            </div>
          </div>
        </div> 
      </div>

      <!-- Content Row -->
      <div class="vx-row" v-if="rfp_type === 2">
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
                <vs-input class="w-full mt-4" label="Property Name" v-model="data_local.property.name" type="text" v-validate="'required'" name="property_id" disabled/>
                <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>
              </div> 

              <div class="mt-6 d-inline">
                <label class="vs-input--label" v-if="qs.length == 0">No Questions To Show</label>
                <label class="vs-input--label" v-if="qs.length != 0">Questions</label><br>
                <div class="dt-available mt-2" v-for="(v, key) in qs">
                  <div class="vx-row">
                    <div class="vx-col pr-0" style="width:40%">
                      <vs-textarea height="80px" :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="Questions" v-model="v.question" type="text" v-validate="'required'" name="v-question" :disabled="!isAdmin"/>
                    </div>
                    <div class="vx-col pr-0" style="width:40%">
                      <vs-textarea height="80px" :class="{'w-full':true, 'vs-t-cna':roleVal !== 'vendor'}" label="Response" v-model="v.response" type="text" v-validate="'required'" name="v-response" :disabled="roleVal !== 'vendor'" />
                    </div>
                    <div class="vx-col" style="width:10%">
                      <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 40px;left: 10px;color: #ea5455;" class="cursor-pointer w-full" @click="deleteQ(key)"/>
                    </div>
                  </div>
                </div>

                <div class="">          
                  <vs-button id="loading-question" color="success" class="mr-4" @click="addQ" :disabled="loading">Add Question</vs-button>
                </div>                 
              </div>

              <hr class="mt-6">
              <div class="mt-6 d-inline" v-if="roleVal === 'vendor'">
                <label class="vs-input--label" v-if="qts.length == 0">No Quotes to Show</label>
                <label class="vs-input--label" v-if="qts.length != 0">Quotes</label><br>
                <div class="dt-available" v-if="qts.length != 0">
                  <div class="vx-row">
                    <div class="vx-col pr-0 m-auto ml-0 mr-0" style="width:60%">
                      <label class="vs-input--label">Description</label>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <label class="vs-input--label">Quantity / Hrs</label>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <label class="vs-input--label">Amount per Qty</label>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <label class="vs-input--label">Total Amount</label>
                    </div>
                  </div>
                </div>
                <div class="dt-available mb-4" v-for="(v, key) in qts">
                  <div class="vx-row mt-2">
                    <div class="vx-col pr-0" style="width:60%">
                      <vs-input :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="" type="text" v-validate="'required'" name="v.description" v-model="v.description" :disabled="!isAdmin"/>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <vs-input :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="" type="text" v-validate="'required'" name="v.quantity" v-model="v.quantity" :disabled="!isAdmin"/>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <vs-input :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="" type="text" v-validate="'required'" name="v.sub_amount" v-model="v.sub_amount" :disabled="!isAdmin"/>
                    </div>
                    <div class="vx-col pr-0" style="width:10%">
                      <vs-input :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="" type="text" v-validate="'required'" name="v.total_amount" v-model="v.total_amount" :disabled="!isAdmin"/>
                    </div>
                    <div class="vx-col" style="width:10%">
                      <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 7px;left: 10px;color: #ea5455;" class="cursor-pointer w-full" @click="deleteQT(key)"/>
                    </div>
                  </div>
                </div>

                <div class="">          
                  <vs-button color="success" class="mr-4" @click="addQT">Add Quote</vs-button>
                </div>                 
              </div>

              <div class="vx-row" v-if="isAdmin">
                <div class="vx-col w-full">
                  <div class="mt-4 select-assinged-to">          
                    <label class="text-sm">Recipients</label>  
                    <v-select multiple :closeOnSelect="true" :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-model="data_local.rfp_recipients" name="rfp_recipients" v-validate="'required'"/>
                    <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <label class="text-sm">Other Comments</label>
                <vs-textarea label="" class="w-full mt-4" v-model="data_local.other_comments" type="text" name="other_comments" />
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
            <div class="vx-col w-full" v-if="!isTenant">
              <div class="mt-4">
                <label class="text-sm">Ask Question(s) by Date</label>
                <flat-pickr v-model="data_local.send_question_date" :config="configETA" class="w-full" name="send_question_date" v-validate="'required'"/>
                <span class="text-danger text-sm"  v-show="errors.has('send_question_date')">{{ errors.first('send_question_date') }}</span>
              </div> 

              <div class="mt-4">
                <label class="text-sm">Due Date</label>
                <flat-pickr v-model="data_local.rfp_due_date" :config="configETA" class="w-full" name="rfp_due_date" v-validate="'required'"/>
                <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
              </div>

              <div class="mt-4">
                <label class="text-sm">Decision Date</label>
                <flat-pickr v-model="data_local.decision_date" :config="configETA" class="w-full" name="decision_date" v-validate="'required'"/>
                <span class="text-danger text-sm"  v-show="errors.has('decision_date')">{{ errors.first('decision_date') }}</span>
              </div>

            </div>
          </div>
        </div>    
      </div>

      <!-- Content Row -->
      <div class="vx-row" v-if="approvalType === 'wo'">
        <div class="vx-col w-1/2" v-if="approvalLoaded">
          <approval 
            :key="forceRender"
            :items="approvals" 
            :reference_id="data_local.id"
            :reference_no="data_local.request_no"
            :type="approvalType"
            class="mb-4" />
        </div>
        <div class="vx-col w-1/2" v-else>
          <span class="flex items-center">
            <feather-icon icon="LoaderIcon" svgClasses="h-4 w-4" class="mr-2 spinner" />
            <span>Approval Loading...</span>
          </span>
        </div>
      </div>
    </div>

    <div class="vx-col">
      <!-- Content Row -->
      <update-file 
        :loadFile="loadFile" 
        :folderPath="folderPath" 
        :folderId="20" class="mb-4" 
      />
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button color="success" class="ml-auto mt-2" @click="assignOrder" :disabled="this.data_local.is_assigned === 1 || !validateForm || is_closed || is_completed" v-if="rfp_type === 1">Assign</vs-button>
          <vs-button color="success" class="ml-auto mt-2" @click="send_rfp" :disabled="this.data_local.is_submitted === 1 || this.data_local.is_assigned === 1 || !validateForm || is_closed || is_completed" v-if="rfp_type === 2">Submit</vs-button>    
          <vs-button class="ml-4 mt-2" @click="save_changes" :disabled="this.data_local.is_assigned === 1 || !validateForm || is_closed || is_completed" v-if="rfp_type !== 2">Save Changes</vs-button>

          <vs-button class="ml-4 mt-2" @click="save_changes" :disabled="this.data_local.is_submitted === 1 || this.data_local.is_assigned === 1 || !validateForm || is_closed || is_completed" v-if="rfp_type === 2">Save Changes</vs-button>

          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel_back">Cancel</vs-button>
          <!-- <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Issued Date" v-model="data_local.rfp_issue_date" v-validate="'required'" name="rfp_issue_date" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('rfp_issue_date')">{{ errors.first('rfp_issue_date') }}</span>
  </div> --> 

  <!-- <div class="mt-4" v-if="false">                  
    <v-select :closeOnSelect="true" :options="optionStaff" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.rfp_recipients" name="rfp_recipients"/>
    <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
  </div> -->


  <!-- <div class="mt-4">
    <label class="vs-input--label">Type</label>
    <v-select :options="optionType" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.rfp_type" name="rfp_type" :disabled="accessLevel < 97"/>
    <span class="text-danger text-sm"  v-show="errors.has('rfp_type')">{{ errors.first('rfp_type') }}</span> 
  </div> -->

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4 cursor-not-allowed" label="Received By" v-model="request_to" type="text" name="request_to" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('request_to')">{{ errors.first('request_to') }}</span>
  </div>  -->

  <!-- <div class="mt-4" v-if="data_local.issued_by_id !== null">
    <vs-input class="w-full mt-4" label="Issued By" v-model="issued_by" type="text" name="issued_by" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('issued_by')">{{ errors.first('issued_by') }}</span> 
  </div> -->

  <!-- <div class="mt-4" v-if="data_local.issued_by_id === null">
    <vs-input class="w-full mt-4" label="Issued By" v-model="data_local.issued_by_id" type="text" v-validate="'required'" name="issued_by_id" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('issued_by_id')">{{ errors.first('issued_by_id') }}</span> 
  </div> -->

  <!-- <div class="vx-col w-full mt-5">
    <label class="text-sm">Recipients</label>
    <div class="flex flex-wrap mt-2">
      <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio >
      <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">Vendor</vs-radio >
    </div>
  </div> -->

  <!-- <div class="mt-4">
    <label class="text-sm">Other Notes</label>
    <vs-textarea label="" class="w-full mt-4" v-model="data_local.other_notes" type="text" v-validate="'required'" name="other_notes" />
    <span class="text-danger text-sm"  v-show="errors.has('other_notes')">{{ errors.first('other_notes') }}</span>
  </div> -->  
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import mainHelper from '@/mainHelper'
import common from '@/common'
const jwt = require('jsonwebtoken')
import flatPickr from 'vue-flatpickr-component';
import Approval from '@/views/components/approval-widget/approval.vue'
import 'flatpickr/dist/flatpickr.css';
const nowDateTime = new Date()
const decoded = jwt.verify(localStorage.usertoken, 'secret')  
const userAllData = JSON.parse(localStorage.userAllData)
import UpdateFile from '@/views/components/files/UploadFile.vue'
import EventBus from '@/EventBus'

export default {
  components: {
    vSelect,
    flatPickr,
    Approval,
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
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      asTenant: [
        'user'
      ],

      loading:false,
      backgroundLoading: 'rgba(255, 255, 255, .8)',
      colorLoading:'black',
      issued_by: null,
      qs: [],
      qts: [],
      forceRender: 0,

      //reading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 20,

      rawFiles: [],
      resDataLocal: [],
      approvals: [],
      approvalLoaded: false,

      configETA: {
        defaultDate: null,
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

      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify({...this.data })),      

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
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
    },
    isTenant() {
      return this.asTenant.includes(this.roleVal)
    },
    approvalType() {
      const typeMapping = {
        '0': 'mo',
        '1': 'wo',
        '2': 'rfp',
      }
      return typeMapping[this.rfp_type]; 
    },
    is_completed() {
      const result = this.data_local['m_request_status']['val'] === 'completed' ? true:false

      return result
    },
    is_closed() {
      const result = this.data_local['m_request_status']['val'] === 'closed' ? true:false

      return result
    },
    folderPath() {
      return `docs/maintenance-order/gallery/${this.$route.params.editId}`
    },
    accessLevel() {
      return localStorage.accessLevel
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    // request_to() {
    //   let request_to = this.optionUser.filter(res => res.id === this.data_local.request_to)
    //   return this.request_to[0]['full_name']
    // },    
    rfp_type() {
      return localStorage.accessLevel >= 96 ? parseInt(this.$route.query.t) : 1
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
    openLoadingQuestion(){
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#loading-question",
        scale: 0.45
      })
      this.loading = true
    },
    async assignOrder() {
      if (this.data_local.assigned_to === null) {
        this.errors.add({
          field: 'assigned_to',
          msg: 'This field is required.'
        });
      } 
      if (!this.validateForm) return

      this.files = []
      this.fileKey = []

      this.data_local.is_assigned = 1
      this.data_local.rfp_issue_date = new Date()
      this.data_local.rfp_type = parseInt(this.$route.query.t)
      this.data_local.property_ref = localStorage.selectedPropertyRef
      await axios.post(`/order/assign/${this.$route.params.editId}`, {
        token: this.token,
        data: this.data_local
      })

      this.$vs.notify({
        color: 'success',
        title: 'Data Saved',
        text: 'The selected data was successfully Saved'
      })

      this.$router.push({name:'app-order-view', params: {viewId: this.$route.params.editId }})
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
    },
    addQT() {
      let q = {
        description: null,
        quantity: null,
        sub_amount: null,
        total_amount: null
      }

      this.qts.push(q)
    },
    onFromTimeChange(selectedTime, timeStr, instance) {
      console.log('selectedTime ', selectedTime)
      console.log('timeStr ', timeStr)
      console.log('instance ', instance)
      console.log('timeStr convertT ', common.convertT(timeStr, '2021-01-01') )
      
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
      // this.data_local.rfp_recipients = null
      this.data_local.assigned_to = null
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async send_rfp() {
      try {        
        if (this.check_empty_dates()) return

        if (this.data_local.rfp_recipients.length === 0 || this.data_local.rfp_recipients === null) {
          this.errors.add({
            field: 'rfp_recipients',
            msg: 'This field is required.'
          });
        } 

        /* eslint-disable */
        if (!this.validateForm) return

        const editId = this.$route.params.editId
        this.data_local.issued_by_id = decoded.id
        this.data_local.rfp_issue_date = new Date()
        this.data_local.is_submitted = 0
        this.data_local.m_request_status_id = 15
        this.data_local.order_id = editId

        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.questions_to_vendor = this.qs
        this.data_local.qoutation = this.qts  
        await axios.post(`/maintenance/save/-1`, {
          data: this.data_local,
          token: this.token,
        })

        this.data_local.is_submitted = 1
        this.save_changes()
      } catch (err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
      }
    },
    check_empty_dates() {
      if (parseInt(this.$route.query.t) !== 2) {
        return false
      } else {
        if (this.data_local.decision_date === null) {
          this.errors.add({
            field: 'decision_date',
            msg: 'This field is required.'
          });
        } 
        if (this.data_local.rfp_due_date === null) {
          this.errors.add({
            field: 'rfp_due_date',
            msg: 'This field is required.'
          });
        } 
        if (this.data_local.send_question_date === null) {
          this.errors.add({
            field: 'send_question_date',
            msg: 'This field is required.'
          });
        }    
      }
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
          
        const editId = this.$route.params.editId
        this.$vs.loading()
        this.data_local.rfp_type = parseInt(this.$route.query.t)
        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.questions_to_vendor = this.qs
        this.data_local.qoutation = this.qts        
        
        const result = await axios.post(`/order/save/${editId}`, 
          { data: this.data_local }, 
          { headers: { 'Authorization': this.token },
            params: {
              'property_ref': localStorage.selectedPropertyRef,
              'parent_org_id': localStorage.selectedParentOrg,
              'role_id': localStorage.selectedRoleId,
              'role_val': localStorage.selectedRoleVal
            }
          }
        )

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: `docs/maintenance-order/gallery/${editId}`,
          folderId: 20
        })

        // delete docs
        await axios.post(`/docs/table/delete`, {
          data: this.filesDel,
          token: this.token
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     
        this.$vs.loading.close()     
        this.$router.push({name:'app-order-view', params: {viewId: editId }})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
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
      const result = await axios.get(`/user/staff/list`, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': this.token 
        },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef
        }
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
    },
    async loadData () {      
      const editId = this.$route.params.editId
      this.approvals = this.data_local.approval
          ? this.data_local.approval.approval_items.sort((a, b) => a.level - b.level) 
          : [];
      this.forceRender +=1;
      this.approvalLoaded = true;

      this.qs = this.data_local.questions_to_vendor
      this.qts = this.data_local.qoutation      
    },    
  },
  watch: { 
    qs: function() { 
      setTimeout(() => {
        this.$vs.loading.close("button#loading-question div.con-vs-loading")
        this.loading = false
      }, 1000);
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
    this.openLoadingQuestion()

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
div.vs-t-cna textarea {
  cursor: not-allowed;
}

div#order-new-tab .wo-details {
  height: 800px;
}

@media only screen and (max-width: 767px) {
  div#order-new-tab .wo-details {
    height: auto;
  }
}

div.select-assinged-to ul.vs__dropdown-menu {
  height: 180px;
}
</style>