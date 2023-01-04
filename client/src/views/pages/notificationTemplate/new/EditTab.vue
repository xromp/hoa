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
        <create-file 
          :loadFile="false" 
          :folderPath="folderPath" 
          :folderId="24" class="mb-4" 
        />
      </div>

    </div>
    
    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit" :disabled="!validateForm">Save</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import common from '@/common'
import CreateFile from '@/views/components/files/UploadFile.vue'
import EventBus from '@/EventBus'
const tz = 0 //new Date().getTimezoneOffset() / -60;
const tx = new Date().getTimezoneOffset() / -60

export default {
  components: {
    vSelect,
    CreateFile
  },
  data () {
    return {
      token: localStorage.usertoken,

      //notificationTemplate
      data_local: {
        message: '',
        property_ref: '',
        title: ''
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
      ],

      // uploading docs
      rawFiles: [],
      resDataLocal: [],
    }
  },
  computed: {
    folderPath() {
      return `docs/maintenance-order/gallery`
    },
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    deleteImage(k) {
      // document.getElementById(f).style.display = 'none';
      this.$delete(this.files, k)
      this.$delete(this.rawFiles, k)

      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })
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
      if (!this.validateForm) return
      this.data_local.property_ref = localStorage.selectedPropertyRef
      this.data_local.createdAt = common.addHours(new Date(), tz)
      this.data_local.updatedAt = common.addHours(new Date(), tz)

      const editId = -1
      try {   
        this.$vs.loading()
        const result = await axios.post(`/notificationTemplate/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })

        this.resDataLocal = result['data']['result']

        // uploading docs
        await axios.post(`/docs/table/save`, {
          rawFiles: this.rawFiles,
          token: this.token,
          id: this.resDataLocal.id,
          path: `docs/notification-template/gallery/${this.resDataLocal.id}`,
          folderId: 24
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
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
      //notificationTemplate
      this.data_local['message'] = ''
      this.data_local['property_ref'] = ''
      this.data_local['title'] = ''
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    }
  },
  mounted () {
    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })
  }    
}
</script>
