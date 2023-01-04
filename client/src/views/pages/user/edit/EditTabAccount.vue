<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input
          ref="password"
          type="password"
          data-vv-validate-on="blur"
          v-validate="'required|min:6'"
          name="password"
          label="Password*"          
          placeholder="Password"
          v-model="password"
          class="w-full mt-4" />
        <span class="text-danger text-sm">{{ errors.first('password') }}</span>  

        <vs-input
          type="password"
          v-validate="'required|min:6|confirmed:password'"
          data-vv-validate-on="blur"
          data-vv-as="password"
          name="confirm_password"
          placeholder="Confirm Password"
          label="Confirm Password*"
          v-model="confirm_password"
          class="w-full mt-4" />
        <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
        
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
import axios from '@/axios'
import UpdateAvatar from '../../../components/files/UploadAvatar.vue'
import EventBus from '@/EventBus'

export default {
  components: {
    vSelect,
    UpdateAvatar
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {      
      //uploading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 3,
      defaultImg: '/img/avatar-s-11.4799a585.png',
      rawFiles: [],
      resDataLocal: [],
      resUp: [],
      tableRead: [],

      token: localStorage.usertoken,
      optionUserRole: [],
      data_local: JSON.parse(JSON.stringify(this.data)),
      password: '',
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
    folderPath() {
      return `docs/user/avatar/${this.data_local.id}`
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
      return !this.errors.any() && this.password !== '' && this.confirm_password !== ''
    }
  },
  methods: {
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async save_changes () {
      try {
        const editId = this.$route.params.editId
        this.data_local.password = this.confirm_password
        if (!this.validateForm) return
        this.$vs.loading()

        await axios.post(`/user/update-password/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: this.folderPath,
          folderId: this.folderId
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch(err) {
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
    async loadUserRole() {
      const result = await axios.get(`/api/userRole/list`, {
        headers: { 
          'Authorization': this.token
        }
      })

      this.optionUserRole = result['data']
    }    
  },
  async created () {
    try {
      this.data_local.password = null
      await this.loadUserRole()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading User Page',
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