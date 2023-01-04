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
              <vs-input class="w-full mt-4" label="Organization" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
              <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Issued By" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
              <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Location" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Issued Date" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Send Questions By" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div>             

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Due By" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div>             

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Decision By" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div>     

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Subject" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div>         

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Overview" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Scope of Work" v-model="data_local.location" type="location" v-validate="'required'" name="location" />
              <span class="text-danger text-sm"  v-show="errors.has('location')">{{ errors.first('location') }}</span>
            </div> 

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
              <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
            </div>  -->

            <!-- <div class="mt-4">
              <vs-textarea class="w-full mt-4" label="Description" v-model="data_local.description" v-validate="'required'" name="description" />
              <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
            </div> -->            

            <!-- <div class="mt-4">
              <label class="vs-input--label">Urgency</label>
              <v-select :options="optionUrgency" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.urgency" name="urgency"/>
              <span class="text-danger text-sm"  v-show="errors.has('urgency')">{{ errors.first('urgency') }}</span> 
            </div> -->

            <!-- <div class="mt-4" v-if="roleVal == 'admin'">
              <label class="vs-input--label">Maintenance Type</label>
              <v-select :options="optionMaintenanceType" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.maintenance_type_id" name="maintenance_type_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('maintenance_type_id')">{{ errors.first('maintenance_type_id') }}</span>
            </div> -->

            <!-- <div class="mt-4" v-if="roleVal == 'admin'">
              <label class="vs-input--label">Vendor Category</label>
              <v-select :options="optionVendorCategoryMaster" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.vendor_category_id" name="vendor_category_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('vendor_category_id')">{{ errors.first('vendor_category_id') }}</span>
            </div> -->

            <!-- <div class="vx-row" v-if="roleVal == 'admin'">
              <div class="vx-col w-full mt-5">
                  <label class="text-sm">Assigned To</label>
                  <div class="flex flex-wrap mt-2" @click="clearSelectAssign()">
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="1" value="1" class="mr-4">Staff</vs-radio >
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="2" value="2" class="mr-4">RFP</vs-radio >
                    <vs-radio v-model="data_local.assigned_to_type" vs-value="3" value="3" class="mr-4">No Action</vs-radio >
                  </div>
              </div>
            </div> -->

            <!-- <div class="mt-4" v-if="data_local.assigned_to_type == 1">          
              <v-select multiple :closeOnSelect="true" :options="optionStaff" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.assigned_to" name="assigned_to"/>
              <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
            </div> -->

            <!-- <div class="mt-4" v-if="data_local.assigned_to_type == 2">          
              <v-select multiple :closeOnSelect="true" :options="optionVendor" :reduce="business_name => business_name.id" label="business_name" v-validate="'required'" v-model="data_local.assigned_to" name="assigned_to"/>
              <span class="text-danger text-sm"  v-show="errors.has('assigned_to')">{{ errors.first('assigned_to') }}</span>
            </div> -->

            <!-- <div class="mt-4" v-if="roleVal == 'admin'">
              <label class="vs-input--label">Estimated Date and Time</label><br>
              <flat-pickr :config="configETA" v-model="data_local.eta_dt" placeholder="dd-mm-yyyy hh:mm" :class="{'cursor-not-allowed': roleVal == 'vendor', 'mr-2':true, 'mb-2':true, 'flatpickr-input':true }" :disabled="roleVal == 'vendor'"/>
            </div> --> 

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Resolved Date" v-model="data_local.resolved_date" type="date" v-validate="'required'" name="resolved_date" />
              <span class="text-danger text-sm"  v-show="errors.has('resolved_date')">{{ errors.first('resolved_date') }}</span>
            </div> -->

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Other Value" v-model="data_local.m_type_other_value" type="m_type_other_value" v-validate="'required'" name="m_type_other_value" />
              <span class="text-danger text-sm"  v-show="errors.has('m_type_other_value')">{{ errors.first('m_type_other_value') }}</span>
            </div> -->

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Rfp Type" v-model="data_local.rfp_type" type="rfp_type" v-validate="'required'" name="rfp_type" />
              <span class="text-danger text-sm"  v-show="errors.has('rfp_type')">{{ errors.first('rfp_type') }}</span>
            </div> -->

            <!-- <div class="mt-4">
              <vs-input class="w-full mt-4" label="Is Seen" v-model="data_local.is_seen" type="is_seen" v-validate="'required'" name="is_seen" />
              <span class="text-danger text-sm"  v-show="errors.has('is_seen')">{{ errors.first('is_seen') }}</span>
            </div> -->

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <!-- <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="FolderIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Files</span>
        </div> -->

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <!-- <div class="mt-4">
              <label class="vs-input--label">User Email</label>
              <v-select :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.user_id" name="user_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
            </div> -->

            <!-- <div class="mt-4">
              <label class="vs-input--label">Building</label>
              <v-select :options="optionBuilding" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.building_id" name="building_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('building_id')">{{ errors.first('building_id') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Property</label>
              <v-select :options="optionProperty" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.property_id" name="property_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Unit</label>
              <v-select :options="optionUnit" :reduce="number => number.id" label="number" v-validate="'required'" v-model="data_local.unit_id" name="property_id"/>
              <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>  
            </div> -->

          </div>
        </div>

         <!-- Col Header -->
        <div class="flex items-end md:mt-4 mt-base">
          <feather-icon icon="FolderIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Files</span>
        </div>

        <!-- Col Content -->
        <div class="vx-row">

          <div class="vx-col w-full">
            <!-- uploading docs -->
            <div class="flex items-start flex-col sm:flex-row">
              <div v-if="files.length > 0" v-for="(item, file) in files">
                <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 12px;left: 82px;color: #ea5455;" class="cursor-pointer" @click="deleteImage(file)"/>
                <img :src="item" class="mt-4 mr-8 rounded h-24 w-24" />  
              </div>
              <p v-if="files.length ==0" class="mt-2">No files uploaded</p>
            </div>

            <div class="flex items-start flex-col sm:flex-row">
              
              <!-- <vs-avatar :src="data_localavatar" size="80px" class="mr-4" /> -->
              <!-- uploading docs -->
              <div class="mt-4">            
                <input type="file" multiple="multiple" id="fileD" class="hidden" ref="update_avatar_input" @change="update_avatar" accept="image/*">

                <vs-button type="border" class="mr-4" @click="$refs.update_avatar_input.click()">Upload Files</vs-button>
              </div>

            </div>
            
          </div>
        </div>

        <!-- Col Content -->
        <div class="vx-row">
          <div class="vx-col w-full">
            <div class="flex items-end md:mt-8">
              <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="w-5 h-5" />
              <span class="leading-none font-medium">Availability</span>
            </div>

            <div class="mt-2 d-inline">
              <label v-if="data_local.maintenance_request_dts.length == 0">No selected date and time</label>
              <label class="vs-input--label" v-if="data_local.maintenance_request_dts.length != 0">Select Date and Time</label><br>
              <div class="dt-available mb-4" v-for="(dt, key) in data_local.maintenance_request_dts">
                <flat-pickr :config="configFromdateTimePicker" v-model="dt.start_date" placeholder="From Date" @on-change="onFromChange" class="mr-2"/>
                <flat-pickr :config="configdateFromTimePicker" @on-change="onFromTimeChange" v-model="dt.start_time" placeholder="Start time" class="mr-2"/>
                <flat-pickr :config="configdateToTimePicker" v-model="dt.end_time" placeholder="End time" />
                <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 5px;left: 10px;color: #ea5455;" class="cursor-pointer" @click="deleteDt(key)"/>
              </div>
            </div>

            <div class="mt-4">          
              <vs-button type="border" class="mr-4" @click="addDt">Add Date and Time</vs-button>
            </div>

            <div class="flex items-end mt-4 md:mt-8 ">
              <feather-icon icon="EditIcon" class="mr-2" svgClasses="w-5 h-5" />
              <span class="leading-none font-medium">Notes</span>
            </div>

            <div class="mt-4">
              <vs-textarea height="200px" class="w-full mt-4" label="" v-model="data_local.notes" type="notes" v-validate="'required'" name="notes" />
              <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '../../../../axios'
