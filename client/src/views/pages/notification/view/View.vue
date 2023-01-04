
<template>
  <div id="page-data-view">

     <vx-card title="Notification Details" class="mb-base">

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
                <td class="font-semibold">Sender</td>
                <td>{{ view_data.property.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Date</td>
                <td>{{ new Date(view_data.updatedAt) | date(true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Sent</td>
                <td>{{ new Date(view_data.createdAt) | date(true) }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons">
            <!-- <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-notification-edit', params: { editId: $route.params.viewId }}">Edit</vs-button> -->
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD">Delete <!-- crud -->
            </vs-button>
          </div>

        </div>

      </vx-card>

      <vx-card title="Notification Sent" class="mb-base">
        <list-tab class="mt-4" />
      </vx-card> 

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-notification-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import ListTab from './list/List.vue'

export default {
  components: {
    ListTab
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

      token: token,
      
      //notification
      view_data: {
        message: '',
        property_id: '',
        title: ''
      },
      data_not_found: false
    }
  },
  computed: {
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
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/notification/delete/${viewId}`, {}, {
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
                this.$router.push({name:'app-notification-list'})
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
    loadData () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.get(`/notification/view/${viewId}`, {
              headers: { 'Authorization': this.token }
            })
            .then(res => {     
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
                this.$router.push({name:'app-notification-list'})
              } else {
                resolve(res['data'])
              }

              this.$vs.loading.close()
            })
            .catch(err => {
              this.data_not_found = true
              this.$vs.loading.close()
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          this.view_data = res[0]
        })
      })
    }
  },
  async created () {
    // crud
    this.showL = await mainHelper.cansee('notification-list', 'list')
    this.showC = await mainHelper.cansee('notification-create', 'create')
    this.showR = await mainHelper.cansee('notification-read', 'read')
    this.showU = await mainHelper.cansee('notification-update', 'update')
    this.showD = await mainHelper.cansee('notification-delete', 'delete')

    if (!this.showR) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }

    this.loadData()
  }
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
