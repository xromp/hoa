<template>
  <div id="order-new-tab">
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
              <vs-input class="w-full mt-4" label="Location" v-model="data_local.location" type="text" v-validate="'required'" name="location"/>
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
              <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
            </div> 

            <div class="mt-4" v-if="!isTenant">
              <label class="text-sm pl-2">Description</label>
              <vs-textarea height="100px" label="" class="w-full" v-model="data_local.description" type="text" v-validate="'required'" name="description" />
              <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
            </div>  
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4" v-if="isTenant">
        <div class="mt-8">
          <div class="mt-4">
            <label class="text-sm pl-2">Availability</label>
            <flat-pickr v-model="data_local.availability" :config="configETA" class="w-full" v-validate="'required'" name="availability" />
            <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span>
          </div>  

          <div class="mt-4">
            <label class="text-sm pl-2 mt-6">Description</label>
            <vs-textarea height="100px" label="" class="w-full" v-model="data_local.description" type="text" v-validate="'required'" name="description" />
            <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
          </div>  

          <!-- <label class="text-sm pl-2">Availability</label>
          <vs-textarea height="100px" label="" class="w-full" v-model="data_local.availability" type="text" name="availability" v-validate="'required'"/>
          <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span> -->
        </div>
      </div> 

      <div class="vx-col w-full md:w-1/2 mt-4" v-if="isAdmin">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="Edit3Icon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Maintenance Other Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4" v-if="!isTenant">
              <label class="text-sm pl-2">Availability</label>
              <flat-pickr v-model="data_local.availability" :config="configETA" class="w-full" v-validate="'required'" name="availability" />
              <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span>
              
              <!-- <vs-textarea height="100px" label="" class="w-full" v-model="data_local.availability" type="text" name="availability" />
              <span class="text-danger text-sm"  v-show="errors.has('availability')">{{ errors.first('availability') }}</span> -->
            </div>

            <div class="mt-4">
              <label class="text-sm pl-2">Manager's Note</label>
              <vs-textarea class="w-full" height="100px" label="" v-model="data_local.notes" name="notes" />
              <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
            </div>

            <div class="mt-4">
              <label class="text-sm">Urgency</label>
              <v-select :closeOnSelect="true" :options="optionUrgency" :reduce="name => name.id" label="name" v-model="data_local.urgency" name="urgency"/>
              <span class="text-danger text-sm"  v-show="errors.has('urgency')">{{ errors.first('urgency') }}</span>
            </div> 
          </div>
        </div>
      </div> 
    </div>

    <div class="vx-row" v-if="isAdmin">
      <div class="vx-col w-full md:w-1/2">
        <div class="mt-4">
          <label class="text-sm pl-2">Scope</label>
          <vs-textarea height="100px" label="" class="w-full" v-model="data_local.scope" type="text" name="scope" />
          <span class="text-danger text-sm"  v-show="errors.has('scope')">{{ errors.first('scope') }}</span>
        </div>   

        <div class="vx-col w-full mt-5">
          <label class="text-sm">Assigned Type</label>
          <vs-switch 
          v-model="assignedType" 
          color="warning" 
          vs-value="2" 
          @change="changeRfpType"
          class="assigned-switch mt-2"
          >
          <span slot="on">Work Order</span>
          <span slot="off">RFP</span>
          </vs-switch>

          <!-- <div class="flex flex-wrap mt-2">
            <vs-radio v-model="data_local.rfp_type" vs-value="1" value="1" class="mr-4">Work Order</vs-radio >
            <vs-radio v-model="data_local.rfp_type" vs-value="2" value="2" class="mr-4">RFP</vs-radio >
          </div> -->
        </div>  

        <div class="vx-col w-full mt-5" v-if="data_local.rfp_type === 1">
          <label class="text-sm">Assigned To</label>
          <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
            <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio >
            <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">Vendor</vs-radio >
          </div>
        </div>

        <div class="vx-col w-full mt-4 mb-8">          
          <div class="vx-col w-full" v-if="data_local.rfp_type === 1">
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

        <!-- <div class="mt-4">
          <label class="text-sm pl-2">Preferred Timing</label>
          <vs-textarea height="100px" label="" :class="{ 'w-full':true, 'vs-t-cna':accessLevel < 97 }" v-model="data_local.preferred_timing" type="text" name="preferred_timing" :disabled="accessLevel < 97"/>
          <span class="text-danger text-sm"  v-show="errors.has('preferred_timing')">{{ errors.first('preferred_timing') }}</span>
        </div>   -->   
      </div>

      <div class="vx-col w-full md:w-1/2">
        <!-- <div class="mt-4">
          <vs-input class="w-full mt-4 cursor-not-allowed" label="Date Created" v-model="data_local.createdAt" v-validate="'required'" name="createdAt" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('createdAt')">{{ errors.first('createdAt') }}</span>
        </div> -->  

        <!-- <div class="mt-4">
          <label class="text-sm">Due Date</label>
          <flat-pickr v-model="data_local.rfp_due_date" :config="configETA" class="w-full" v-validate="'required'" name="rfp_due_date" />
          <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
        </div> -->

        <!-- <div class="mt-4">
          <label class="text-sm">Urgency</label>
          <v-select :closeOnSelect="true" :options="optionUrgency" :reduce="name => name.id" label="name" v-model="data_local.urgency" name="urgency"/>
          <span class="text-danger text-sm"  v-show="errors.has('urgency')">{{ errors.first('urgency') }}</span>
        </div>  -->
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row" v-if="data_local.rfp_type === 2">
      <div class="vx-col w-full md:w-1/2 mt-6">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="PaperclipIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Request Details</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Scope" v-model="data_local.scope" type="text" v-validate="'required'" name="scope" />
              <span class="text-danger text-sm"  v-show="errors.has('scope')">{{ errors.first('scope') }}</span>
            </div>  -->

            <div class="mt-6 d-inline">
              <label class="vs-input--label" v-if="qs.length == 0">No Questions To Show</label>
              <label class="vs-input--label" v-if="qs.length != 0">Questions</label><br>
              <div class="dt-available mt-2" v-for="(v, key) in qs">
                <div class="vx-row">
                  <div class="vx-col pr-0" style="width:40%">
                    <vs-textarea height="80px" :class="{'w-full':true, 'vs-t-cna':!isAdmin}" label="Questions" v-model="v.question" type="text" v-validate="'required'" name="v-question" :disabled="!isAdmin"/>
                  </div>
                  <div class="vx-col pr-0" style="width:40%">
                    <vs-textarea height="80px" class="w-full" label="Response" v-model="v.response" type="text" v-validate="'required'" name="v-response" />
                  </div>
                  <div class="vx-col" style="width:10%">
                    <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 40px;left: 10px;color: #ea5455;" class="cursor-pointer w-full" @click="deleteQ(key)"/>
                  </div>
                </div>
              </div>

              <div class="">          
                <vs-button color="success" class="mr-4" @click="addQ">Add Question</vs-button>
              </div>                 
            </div>

            <hr class="mt-6">
            <div class="mt-6 d-inline" v-if="false">
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
              <div class="vx-col w-full mt-5">
                  <label class="text-sm">Recipients</label>
                  <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
                    <!-- <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio > -->
                    <!-- <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">Vendor</vs-radio > -->
                    <!-- <vs-radio v-model="data_local.assigned_to_type" vs-value="3" value="3" class="mr-4">No Action</vs-radio > -->
                  </div>
              </div>
            </div>

            <!-- <div class="mt-4 select-assinged-to" v-if="data_local.assigned_to_type == 1">          
              <v-select multiple :closeOnSelect="true" :options="optionStaff" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.rfp_recipients" name="rfp_recipients"/>
              <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
            </div> -->

            <div class="mt-4 select-assinged-to" v-if="data_local.rfp_type == 2">          
              <v-select multiple :closeOnSelect="true" :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-validate="'required'" v-model="data_local.rfp_recipients" name="rfp_recipients"/>
              <span class="text-danger text-sm"  v-show="errors.has('rfp_recipients')">{{ errors.first('rfp_recipients') }}</span>
            </div> 

            <!-- <div class="mt-4">
              <label class="text-sm">Other Notes</label>
              <vs-textarea label="" class="w-full mt-4" v-model="data_local.other_notes" type="text" v-validate="'required'" name="other_notes" />
              <span class="text-danger text-sm"  v-show="errors.has('other_notes')">{{ errors.first('other_notes') }}</span>
            </div> -->

            <div class="mt-4">
              <label class="text-sm">Other Comments</label>
              <vs-textarea label="" class="w-full mt-4" v-model="data_local.other_comments" type="text" v-validate="'required'" name="other_comments" />
              <span class="text-danger text-sm"  v-show="errors.has('other_comments')">{{ errors.first('other_comments') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-6">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Request Date Details</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4" v-if="isAdmin">
              <label class="text-sm">Send Question Date</label>
              <flat-pickr v-model="data_local.send_question_date" :config="configETA" class="w-full" v-validate="'required'" name="send_question_date" />
              <span class="text-danger text-sm"  v-show="errors.has('send_question_date')">{{ errors.first('send_question_date') }}</span>
            </div> 

            <div class="mt-4" v-if="isAdmin">
              <label class="text-sm">Due Date</label>
              <flat-pickr v-model="data_local.rfp_due_date" :config="configETA" class="w-full" v-validate="'required'" name="rfp_due_date" />
              <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
            </div>

            <div class="mt-4" v-if="isAdmin">
              <label class="text-sm">Decision Date</label>
              <flat-pickr v-model="data_local.decision_date" :config="configETA" class="w-full" v-validate="'required'" name="decision_date" />
              <span class="text-danger text-sm"  v-show="errors.has('decision_date')">{{ errors.first('decision_date') }}</span>
            </div>

          </div>
        </div>
      </div>    
    </div>

    <div class="vx-col wo-details-new">
      <!-- Content Row -->
      <create-file 
        :loadFile="false" 
        :folderId="20" class="mb-4" 
      />
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="flex flex-wrap items-center justify-end">
          <!-- <vs-button color="success" class="ml-auto mt-2" @click="send_rfp" :disabled="this.data_local.is_submitted === 1" v-if="data_local.rfp_type === 2">Send</vs-button> -->
          <vs-button class="ml-4 mt-2" @click="submit" :disabled="this.data_local.is_submitted === 1 || !validateForm">Submit Request</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel_back">Cancel</vs-button>
          <!-- <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="mt-4" v-if="isAdmin">
    <vs-input class="w-full mt-4" label="Issued Date" v-model="data_local.rfp_issue_date" v-validate="'required'" name="rfp_issue_date" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('rfp_issue_date')">{{ errors.first('rfp_issue_date') }}</span>
  </div>  -->


  <!-- <div class="mt-4">
    <label class="vs-input--label">Type</label>
    <v-select :options="optionType" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.rfp_type" name="rfp_type"/>
    <span class="text-danger text-sm"  v-show="errors.has('rfp_type')">{{ errors.first('rfp_type') }}</span> 
  </div> -->

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Request No" v-model="data_local.request_no" type="request_no" v-validate="'required'" name="request_no" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('request_no')">{{ errors.first('request_no') }}</span>
  </div>  -->

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Status" v-model="data_local.m_request_status.name" type="text" v-validate="'required'" name="m_request_status" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('m_request_status')">{{ errors.first('m_request_status') }}</span>
  </div> -->

 <!--  <div class="mt-4">
    <vs-input class="w-full mt-4" label="Request By" v-model="data_local.user.full_name" type="text" v-validate="'required'" name="full_name" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('full_name')">{{ errors.first('full_name') }}</span>
  </div>  -->

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Received By" v-model="request_to[0]['full_name']" type="text" v-validate="'required'" name="request_to" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('request_to')">{{ errors.first('request_to') }}</span>
  </div>  -->

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Date Created" v-model="data_local.createdAt" v-validate="'required'" name="createdAt" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('createdAt')">{{ errors.first('createdAt') }}</span>
  </div> -->  

  <!-- <div class="mt-4">
    <vs-input class="w-full mt-4" label="Property Name" v-model="data_local.property.name" type="text" v-validate="'required'" name="property_id" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>
  </div>  -->

  <!-- <div class="mt-4" v-if="data_local.issued_by_id !== null">
    <vs-input class="w-full mt-4" label="Issued By" v-model="issued_by[0]['full_name']" type="text" v-validate="'required'" name="issued_by" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('issued_by')">{{ errors.first('issued_by') }}</span> 
  </div>

  <div class="mt-4" v-if="data_local.issued_by_id === null">
    <vs-input class="w-full mt-4" label="Issued By" v-model="data_local.issued_by_id" type="text" v-validate="'required'" name="issued_by_id" disabled/>
    <span class="text-danger text-sm"  v-show="errors.has('issued_by_id')">{{ errors.first('issued_by_id') }}</span> 
  </div> -->

</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import common from '@/common'
const jwt = require('jsonwebtoken')
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const decoded = jwt.verify(localStorage.usertoken, 'secret')  
import { FileIcon } from 'vue-feather-icons'
import CreateFile from '@/views/components/files/UploadFile.vue'
import EventBus from '@/EventBus'

export default {
  components: {
    vSelect,
    flatPickr,
    FileIcon,
    CreateFile
  },
  data () {
    return {
      assignedType: 1,

      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      asTenant: [
        'user'
      ],

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

      token: localStorage.usertoken,

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

      //portfolio
      data_local: {
        unit_resident_id: null,
        m_request_status_id: 12,
        resolved_date: new Date(),
        building_id: null,
        location: '',
        maintenance_type_id: 0,
        urgency: 'Low',
        title: '',
        description: '',
        image_filename: '',
        m_type_other_value: '',
        assigned_to: null,
        assigned_to_type: 0,
        rfp_type: 1,
        vendor_category_id: 0,
        user_id: null,
        is_seen: 0,
        property_id: null,
        unit_id: null,
        start_time: null,
        end_time: null,
        start_date: null,
        end_date: null,
        eta_dt: null,
        notes: '',
        request_no: null,
        overview: '',
        scope: '',
        request_to: null,
        vendor_email: '',
        direction: '',
        issued_by_id: null,
        rfp_issue_date: null,
        send_question_date: null,
        rfp_due_date: null,
        decision_date: null,
        closed_date:null,
        questions_to_vendor: [],
        qoutation: [],
        availability: '',
        other_comments: '',
        is_submitted: 0,
        rfp_recipients: [],
        other_notes: '',
        maintenance_request_dts: [],
        createdAt: common.formatDate(new Date()),
        updatedAt: new Date(),  
      },

      qs: [],
      qts: [],

      rawFiles: [],
      resDataLocal: [],

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
    accessLevel() {
      return localStorage.accessLevel
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    changeRfpType(){
      this.data_local.rfp_type = this.assignedType ? 1 : 2
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
    submit(loc) {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes(loc)
        }
      })
    },
    check_empty_dates() {
      if ( this.data_local.rfp_type === 2) {
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

        this.data_local.issued_by_id = decoded.id
        this.data_local.rfp_issue_date = new Date()
        this.data_local.is_submitted = 0
        this.data_local.m_request_status_id = 15        

        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.questions_to_vendor = this.qs
        this.data_local.qoutation = this.qts  
        await axios.post(`/maintenance/save/-1`, {
          data: this.data_local,
          token: this.token,
        })

        this.data_local.is_submitted = 1
      } catch (err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
      }
    },
    async save_changes (loc) {
      try {
        if (!this.validateForm) return
        const editId = -1    
        this.$vs.loading()  
        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.questions_to_vendor = this.qs
        this.data_local.qoutation = this.qts 
        this.data_local.request_no = "MR-" + common.formatDate5(new Date())

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

        this.resDataLocal = result['data']['result']

        console.log('this.resDataLocal ', this.resDataLocal)

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: this.resDataLocal.id,
          path: `docs/maintenance-order/gallery/${this.resDataLocal.id}`,
          folderId: 20
        })

        // assign order
        if (this.data_local.rfp_type === 1) {
          await this.assignOrder()
        } else {
          this.data_local.order_id = this.resDataLocal.id
          this.send_rfp()
        } 

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully saved'
        })
        this.$vs.loading.close()
        this.$router.push({name:'app-order-list'})
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
      // this.data_local.rfp_type = parseInt(this.$route.query.t)
      this.data_local.property_ref = localStorage.selectedPropertyRef
      this.data_local.id = this.resDataLocal.id
      await axios.post(`/order/assign/${this.resDataLocal.id}`, {
        token: this.token,
        data: this.data_local
      })
    },
    reset_data () {
      //portfolio
      this.data_local['name'] = ''
      this.data_local['unit_resident_id'] = ''
      this.data_local['m_request_status_id'] = ''      
      this.data_local['phone'] = ''
      this.data_local['resolved_date'] = ''
      this.data_local['building_id'] = ''
      this.data_local['location'] = ''
      this.data_local['maintenance_type_id'] = ''
      this.data_local['urgency'] = ''
      this.data_local['description'] = ''
      this.data_local['m_type_other_value'] = ''
      this.data_local['assigned_to'] = ''
      this.data_local['rfp_type'] = ''
      this.data_local['vendor_category_id'] = ''
      this.data_local['user_id'] = ''
      this.data_local['is_seen'] = ''
      this.data_local['property_id'] = ''
      this.data_local['unit_id'] = ''
      this.rawFiles = []

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
  },
  async created () {   
    try {
      this.data_local.rfp_type = parseInt(this.$route.query.t)
      this.assignedType = parseInt(this.$route.query.t) === 1

      // await this.loadMaintenanceType()
      // await this.loadVendorCategoryMaster()
      await this.loadVendor()
      // await this.loadUser()
      // await this.loadBuilding()
      // await this.loadProperty()
      // await this.loadUnit()
      // await this.loadRequestStatus()
      await this.loadStaff()          
      this.data_local.user_id = decoded.id
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Maintenance Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },  
  mounted () {
    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })
  }  
}
</script>
<style>
  div#order-new-tab .wo-details-new {
    height: 150px;
  }

  div.select-assinged-to ul.vs__dropdown-menu {
    height: 150px;
  }

  .assigned-switch {
    background: rgba(var(--vs-primary),1);
  }

  button.assigned-switch .text-off.text-switch.active-text {
    color: #f8f8f8 !important;
  }

  button.assigned-switch.vs-switch-warning.vs-switch-active {
    background: rgba(var(--vs-warning),1) !important;
  }

  button.vs-switch.assigned-switch {
    width: 110px !important;
    padding: 16px !important;
    border-radius: 16px;
  }

  button.vs-switch.assigned-switch .vs-circle-switch.vs-switch--circle {
    left: 3px !important;
    top: 5px !important;
    width: 23px !important;
    height: 23px !important;
  }

  button.vs-switch.assigned-switch.vs-switch.vs-switch-active .vs-switch--circle {
    margin-left: calc(100% - 29px);
  }
</style>
