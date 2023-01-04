<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Title" v-model="data_local.title" type="title" v-validate="'required'" name="title" />
        <span class="text-danger text-sm"  v-show="errors.has('title')">{{ errors.first('title') }}</span>

        <vs-textarea height="200px"  class="w-full mt-4" label="Message" v-model="data_local.message" v-validate="'required'" name="message" />
        <span class="text-danger text-sm"  v-show="errors.has('message')">{{ errors.first('message') }}</span>
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <!-- Col Header -->
        <div class="flex items-end md:mt-4 mt-base">
          <feather-icon icon="FolderIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Files</span>
        </div>

        <!-- Content Row -->
        <update-file 
          :loadFile="loadFile" 
          :folderPath="folderPath" 
          :folderId="20" class="mb-4" 
        />       

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
import UpdateFile from '@/views/components/files/UploadFile.vue'
import EventBus from '@/EventBus'

export default {
  components: {
    vSelect,
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
      //reading docs
      files: [],
      filesDel: [],
      loadFile: true,
      folderId: 24,
      rawFiles: [],
      resDataLocal: [],

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
      return `docs/notification-template/gallery/${this.$route.params.editId}`
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
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        const editId = this.$route.params.editId
        this.$vs.loading()

        await axios.post(`/notificationTemplate/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: editId,
          path: `docs/notification-template/gallery/${editId}`,
          folderId: 24
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
        this.$router.push({name:'app-notification-template-view', params: {viewId: editId }})
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
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
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
