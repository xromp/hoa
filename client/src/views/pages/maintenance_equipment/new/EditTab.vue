<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Device Information</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">
            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Device Name" v-model="data_local.device_name" type="device_name" v-validate="'required'" name="device_name" />
              <span class="text-danger text-sm"  v-show="errors.has('device_name')">{{ errors.first('device_name') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Category</label>
              <v-select v-validate="'required'" :options="optionVendorCategoryMaster" :reduce="name => name.name" label="name" v-model="data_local.category" name="category"/>
              <span class="text-danger text-sm"  v-show="errors.has('category')">{{ errors.first('category') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Components</label>
              <v-select multiple :options="optionEquipment" :reduce="device_name => device_name.id" label="device_name" v-model="data_local.components" name="components"/>
              <span class="text-danger text-sm"  v-show="errors.has('components')">{{ errors.first('components') }}</span>
              <span class="text-danger text-sm"  v-show="errors.has('components')">{{ errors.first('components') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Files" v-model="data_local.files" type="files" name="files" />
              <span class="text-danger text-sm"  v-show="errors.has('files')">{{ errors.first('files') }}</span>
            </div>

            <div class="mt-4">
              <label class="vs-input--label">Serviced By</label>
              <v-select :options="optionVendor" :reduce="email => email.id" label="email" v-model="data_local.serviced_by" name="serviced_by"/>
              <span class="text-danger text-sm"  v-show="errors.has('serviced_by')">{{ errors.first('serviced_by') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Model No" v-model="data_local.model_no" type="model_no" name="model_no" />
              <span class="text-danger text-sm"  v-show="errors.has('model_no')">{{ errors.first('model_no') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Part No" v-model="data_local.part_no" type="part_no" name="part_no" />
              <span class="text-danger text-sm"  v-show="errors.has('part_no')">{{ errors.first('part_no') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Unit Price" v-model="data_local.unit_price" type="unit_price" name="unit_price" />
              <span class="text-danger text-sm"  v-show="errors.has('unit_price')">{{ errors.first('unit_price') }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">

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
              <div v-if="files.length > 0" v-for="(item, file) in files" :id="fileKey[file]">
                <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 12px;left: 82px;color: #ea5455;" class="cursor-pointer" @click="deleteImage(fileKey[file], file)" v-if="roleVal != 'vendor'"/>
                <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 12px;left: 82px;color: #gray;" class="cursor-not-allowed" v-else-if="roleVal == 'vendor'"/>
                <img :src="item" class="mr-8 rounded h-24 w-24" />  
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

        <!-- Col Header -->
          <div class="flex items-end md:mt-4">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Reminders</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Service Reminders" v-model="data_local.service_reminders" type="date" name="service_reminders" />
              <span class="text-danger text-sm"  v-show="errors.has('service_reminders')">{{ errors.first('service_reminders') }}</span>
            </div>

            <div class="mt-4">
              <vs-textarea class="w-full mt-4" label="Notes" v-model="data_local.notes" type="notes" name="notes" />
              <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Location</span>
        </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Location Name" v-model="data_local.location_name" type="location_name" name="location_name" />
              <span class="text-danger text-sm"  v-show="errors.has('location_name')">{{ errors.first('location_name') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Location Description" v-model="data_local.location_description" type="location_description" name="location_description" />
              <span class="text-danger text-sm"  v-show="errors.has('location_description')">{{ errors.first('location_description') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Longtitude" v-model="data_local.longtitude" type="longtitude" name="longtitude" />
              <span class="text-danger text-sm"  v-show="errors.has('longtitude')">{{ errors.first('longtitude') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Latitude" v-model="data_local.latitude" type="latitude" name="latitude" />
              <span class="text-danger text-sm"  v-show="errors.has('latitude')">{{ errors.first('latitude') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Input Location" v-model="data_local.input_location" type="input_location" name="input_location" />
              <span class="text-danger text-sm"  v-show="errors.has('input_location')">{{ errors.first('input_location') }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Warranty</span>
          </div>

        <!-- Col Content -->
        <div>
          <div class="vx-col w-full">

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Warranty Start" v-model="data_local.warranty_start" type="date" name="warranty_start" />
              <span class="text-danger text-sm"  v-show="errors.has('warranty_start')">{{ errors.first('warranty_start') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Warranty End" v-model="data_local.warranty_end" type="date" name="warranty_end" />
              <span class="text-danger text-sm"  v-show="errors.has('warranty_end')">{{ errors.first('warranty_end') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Standard Warranty" v-model="data_local.standard_warranty" type="date" name="standard_warranty" />
              <span class="text-danger text-sm"  v-show="errors.has('standard_warranty')">{{ errors.first('standard_warranty') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Extended Warranty" v-model="data_local.extended_warranty" type="date" name="extended_warranty" />
              <span class="text-danger text-sm"  v-show="errors.has('extended_warranty')">{{ errors.first('extended_warranty') }}</span>
            </div>

            <div class="mt-4">
              <vs-input class="w-full mt-4" label="Expiration Reminder" v-model="data_local.expiration_reminder" type="date" name="expiration_reminder" />
              <span class="text-danger text-sm"  v-show="errors.has('expiration_reminder')">{{ errors.first('expiration_reminder') }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>    

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit('a')" :disabled="!validateForm">Save and New</vs-button>
          <vs-button class="ml-4 mt-2" @click="submit('b')" :disabled="!validateForm">Save and Close</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '../../../../axios'

export default {
  components: {
    vSelect
  },
  data () {
    return {
      files: [],
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      fileKey: [],
      filesDel: [],

      roleVal:'',

      token: localStorage.usertoken,

      optionVendor: [],
      optionVendorCategoryMaster: [],
      optionEquipment: [],
      
      //equipment
      data_local: {
        device_name: '',
        service_reminders: '',
        category: '',
        files: '',
        serviced_by: '',
        model_no: '',
        part_no: '',
        unit_price: '',
        location_name: '',
        location_description: '',
        longtitude: '',
        latitude: '',
        input_location: '',
        warranty_start: '',
        warranty_end: '',
        standard_warranty: '',
        extended_warranty: '',
        expiration_reminder: '',
        notes: '',
        createdAt: '',
        updatedAt: ''
      }, 

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
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
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
    save_changes (loc) {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = -1
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/equipment/save/${editId}`, {
              data: this.data_local,
              token: this.token
            })
            .then(res => {    
              if(res['data'] != 'access_denied' && res['data'] != '') {

                //uploading docs
                if(res['data']['message'] == 'success') {
                  //uploading docs
                  this.resDataLocal = res['data']['result']

                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully saved'
                  })

                  if (loc=='a') {
                    setTimeout(() => {
                      window.location.href = "/equipments/new";
                    },500)
                  } else {
                    // this.$router.push({name:'app-equipment-list'})
                  }
                  
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
                this.$router.push({name:'app-equipment-list'})
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
              id: this.resDataLocal.id,
              path: `docs/maintenance-equipment/gallery/${this.resDataLocal.id}`,
              folderId: 8
            })

            this.$router.push({name:'app-equipment-list'})
        } catch(err) {
          reject(err.toString('utf8'));
        }      

      }) 
    },
    reset_data () {
      //equipment
      this.data_local['device_name'] = ''
      this.data_local['service_reminders'] = ''
      this.data_local['category'] = ''
      this.data_local['files'] = ''
      this.data_local['serviced_by'] = ''
      this.data_local['model_no'] = ''
      this.data_local['part_no'] = ''
      this.data_local['unit_price'] = ''
      this.data_local['location_name'] = ''
      this.data_local['location_description'] = ''
      this.data_local['longtitude'] = ''
      this.data_local['latitude'] = ''
      this.data_local['input_location'] = ''
      this.data_local['warranty_start'] = ''
      this.data_local['warranty_end'] = ''
      this.data_local['standard_warranty'] = ''
      this.data_local['extended_warranty'] = ''
      this.data_local['expiration_reminder'] = ''
      this.data_local['notes'] = ''
      
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
    loadOptionEquipment () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/part/list`, {
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
        console.log('res loadOptionEquipment ', res)
        this.optionEquipment = res
      })
    }, 
  },
  created () {
    this.loadVendor()
    this.loadVendorCategoryMaster()
    this.loadOptionEquipment()
  }
}
</script>
