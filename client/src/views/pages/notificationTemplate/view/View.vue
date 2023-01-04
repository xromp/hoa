<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-notification-template-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <vx-card title="Template Details" class="mb-base">
        <!-- Avatar -->
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Title</td>
                <td>{{ view_data.title }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Message</td>
                <td>{{ view_data.message }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Property</td>
                <td v-if="view_data.property !== undefined">{{ view_data.property.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Updated</td>
                <td>{{ new Date(view_data.updatedAt) | date(true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Created</td>
                <td>{{ new Date(view_data.createdAt) | date(true) }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-notification-template-edit', params: { editId: $route.params.viewId }}" 
              :disabled="!showU">Edit <!-- crud -->
              </vs-button> 
              <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
              :disabled="!showD">Delete <!-- crud -->
              </vs-button>
          </div>
        </div>
      </vx-card>

      <vx-card title="Files" class="mb-base">
        <div class="vx-row">
          <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
        </div>
      </vx-card>
    </div>      
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'
import ReadFile from '@/views/components/files/ReadFile.vue'

export default {
  components: {
    ReadFile
  },
  data () {
    const token = localStorage.usertoken
    return {
      // crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,

      imgs: '',  // Img Url , string or Array of string
      visible: false,
      index: 0,   // default: 0

      token: token,
      
      //notification_template
      view_data: {
        message: '',
        property_id: '',
        title: ''
      },
      data_not_found: 0,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 24
    }
  },
  computed: {
    folderPath() {
      return `docs/notification-template/gallery/${this.view_data.id}`
    },
  },
  methods: {
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.title}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/notificationTemplate/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        await this.loadData()
        // this.$router.push({name:'app-amenity-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Notification Template Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    async loadData () {
      this.$vs.loading()
      const viewId = this.$route.params.viewId
      const loadData = await axios.get(`/notificationTemplate/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: { 'property_ref': localStorage.selectedPropertyRef }
      })

      if (loadData['data'].length === 0)  {
        this.data_not_found = 2
      } else {          
        this.data_not_found = 1
        this.view_data = loadData['data'][0]
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    // crud
    this.showL = await mainHelper.cansee('notification-template-list', 'list')
    this.showC = await mainHelper.cansee('notification-template-create', 'create')
    this.showR = await mainHelper.cansee('notification-template-read', 'read')
    this.showU = await mainHelper.cansee('notification-template-update', 'update')
    this.showD = await mainHelper.cansee('notification-template-delete', 'delete')

    if (!this.showR) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
    
    this.loadData()
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/notification-templates/view/${this.$route.params.viewId}`) return
      console.log('/notification-templates/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/notification-templates/view/${this.$route.params.viewId}`) return
      console.log('/notification-templates/view/')
      await this.loadData()
    })   
  },
}

</script>

<style lang="scss">
div.vel-img-modal.vel-modal[data-v-1f17a952] {
  z-index: 100000 !important;
}

#avatar-col {
  width: 10rem;
}

#page-data-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: .8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width:370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }


@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }

}

.avatar-img {
  position: relative;
  width: 230px;
  overflow: hidden;
  padding-top: 230px;
}

.avatar-img img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
}

</style>
