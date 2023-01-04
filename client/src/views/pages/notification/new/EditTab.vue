<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full mt-4">
        <label class="vs-input--label">Template</label>
        <v-select :options="optionNotificationTemplate" :reduce="title => title.id" label="title" @change="selectTemplate($event)" @input="selectTemplate($event)" v-model="data_local.notification_template_id" name="notification_template_id"/>
        <span class="text-danger text-sm"  v-show="errors.has('notification_template_id')">{{ errors.first('notification_template_id') }}</span>

        <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title"  v-validate="'required'" name="title" />
        <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>

        <vs-textarea height="200px"  class="w-full mt-4" label="Message" v-model="data_local.message" v-validate="'required'" name="message" />
        <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
      </div>

      <div class="vx-col md:w-1/2 w-full mt-4">
        <label class="vs-input--label">Repeat</label>
        <div class="vx-row">
          <div class="vx-col w-full">
              <div class="flex flex-wrap mt-1 mb-6">
                <vs-radio  v-model="data_local.isRepeat" vs-value="1" class="mr-4 mb-2">Yes</vs-radio >
                <vs-radio  v-model="data_local.isRepeat" vs-value="2" class="mr-4 mb-2">No</vs-radio >
              </div>

              <div v-if="data_local.isRepeat == 1">                
                <div class="mt-4">
                  <label class="vs-input--label">Start Date and Time</label><br>
                  <flat-pickr :config="configETA" v-model="data_local.start_date" class="mr-2 mb-2 flatpickr-input w-full" name="start_date" v-validate="'required'" />
                  <span class="text-danger text-sm"  v-show="errors.has('start_date')">{{ errors.first('start_date') }}</span>
                </div>

                <div class="mt-4" v-if="data_local.isRepeat == 1">
                  <label class="vs-input--label">Repeats On</label>
                  <v-select :options="optionNotificationRepeat" :reduce="label => label.id" label="label" v-validate="'required'" v-model="data_local.repeat_type" name="repeat_type"/>
                  <span class="text-danger text-sm"  v-show="errors.has('repeat_type')">{{ errors.first('repeat_type') }}</span>
                </div>

                <!-- <div class="flex flex-wrap mt-4" v-if="data_local.repeat_type == 1">
                  <vs-button radius color="dark" type="border" icon-pack="feather" class="mr-2" style="height:40px;width:40px;" v-model="data_local.recurDay">S</vs-button>
                  <vs-button radius color="dark" type="border" icon-pack="feather" class="mr-2" style="height:40px;width:40px;" v-model="data_local.recurDay">M</vs-button>
                </div> -->

                  <ul :class="{'flex':true, 'flex-wrap':true, 'mt-8':true, 'p-2':true, 'danger':repeatDayErr}" v-if="data_local.repeat_type == 1">
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="0">Sunday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="1">Monday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="2">Tuesday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="3">Wednesday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="4">Thursday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="5">Friday</vs-checkbox>
                    </li>
                    <li>
                      <vs-checkbox v-model="data_local.repeatDay" vs-value="6">Saturday</vs-checkbox>
                    </li>
                  </ul>

                  <div class="mt-5">
                    <label class="vs-input--label">End Date and Time</label><br>
                    <flat-pickr :config="configETA" v-model="data_local.end_date" class="mr-2 mb-2 flatpickr-input w-full" name="end_date" v-validate="'required'"/>
                    <span class="text-danger text-sm"  v-show="errors.has('end_date')">{{ errors.first('end_date') }}</span>
                  </div>
              </div>
          </div>          
        </div>

        <vs-divider class="mt-8"></vs-divider>

        <label class="vs-input--label">Files</label>
        <div class="vx-row">
          <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">      
      <div class="vx-col w-1/2">
        <div class="flex items-end md:mt-8 mb-4">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Recipients Category</span>
        </div>
        <vs-tabs>
          <vs-tab label="Resident" @click="selectRecipientType(1)">
            <vs-table multiple v-model="selected" @selected="handleSelected" pagination max-items="10" search :data="optionUser" :class="{'mt-4':true, 'danger':selectedErr}">
              <template slot="thead">
                <vs-th style="padding:0px; font-weight: normal;">Select All</vs-th>
                <vs-th sort-key="unit_number">Unit Number</vs-th>
                <vs-th sort-key="first_name">First</vs-th>
                <vs-th sort-key="last_name">Last</vs-th>
                <vs-th sort-key="email">Email</vs-th>                
                <vs-th sort-key="id">User Type</vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  
                  <vs-td></vs-td>
                  <vs-td :data="data[indextr]">
                    {{ data[indextr]['unit_number'] }}
                  </vs-td>

                  <vs-td :data="data[indextr].first_name">
                    {{ data[indextr].first_name }}
                  </vs-td>

                  <vs-td :data="data[indextr].last_name">
                    {{ data[indextr].last_name }}
                  </vs-td>

                  <vs-td :data="data[indextr].email">
                    {{ data[indextr].email }}
                  </vs-td>

                  <vs-td :data="data[indextr]['user_org_role_name'] ">
                    {{ data[indextr]['user_org_role_name'] }}
                  </vs-td>

                </vs-tr>
              </template>
            </vs-table>    
          </vs-tab>

          <vs-tab label="User Type" @click="selectRecipientType(2)">
            <vs-table multiple v-model="selected" @selected="handleSelected" pagination max-items="10" search :data="optionUserType" :class="{'mt-4':true, 'danger':selectedErr}">
              <template slot="thead">
                <vs-th style="padding:0px; font-weight: normal;">Select All</vs-th>
                <!-- <vs-th sort-key="parent_name">Parent User Type</vs-th> -->
                <vs-th sort-key="name">User Type</vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  
                  <vs-td></vs-td>
                  <!-- <vs-td :data="data[indextr].parent_name">
                    {{ data[indextr].parent_name[0].name === undefined ? data[indextr].parent_name : data[indextr].parent_name[0].name }}
                  </vs-td> -->

                  <vs-td :data="data[indextr].name">
                    {{ data[indextr].name }}
                  </vs-td>

                </vs-tr>
              </template>
            </vs-table>    
          </vs-tab>
        </vs-tabs>

      </div>
      <div class="vx-col w-1/2">
        <div class="flex items-end md:mt-8 mb-4">
          <feather-icon icon="UsersIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Selected Recipient</span>
        </div>
        <vs-tabs>
          <vs-tab label="Review recipients">
            <vs-table multiple v-model="selected" pagination max-items="10" search :data="selected" :class="{'mt-4':true, 'danger':selectedErr}">
              <template slot="thead">
                <vs-th style="padding:0px; font-weight: normal;">Select All</vs-th>
                <vs-th sort-key="user_type" v-if="data_local.recipient_type === 2">User Type</vs-th>
                <vs-th sort-key="unit_number" v-if="data_local.recipient_type === 1">Unit Number</vs-th>
                <vs-th sort-key="first_name" v-if="data_local.recipient_type === 1">First Name</vs-th>
                <vs-th sort-key="last_name" v-if="data_local.recipient_type === 1">Last Name</vs-th>
                <vs-th sort-key="email" v-if="data_local.recipient_type === 1">Email</vs-th>                
              </template>

              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  
                  <vs-td></vs-td>

                  <vs-td :data="data[indextr].name" v-if="data_local.recipient_type === 2">
                    {{ data[indextr].name }}
                  </vs-td>

                  <vs-td :data="data[indextr]" v-if="data_local.recipient_type === 1">
                    {{ data[indextr]['unit_number'] }}
                  </vs-td>

                  <vs-td :data="data[indextr].first_name" v-if="data_local.recipient_type === 1">
                    {{ data[indextr].first_name }}
                  </vs-td>

                  <vs-td :data="data[indextr].last_name" v-if="data_local.recipient_type === 1">
                    {{ data[indextr].last_name }}
                  </vs-td>

                  <vs-td :data="data[indextr].email" v-if="data_local.recipient_type === 1">
                    {{ data[indextr].email }}
                  </vs-td>

                </vs-tr>
              </template>
            </vs-table>  
          </vs-tab>  
        </vs-tabs>
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit" :disabled="!validateForm">Send Notification</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import common from '@/common'
import EventBus from '@/EventBus'
import ReadFile from '@/views/components/files/ReadFile.vue'
const today = new Date()
var formatedD = common.formatDate(today)

