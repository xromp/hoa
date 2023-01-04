<template>
  <div id="data-edit-tab-info">

    <!-- Avatar Row -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="flex items-start flex-col sm:flex-row">
          <img :src="data.avatar" class="mr-8 rounded h-24 w-24" />
          <!-- <vs-avatar :src="data.avatar" size="80px" class="mr-4" /> -->
          <div>
            <p class="text-lg font-medium mb-2 mt-4 sm:mt-0">{{ data.name  }}</p>
            <input type="file" class="hidden" ref="update_avatar_input" @change="update_avatar" accept="image/*">

            <!-- Toggle comment of below buttons as one for actual flow & currently shown is only for demo -->
            <vs-button class="mr-4 mb-4">Change Avatar</vs-button>
            <!-- <vs-button type="border" class="mr-4" @click="$refs.update_avatar_input.click()">Change Avatar</vs-button> -->

            <vs-button type="border" color="danger">Remove Avatar</vs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full" style="height:300px;">
        <vs-input class="w-full mt-4" label="Email" v-model="data_local.email" v-validate="'required'" name="email" />
        <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

        <vs-input class="w-full mt-4" label="Is Activated" v-model="data_local.is_activated" v-validate="'required'" name="is_activated" />
        <span class="text-danger text-sm"  v-show="errors.has('is_activated')">{{ errors.first('is_activated') }}</span> 

        <vs-input class="w-full mt-4" label="Notes" v-model="data_local.notes" v-validate="'required'" name="notes" />
        <span class="text-danger text-sm"  v-show="errors.has('notes')">{{ errors.first('notes') }}</span>   
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Password" v-model="data_local.password" v-validate="'required'" name="password" type="password"/>
        <span class="text-danger text-sm"  v-show="errors.has('password')">{{ errors.first('password') }}</span>  

        <vs-input class="w-full mt-4" label="Confirm Password" v-model="data_local.confirm_password" v-validate="'required'" name="confirm_password" type="password"/>
        <span class="text-danger text-sm"  v-show="errors.has('confirm_password')">{{ errors.first('confirm_password') }}</span>

        <div class="mt-4">
          <label class="vs-input--label">User Role</label>
          <v-select :options="optionUserRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.user_role_id" name="user_role_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('user_role_id')">{{ errors.first('user_role_id') }}</span>
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

export default {
  components: {
    vSelect
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      token: localStorage.usertoken,
      optionUserRole: [],
      data_local: JSON.parse(JSON.stringify(this.data)),
      confirm_password: '',
      permissions: [{
        users: {
          'read': true,
          'write': false,
          'create': false,
          'delete': false
        },
        posts: {
          'read': true,
          'write': true,
          'create': true,
          'delete': true
        },
        comments: {
          'read': true,
          'write': false,
          'create': true,
          'delete': false
        }
      }],

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
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    save_changes () {
      /* eslint-disable */
      if (!this.validateForm) return

      // Here will go your API call for updating data
      // You can get data in "this.data_local"

      /* eslint-enable */

      const editId = this.$route.params.editId
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/user/save/${editId}`, {
              data: this.data_local,
              token: this.token
            })
            .then(res => {
              if(res['data'] != 'access_denied' && res['data'] != '') {

                if(res['data'] == 'success') {
                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully Saved'
                  })
                  this.$router.push({name:'app-user-view', params: {viewId: editId }})
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
                this.$router.push({name:'app-user-view', params: {viewId: editId }})
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
      this.data_local = JSON.parse(JSON.stringify(this.data))
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
    loadUserRole () {
      var d = new Promise( async (resolve, reject)  => {
        try {    
          await axios.get(`/api/userRole/list`, {
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
        console.log('res user role ', res)
        this.optionUserRole = res
      })
    }    
  },
  created () {
    this.loadUserRole()
  }
}
</script>
