<template>
  <div class="flex items-center">
    <span @click="openEditEvent(params.data)" class="text-inherit font-bold hover:text-primary cursor-pointer" v-if="showR">{{ params.value }}</span>
    <span class="font-normal cursor-auto" v-if="!showR">{{ params.value }}</span> <!--crud-->

    <!-- ADD EVENT -->
    <vs-prompt
        class="calendar-event-dialog"
        title="Add Event"
        accept-text= "Add Event"
        @accept="confirmAction(-1)"
        :is-valid="validForm"
        :active.sync="activePromptAddEvent">

        <!-- <div class="calendar__label-container flex" v-if="roleVal == 'admin'">
            <vs-chip class="text-white" :class="'bg-' + labelColor(labelLocal)">{{ labelLocal }}</vs-chip>

            <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
                <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>

                <vs-dropdown-menu style="z-index: 200001">
                  <vs-dropdown-item v-for="(label, index) in calendarLabels" :key="index" @click="labelLocal = label.value">
                      <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                      <span>{{ label.text }}</span>
                  </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </div> -->

        <div class="vx-row">
          <div class="mt-4 vx-col w-1/2" v-if="this.data_local.is_block === 0">
            <label class="vs-input--label">Unit*</label>
            <v-select :options="optionUnit" :reduce="number => number.id" label="number" v-validate="'required'" v-model="data_local.unit_id" name="unit_id" class="inputx" @change="loadUser" @input="loadUser()"/>
            <span class="text-danger text-sm"  v-show="errors.has('unit_id')">{{ errors.first('unit_id') }}</span>
          </div>

          <div class="mt-4 vx-col w-1/2">
            <label class="vs-input--label">Amenity*</label>
            <v-select :options="optionAmenity" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.amenity_id" name="amenity_id" class="inputx" @change="selectAmenity" @input="selectAmenity()"/>
            <span class="text-danger text-sm"  v-show="errors.has('amenity_id')">{{ errors.first('amenity_id') }}</span>
          </div>
        </div>

        <div class="mt-4" v-if="isAdmin && this.data_local.is_block === 0">
          <label class="vs-input--label">Resident*</label>
          <v-select :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.user_id" name="user_id" class="inputx"/>
          <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
        </div>

        <div class="mt-4" v-if="!isAdmin">
          <label class="vs-input--label">Resident*</label>
          <vs-input name="user_full_name" class="w-full" v-model="user_full_name" type="text" disabled></vs-input>
        </div>

        <div class="vx-row">
          <div :class="{'mt-4':true, 'vx-col':true, 'w-1/2':!isTenant, 'w-full':isTenant}">
            <small class="date-label">Reservation Start Date</small>
            <flat-pickr
              :config="configETA" 
              v-model="data_local.startDate" 
              v-validate="'required|allowedNoOfBooking'"
              placeholder="" 
              :class="{'mr-2':true, 'mb-2':true, 'flatpickr-input':true, 'w-full':true, 'cursor-not-allowed':data_local.amenity_id==null }"
              @on-change="onFromChange" 
              :disabled="data_local.amenity_id==null"
              name="startDate"/>
            <span class="text-danger text-sm"  v-show="errors.has('startDate')">{{ errors.first('startDate') }}</span>
          </div>

          <div class="mt-4 vx-col w-1/2" v-if="!isTenant">
            <small class="date-label">Reservation End Date</small>
            <flat-pickr 
              :config="configETA" 
              v-model="data_local.endDate" 
              v-validate="'required|allowedNoOfBooking'"
              :placeholder="data_local.endDate" 
              :class="{'mr-2':true, 'mb-2':true, 'flatpickr-input':true, 'w-full':true, 'cursor-not-allowed':data_local.amenity_id==null || this.isBookMax }" 
              @on-change="onFromChange" 
              :disabled="data_local.amenity_id==null || this.isBookMax"
              name="endDate"/>
            <span class="text-danger text-sm"  v-show="errors.has('endDate')">{{ errors.first('endDate') }}</span>
          </div>
        </div>

        <div class="vx-row">          
          <div class="mt-4 vx-col w-1/2 option-start-time">
            <small class="date-label">Start Time</small>
            <v-select 
              :options="optionHoursStart" 
              :reduce="val => val.id" 
              label="val" 
              v-validate="'required'" 
              v-model="data_local.from_time" 
              name="from_time" class="inputx" 
              @change="selectAmenity2" 
              @input="selectAmenity2()" 
              :disabled="data_local.amenity_id==null || this.isBookMax"/>
            <span class="text-danger text-sm" v-show="errors.has('from_time')">{{ errors.first('from_time') }}</span>
          </div> 

          <div class="mt-4 vx-col w-1/2 option-start-time">
            <small class="date-label">End Time</small>
            <v-select 
              :options="optionHoursEnd" 
              :reduce="val => val.id" 
              label="val" 
              v-model="data_local.to_time" 
              v-validate="'required|minBookingHours|maxBookingHours'"
              name="to_time" class="inputx" 
              :disabled="data_local.amenity_id==null || this.isBookMax" 
              />
            <span class="text-danger text-sm" v-show="errors.has('to_time')">{{ errors.first('to_time') }}</span>
          </div> 
        </div>

        <div class="vx-row">  
          <div class="mt-4 vx-col w-1/2" v-if="isAdmin">
            <label class="vs-input--label">All Day?</label>
            <vs-switch color="primary" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="data_local.is_all_day" class="pt-4 pb-4 isAllDaySwitch">
              <span slot="on" class="pl-1 pr-0">YES</span>
              <span slot="off" class="pl-0 pr-1">NO</span>
            </vs-switch>
          </div>

          <div class="mt-4 vx-col w-1/2" v-if="this.data_local.is_block === 0">
            <label class="vs-input--label">Expected No of People</label>
            <vs-input name="people" class="w-full" v-model="data_local.people" type="number"></vs-input>
            <span class="text-danger text-sm"  v-show="errors.has('people')">{{ errors.first('people') }}</span>
          </div>
        </div>

      <!-- <div class="mt-8 vx-col" v-if="this.data_local.is_block === 0 && roleVal == 'admin'">
          <v-select :options="optionAction" :reduce="name => name.val" label="name" v-model="data_local.label" name="label" class="inputx" placeholder="Action"/>
          <span class="text-danger text-sm" v-show="errors.has('label')">{{ errors.first('label') }}</span>
        </div>         

        <div class="mt-8" v-if="this.data_local.label === 'reject'">
          <vs-textarea height="50px" class="w-full mt-4" label="Reject Reason" v-model="data_local.rejection_reason" type="text" name="rejection_reason" />
          <span class="text-danger text-sm"  v-show="errors.has('rejection_reason')">{{ errors.first('rejection_reason') }}</span>
        </div>  -->       

        <div class="vx-row"> 
          <div :class="{'mt-8':true, 'vx-col':true, 'w-1/2':isAdmin, 'w-full':!isAdmin}" v-if="this.data_local.is_block === 0">
            <vs-textarea height="80px" class="w-full mt-4" label="Resident Comments" v-model="data_local.comments" type="text" name="comments" />
            <span class="text-danger text-sm"  v-show="errors.has('comments')">{{ errors.first('comments') }}</span>
          </div>

          <div class="mt-8 vx-col w-1/2" v-if="this.data_local.is_block === 0 && isAdmin">
            <vs-textarea height="80px" class="w-full mt-4" label="Internal Comments" v-model="data_local.internal_comments" type="text" name="internal_comments" />
            <span class="text-danger text-sm"  v-show="errors.has('internal_comments')">{{ errors.first('internal_comments') }}</span>
          </div>
        </div>

        <div class="mt-8" v-if="this.data_local.is_block === 1">
          <vs-textarea height="50px" class="w-full mt-4" label="Block Reason" v-model="data_local.block_reason" type="text" name="block_reason" />
          <span class="text-danger text-sm"  v-show="errors.has('block_reason')">{{ errors.first('block_reason') }}</span>
        </div>
    </vs-prompt>

    <!-- EDIT EVENT -->
    <vs-prompt
        class="calendar-event-dialog"
        title="Edit Event"
        accept-text= "Submit"
        cancel-text = "Cancel"
        button-cancel = "border"
        @cancel="removeEvent"
        @accept="confirmAction(eventId)"
        :is-valid="validForm"
        :active.sync="activePromptEditEvent">

        <!-- <div class="calendar__label-container flex" v-if="roleVal == 'admin'">
            <vs-chip class="text-white" :class="'bg-' + labelColor(labelLocal)">{{ labelLocal }}</vs-chip>

            <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
                <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>

                <vs-dropdown-menu style="z-index: 200001">
                  <vs-dropdown-item v-for="(label, index) in calendarLabels" :key="index" @click="labelLocal = label.value">
                      <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                      <span>{{ label.text }}</span>
                  </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </div> -->

        <div class="vx-row">  
          <div class="mt-4 vx-col w-1/2" v-if="this.data_local.is_block === 0">
            <label class="vs-input--label">Unit*</label>
            <v-select :options="optionUnit" :reduce="number => number.id" label="number" v-validate="'required'" v-model="data_local.unit_id" name="unit_id" class="inputx" @change="loadUser" @input="loadUser()"/>
            <span class="text-danger text-sm"  v-show="errors.has('unit_id')">{{ errors.first('unit_id') }}</span>
          </div>

          <div class="mt-4 vx-col w-1/2">
            <label class="vs-input--label">Amenity*</label>
            <v-select :options="optionAmenity" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.amenity_id" name="amenity_id" class="inputx" @change="selectAmenity" @input="selectAmenity()"/>
            <span class="text-danger text-sm"  v-show="errors.has('amenity_id')">{{ errors.first('amenity_id') }}</span>
          </div>
        </div>

        <div class="mt-4" v-if="isAdmin && this.data_local.is_block === 0">
          <label class="vs-input--label">Resident*</label>
          <v-select :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.user_id" name="user_id" class="inputx"/>
          <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
        </div>

        <div class="mt-4" v-if="!isAdmin">
          <label class="vs-input--label">Resident*</label>
          <vs-input name="user_full_name" class="w-full" v-model="user_full_name" type="text" disabled></vs-input>
        </div>

        <div class="vx-row">  
          <div :class="{'mt-4':true, 'vx-col':true, 'w-1/2':!isTenant, 'w-full':isTenant}">
            <small class="date-label">Reservation Start Date</small>
            <flat-pickr :config="configETA" v-model="data_local.startDate" :placeholder="data_local.startDate" :class="{'mr-2':true, 'mb-2':true, 'flatpickr-input':true, 'w-full':true, 'cursor-not-allowed':data_local.amenity_id==null }" @on-change="onFromChange" :disabled="data_local.amenity_id==null"/>
          </div>

          <div class="mt-4 vx-col w-1/2" v-if="!isTenant">
            <small class="date-label">Reservation End Date</small>
            <flat-pickr 
              :config="configETA" 
              v-model="data_local.endDate" 
              v-validate="'required|allowedNoOfBooking'"
              :placeholder="data_local.endDate" 
              :class="{'mr-2':true, 'mb-2':true, 'flatpickr-input':true, 'w-full':true, 'cursor-not-allowed':data_local.amenity_id==null || this.isBookMax }" 
              @on-change="onFromChange" 
              :disabled="data_local.amenity_id==null || this.isBookMax"/>
          </div>
        </div>

        <div class="vx-row">          
          <div class="mt-4 vx-col w-1/2">
            <small class="date-label">Start Time</small>
            <v-select :options="optionHoursStart" :reduce="val => val.id" label="val" v-validate="'required'" v-model="data_local.from_time" name="from_time" class="inputx" @change="selectAmenity2" @input="selectAmenity2()" :disabled="data_local.amenity_id==null || this.isBookMax"/>
            <span class="text-danger text-sm" v-show="errors.has('from_time')">{{ errors.first('from_time') }}</span>
          </div> 

          <div class="mt-4 vx-col w-1/2">
            <small class="date-label">End Time</small>
            <v-select 
              :options="optionHoursEnd" 
              :reduce="val => val.id" 
              label="val" 
              v-model="data_local.to_time" 
              v-validate="'required|minBookingHours|maxBookingHours'"
              name="to_time" 
              class="inputx" 
              :disabled="data_local.amenity_id==null || this.isBookMax" 
              />
            <span class="text-danger text-sm" v-show="errors.has('to_time')">{{ errors.first('to_time') }}</span>
          </div> 
        </div>

        <div class="vx-row">
          <div class="mt-4 vx-col w-1/2" v-if="isAdmin">
            <label class="vs-input--label">All Day?</label>
            <vs-switch color="primary" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="data_local.is_all_day" class="pt-4 pb-4 isAllDaySwitch">
              <span slot="on" class="pl-1 pr-0">YES</span>
              <span slot="off" class="pl-0 pr-1">NO</span>
            </vs-switch>
          </div>
          
          <div class="mt-4 vx-col w-1/2" v-if="this.data_local.is_block === 0">
            <label class="vs-input--label">Expected No of People</label>
            <vs-input name="people" class="w-full" v-model="data_local.people" type="number"></vs-input>
            <span class="text-danger text-sm"  v-show="errors.has('people')">{{ errors.first('people') }}</span>
          </div>
        </div>

        <div class="mt-4 vx-col" v-if="this.data_local.is_block === 0 && isAdmin">
          <label class="vs-input--label text-success" style="font-weight:bold">Action</label>
          <v-select :options="optionAction" :reduce="name => name.val" label="name" v-model="data_local.label" name="label" class="inputx"/>
          <span class="text-danger text-sm" v-show="errors.has('label')">{{ errors.first('label') }}</span>
        </div>         

        <div class="mt-4" v-if="this.data_local.label === 'reject'">
          <vs-textarea height="50px" class="w-full mt-4" label="Reject Reasons" v-model="data_local.rejection_reason" type="text" name="rejection_reason" />
          <span class="text-danger text-sm"  v-show="errors.has('rejection_reason')">{{ errors.first('rejection_reason') }}</span>
        </div>          

        <div class="vx-row">
          <div :class="{'mt-4':true, 'vx-col':true, 'w-1/2':isAdmin, 'w-full':!isAdmin}" v-if="this.data_local.is_block === 0">
            <vs-textarea height="80px" class="w-full" label="Resident Comments" v-model="data_local.comments" type="text" name="comments" />
            <span class="text-danger text-sm"  v-show="errors.has('comments')">{{ errors.first('comments') }}</span>
          </div>

          <div class="mt-4 vx-col w-1/2" v-if="this.data_local.is_block === 0 && isAdmin">
            <vs-textarea height="80px" class="w-full" label="Internal Comments" v-model="data_local.internal_comments" type="text" name="internal_comments" />
            <span class="text-danger text-sm"  v-show="errors.has('internal_comments')">{{ errors.first('internal_comments') }}</span>
          </div>
        </div>

        <div class="mt-4" v-if="this.data_local.is_block === 1">
          <vs-textarea height="50px" class="w-full mt-4" label="Block Reason" v-model="data_local.block_reason" type="text" name="block_reason" />
          <span class="text-danger text-sm"  v-show="errors.has('block_reason')">{{ errors.first('block_reason') }}</span>
        </div>

    </vs-prompt>

    <vs-prompt 
      class="calendar-event-dialog"
      title="Saving Event"
      color="danger"
      acceptText="Ok"
      buttonCancel="false"
      type="alert"
      :active.sync="eventError.hasError">
      <p>{{ eventError.text }}</p>
    </vs-prompt>

    <vs-prompt 
      color="warning"
      title="Confirm Amenity Booking" 
      acceptText="Yes"
      text="This will create several events in the system (one for each day) are you ready to continue?"
      :active.sync="confirmAddEventPop"
      @cancel="activePromptAddEvent=true"
      @accept="addEvent(-1)"
      @close="activePromptAddEvent=true"
    >
    </vs-prompt>  
    <vs-prompt 
      color="warning"
      title="Confirm Amenity Booking" 
      acceptText="Yes"
      text="This will create several events in the system (one for each day) are you ready to continue?"
      :active.sync="confirmEditEventPop"
      @cancel="activePromptEditEvent=true"
      @accept="addEvent(eventId)"
      @close="activePromptEditEvent=true"
    >
    </vs-prompt>    
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import moduleCalendar from '@/store/calendar/moduleCalendar.js'
require('vue-simple-calendar/static/css/default.css')