export default {
  components: {
    vSelect,
    flatPickr,
    ReadFile
  },

  data () {    
    return {
      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 24,
      folderPath: '',

      optionNotificationRepeat: [
        { label: 'Weekly',  id: 1 },
        { label: 'Monthly',  id: 2 },
        { label: 'Annual',  id: 3 },
      ],      
      configETA: {
        minuteIncrement: 1,
        minDate: new Date(),
        maxDate: null, 
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        // "disable": [
        //     function(date) {
        //         // return true to disable
        //         return (date.getDay() === 0 || date.getDay() === 6);
        //     }
        // ],
        // defaultDate: [new Date()]
      },
      configdateTimePicker: {
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

      selected: [],
      selectedErr: false,
      'tableList': [
        'vs-th: Component',
        'vs-tr: Component',
        'vs-td: Component',
        'thread: Slot',
        'tbody: Slot',
        'header: Slot'
      ],

      optionNotificationTemplate: [],
      optionUser: [],
      optionUserType: [],

      token: localStorage.usertoken,

      //notification
      data_local: {
        message: '',
        title: '',
        notification_template_id: null,
        isRepeat: 2,
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        repeatDay: [],
        repeat_type: null,
        property_ref: '',
        recipient_type: 1
      },
      repeatDayErr: false,

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
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    handleSelected(tr) {
      console.log('handleSelected(tr) ', tr)
      console.log('selected ', this.selected)
    },
    selectRecipientType(id) {
      this.selected = []
      this.data_local.recipient_type = id
      console.log('this.data_local.recipient_type ', this.data_local.recipient_type)
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    submit() {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes()
        }
      })
    },
    async save_changes () {
      try {  
        this.data_local.user_id = []
        this.data_local.start_time = this.data_local.start_date
        this.data_local.end_time = this.data_local.end_date

        if (this.data_local.repeat_type == 1 && this.data_local.repeatDay.length === 0) {
          this.$vs.notify({
            color: 'danger',
            title: 'Saving Data',
            text: 'Please select at least one day'
          })
          this.repeatDayErr = true
          return false
        }

        if (this.selected.length === 0) {
          this.$vs.notify({
            color: 'danger',
            title: 'Saving Data',
            text: 'Please select User Email'
          })
          this.selectedErr = true
          return false
        }

        for (var key in this.selected) {
          this.data_local.user_id.push(this.selected[key]['id'])
        }

        if (!this.validateForm) return
        this.data_local.property_ref = localStorage.selectedPropertyRef
        this.data_local.createdAt = common.formatDate2(new Date())
        this.data_local.updatedAt = common.formatDate2(new Date())

        const editId = -1
        this.$vs.loading()
        await axios.post(`/notification/save/${editId}`,
          { data: this.data_local }, 
          { headers: { 'Authorization': this.token } },
        ) 

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'Thank you, your notification has been successfully sent!'
        })
        
        setTimeout(async () => { this.$vs.loading.close() },1000)
        this.$router.go(-1)
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      //notification
      this.data_local['message'] = ''
      this.data_local['title'] = ''
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    selectTemplate(event) {
      this.$vs.loading()
      let nt = this.optionNotificationTemplate.filter(x => x.id === event)

      this.data_local.title = nt[0]['title']
      this.data_local.message = nt[0]['message']
      this.folderPath = `docs/notification-template/gallery/${this.data_local.notification_template_id}`
      setTimeout(async () => { this.$vs.loading.close() },1000)
    },    
    async loadNotificationTemplate() { 
      this.$vs.loading()
      const result = await axios.get(`/notificationTemplate/list`, {
          headers: { 'Authorization': this.token, 'property_ref': localStorage.selectedPropertyRef }
      })

      this.optionNotificationTemplate = result['data'] 
      this.data_local.notification_template_id = null
      this.data_local.title = null
      this.data_local.message = null
      setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    async loadUser () {
      const result = await axios.get(`/user/list`, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': this.token 
        },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'type': 'non-overflow',
          'is_deleted': false,
        }
      })

      this.optionUser = result['data']
      setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    async loadUserType () {
      const result = await axios.get(`/role/list`, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': this.token 
        },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal,
          'type': 'non-overflow'
        }
      })

      this.optionUserType = result['data'] 
    }
  },
  async created () {
    try {
      await this.loadNotificationTemplate()
      await this.loadUser()
      await this.loadUserType()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Notification New Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  }, 
  mounted () {    
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== '/notifications/new') return
      console.log('/notifications/new')
      await this.loadUser()
      await this.loadUserType()
      await this.loadNotificationTemplate()
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== '/notifications/new') return
      console.log('/notifications/new')
      await this.loadUser()
      await this.loadUserType()
      await this.loadNotificationTemplate()
    })  
  }
}
</script>

<style lang="scss">
  div.vel-img-modal.vel-modal[data-v-1f17a952] {
    z-index: 100000 !important;
  }

  .danger {
    border: 1px solid red
  }
</style>