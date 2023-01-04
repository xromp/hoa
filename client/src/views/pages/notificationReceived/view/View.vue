<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link to="/notifications/received" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <vx-card title="Notification Details" class="mb-base" v-if="data_not_found===1">
      <!-- Avatar -->
      <div class="vx-row">
        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table>
            <tr>
              <td class="font-semibold">Title</td>
              <td>{{ view_data.notification_message.title }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Message</td>
              <td>{{ view_data.notification_message.message }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>
            <tr>
              <td class="font-semibold"> Sender </td>
              <td>{{ view_data.notification_message.user ? view_data.notification_message.user.full_name : ''}}</td>
            </tr>
            <tr>
              <td class="font-semibold">Sent at</td>
              <td>{{ new Date(view_data.notification_message.createdAt) | date(true) }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Created</td>
              <td>{{ new Date(view_data.createdAt) | date(true) }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons">
          <!-- <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-notification-edit', params: { editId: $route.params.viewId }}">Edit</vs-button> -->
          <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
        </div>
      </div>
    </vx-card>

    <vx-card title="Files" class="mb-base">
        <div class="vx-row">
          <read-file :folderPath="folderPath" :folderId="folderId" class="vx-col mb-4" />
        </div>
      </vx-card>
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
      token: token,
      
      //notification
      view_data: {
        notification_message: {}
      },
      data_not_found: 0
    }
  },
  computed: {
    folderPath() {
      return `docs/notification-template/gallery/${this.view_data.notification_template_id}`
    },
  },
  methods: {
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.notification_message.title}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const { id } = this.$route.params
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.delete(`/notification/received/${id}`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {        
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
              } else {
                this.$router.push({name:'app-notification-received'})
                this.showDeleteSuccess()
              }

            })
            .catch(err => {              
              reject(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.data_local = res[0]
        })
      })
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
      const viewId = this.$route.params.id
      console.log('viewId ', viewId)
      const {data} = await axios.get(`/notification/received/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: { 'property_ref': localStorage.selectedPropertyRef }
      })

      if (data.length === 0)  {
        this.data_not_found = 2
      } else {          
        this.data_not_found = 1
        this.view_data = data
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('notification-list', 'list')
      this.showC = await mainHelper.cansee('notification-create', 'create')
      this.showR = await mainHelper.cansee('notification-read', 'read')
      this.showU = await mainHelper.cansee('notification-update', 'update')
      this.showD = await mainHelper.cansee('notification-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Notification Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/notifications/received/${this.$route.params.id}`) return
      console.log('/notifications/received/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/notifications/received/${this.$route.params.id}`) return
      console.log('/notifications/received/')
      await this.loadData()
    })   
  },  
}

</script>

<style lang="scss">
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
