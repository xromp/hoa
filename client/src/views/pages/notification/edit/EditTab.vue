<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Property Id" v-model="data_local.property_id" v-validate="'required'" name="property_id" />
        <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>

        <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
          <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>
      
      </div>

      <div class="vx-col md:w-1/2 w-full">

        <div class="mt-4">
          <vs-input class="w-full mt-4" label="Message" v-model="data_local.message" v-validate="'required'" name="message" />
          <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
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
          await axios.post(`/notification/save/${editId}`, 
              { data: this.data_local }, 
              { headers: { 'Authorization': this.token } },
            )
            .then(res => {
              if(res['data'] != 'access_denied' && res['data'] != '') {

                if(res['data'] == 'success') {
                  this.$vs.notify({
                    color: 'success',
                    title: 'Data Saved',
                    text: 'The selected data was successfully Saved'
                  })
                  this.$router.push({name:'app-notification-view', params: {viewId: editId }})
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
                this.$router.push({name:'app-notification-view', params: {viewId: editId }})
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
    }
  }
}
</script>
