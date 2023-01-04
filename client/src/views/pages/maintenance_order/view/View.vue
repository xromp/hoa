<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-order-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
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
              <tr v-if="isTenant || isAdmin">      
                <td class="font-semibold">Requestor's Availability</td>
                <!-- <td class="font-semibold" v-else>Availability</td> -->
                <td>{{ view_data.availability === null ||  view_data.availability === '' ? '--' : view_data.availability }}</td>
              </tr>
              <tr v-if="!isTenant && isAdmin">      
                <td class="font-semibold">Preferred Timing</td>
                <td>{{ view_data.preferred_timing === null ||  view_data.preferred_timing === '' ? '--' : view_data.preferred_timing }}</td>
              </tr>

              
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2" v-if="!isTenant">
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

              <tr v-if="isAdmin">
                <td class="font-semibold">Manager's Notes</td>
                <td>{{ view_data.notes === null ||  view_data.notes === '' ? '--' : view_data.notes }}</td>
              </tr>     

              <tr v-if="isAdmin || roleVal === 'staff'">
                <td class="font-semibold">Urgency</td>
                <td>{{ view_data.urgency }}</td>
              </tr>

              <tr>
                <td class="font-semibold">Requested By</td>
                <td>{{ view_data.user.first_name +' '+ view_data.user.last_name }}</td>
              </tr> 

              <tr v-if="isAdmin">
                <td class="font-semibold">Received By</td>
                <td>{{ request_to === null ? 'Unseen' : request_to }}</td>
              </tr>  

              <tr v-if="!isTenant">
                <td class="font-semibold">Assigned To</td>
                <td>{{ assigned_to_name === null ? 'Unassigned' : assigned_to_name }}</td>
              </tr>                   
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons" v-if="roleVal === 'staff' || roleVal === 'vendor' ">   
            <vs-button color="warning" icon-pack="feather" icon="icon-check" class="mr-4" @click="dialogAccept=!dialogAccept" :disabled="view_data.is_seen === 1 || is_completed || is_closed || is_decline">Accept</vs-button>       
            <vs-button class="mr-2" @click="confirmComplete" color="success" type="filled" :disabled="view_data.is_seen === 0 || is_completed || is_closed || is_decline">Completed</vs-button>
            <vs-button color="grey" icon-pack="feather" icon="icon-x" class="mr-4" @click="confirmDecline" v-if="!is_seen" :disabled=" is_completed || is_decline || is_closed">Decline</vs-button>
          </div>

          <div class="vx-col w-full flex" id="account-manage-buttons" v-else>          
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" 
            :disabled="!showU" @click="maintenanceType(0)">Edit <!-- crud -->
            </vs-button> 
             <vs-button icon-pack="feather" icon="icon-book-open" class="mr-4" 
            :disabled="!showU" @click="maintenanceType(1)" v-if="isAdmin">Work Order <!-- crud -->
            </vs-button> 
             <vs-button icon-pack="feather" icon="icon-file-text" class="mr-4"  
            :disabled="!showU" @click="maintenanceType(2)" v-if="isAdmin">RFP <!-- crud -->
            </vs-button> 
            <!-- <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD">Delete
            </vs-button> -->
            <vs-button @click="popupActive=true" color="warning" type="border" class="" v-if="isAdmin">
              <feather-icon icon="SettingsIcon" svgClasses="h-4 w-4"/>
            Actions</vs-button>
          </div>

          <div class="vx-col w-full flex" id="account-manage-buttons" v-if="false">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-order-edit', params: { editId: $route.params.viewId }}" v-if="is_seen">Edit</vs-button>
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

      <div class="vx-row" v-if="!isTenant">
        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Request Details" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Property Name</td>
                <td v-if="view_data.property !== null">{{ view_data.property.name }}</td>
              </tr>

              <tr v-if="isAdmin">
                <td class="font-semibold">Issued By</td>
                <td>{{ issued_name }}</td>
              </tr>

              <tr>
                <td class="font-semibold">Scope</td>
                <td>{{ view_data.scope === null ||  view_data.scope === '' ? '--' : view_data.scope }}</td>
              </tr>

              <tr v-if="isAdmin">
                <td class="font-semibold">Other Comments</td>
                <td>{{ view_data.other_comments === null ||  view_data.other_comments === '' ? '--' : view_data.other_comments }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="RFP Key Dates" class="mb-base">
            <table>
              <tr v-if="isAdmin">
                <td class="font-semibold">Issued Date</td>
                <td v-if="view_data.rfp_issue_date !== null">{{new Date(view_data.rfp_issue_date) | date(true) }}</td>
                <td v-else>--</td>
              </tr>

              <tr v-if="isAdmin">
                <td class="font-semibold">Send Question Date</td>
                <td v-if="view_data.send_question_date !== null">{{new Date(view_data.send_question_date) | date(true) }}</td>
                <td v-else>--</td>
              </tr>

              <tr>
                <td class="font-semibold">Due Date</td>
                <td v-if="view_data.rfp_due_date !== null">{{new Date(view_data.rfp_due_date) | date(true) }}</td>
                <td v-else>--</td>
              </tr>

              <tr v-if="isAdmin">
                <td class="font-semibold">Decision Date</td>
                <td v-if="view_data.decision_date !== null">{{new Date(view_data.decision_date) | date(true) }}</td>
                <td v-else>--</td>
              </tr>

              <tr>
                <td class="font-semibold">Date Created</td>
                <td>{{ view_data.createdAt | date(true) }}</td>
              </tr>             
            </table>
          </vx-card>
        </div> 
      </div>

      <div class="vx-row" v-if="false">
        <div class="vx-col w-full">
          <vx-card title="RFP Response" class="mb-base">
            <vs-table stripe pagination :max-items="10" :data="maintenance_requests_qs">
              <vs-tr>
                <vs-td class="pointer-events-none font-semibold">Request No</vs-td>
                <vs-td class="pointer-events-none font-semibold">Question</vs-td>
                <vs-td class="pointer-events-none font-semibold">Response</vs-td>
              </vs-tr>
              <vs-tr v-if="maintenance_requests_qs.length !== 0" v-for="(value, key) in maintenance_requests_qs"> 
                  <vs-td>
                    <ul>                    
                      <li>{{value[0]}}</li>
                    </ul>
                  </vs-td>
                  <vs-td>
                    <!-- <label class="text-base font-semibold">Questions</label> -->
                    <ul v-if="value[1].length > 0">                    
                      <li v-for="(v, k) in value">{{ value[1][k]['question'] }}</li>
                    </ul>  
                    <ul v-else>
                      <li>--</li>
                    </ul>                
                  </vs-td> 
                  <vs-td>
                    <!-- <label class="text-base font-semibold">Responses</label> -->
                    <ul v-if="value[1].length > 0"> 
                      <li v-for="(v, k) in value" v-if="value[1][k]['response'] !== null">{{ value[1][k]['response'] }}</li>
                    </ul> 
                    <ul v-else>
                      <li>--</li>
                    </ul>                 
                  </vs-td> 
              </vs-tr> 
              <vs-tr v-if="maintenance_requests_qs.length === 0">--</vs-tr>
            </vs-table>
          </vx-card>
        </div> 

        <div class="vx-col w-full">
          <vx-card title="RFP Quotation Break Down" class="mb-base">
            <vs-table stripe pagination :max-items="10" :data="maintenance_requests_qs">
              <vs-tr>
                <vs-td class="pointer-events-none font-semibold">Description</vs-td>
                <vs-td class="pointer-events-none font-semibold">Quantity</vs-td>
                <vs-td class="pointer-events-none font-semibold">Sub Amount</vs-td>
                <vs-td class="pointer-events-none font-semibold">Total Amount</vs-td>
              </vs-tr>
              <vs-tr v-if="maintenance_requests_qs.length !== 0" v-for="(value, key) in maintenance_requests_qs" > 
                  <vs-td>
                    <ul>                    
                      <li class="mb-8">{{value[0]}}</li>
                    </ul>
                  </vs-td>
                  <vs-td>                 
                    <!-- <label class="text-base font-semibold">Description</label> -->
                    <ul v-if="value[2].length > 0">
                      <li v-for="(v, k) in value">{{value[2][k]['description']}}</li>
                    </ul>
                    <ul v-else>
                      <li>--</li>
                    </ul>
                  </vs-td> 
                  <vs-td>                 
                    <!-- <label class="text-base font-semibold">Quantity</label> -->
                    <ul v-if="value[2].length > 0">
                      <li v-for="(v, k) in value">{{value[2][k]['quantity']}}</li>
                    </ul>
                    <ul v-else>
                      <li>--</li>
                    </ul>
                  </vs-td>  
                  <vs-td>                 
                    <!-- <label class="text-base font-semibold">Sub Amount</label> -->
                    <ul v-if="value[2].length > 0">
                      <li v-for="(v, k) in value">$ {{value[2][k]['sub_amount']}}</li>
                    </ul>
                    <ul v-else>
                      <li>--</li>
                    </ul>
                  </vs-td>  
                  <vs-td>
                    <!-- <label class="text-base font-semibold">Total Amount</label> -->
                    <ul v-if="value[2].length > 0">
                      <li v-for="(v, k) in value">$ {{value[2][k]['total_amount']}}</li>
                    </ul>
                    <ul v-else>
                      <li>--</li>
                    </ul>
                  </vs-td>
              </vs-tr> 
              <vs-tr v-if="maintenance_requests_qs.length === 0">--</vs-tr>
            </vs-table>
          </vx-card>
        </div> 
      </div>

      <vx-card title="Files" class="mb-base">
        <div class="vx-row">
          <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
        </div>
      </vx-card>

      <vx-card title="RFP Lists" class="mb-base w-full" v-if="isAdmin">
        <request-list class="mb-4 w-full" />
      </vx-card>

      <vx-card id='threadCard' :class="{'cardGlow':is_glow }" ref="threadCard" title="Tread: Internal Notes" class="mb-base">
        <thread-list requestType="wo" class="mb-4" />
      </vx-card>

      <vs-popup classContent="popup-example order-view-pop-f" title="Select Action" :active.sync="popupActive"> 
        <div class="vx-col w-full selectOption" style="overflow: hidden;"> 

          <div class="mt-6"> 
            <vs-button class="mr-2" @click="reOpen()" color="warning" type="filled" :disabled="is_reopen" v-if="!(accessLevel <= 96)">Reopen</vs-button>
            <vs-button class="mr-2" @click="updateStatus('completed')" color="success" type="filled" :disabled="view_data.m_request_status.val==='completed' || view_data.m_request_status.val==='closed'">Completed</vs-button>
            <vs-button class="mr-2" @click="updateStatus('closed')" color="gray" type="filled" :disabled="view_data.m_request_status.val==='closed'" v-if="!(accessLevel <= 96)">Close</vs-button>
          </div>
        </div>
      </vs-popup>

      <vs-prompt
        @cancel="view_data.rfp_due_date = null"
        @accept="acceptJob"
        @close="view_data.rfp_due_date = null"
        :is-valid="validateForm"
        :active.sync="dialogAccept">
        <div class="con-exemple-prompt">
          <span>Please Enter Due Date</span>
          <flat-pickr :config="configETA" v-model="view_data.rfp_due_date" placeholder="Select Date" :class="{'flatpickr-input':true, 'w-full':true }" name="rfp_due_date" v-validate="'required'"/>
          <span class="text-danger text-sm"  v-show="errors.has('rfp_due_date')">{{ errors.first('rfp_due_date') }}</span>
        </div>
      </vs-prompt>    

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
      <vs-button class="mr-2" @click="updateStatus('completed')" color="success" type="filled" :disabled="view_data.assigned_to_type < 3 || view_data.m_request_status.val==='completed' ">Completed</vs-button>
      <vs-button class="mr-2" @click="updateStatus('closed')" color="gray" type="filled" :disabled="view_data.assigned_to_type < 3" v-if="!(accessLevel <= 96)">Closed</vs-button>
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

    <!--
    <tr v-if="accessLevel >= 96">
      <td class="font-semibold">Urgency</td>
      <td>{{ view_data.urgency }}</td>
    </tr>

     <tr v-if="accessLevel >= 96">
      <td class="font-semibold">Assigned To</td>
      <td>{{ view_data.assigned_to_name === null ? 'Unassigned' : view_data.assigned_to_name }}</td>
    </tr>  

    <tr v-if="accessLevel >= 96">
      <td class="font-semibold">Direction</td>
      <td>{{ view_data.direction === null ||  view_data.direction === '' ? '--' : view_data.direction }}</td>
    </tr>
    <tr v-if="accessLevel >= 96">
      <td class="font-semibold">Due Date</td>
      <td v-if="view_data.eta_dt === null">--</td>
      <td v-else-if="view_data.eta_dt !== null">{{ new Date(view_data.eta_dt) | date(true) }}</td>
    </tr> -->

    <!-- <tr v-for="(dt, key) in view_data.maintenance_request_dts">              
      <td class="font-semibold" v-if="key == 0">Availability</td>
      <td class="font-semibold" v-else-if="key != 0"></td>
      <td>
        {{ new Date(dt.start_date) | date(true) }} ( {{ dt.start_time | time }} to {{ dt.end_time | time }} )
      </td>
    </tr> -->   

    <!-- <tr>
      <td class="font-semibold">User Email</td>
      <td v-if="view_data.user !== null">{{ view_data.user.email }}</td>
    </tr>

    <tr>
      <td class="font-semibold">Building</td>
      <td v-if="view_data.building !== null">{{ view_data.building.name }}</td>
    </tr>

    <tr>
      <td class="font-semibold">First Name</td>
      <td>{{ view_data.user.first_name }}</td>
    </tr>

    <tr>
      <td class="font-semibold">Last Name</td>
      <td>{{ view_data.user.last_name }}</td>
    </tr>

    <tr>
      <td class="font-semibold">Unit No</td>
      <td v-if="view_data.unit !== null">{{ view_data.unit.number }}</td>
    </tr> -->

    <!-- <tr>
      <td class="font-semibold mr-4">Type</td>
      <td v-if="view_data.maintenance_type !== null">{{ view_data.maintenance_type.name }}</td>
    </tr> -->
    <!-- <tr>
      <td class="font-semibold">Category</td>
      <td v-if="view_data.vendor_category_master !== null">{{ view_data.vendor_category_master.name }}</td>
    </tr> -->
    <!-- <tr>
      <td class="font-semibold">Assigned To</td>
      <td v-if="view_data.vendor !== null">{{ view_data.vendor.name }}</td>
    </tr> -->
    <!-- <tr>
      <td class="font-semibold">Resolved Date</td>
      <td>{{ view_data.resolved_date | date(true) }}</td>
    </tr> -->
    <!-- <tr>
      <td class="font-semibold">Rfp Type</td>
      <td>{{ view_data.rfp_type }}</td>
    </tr> -->
    <!-- <tr>
      <td class="font-semibold">Is Seen</td>
      <td>{{ view_data.is_seen }}</td>
    </tr> -->

    <!-- <div class="vx-col w-full flex" id="account-manage-buttons" v-if="isAdmin">
      <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-order-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
      <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
    </div> -->

  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import ThreadList from '../../maintenance_thread/list/List.vue'
import RequestList from './list/List.vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
const jwt = require('jsonwebtoken')
const decoded = jwt.verify(localStorage.usertoken, 'secret')

import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import EventBus from '@/EventBus'
import ReadFile from '@/views/components/files/ReadFile.vue'

export default {
  components: {
    ThreadList,
    RequestList,
    'countdown': VueCountdown,    
    vSelect,
    flatPickr,
    ReadFile
  },
  data () {
    const token = localStorage.usertoken
    return {
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager',
        'staff'
      ],

      asTenant: [
        'user'
      ],

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

      dialogAccept: false,
      is_glow: false,
      optionStaff: [],
      optionUser: [],
      optionVendor: [],
      request_to: null,
      popupActive: false,
      // rfp_recipients: [],
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
      approvals: [],
      data_not_found: 0,

      files: [],
      fileKey: [],
      folderId: 20,

      vendorUser:null
    }
  },
  methods: {    
    maintenanceType(t){
      this.$router.push(`/orders/edit/${this.$route.params.viewId}?t=${t}`)
    },
    clearSelectAssign() {
      this.view_data.assigned_to = null
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
    confirmComplete () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: 'Confirm Complete',
        text: `Are you sure you want to update the status to Complete?`,
        accept: this.completeOrder,
        acceptText: 'Yes'
      })
    },
    async completeOrder() {
      try {
        const viewId = this.$route.params.viewId
        this.view_data.property_ref = localStorage.selectedPropertyRef
        this.view_data.m_request_status_val = 'completed'
        await axios.post(`/order/update-stat/${this.$route.params.viewId}`, {
          token: this.token,
          data: this.view_data,
          params: {
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': localStorage.selectedParentOrg,
            'role_id': localStorage.selectedRoleId,
            'role_val': localStorage.selectedRoleVal
          }

        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job completed.'
        })
        this.loadData()
      } catch(err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    confirmDecline () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `Please send a message to issuer`,
        accept: this.declineOrder,
        acceptText: 'Yes'
      })
    },
    async declineOrder() {
      try {
        const viewId = this.$route.params.viewId
        this.view_data.property_ref = localStorage.selectedPropertyRef

        await axios.post(`/order/reject/${viewId}`, {
          token: this.token,
          data: this.view_data
        })

        this.view_data.m_request_status_val = 'decline'
        await axios.post(`/order/update-stat/${this.$route.params.viewId}`, {
          token: this.token,
          data: this.view_data,
          params: {
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': localStorage.selectedParentOrg,
            'role_id': localStorage.selectedRoleId,
            'role_val': localStorage.selectedRoleVal
          }
        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job declined.'
        })
        this.loadData()
        
        // this.$refs.['threadCard'].$el.scrollIntoView({ behavior: 'smooth' });
        this.is_glow = true
      } catch(err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/order/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
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
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    async acceptJob() {
      try {
        if (this.view_data.rfp_due_date === null) {
          this.errors.add({
            field: 'rfp_due_date',
            msg: 'This field is required.'
          });

          return false
        }
        const viewId = this.$route.params.viewId
        this.view_data.property_ref = localStorage.selectedPropertyRef

        await axios.post(`/order/accept/${viewId}`, {
          token: this.token,
          data: this.view_data
        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job accepted.'
        })
        this.loadData()
      } catch(err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    async rejectJob() {
      try {
        const viewId = this.$route.params.viewId
        await axios.post(`/order/reject/${viewId}`, {
          token: this.token
        })

        this.$vs.notify({
          color: 'success',
          title: 'Loading Page',
          text: 'Job declined.'
        })
        this.$router.push({name:'app-order-list'})
      } catch(err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    async reOpen() {
      try {
        this.view_data.is_submitted = 0   
        this.view_data.is_assigned = 0
        this.view_data.property_ref = localStorage.selectedPropertyRef
        this.view_data.m_request_status_val = 'reopen'
        await axios.post(`/order/reopen/${this.$route.params.viewId}`, {
          token: this.token,
          data: this.view_data
        })

        this.popupActive = false
        this.loadData()
        this.$vs.notify({
          color: 'success',
          title: 'Updating Status',
          text: 'Status Changed.'
        })
      } catch (err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    async updateStatus(val) {
      try {
        this.files = []
        this.fileKey = []

        this.view_data.property_ref = localStorage.selectedPropertyRef
        this.view_data.m_request_status_val = val
        await axios.post(`/order/update-stat/${this.$route.params.viewId}`, {
          token: this.token,
          data: this.view_data,
          params: {
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': localStorage.selectedParentOrg,
            'role_id': localStorage.selectedRoleId,
            'role_val': localStorage.selectedRoleVal
          }
        })

        this.popupActive = false
        this.loadData()
        this.$vs.notify({
          color: 'success',
          title: 'Updating Status',
          text: 'Status Changed.'
        })
      } catch (err) {
        this.$vs.notify({
          time: 10000,
          color: 'danger',
          title: 'Loading Maintenance Page',
          text: err.toString('utf8')
        })
      }
    },
    async loadStaff () {
      const result = await axios.get(`/user/list`, {
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
    async loadVendor () {
      const result = await axios.get(`/vendor/property/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionVendor = result['data']
    },    
    async loadUser () {
      const result = await axios.get(`/user/list`, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': this.token 
        },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef
        }
      })

      this.optionUser = result['data']
      return result['data']
    },
    async loadData () {
      this.$vs.loading()
      const loadUser = await this.loadUser()
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/order/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.viewedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if (result['data'].length === 0) {
        this.data_not_found = 2
      } else {  
        this.data_not_found = 1
        this.view_data = result['data']
        this.view_data.createdAt = new Date(this.view_data.createdAt)
        this.view_data.resolved_date = new Date(this.view_data.resolved_date)
        this.view_data.assigned_to = JSON.parse(this.view_data.assigned_to)
        this.isWorkOrderOwner

        loadUser.filter((res) => {        
          this.request_to = res.id === this.view_data.request_to ? res.full_name : this.request_to

          if (res.id === this.view_data.request_to) return
        })

        if(result['data'] == 'access_denied' || result['data'] == '') {
          this.$vs.notify({
            color: 'danger',
            title: 'Error loading',
            text: 'Something went wrong'
          })
        }

        this.approvals = this.view_data.approval 
          ? this.view_data.approval.approval_items
              .sort((a, b) => a.level - b.level) 
          : [];

        this.request_to = this.optionUser.filter(res => res.id === this.view_data.request_to)        
        this.request_to = this.request_to.length===0 || this.view_data.request_to === null || this.view_data.request_to.length===0 ? null : this.request_to[0]['full_name']
        this.request_to = decoded.id === this.view_data.request_to ? decoded.full_name : this.request_to

        if (this.roleVal === 'vendor' && result['data']['maintenance_request_vendor'] !== null) {
          this.is_seen = result['data']['maintenance_request_vendor']['is_seen'] == 1 ? true:false
        }
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
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
    is_decline() {
      return this.view_data['m_request_status']['val'] === 'decline'
    },
    is_completed() {
      return this.view_data['m_request_status']['val'] === 'completed'
    },
    is_closed() {
      return this.view_data['m_request_status']['val'] === 'closed'
    },
    is_reopen() {      
      if (this.view_data['m_request_status']['val'] === 'reopen') return true
      if (this.view_data.m_request_status.val==='closed') return false
      if (this.view_data.is_assigned !== 1 && this.view_data.is_submitted !== 1 && this.view_data.m_request_status.val!=='completed') return true
    },
    is_assigned() {
      return this.view_data.is_assigned === 1
    },
    is_submitted() {
      return this.view_data.is_submitted === 1
    },
    async isWorkOrderOwner() {
      console.log('this.roleVal ', this.roleVal)
      const vendorUser = await axios.get(`/vendor-user/view/${decoded.id}`, {
        headers: { 'Authorization': this.token }
      })
      this.vendorUser = vendorUser.data

      let vendorId = !this.vendorUser ? null : this.vendorUser.vendor.id
      if (this.view_data.assigned_to_type === 1 && JSON.parse(this.view_data.assigned_to) === this.vendorUser.id) return
      if (this.view_data.assigned_to_type === 2 && JSON.parse(this.view_data.assigned_to) === vendorId) return
      if ( this.isAdmin || this.isTenant) return

      this.$vs.notify({
        color: 'danger',
        title: 'Error loading',
        text: 'You are not allowed to view this page'
      })
      this.$vs.loading.close()
      this.$router.push({name:'app-order-list'})
    },
    folderPath() {
      return `docs/maintenance-order/gallery/${this.view_data.id}`
    },
    validateForm () {
      return !this.errors.any() && this.view_data.rfp_due_date !== '' && this.view_data.rfp_due_date !== null
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    issued_name() {
      let issued_by = null
      issued_by = this.optionUser.filter( r => r.id === parseInt(this.view_data.issued_by_id) )
      return issued_by.length === 0 ? '--' : issued_by[0]['full_name']
    },
    rfp_type_name() {
      let type_name = null
      type_name = this.optionType.filter( r => r.id === parseInt(this.view_data.rfp_type) )

      return type_name.length === 0 ? '--' : type_name[0]['name']
    },
    maintenance_requests_qs() {
      let q = []
      let recipient = []

      this.view_data.maintenance_requests.map((value, key) => {
        q.push( [value.request_no+"-"+value.id, (JSON.parse(value.questions_to_vendor)), (JSON.parse(value.qoutation)) ] )
      })

      console.log('qqqqq ', q.length)
      return q
    },
    rfp_recipients() {
      let x = null
      let y = []

      if (JSON.parse(this.view_data.rfp_recipients) === null ) return
      this.view_data.rfp_recipients = JSON.parse(this.view_data.rfp_recipients)
      this.view_data.rfp_recipients.map((r, k) => {
        x = this.optionVendor.filter(res => res.id === r)
        y[k] = x[0]
      })

      return y
    },
    assigned_to_name() {
      try {
        let assigned = []
        if (this.view_data.assigned_to_type === 1) {        
          assigned = this.optionStaff.filter(res => this.view_data.assigned_to === res.id) 

          return assigned.length === 0 ? '--' : assigned[0]['full_name']
        } else {
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
      //crud
      this.showL = await mainHelper.cansee('order-list', 'list')
      this.showC = await mainHelper.cansee('order-create', 'create')
      this.showR = await mainHelper.cansee('order-read', 'read')
      this.showU = await mainHelper.cansee('order-update', 'update')
      this.showD = await mainHelper.cansee('order-delete', 'delete')

      if (!this.showL) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      await this.loadUser()
      await this.loadStaff()
      await this.loadVendor()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Maintenance Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/orders/view/${this.$route.params.viewId}`) return
      console.log(`/orders/view/${this.$route.params.viewId}`)
      await this.loadData()
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/orders/view/${this.$route.params.viewId}`) return
      console.log(`/orders/view/${this.$route.params.viewId}`)
      await this.loadData()
    })

    EventBus.$on('load-approval', () => {
      /* this.approvals = this.approvals.map(e => ({...e, status: 'Approved', completed_at: new Date()}));
      console.log('load-approval', this.approvals)
      this.$set(this.approvals, 'approvals', this.approvals.map(e => ({...e, status: 'Approved', completed_at: new Date()}))) */
    })
  },  
}

</script>

<style lang="scss">

div.order-view-pop-t {
  height: 420px;
}

div.order-view-pop-f {
  height: 220px;
  width: 400px !important;
}

.vs-popup {
  width: 400px !important;
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

.cardGlow {
  box-shadow: 0px 4px 25px 0px rgba(var(--vs-danger),1);
  -webkit-transition: box-shadow 5s ease-out;
  -moz-transition: box-shadow 5s ease-out;
  -o-transition: box-shadow 5s ease-out;
  transition: box-shadow 5s ease-out;
}

.request-details table td {
  min-width: unset !important;
  padding-right: 10px !important;
}
</style>
