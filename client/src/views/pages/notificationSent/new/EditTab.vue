<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full mt-4">
        <label class="vs-input--label">Template</label>
        <v-select :options="optionNotificationTemplate" :reduce="title => title.id" label="title" v-validate="'required'" @change="selectTemplate($event)" @input="selectTemplate($event)" v-model="data_local.notification_message_id" name="notification_message_id"/>
        <span class="text-danger text-sm"  v-show="errors.has('notification_message_id')">{{ errors.first('notification_message_id') }}</span>

        <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title"  v-validate="'required'" name="title" />
        <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>

        <vs-textarea height="200px"  class="w-full mt-4" label="Message" v-model="data_local.message" v-validate="'required'" name="message" />
        <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <label class="vs-input--label">User Email</label>
          <v-select multiple :options="optionUser" :reduce="email => email.id" label="email" v-validate="'required'" v-model="data_local.user_id" name="user_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('user_id')">{{ errors.first('user_id') }}</span>
        </div>
      </div>
    </div>
    
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
      optionNotificationTemplate: [],
      optionUser: [],

      token: localStorage.usertoken,

      //notification
      data_local: {
        message: '',
        title: '',
        notification_message_id: null
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
    submit() {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes()
        }
      })
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = -1
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/notification/save/${editId}`,
              { data: this.data_local }, 
              { headers: { 'Authorization': this.token } },
            )
            .then(res => {    
              if(res['data'] != 'access_denied' && res['data'] != '') {

                if(res['data']['message'] == 'success') {
                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully saved'
                  })
                  this.$router.push({name:'app-notification-list'})
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
                this.$router.push({name:'app-notification-list'})
              }

            })
            .catch(err => {
              this.$vs.notify({
                color: 'danger',
                title: 'Data Saving Error',
                text: 'The selected data was not saved'
              })
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

      }) 
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
    update_avatar () {
      // You can update avatar Here
      // For reference you can check dataList example
      // We haven't integrated it here, because data isn't saved in DB
    },
    async loadNotificationTemplate() {
      try {    
        var res = await axios.get(`/notificationTemplate/list`, {
            headers: { 'Authorization': this.token }
        })

        this.optionNotificationTemplate = res['data']
      } catch(err) {
        reject(err.toString('utf8'));
      }  

      console.log('res maintenanceType ', this.optionNotificationTemplate)
    },
    selectTemplate(event) {
      var nt = this.optionNotificationTemplate
      console.log('event ', event)      
      console.log('optionNotificationTemplate ', this.optionNotificationTemplate)  
      var nnt = nt.filter(x => x.id === event);   
      console.log('nnt ', nnt)   

      this.data_local.title = nnt[0]['title']
      this.data_local.message = nnt[0]['message']
      // console.log('optionNotificationTemplate ', this.optionNotificationTemplate['event'][title])

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
  },
  created () {
    this.loadNotificationTemplate()
    this.loadUser()
  } 
}
</script>