const jwt = require('jsonwebtoken')
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  components: {
    vSelect,
    flatPickr
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
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      fileKey: [],
      filesDel: [],

      configETA: {
        minDate: new Date(),
        maxDate: null, 
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        "disable": [
            function(date) {
                // return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);

            }
        ]
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

      roleVal:'',
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
      ]
    }
  },
  computed: {
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
    onFromChange(selectedDates, dateStr, instance) {
      this.$set(this.configTodateTimePicker, 'minDate', dateStr);
    },
    onToChange(selectedDates, dateStr, instance) {
      this.$set(this.configFromdateTimePicker, 'maxDate', dateStr);
    },
    clearSelectAssign() {
      console.log('clearSelectAssign')
      this.data_local.assigned_to = ''
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async loadData () {
      const editId = this.$route.params.editId
      try {    
          this.files = []
          //reading docs
          this.tableRead = await axios.post(`/docs/table/read/`, {
            token: this.token,
            path: `docs/maintenance-request/gallery/${editId}`,
            document_folder_id: 7
          })

          //reading docs
          for (const [key, value] of Object.entries(this.tableRead.data.uploadedD)) {
            var imgB64 = this._arrayBufferToBase64( value.data.Body.data )
            var imgAsc = imgB64.toString('ascii')
            this.files.push("data:image/png;base64, " + imgAsc)
            this.fileKey.push(value.key)
          }

      } catch(err) {
        console.log(err.toString('utf8'));
      }
    },
    deleteImage(f, k) {
      // document.getElementById(f).style.display = 'none';
      console.log('f ', f)
      console.log('k ', k)
      this.$delete(this.fileKey, k)
      this.$delete(this.files, k)
      this.$delete(this.rawFiles, k)
      this.filesDel.push(f)

      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })
    },
    async loadUserPem() {
      var decoded = jwt.verify(this.token, 'secret')  
      const viewId = decoded.id
      var d = await axios.get(`/user/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      }) 
      const userD = d['data'][0]['user_role']['val']
      this.roleVal = userD

      console.log('this.roleVal ', this.roleVal)
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = this.$route.params.editId
      const userAllData = JSON.parse(localStorage.userAllData)

      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/maintenance/save/${editId}`, {
            data: this.data_local,
            token: this.token,
            business_name: this.roleVal == 'admin' ? '' : userAllData['vendor']['business_name']
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
                // this.$router.push({name:'app-maintenance-view', params: {viewId: editId }})
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
              this.$router.push({name:'app-maintenance-view', params: {viewId: editId }})
            }

          })
          .catch(err => {
            this.$vs.notify({
              color: 'danger',
              title: 'Data Saving Error',
              text: 'The selected data was not saved'
            })
          }) 

          // save maintenance dt
          await axios.post(`/maintenance/dt/save/${editId}`, {
            data: this.data_local.maintenance_request_dts,
            token: this.token,
          })

          // uploading docs
          await axios.post(`/docs/table/save`, {
            rawFiles: this.rawFiles,
            token: this.token,
            id: editId,
            path: `docs/maintenance-request/gallery/${editId}`,
            folderId: 5
          })

          // delete docs
          await axios.post(`/docs/table/delete`, {
            data: this.filesDel,
            token: this.token
          })

          this.$router.push({name:'app-maintenance-list'})

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
    //uploading docs
    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    //uploading docs
    async update_avatar () {
      this.$vs.loading()
      var formdata = new FormData();
      $.each($('#fileD')[0].files, function(i, file) {
        formdata.append('fileD_'+i, file);
      });
      formdata.append('token', this.token)

      this.resUp = await axios.post(`/docs/upload`,  
        formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
      )

      for (const [key, value] of Object.entries(this.resUp.data.rawD)) {
        var imgB64 = this._arrayBufferToBase64( value.data.data )
        var imgAsc = imgB64.toString('ascii')
        this.files.push("data:image/png;base64, " + imgAsc)
      }

      if (this.resUp.data.uploadedD.length > 1) {
        for (const [key, value] of Object.entries(this.resUp.data.uploadedD)) {
          this.rawFiles.push(value)
        }
      } else {
        this.rawFiles[0] = this.resUp.data.uploadedD
      }

      setTimeout(() => {
        this.$vs.loading.close()
      }, 2000)
    },
    loadMaintenanceType () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/maintenanceType/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res maintenanceType ', res)
        this.optionMaintenanceType = res
      })
    },
    loadVendorCategoryMaster () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/vendorCategoryMaster/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadVendorCategoryMaster ', res)
        this.optionVendorCategoryMaster = res
      })
    },
    loadVendor () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/vendor/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadVendor ', res)
        this.optionVendor = res
      })
    },
    loadStaff () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/staff/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadStaff ', res)
        this.optionStaff = res
      })
    },
    loadUser () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/user/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadUser ', res)
        this.optionUser = res
      })
    },
    loadBuilding () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/building/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadBuilding ', res)
        this.optionBuilding = res
      })
    },
    loadProperty () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/property/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadProperty ', res)
        this.optionProperty = res
      })
    },
    loadUnit () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/unit/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadUnit ', res)
        this.optionUnit = res
      })
    },
    loadRequestStatus () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/requestStatus/list`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              resolve(res['data'])
            })
            .catch(err => {
              reject(err.toString('utf8'));
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }  
      })

      d.then((res) => {
        console.log('res loadRequestStatus ', res)
        this.optionRequestStatus = res
      })
    }
  },
  created () {
    this.loadUserPem()
    this.loadMaintenanceType()
    this.loadVendorCategoryMaster()
    this.loadVendor()
    this.loadUser()
    this.loadBuilding()
    this.loadProperty()
    this.loadUnit()
    this.loadRequestStatus()
    this.loadStaff()
    this.loadData()

    // this.data_local['assigned_to_type'] = 2
  }  
}
</script>
