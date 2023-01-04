<template>
  <div id="page-data-view">
    <vx-card title="User Role Details" class="mb-base">
      <div class="vx-row">
        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>
            <tr>
              <td class="font-semibold">Name</td>
              <td>{{ view_data.name }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- /Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table>
            <tr>
              <!-- <td class="font-semibold">Property</td>
              <td v-if="view_data.property !== null">{{ view_data.property.name }}</td> -->
              <td class="font-semibold">Description</td>
              <td>{{ view_data.description }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons">
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-role-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
          <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
        </div>
      </div>
    </vx-card>

    <!-- Permissions -->
    <vx-card title="Permission" class="mb-base">
      <table class="w-full user-role-list">
        <tr>
          <th class="font-semibold text-center px-3 py-2" v-for="heading in ['Module','Menu', 'Approval', 'Execute', 'Create', 'Read', 'Update', 'Delete']" :key="heading">{{ heading }}</th>
        </tr>

        <tr v-for="(val, id) in optionUserModule" v-if="edit_data[val.val] === undefined ? checkM(val.val) : true">
          <td class="px-3 py-2">{{ val.name }}</td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['list']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['approval']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['execute']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['create']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['read']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['update']" disabled></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="edit_data[val.val]['delete']" disabled></vs-checkbox>
          </td>
        </tr>
      </table>
    </vx-card>    

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-role-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
  },
  data () {
    const token = localStorage.usertoken
    return {
      token: token,

      optionUserModule: [],
      edit_data: [],
      
      //role
      view_data: {
        parent_id: '',
        property_id: '',
        property: {
          name: ''
        },        
        name: ''
      },
      data_not_found: false
    }
  },
  computed: {
  },
  methods: {
    checkM(data) {
      return new Promise((resolve, reject) => {
        try {
          this.edit_data[data]  = {
            all: false,
            list: false,
            approval: false,
            execute: false,
            create: false,
            update: false,
            read: false,
            delete: false,
          }

          resolve(this.edit_data)
        } catch(err) {
          reject(err.toString('utf8'));
        }
      })
      console.log('this.edit_data ', this.edit_data)
    },
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
        const result = await axios.post(`/role/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        // this.$router.push({name:'app-role-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Role Page',
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
      const result = await axios.get(`/role/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.view_data = result['data']
      this.edit_data = JSON.parse(result['data']['permission'])
    },
    async loadPermission () {
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/permission/view/${viewId}`, {
        headers: { 'Authorization': this.token }
      })

      this.edit_data = JSON.parse(result['data'][0]['permissions_json'])
    },
    async loadUserModule () {
      const result = await axios.get(`/api/userModule/list`, {
        headers: { 'Authorization': this.token }
      })

      this.optionUserModule = result['data']
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
      await this.loadUserModule()
      // await this.loadPermission()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Role Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
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

table.user-role-list .con-vs-checkbox, table.user-role-list .con-vs-radio {
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}
</style>