import Datepicker from 'vuejs-datepicker'
import { en, he } from 'vuejs-datepicker/src/locale'
import { Validator } from 'vee-validate'
import mainHelper from '@/mainHelper'

import vSelect from 'vue-select'
import axios from '@/axios'
import EventBus from '@/EventBus'
import common from '@/common'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const jwt = require('jsonwebtoken')
var token = localStorage.usertoken
var decoded = jwt.verify(token, 'secret')
let tz = 0 //new Date().getTimezoneOffset() / -60;
let tx = new Date().getTimezoneOffset() / -60;

export default {
  components: {
    CalendarView,
    CalendarViewHeader,
    Datepicker,
    vSelect,
    flatPickr
  },
  data () {
    return {
      showR:false,

      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      asTenant: [
        'user'
      ],

      optionMinHours: [
        { id:1, name: 'None',     val:0, type:'minutes', h:0, m:0 },
        { id:3, name: '30 Mins',  val:30, type:'minutes', h:0, m:30 },
        { id:5, name: '1 Hour',   val:1, type:'hours', h:1, m:0 },
        { id:6, name: '2 Hours',  val:2, type:'hours', h:2, m:0 },
        { id:7, name: '3 Hours',  val:3, type:'hours', h:3, m:0 },
      ],

      optionMaxHours: [
        { id:1, name: 'None',      val:0, type:'minutes', h:0, m:0 },
        { id:3, name: '30 Mins',   val:30, type:'minutes', h:0, m:30 },
        { id:5, name: '1 Hour',    val:1, type:'hours', h:1, m:0 },
        { id:6, name: '2 Hours',   val:2, type:'hours', h:2, m:0 },
        { id:7, name: '3 Hours',   val:3, type:'hours', h:3, m:0 },
        { id:8, name: '4 Hours',   val:4, type:'hours', h:4, m:0 },
        { id:9, name: '5 Hours',   val:5, type:'hours', h:5, m:0 },
        { id:10, name: '6 Hours',  val:6, type:'hours', h:6, m:0 },
        { id:11, name: '7 Hours',  val:7, type:'hours', h:7, m:0 },
        { id:12, name: '8 Hours',  val:8, type:'hours', h:8, m:0 },
      ],

      optionBufferTime: [
        { id:1, name: 'None', val:0, type:'minutes' },
        { id:2, name: '15 Mins', val:15, type:'minutes' },
        { id:3, name: '30 Mins', val:30, type:'minutes' },
        { id:4, name: '45 Mins', val:45, type:'minutes' },
        { id:5, name: '1 Hour', val:1, type:'hours'  },
        { id:6, name: '2 Hours', val:2, type:'hours' },
        { id:7, name: '3 Hours', val:3, type:'hours' },
        { id:8, name: '4 Hours', val:4, type:'hours' }
      ],

      optionBookingLimitUnit: [
        { id:1, name: 'Daily', val:'daily' },
        { id:2, name: 'Weekly', val:'daily' },
        { id:3, name: 'Monthly', val:'daily' },
        { id:4, name: 'Annual', val:'daily' }
      ],

      user_full_name: '',
      amenity_name: '',
      amenity_min_time: null,
      amenity_max_time: null,
      booking_limit: null,
      booking_limit_unit: null,
      selectedAmenity: [],
      listData: [],
      token: localStorage.usertoken,
      eventId: -1,

      configETA: {
        minDate: new Date(),
        maxDate: null, 
        enableTime: false,
        dateFormat: 'M d Y',
        "disable": [
            function(date) {
                // return true to disable
                // return (date.getDay() === 0 || date.getDay() === 6);
            }
        ]
      },
      configdateFromTimePicker: {
        enableTime: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "8:00",
        maxTime: "17:00",
        time_24hr: true
      },
      configdateToTimePicker: {
        enableTime: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "8:00",
        maxTime: "17:00",
        time_24hr: true
      },
      configFromdateTimePicker: {
        minDate: new Date(),
        maxDate: null,        
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

      value1: null,
      unit_id: null,
      optionUnit: [],
      optionUser: [],
      optionAmenity: [],
      optionHour: [],
      optionHoursStart: [],
      optionHoursEnd: [],
      timeS: false,

      data_local: {
        amenity_id: null,
        unit_resident_id: null,
        from_time: '',
        to_time: '',
        people: 0,
        comments: '',
        status: '',
        from_dates: null,
        from_date: null,
        to_date: null,
        user_id: null,
        is_seen: 0,
        from_datetime: null,
        to_datetime: null,
        property_id: null,
        unit_id: null,
        rejection_reason: '',
        internal_comments: '',
        createdAt: null,
        updatedAt: null,

        startDate: null,
        endDate: null,
        title: '',
        label: 'approve',
        is_block: 0,
        block_reason: '',
        is_buffer: 0,
        is_all_day: 0
      },
      optionAction: [
        { id: 1, name: 'Approve', val: 'approve'},
        { id: 3, name: 'Reject', val: 'reject'},
        { id: 4, name: 'Delete', val: 'delete'}
      ],
      showDate: new Date(),
      disabledFrom: false,
      id: 0,
      title: '',
      startDate: '',
      endDate: '',
      labelLocal: 'pending',
      unit_number: 0,

      langHe: he,
      langEn: en,

      url: '',
      calendarView: 'month',

      activePromptAddEvent: false,
      activePromptEditEvent: false,
      confirmAddEventPop: false,
      confirmEditEventPop: false,

      calendarViewTypes: [
        {
          label: 'Month',
          val: 'month'
        },
        {
          label: 'Week',
          val: 'week'
        },
        // {
        //   label: 'Year',
        //   val: 'year'
        // }
      ],

      calendarLabels: [
        {
          color: "success",
          text: "Approve",
          value: "approve"
        },
        {
          color: "danger",
          text: "Deleted",
          value: "deleted"
        },
        {
          color: "warning",
          text: "Pending",
          value: "pending"
        },
      ],

      isMin: true,
      isMax: true,
      isBookMax: false,

      eventError: {},
    }
  },
  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
    },
    isTenant() {
      return this.asTenant.includes(this.roleVal)
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    validForm () {
      this.data_local.user_id = this.isAdmin ? this.data_local.user_id : decoded.id
      return this.from_datetime !== '' 
      && ( this.isTenant ? true :
          Date.parse(this.data_local.endDate) - Date.parse(this.data_local.startDate) >= 0 )
      && this.data_local.unit_id !== null 
      && this.data_local.user_id !== null 
      && this.data_local.amenity_id !== null 
      && this.data_local.amenity_id !== null 
      && this.data_local.from_time !== null 
      && this.data_local.to_time !== null 
      && this.isMin 
      && this.isMax 
      && !this.isBookMax
    },
    disabledDatesTo () {
      return { to: new Date(this.data_local.startDate) }
    },
    disabledDatesFrom () {
      return { from: new Date(this.data_local.endDate) }
    },
    labelColor () {
      return (label) => {
        if      (label === 'approve') return 'success'
        else if (label === 'pending') return 'warning'
        else if (label === 'deleted') return 'danger'
      }
    },
    windowWidth () {
      return this.$store.state.windowWidth
    }
  },
  methods: {
    async simpleCalendarEvents () {
      try { 
        this.user_full_name = decoded.first_name + ' ' + decoded.last_name
        let reservationList = await axios.get('/amenity-reservation/list', {
          headers: { 
            'Authorization': localStorage.usertoken,
            'property_ref': localStorage.selectedPropertyRef
          },
        })

        this.listData = reservationList['data']
        this.listData.filter((res) => {
          let approveS = `background-color: ${res.amenity.amenity_color} !important; color: white; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;`
          let pendingS = 'background-color: white !important; color: black !important; border: 5px solid #00f5b8;'
          let blockS = 'background-color: gray !important; color: white !important;'
          res['style'] = res['status'] === 'pending' ? pendingS : res['is_block'] === 1 ?  blockS : approveS
          console.log('res ', res)  
          // res['startDate'] = common.addHours(res['startDate'], tz)
        })
        
        return reservationList
      } catch (err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Loading Page',
          text: err.toString('utf8')
        })
        return
      } 
    },
    onFromTimeChange(selectedTime, timeStr, instance) {
      this.$set(this.configdateToTimePicker, 'minTime', timeStr);     
    },
    onFromChange(selectedDates, dateStr, instance) {
      this.$set(this.configTodateTimePicker, 'minDate', dateStr);
      // this.data_local.endDate = this.data_local.is_block === 0 ? this.data_local.startDate : this.data_local.endDate

      this.selectAmenity()
    },
    onToChange(selectedDates, dateStr, instance) {
      this.$set(this.configFromdateTimePicker, 'maxDate', dateStr);
    },
    confirmAction(id) {
      if (!this.data_local.is_all_day) {
        if (id === -1) {        
          this.confirmAddEventPop = true
        } else {        
          this.confirmEditEventPop = true
        }
      } else {
        this.addEvent(id)
      }
    },
    async addEvent (eid) {
      try {  
        const dataCopy = { ...this.data_local };
        dataCopy.endDate = this.isTenant ? dataCopy.startDate : dataCopy.endDate

        dataCopy.property_ref = localStorage.selectedPropertyRef
        this.optionAmenity.filter((res) => {
          this.amenity_name = dataCopy.amenity_id == res['id'] ? res['name'] : this.amenity_name
        })

        this.optionUnit.filter((res) => {
          this.unit_number = dataCopy.unit_id == res['id'] ? res['number'] : this.unit_number
        })

        this.optionHour.filter((res) => {
          dataCopy.from_time = dataCopy.from_time == res['id'] ? res['val'] : dataCopy.from_time

          dataCopy.to_time = dataCopy.to_time == res['id'] ? res['val'] : dataCopy.to_time
        })

        // dataCopy.endDate = dataCopy.is_block === 0 ? dataCopy.startDate : dataCopy.endDate
        let dft = dataCopy.from_time.toString().replace('12:', '00:');
        let dtt = dataCopy.to_time.toString().replace('12:', '00:');
        let sdt = common.convertT(dft, common.formatDate(new Date(dataCopy.startDate)) )
        let edt = common.convertT(dtt, common.formatDate(new Date(dataCopy.endDate)) )
        
        dataCopy.startDate = common.addHours(new Date(sdt), tz)
        dataCopy.endDate = common.addHours(new Date(edt), tz)
        let title1 = this.amenity_name + ": " + this.unit_number + " - (" + dataCopy.from_time + " to " + dataCopy.to_time + ")"
        let title2 = this.amenity_name + ": Blocked - (" + dataCopy.from_time + " to " + dataCopy.to_time + ")"
        dataCopy.title = dataCopy.is_block === 0 ? title1 : title2
        dataCopy.classes = `event-${  this.labelColor(dataCopy.label)}`
        dataCopy.from_datetime = common.addHours(new Date(sdt), tz)
        dataCopy.to_datetime = common.addHours(new Date(edt), tz)
        dataCopy.from_date = common.formatDate2(sdt)
        dataCopy.to_date = common.formatDate2(edt)
        dataCopy.createdAt = common.addHours(new Date(), tz)
        dataCopy.updatedAt = common.addHours(new Date(), tz)

        let y = 0
        let tempSdt = null
        dataCopy.from_dates = []

        for (let i = new Date(dataCopy.from_date).getDay(); i <= (new Date(dataCopy.to_date).getDay()); i++) {
          tempSdt = common.addDays(dataCopy.from_date, y) 
          dataCopy.from_dates.push(tempSdt)
          y++
        }

        let amenityResDup = await axios.get(`/amenity-reservation-detail/dup`, {
          headers: { 
            'Authorization': localStorage.usertoken,
            'property_ref': localStorage.selectedPropertyRef,
            'amenity_id': dataCopy.amenity_id,
            'from_dates': JSON.stringify(dataCopy.from_dates)
          },
        })

        this.timeS = false
        amenityResDup['data']['result'].filter((res) => {
          let cTs_1 = common.convertT(res['from_time'].replace('12:', '00:'), res['from_date'])
          let cTe_1 = common.convertT(res['to_time'].replace('12:', '00:'), res['from_date'])
          let cTs_2 = common.convertT(res['from_time'].replace('12:', '00:'), res['to_date'])
          let cTe_2 = common.convertT(res['to_time'].replace('12:', '00:'), res['to_date'])

          let cTls = common.convertT(dataCopy.from_time.replace('12:', '00:'), common.formatDate(new Date(dataCopy.startDate)) )
          let cTle = common.convertT(dataCopy.to_time.replace('12:', '00:'), common.formatDate(new Date(dataCopy.endDate)) )

          if (this.data_local.amenity_reservation_id !== parseInt(res['amenity_reservation_id']) ) {  
            while (cTe_1.getTime() > cTs_1.getTime()) {  
              this.timeS = cTls.getTime() === cTs_1.getTime() ? true : this.timeS
              this.timeS = cTle.getTime() === cTs_1.getTime() ? true : this.timeS
              cTs_1 = common.addTime3(cTs_1, 30, 'minutes')
            }

            while (cTe_2.getTime() > cTs_2.getTime()) {  
              this.timeS = cTls.getTime() === cTs_2.getTime() ? true : this.timeS
              this.timeS = cTle.getTime() === cTs_2.getTime() ? true : this.timeS
              cTs_2 = common.addTime3(cTs_2, 30, 'minutes')
            }
          }
        })

        if(this.timeS) {
          this.simpleCalendarEvents()
          this.eventError = {
            hasError: true,
            text: 'That time slot is unavailable, please pick another',
          }
          return
        }       

        //add buffer time
        let bfTime = null
        let timeVal = null
        let timeType = null

        this.optionAmenity.filter((res) => {
          bfTime = dataCopy.amenity_id === res.id ? res.buffer_time : bfTime
        })

        this.optionBufferTime.filter((res) => {
          timeVal = res.id === parseInt(bfTime) ? res.val : timeVal
          timeType = res.id === parseInt(bfTime) ? res.type : timeType
        })

        dataCopy.buffer_to_time = common.addTime(dataCopy.to_date, timeVal, timeType)
        //add buffer time         

        let res = await axios.post(`/amenity-reservation/save/${eid}`, {
          data: dataCopy,
          token: this.token
        })     

        if(res['data'] != 'access_denied' && res['data'] != '') {
          this.simpleCalendarEvents()
          this.activePromptAddEvent = false;
          this.$vs.notify({
            color: 'success',
            title: 'Data Saved',
            text: 'The selected data was successfully saved'
          })
        }  else {
          throw new TypeError("Something went wrong")
        }
      } catch(err) {
        this.eventError = {
          hasError: true,
          text: err.toString('utf8')
        }
      }      

      // const obj = { title: this.title, startDate: this.data_local.from_date, endDate: this.data_local.to_date, label: this.labelLocal, url: this.url }
      // obj.classes = `event-${  this.labelColor(this.labelLocal)}`
      // this.$store.dispatch('calendar/addEvent', obj)
    },
    updateMonth (val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val)
    },
    clearFields () {
      this.title = this.data_local.to_date = this.url = ''
      this.id = 0
      this.labelLocal = this.isAdmin ? 'approve' : 'pending'
    },
    promptAddNewEvent (date) {
      this.data_local.label = 'approve'
      this.data_local.is_block = 0

      console.log('tz ', tz)
      console.log('tx ', tx)
      

      // if (this.eventId === -1) {        
        this.eventId = -1
        this.data_local.unit_id = null
        this.data_local.user_id = null
        this.data_local.amenity_id = null
        this.data_local.from_time = null
        this.data_local.to_time = null
        this.data_local.endDate = null
        this.data_local.people = 0
        this.data_local.comments = null
        this.data_local.internal_comments = null   
        this.data_local.block_reason = null
        this.data_local.rejection_reason = null
      // }

      this.disabledFrom = false
      this.addNewEventDialog(common.formatDate2(date))
    },
    promptAddNewBlockEvent (date) {
      this.data_local.label = 'approve'
      this.data_local.is_block = 1

      // if (this.eventId === -1) {        
        this.eventId = -1
        this.data_local.unit_id = 0
        this.data_local.user_id = decoded.id
        this.data_local.property_id = decoded.property_id
        this.data_local.amenity_id = null
        this.data_local.from_time = null
        this.data_local.to_time = null
        this.data_local.endDate = null
        this.data_local.people = 0
        this.data_local.comments = null
        this.data_local.internal_comments = null
        this.data_local.block_reason = null
        this.data_local.rejection_reason = null
        
      // }

      this.disabledFrom = false
      this.addNewEventDialog(common.formatDate2(date))
    },
    addNewEventDialog (date) {
      this.clearFields()
      this.data_local.startDate = common.formatDate(date)
      // this.data_local.endDate = common.formatDate(date)
      this.activePromptAddEvent = true
    },
    openAddNewEvent (date) {
      this.disabledFrom = true
      this.addNewEventDialog(date)
    },
    async openEditEvent (event) {
      if (!this.isAdmin && decoded.id !== event['user_id']) {
        this.simpleCalendarEvents()
        this.$vs.notify({
          color: 'danger',
          title: 'Data Edit',
          text: 'You are not allowed'
        })
        return
      }

      // console.log("event['startDate'] ", event['startDate'])

      this.data_local.is_block = event['is_block']
      this.data_local.unit_id = event['unit_id']
      await this.loadUser()

      let sts = common.subtractHours(new Date(event['amenity_reservation']['startDate']), tx)
      let ste = common.subtractHours(new Date(event['amenity_reservation']['endDate']), tx)
      // this.data_local.startDate = sts
      this.data_local.startDate = common.formatDate(sts)
      this.data_local.amenity_id = event['amenity_id']
      await this.selectAmenity()

      // this.data_local.startDate = sts
      this.data_local.startDate = common.formatDate(sts)
      this.data_local.to_time = event['amenity_reservation']['to_time']
      this.data_local.from_time = event['amenity_reservation']['from_time']
      this.data_local.from_date = event['from_date']
      this.data_local.to_date = event['to_date']     
      // this.data_local.endDate = ste
      this.data_local.endDate = common.formatDate(ste)
      this.data_local.title = event['title']
      this.data_local.label = event['label']
      this.data_local.classes = event['classes']  
      this.optionHour.filter((res) => {
        this.data_local.from_time = this.data_local.from_time == res['val'] ? res['id'] : this.data_local.from_time
      })      

      await this.selectAmenity2()
      this.data_local.from_time = event['amenity_reservation']['from_time']
      this.data_local.to_time = event['amenity_reservation']['to_time']
      this.eventId = event['id']      
      this.data_local.amenity_reservation_id = event['amenity_reservation_id']
      this.data_local.unit_resident_id = event['unit_resident_id']      
      this.data_local.people = event['people']
      this.data_local.comments = event['comments']
      this.data_local.status = event['status']
      this.data_local.user_id = event['user_id']
      this.data_local.is_seen = event['is_seen']
      this.data_local.property_id = event['property_id']      
      this.data_local.rejection_reason = event['rejection_reason']
      this.data_local.internal_comments = event['internal_comments']
      this.data_local.block_reason = event['block_reason']
      this.activePromptEditEvent = true
    },
    editEvent () {
    },
    removeEvent () {
      this.$store.dispatch('calendar/removeEvent', this.id)
    },
    eventDragged (event, date) {
      this.$store.dispatch('calendar/eventDragged', {event, date})
    },
    async loadUnit () {
      var d = await axios.get('/unit/list', {
          headers: { 
            'Authorization': localStorage.usertoken
          },
          params: {
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': localStorage.selectedParentOrg
          }
        })

        this.optionUnit = d['data']
        console.log('this.optionUnit  ', this.optionUnit)
        console.log('localStorage.selectedPropertyRef  ', localStorage.selectedPropertyRef)

        setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    async loadUser () {
      var d = await axios.get(`/unit-user/list/${this.data_local.unit_id}`, {
          headers: { 
            'Authorization': localStorage.usertoken,
            'property_ref': localStorage.selectedPropertyRef,
            'unit_id': this.data_local.unit_id
          },
        })

        this.optionUser = d['data'].map(({user})=>user)
        this.data_local.user_id = null
        // console.log('this.optionUser  ', this.optionUser)
    },
    async loadAmenity () {
      var d = await axios.get('/amenity/list', {
          headers: { 
            'Authorization': localStorage.usertoken,
            'property_ref': localStorage.selectedPropertyRef
          },
        })

        this.optionAmenity = d['data']
        console.log('this.optionAmenity  ', this.optionAmenity)
    },
    async selectAmenity() {
      this.data_local.from_time = null
      this.data_local.to_time = null
      this.optionAmenity.filter((res) => {
        this.amenity_name = this.data_local.amenity_id == res['id'] ? res['name'] : this.amenity_name
        this.selectedAmenity = this.data_local.amenity_id == res['id'] ? res : this.selectedAmenity
      })

      let odj = JSON.parse(this.selectedAmenity.operational_days_json)
      let startDate = new Date(this.data_local.startDate)
      this.optionHoursStart = []

      if (!odj[startDate.getDay()]['is_all_day']) {
        let odjS = odj[startDate.getDay()]['op_start_time_id']
        let odjE = odj[startDate.getDay()]['op_end_time_id']
        let odjSv = odj[startDate.getDay()]['op_start_time']
        let odjEv = odj[startDate.getDay()]['op_end_time']

        for (const [key, value] of Object.entries(odjS) ) {
          for (let i = odjS[key]; i <= (odjE[key]); i++) { 
            this.optionHoursStart.push({id:this.optionHour[i]['id'], val:this.optionHour[i]['val'] })
          }
        }
      } else {
        this.optionHoursStart = this.optionHour
      }   
    },
    async selectAmenity2() {
      
      this.data_local.to_time = null
      this.optionAmenity.filter((res) => {
        this.amenity_name = this.data_local.amenity_id == res['id'] ? res['name'] : this.amenity_name
        this.selectedAmenity = this.data_local.amenity_id == res['id'] ? res : this.selectedAmenity
      })

      let odj = JSON.parse(this.selectedAmenity.operational_days_json)
      let startDate = new Date(this.data_local.startDate)

      this.optionHoursEnd = []

      if (!odj[startDate.getDay()]['is_all_day']) {
        let odjS = odj[startDate.getDay()]['op_start_time_id']
        let odjE = odj[startDate.getDay()]['op_end_time_id']
        let odjSv = odj[startDate.getDay()]['op_start_time']
        let odjEv = odj[startDate.getDay()]['op_end_time']

        for (const [key, value] of Object.entries(odjS) ) {
          if ((this.data_local.from_time+1) < (odjE[key]+1)) {          
            for (let i = (this.data_local.from_time+1); i <= (odjE[key]); i++) { 
              let hasHr = this.optionHoursEnd.filter(obj=>obj.val===this.optionHour[i]['val'])
              
              if (!hasHr.length > 0) {
                this.optionHoursEnd.push({id:this.optionHour[i]['id'], val:this.optionHour[i]['val'] })
              }
            }
          }

        }
      } else {
        for (const [key, value] of Object.entries(this.optionHour) ) {
          if ((this.data_local.from_time+1) < (this.optionHour[key]['id']+1)) {
            this.optionHoursEnd.push({id:this.optionHour[key]['id'], val:this.optionHour[key]['val'] })
          }
        }
      }
    },
    loadHour() {
      let id = 0
      let yy = 0
      let tya = 0
      let hh = 0
      let zx = 0
      let bt = 30
      let ii = 0

      for (let i = 0; i <= 23; i++) {
        for (ii; ii < 60; ii=ii+bt) {
          hh = ii==0? '00':ii
          tya = i >= 12 ? 'PM' : 'AM'
          zx = i > 12 ? i-12 : i
          zx = zx === 0 ? 12 : zx
          yy = ('0' + zx).slice(-2)+':'+hh + tya
          this.optionHour.push({'id': id, 'val': yy})
          id++
        }

        ii = 0
      }
    },
    showAvailableTime() {
      let bfTime = null
      let timeVal = null
      let timeType = null
      let allReservation = [] 
      let ops = []
      let ope = []

      this.optionAmenity.filter((res) => {
        bfTime = this.data_local.amenity_id === res.id ? res.buffer_time : bfTime
      })

      this.optionBufferTime.filter((res) => {
        timeVal = res.id === parseInt(bfTime) ? res.val : timeVal
        timeType = res.id === parseInt(bfTime) ? res.type : timeType
      })
      
      this.listData.map((v, k) => {
        if (v.from_date === common.formatDate4(new Date(this.data_local.startDate)))
        {
          allReservation.push(v) 
        } 
      })

      let sdff = null
      let sdfe = null
      let sdf = null
      let sde = null
      let from_times = []
      let sdfm = null

      allReservation.map((c) => {
        sdff = common.subtractHours(new Date(c.from_datetime), tz)
        sdfe = common.subtractHours(new Date(c.to_datetime), tz)
        // sdff = c.from_time.includes(':30') ? sdff : common.addTime2(sdff, timeVal, timeType)
        // sdfe = c.to_time.includes(':30') ? sdfe : common.addTime2(sdfe, timeVal, timeType)
        sdf = new Date(sdff).getHours()
        sde = new Date(sdfe).getHours()
        sdfm = null

        from_times.push( (c.from_time).toString() )

        for (let i = sdf; i <= sde; i++) {
          sdff = common.addTime2(sdff, 30, 'minutes')
          sdfm = common.formatTime3(sdff)
          sdfm = sdfm.replace('00:', '12:');
          console.log('sdfm ', sdfm)
          console.log('i ', i)
          from_times.push( sdfm )
        }
      })

      ops = this.optionHoursStart.filter(({val}) => !from_times.includes((val).toString()))
      this.optionHoursStart = ops

      ope = this.optionHoursEnd.filter(({val}) => !from_times.includes((val).toString()))
      this.optionHoursEnd = ope      
    },
    checkMinMaxTime(type) {
      this.optionAmenity.filter((x) => {
        this.amenity_min_time = this.data_local.amenity_id !== x['id'] ? this.amenity_min_time : this.optionMinHours.filter(y => y.id === x['min_hours'])
        this.amenity_max_time = this.data_local.amenity_id !== x['id'] ? this.amenity_max_time : this.optionMaxHours.filter(y => y.id === x['max_hours'])
      })

      let dft = this.optionHoursStart.filter((x) => x.id === this.data_local.from_time)
      let dtt = this.optionHoursStart.filter((x) => x.id === this.data_local.to_time)
      let tf = common.convertT(dft[0]['val'].replace('12:', '00:'), '2021-01-01')
      let tt = common.convertT(dtt[0]['val'].replace('12:', '00:'), '2021-01-01')
      let difference = Math.abs(tf.getTime() - tt.getTime());
      let hourDifference = difference  / 1000 / 3600;
      
      this.isMin = this.amenity_min_time[0]['h'] <= hourDifference
      this.isMax = this.amenity_max_time[0]['h'] >= hourDifference

      const hoursValidations = {
        min: this.isMin,
        max: this.isMax,
      }
      return hoursValidations[type];
    },
    checkBookingLimit() {
      let listReservations = this.listData.filter((x) => this.data_local.amenity_id === x['amenity_id'] )
      const sd = common.convertT('00:00AM', common.formatDate(new Date(this.data_local.startDate)) )

      this.optionAmenity.filter((x) => {
        this.booking_limit = this.data_local.amenity_id !== x['id'] ? this.booking_limit : x['booking_limit']
        this.booking_limit_unit = this.data_local.amenity_id !== x['id'] ? this.booking_limit_unit : this.optionBookingLimitUnit.filter(y => y.id === x['booking_limit_unit'])
      })
      
      listReservations = listReservations.filter((x) => {
        let xd = new Date(x.from_datetime)
        // console.log('xd ', xd)
        // console.log('xd.getDate() ', xd.getDate() )
        // console.log('common.getWeek(xd) ', common.getWeek(xd) )
        // console.log('xd.getMonth() ', parseInt(xd.getMonth()) )
        if (this.booking_limit_unit[0]['id'] === 1 && xd.getDate() === sd.getDate()) { //daily
          return x
        } else if (this.booking_limit_unit[0]['id'] === 2 && parseInt( common.getWeek(xd) ) == parseInt( common.getWeek(sd) )) {//weekly
          return x
        } else if (this.booking_limit_unit[0]['id'] === 3 && xd.getMonth() === sd.getMonth()) {//monthly
          return x
        }
      })

      this.isBookMax = this.booking_limit <= listReservations.length;
      return !this.isBookMax;
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
      this.simpleCalendarEvents()
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('amenity-read', 'read')
  
    this.showPage = await mainHelper.isPageAvailable('reservation')
    if (this.showPage) { this.$router.push({name:'page-maintenance'}) }
    
    this.loadUnit()
    this.loadUser()
    this.loadAmenity()
    this.simpleCalendarEvents()
    this.loadHour()

    this.$store.registerModule('calendar', moduleCalendar)
    this.$store.dispatch('calendar/fetchEvents')
    this.$store.dispatch('calendar/fetchEventLabels')
    
    var showP = await mainHelper.cansee(this.$route.meta.slug, 'list')
    if (!showP) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule('calendar')
  },
  mounted() {
    console.log('this.$route.path ', this.$route.path)

    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/reservation/calendar/`) return
      console.log(`/reservation/calendar/`)
      await this.loadUnit()
      await this.loadUser()
      await this.loadAmenity()
      await this.simpleCalendarEvents()
    })

    const allowedBookingLimit = {
      getMessage: field => 'That time slot is unavailable, please pick another',
      validate: value => this.checkBookingLimit()
    };
    const minBookingHours = ('minBookingHours', {
      getMessage: field => 'Minimun of ' + this.amenity_min_time[0]['name'] + ' is allowed',
      validate: value => this.checkMinMaxTime('min')
    });
      const maxBookingHours = ('maxBookingHours', {
      getMessage: field => 'Maximum of ' + this.amenity_max_time[0]['name'] + ' is allowed',
      validate: value => this.checkMinMaxTime('max')
    });
    Validator.extend('allowedNoOfBooking', allowedBookingLimit);
    Validator.extend('minBookingHours', minBookingHours);
    Validator.extend('maxBookingHours', maxBookingHours);
  }

}
</script>

<style lang="scss">

div.option-start-time ul.vs__dropdown-menu {
  height: 200px;
}

@import "@/assets/scss/vuexy/apps/simple-calendar.scss";

div#simple-calendar-app .theme-default .cv-weeks .cv-week .cv-event.event-danger {
  background: gray !important;
}

div#simple-calendar-app .cv-event {
  word-break: break-word;
  white-space: initial;
  padding-top: 5px;
  padding-bottom: 5px;
  height: 62px;
}

#simple-calendar-app .theme-default .cv-weeks .cv-week {
  min-height: 50% !important;
}

.isAllDaySwitch span.vs-circle-switch {
  top: inherit !important;
}

.isAllDaySwitch {
  width: 70px !important;
}

.vs-button-false {
  display: none;
}

.calendar-event-dialog div.vs-dialog {
  max-width: 600px !important;
}

#simple-calendar-app .cv-day-number {
  height:0px;
}

</style>
