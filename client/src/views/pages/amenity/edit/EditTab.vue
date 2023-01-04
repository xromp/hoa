<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Name*" v-model="data_local.name" type="text" v-validate="'required'" name="name" :maxlength="30"/>
        <span class="text-warning text-sm"  v-show="data_local.name.length == 30">You have reached your maximum limit of characters allowed.</span>
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>

        <div class="vx-row mt-4">
          <div class="w-full vx-col">
            <label class="vs-input--label">Background Color*</label>
          </div>
          <div class="w-3/4 vx-col">
            <vs-input class="w-full cursor-pointer h-10 rounded-lg" v-model="data_local.amenity_color" type="color" v-validate="'required'" name="amenity_color" />
          </div>
          <div class="w-1/4 vx-col">
            <vs-input class="w-full" v-model="data_local.amenity_color" type="text" v-validate="'required'" name="amenity_color" />
            <span class="text-danger text-sm"  v-show="errors.has('amenity_color')">{{ errors.first('amenity_color') }}</span>
          </div>

        </div>

        <div class="vx-row mt-4">
          <div class="w-1/2 vx-col">
            <label class="vs-input--label">Min Hours</label>
            <v-select :options="optionMinHours" :reduce="val => val.id" label="val" v-model="data_local.min_hours" name="min_hours"/>
            <span class="text-danger text-sm"  v-show="errors.has('min_hours')">{{ errors.first('min_hours') }}</span>
          </div>
          <div class="w-1/2 vx-col">
            <label class="vs-input--label">Max time*</label>
            <v-select :options="optionMaxHours" :reduce="val => val.id" label="val" v-validate="'required'" v-model="data_local.max_hours" name="max_hours"/>
            <span class="text-danger text-sm"  v-show="errors.has('max_hours')">{{ errors.first('max_hours') }}</span>
          </div>
        </div>        
        <div class="vx-row mt-4">
          <div class="w-1/2 vx-col">
            <vs-input class="w-full" v-model="data_local.booking_limit" type="number" label="How many times the Unit can book" v-validate="'required'" name="booking_limit" />
            <span class="text-danger text-sm"  v-show="errors.has('booking_limit')">{{ errors.first('booking_limit') }}</span>
          </div>
          <div class="w-1/2 vx-col">
            <label class="vs-input--label">How often: (Daily/Weekly/Monthly)</label>
            <v-select :options="optionBookingLimitUnit" :reduce="val => val.id" label="val" v-model="data_local.booking_limit_unit" name="booking_limit_unit" v-validate="'required'"/>
            <span class="text-danger text-sm"  v-show="errors.has('booking_limit_unit')">{{ errors.first('booking_limit_unit') }}</span>
          </div>
        </div>
        <div class="vx-row mt-4">
          <div class="w-1/2 vx-col">
            <label class="vs-input--label">Buffer time*</label>
            <v-select :options="optionBufferTime" :reduce="val => val.id" label="val" v-validate="'required'" v-model="data_local.buffer_time" name="buffer_time"/>
            <span class="text-danger text-sm"  v-show="errors.has('buffer_time')">{{ errors.first('buffer_time') }}</span>
          </div>
          <div class="w-1/2 vx-col">
            <vs-input class="w-full" v-model="data_local.max_user_allowed" type="number" label="Maximum People Allowed" v-validate="'required'" name="max_user_allowed" />
            <span class="text-danger text-sm"  v-show="errors.has('max_user_allowed')">{{ errors.first('max_user_allowed') }}</span>
          </div>
        </div>
      </div>
      <div class="vx-col md:w-1/2 w-full">
        <!-- Col Content -->
        <div class="vx-row ">
          <div class="vx-col w-full">            
            <vs-input class="w-full mt-4" label="Deposit" v-model="data_local.deposit_amount" type="number" name="deposit_amount" />
            <span class="text-danger text-sm"  v-show="errors.has('deposit_amount')">{{ errors.first('deposit_amount') }}</span>

            <vs-textarea height="100px" class="w-full mt-4" label="Booking Message" v-model="data_local.booking_message" type="text" name="booking_message" />        
            <span class="text-danger text-sm"  v-show="errors.has('booking_message')">{{ errors.first('booking_message') }}</span>

            <vs-textarea height="100px" class="w-full mt-4" label="Terms and Conditions" v-model="data_local.terms_conditions" type="text" name="terms_conditions" />
            <span class="text-danger text-sm"  v-show="errors.has('terms_conditions')">{{ errors.first('terms_conditions') }}</span>
          </div>
        </div>

        <!-- Content Row -->
        <update-file 
          :loadFile="loadFile" 
          :folderPath="folderPath" 
          :folderId="folderId" class="mb-4" 
        />
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row mt-4" style="height:500px">
      <div class="vx-col w-full">      
        <div class="flex items-end md:mt-8">
          <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Hours of Operation</span>
        </div>
        <div class="vx-row w-full mt-4">
          <div class="w-full vx-col">
            <vs-table stripe :data="optionHours" :class="{'hours-of-operation':hopErr}">
              <template slot="thead">
                <vs-th>Day</vs-th>
                <vs-th>24 Hours</vs-th>
                <vs-th>Operational Hours</vs-th>
                <vs-th></vs-th>
              </template>

              <template>
                <vs-tr v-for="(currentD, indexD) in optionOperationalDays" :key="indexD">
                  <vs-td>{{currentD.name}}</vs-td>
                  <vs-td>
                    <vs-switch vs-icon-on="check" v-model="data_local.operational_days_json[indexD]['is_all_day']" color="warning" vs-value="m-yes" @change="operationalHours">
                      <span slot="off"></span>
                    </vs-switch>
                  </vs-td>
                  <vs-td>
                    <vs-chip closable @click="remove(indexD, index)" color="#24c1a0" close-icon="close" v-for="(current, index) in data_local.operational_days_json[indexD]['val']" :key="index">
                      {{current}}
                    </vs-chip>
                  </vs-td>
                  <vs-td>
                    <feather-icon icon="PlusCircleIcon" svgClasses="h-6 w-6 text-success m-auto" style="top: 5px;left: 10px;" class="cursor-pointer w-full vx-col" @click="selectPopup(indexD)"/>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>        
          </div>
          <div class="w-full vx-col"> 
            <span class="text-danger text-sm"  v-show="errors.has('operational_days_json')">  
            {{ errors.first('operational_days_json') }}</span>  
          </div>
        </div>       
      </div>
    </div>    
    
    <vs-prompt 
    title="Select Operating Hours" 
    acceptText="Add New"
    @cancel="operationalHours"
    @accept="addNewOpHours"
    @close="operationalHours"
    :is-valid="op_start_time!==null && op_end_time!==null"
    :active.sync="popupActive2">
      <div class="vx-col w-full opHours">
        <div class="vx-row mb-base" style="height:150px;">          
          <div class="mt-4 w-1/2 vx-col">
            <v-select :options="optionHour" :reduce="val => val.id" label="val" v-validate="'required'" v-model="op_start_time" name="op_start_time" class="inputx" placeholder="Start time"/>
            <span class="text-danger text-sm"  v-show="errors.has('op_start_time')">{{ errors.first('op_start_time') }}</span>
          </div>   

          <div class="mt-4 w-1/2 vx-col">
            <v-select :options="optionHour" :reduce="val => val.id" label="val" v-validate="'required'" v-model="op_end_time" name="op_end_time" class="inputx" placeholder="End time"/>
            <span class="text-danger text-sm"  v-show="errors.has('op_end_time')">{{ errors.first('op_end_time') }}</span>
          </div>   
        </div>
      </div>
    </vs-prompt>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="vx-row mt-4">
    <div class="w-full vx-col">
      <label class="vs-input--label">Text Color*</label>
    </div>
    <div class="w-5/6 vx-col">            
      <vs-input class="w-full" v-model="data_local.amenity_f_color" type="text" v-validate="'required'" name="amenity_f_color"/>
      <span class="text-danger text-sm"  v-show="errors.has('amenity_f_color')">{{ errors.first('amenity_f_color') }}</span>
    </div>

    <div class="w-1/6 vx-col">
      <vs-input class="w-full cursor-pointer h-10 rounded-lg" v-model="data_local.amenity_f_color" type="color" v-validate="'required'" name="amenity_f_color"/>
    </div>
  </div> -->  
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import UpdateFile from '@/views/components/files/UploadFile.vue'
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
      hopErr: false,
      opStartTimeErr: false,
      opEndTimeErr: false,
      popupActive2: false,

      configdateFromTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true,
        minTime: "8:00",
        maxTime: "17:00",
        time_24hr: true
      },
      configdateToTimePicker: {
        enableTime: true,
        enableSeconds: false,
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

      optionMinHours: [
        { id:1, val: 'None' },
        { id:3, val: '30 Mins' },
        { id:5, val: '1 Hour' },
        { id:6, val: '2 Hours' },
        { id:7, val: '3 Hours' }
      ],

      optionMaxHours: [
        { id:1, val: 'None' },
        { id:3, val: '30 Mins' },
        { id:5, val: '1 Hour' },
        { id:6, val: '2 Hours' },
        { id:7, val: '3 Hours' },
        { id:8, val: '4 Hours' },
        { id:9, val: '5 Hours' },
        { id:10, val: '6 Hours' },
        { id:11, val: '7 Hours' },
        { id:12, val: '8 Hours' }
      ],

      optionBufferTime: [
        { id:1, val: 'None' },
        { id:3, val: '30 Mins' },
        { id:5, val: '1 Hour' },
        { id:6, val: '2 Hours' },
        { id:7, val: '3 Hours' },
        { id:8, val: '4 Hours' }
      ],

      optionBookingLimitUnit: [
        { id:1, name: 'Daily' },
        { id:2, name: 'Weekly' },
        { id:3, name: 'Monthly' },
        { id:4, name: 'Annual' }
      ],

      optionOperationalDays: [
        { id:0, name: 'Sunday' },
        { id:1, name: 'Monday' },
        { id:2, name: 'Tuesday' },
        { id:3, name: 'Wednesday' },
        { id:4, name: 'Thursday' },
        { id:5, name: 'Friday' },
        { id:6, name: 'Saturday' }
      ],

      optionHour: [],
      optionHours: [],
      operational_days: [],
      operational_hours: [      
        { id:1, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:2, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:3, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:4, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:5, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:6, val: [], op_start_time:[], op_end_time:[], is_all_day:false },
        { id:7, val: [], op_start_time:[], op_end_time:[], is_all_day:false }
      ],
      switchArray: [],
      selectedPopUpId: 0,
      op_start_time: null,
      op_end_time: null,


      files: [],
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      fileKey: [],
      filesDel: [],

      //reading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 31,

      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify(this.data)),

      statusOptions: [
        { label: 'Active',  value: 'active' },
        { label: 'Blocked',  value: 'blocked' },
        { label: 'Deactivated',  value: 'deactivated' }
      ],
      roleOptions: [
        { label: 'Admin',  value: 'admin' },
        { label: 'User',  value: 'user' },
        { label: 'Staff',  value: 'staff' }
      ]
    }
  },
  computed: {
    folderPath() {
      return `docs/amenity/gallery/${this.$route.params.editId}`
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
    remove(x, y) {
      this.data_local.operational_days_json[x]['op_start_time'].splice(y, 1)
      this.data_local.operational_days_json[x]['op_end_time'].splice(y, 1)
      this.data_local.operational_days_json[x]['op_start_time_id'].splice(y, 1)
      this.data_local.operational_days_json[x]['op_end_time_id'].splice(y, 1)
      this.data_local.operational_days_json[x]['val'].splice(y, 1)
      this.operationalHours()
    },
    checkOverlap(s, e){
      let objS = this.data_local.operational_days_json[this.selectedPopUpId]['op_start_time_id']
      let objE = this.data_local.operational_days_json[this.selectedPopUpId]['op_end_time_id']
      let objC = false

      for (const [key, value] of Object.entries(objS)) {
        for (let i = objS[key]; i <= (objE[key]-1); i++) { 
          console.log('i ', i)
          console.log('i === s ', i === s)
          objC = i === s ? true : objC
        }
      }
      
      return objC
    },
    operationalHours() {
      this.hopErr = true
      this.data_local.operational_days_json.filter((res) => {
        this.hopErr = res['val'].length > 0 ? false : this.hopErr
        this.hopErr = res['is_all_day'] === true ? false : this.hopErr
      })      

      this.opStartTimeErr = false
      this.opEndTimeErr = false
      this.errors.remove('operational_days_json')
      this.errors.remove('op_start_time')
      this.errors.remove('op_end_time')
      this.op_start_time = new Date()
      this.op_end_time = new Date()

      if (!this.hopErr) return
      this.errors.add({
        field: 'operational_days_json',
        msg: 'This field is required.'
      });
    },
    addNewOpHours() {   
      if (this.op_start_time == null || this.op_end_time == null) {
        this.opStartTimeErr = true
        this.opEndTimeErr = true
        return
      } else {
        this.opStartTimeErr = false
        this.opEndTimeErr = false
        this.hopErr = false 
        this.errors.remove('operational_days_json')

        if (this.checkOverlap(this.op_start_time, this.op_end_time)) {
          this.$vs.notify({
            color: 'danger',
            title: 'Data Saved',
            text: 'Choose different time'
          })
          return
        } 
      }

      if (this.op_start_time > this.op_end_time) {
        this.opStartTimeErr = false
        this.opEndTimeErr = false

        this.$vs.notify({
          color: 'danger',
          title: 'Data Saved',
          text: 'Start time is greater than End time'
        })    
        return    
      }

      if (this.op_start_time == this.op_end_time) {
        this.opStartTimeErr = false
        this.opEndTimeErr = false

        this.$vs.notify({
          color: 'danger',
          title: 'Data Saved',
          text: 'Start time should not be equal to End time'
        })    

        return    
      }

      this.op_start_time_id = this.op_start_time
      this.op_end_time_id = this.op_end_time

      this.optionHour.filter((res) => {
        this.op_start_time = this.op_start_time == res['id'] ? res['val'] : this.op_start_time
        this.op_end_time = this.op_end_time == res['id'] ? res['val'] : this.op_end_time
      })  

      var newOp = this.op_start_time + ' to ' + this.op_end_time
      var count = this.data_local.operational_days_json[this.selectedPopUpId]['val'].length 

      this.data_local.operational_days_json[this.selectedPopUpId]['val'][count] = newOp
      this.data_local.operational_days_json[this.selectedPopUpId]['op_start_time'][count] = this.op_start_time
      this.data_local.operational_days_json[this.selectedPopUpId]['op_end_time'][count] = this.op_end_time
      this.data_local.operational_days_json[this.selectedPopUpId]['op_start_time_id'][count] = this.op_start_time_id
      this.data_local.operational_days_json[this.selectedPopUpId]['op_end_time_id'][count] = this.op_end_time_id

      console.log('this.data_local.operational_days_json ', this.data_local.operational_days_json)

      this.popupActive2=false
      // this.onFromTimeChange(null, this.op_end_time, null)
      // this.op_start_time = this.op_end_time
      this.op_start_time = this.op_start_time_id + 1
      this.op_end_time = this.op_start_time + 1
      this.hopErr = false
    },
    selectPopup(id) {
      this.op_start_time = null
      this.op_end_time = null

      this.popupActive2=true
      this.selectedPopUpId = id
    },
    onFromTimeChange(selectedTime, timeStr, instance) {
      this.$set(this.configdateFromTimePicker, 'minTime', timeStr);     
      this.$set(this.configdateToTimePicker, 'minTime', timeStr);     
    },
    onFromChange(selectedDates, dateStr, instance) {
      this.$set(this.configTodateTimePicker, 'minDate', dateStr);
    },
    onToChange(selectedDates, dateStr, instance) {
      this.$set(this.configFromdateTimePicker, 'maxDate', dateStr);
    },
    changeOptionHours() {
      let bt = 60
      let ii = 0
      let hh = 0
      let id = 0
      let x = 0
      let xx = 0
      let yy = 0
      let zz = 0
      let zx = 0
      let tya = ''
      let tyb = ''

      for (let i = 8; i < 17; i++) {
        for (ii; ii < 60; ii=ii+bt) {
          hh = ii==0? '00':ii
          x = ii+bt
          xx = x == 60 ? '00' : x
          zz = xx == 60 ? i : i+1
          tya = i >= 12 ? 'PM' : 'AM'
          tyb = zz >= 12 ? 'PM' : 'AM'
          zx = i > 12 ? i-12 : i
          zz = zz > 12 ? zz-12 : zz
          yy = ('0' + zx).slice(-2)+':'+hh + tya + ' to ' + ('0' + zz).slice(-2)+':'+xx+ tyb
          this.optionHours.push({'id': id, 'name': yy})
          id++
        }
        ii = 0
      }
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },  
    submit() {  
      this.operationalHours()

      this.$validator.validateAll() 
      .then(result => { 
        if(result) {  
          this.save_changes() 
        } 
      })  
    },
    async save_changes () {
      try {
        if (!this.validateForm) return

        this.$vs.loading()
        const editId = this.$route.params.editId
        this.data_local.deposit_amount = parseFloat(this.data_local.deposit_amount).toFixed(2);
        await axios.post(`/amenity/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: `docs/amenity/gallery/${editId}`,
          folderId: 31
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
        this.$router.go(-1)
      } catch(err){
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
        this.$router.go(-1)
      } 
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    }, 
    async loadFreq() {
      const result = await axios.get(`/api/freq/list`, {
        headers: { 
          'Authorization': this.token, 
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      this.optionBookingLimitUnit = result['data']
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
    }   
  },
  created () {
    try {
      this.changeOptionHours()
      this.loadFreq()
      this.loadHour()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Amenity Page',
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
<style lang="scss">
  div.vs-con-input input[type=color] {
    padding: 0px !important;
    height: 2.5rem !important;
    border-radius: 5px;
  }

  div.opHours input.danger {
    border: 1px solid red;
  }

  div.am-op-st input.flatpickr-input {
    width: 100px; 
  }

  div.hours-of-operation {
    border: 1px solid red;
  }

  div.opHours ul.vs__dropdown-menu {
    height: 200px;
  }  
</style>
