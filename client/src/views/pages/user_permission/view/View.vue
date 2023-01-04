<template>
  <div id="page-data-view">
      <vx-card title="Permission Details" class="mb-base">
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">User Role</td>
                <td>{{ view_data.user_role.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">User Module</td>
                <td>{{ view_data.user_module.name }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->
          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-permission-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
          </div>
        </div>
      </vx-card>

      <!-- <div class="vx-row">
        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Personal Information" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">list</td>
                <td v-if="view_data.list !== null">{{ view_data.list }}</td>
              </tr>
              <tr>
                <td class="font-semibold">create</td>
                <td>{{ view_data.create }}</td>
              </tr>
              <tr>
                <td class="font-semibold">read</td>
                <td>{{ view_data.read }}</td>
              </tr>
              <tr>
                <td class="font-semibold">update</td>
                <td>{{ view_data.update }}</td>
              </tr>
              <tr>
                <td class="font-semibold">delete</td>
                <td>{{ view_data.delete }}</td>
              </tr>
            </table>
          </vx-card>
        </div>
      </div>  -->    

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-permission-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

  </div>
</template>

<script>
import axios from '@/axios'

export default {
  components: {
  },
  data () {
    const token = localStorage.usertoken
    return {
      token: token,
      
      //permission
      view_data: {
        user_role_id: '',
        user_role: {
          name: '',
        },
        user_module_id: '',
        user_module: {
          name: '',
        },
        list: '',
        create: '',
        read: '',
        update: '',
        delete: ''
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
        text: `You are about to delete "${this.view_data.email}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/permission/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-permission-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Permission Page',
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
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/permission/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      })

      this.view_data = result['data']
    },
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('role-list', 'list')
      this.showC = await mainHelper.cansee('role-create', 'create')
      this.showR = await mainHelper.cansee('role-read', 'read')
      this.showU = await mainHelper.cansee('role-update', 'update')
      this.showD = await mainHelper.cansee('role-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Permission Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
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
