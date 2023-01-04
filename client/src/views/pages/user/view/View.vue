<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-user-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <vx-card title="User Details" class="mb-base">
        <!-- Avatar -->
        <div class="vx-row">
          <div class="vx-row">
            <read-avatar 
            :folderPath="folderPath" 
            :folderId="folderId" 
            :defaultImg = "defaultImg"
            class="vx-col mb-4" />
          </div>

          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Email</td>
                <td>{{ view_data.email }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Status</td>
                <td v-if="view_data.is_deleted === 1">Archived</td>
                <td v-else>Active</td>                
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Notes</td>
                <td v-if="view_data.notes === null">{{ view_data.notes }}</td>
                <td v-else>--</td>
              </tr>
              <!-- <tr>
                <td class="font-semibold">User Role</td>
                <td v-if="view_data.user_role !== null">{{ view_data['user_org_roles'][0]['user_role']['name'] }}</td>
                <td v-else>--</td>                
              </tr> -->
            </table>
          </div>
          <!-- /Information - Col 2 -->

          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-user-edit', params: { editId: $route.params.viewId }}" 
            :disabled="!showU">Edit <!-- crud -->
            </vs-button> 

            <vs-button type="border" color="danger" icon-pack="feather" class="mr-4"  icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD" v-if="view_data.is_deleted===0">Archived <!-- crud -->
            </vs-button>

            <vs-button type="border" color="success" icon-pack="feather" class="mr-4"  icon="icon-user-check" @click="confirmRestoreRecord" 
            :disabled="!showU" v-else>Restore <!-- crud -->
            </vs-button>

            <AssignAccessBtn></AssignAccessBtn>            
          </div>

        </div>
      </vx-card>

      <div class="vx-row">
        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Personal Information" class="mb-base">
            <table>
              <!-- <tr>
                <td class="font-semibold">Salutation</td>
                <td v-if="view_data.salutation !== null">{{ view_data.salutation.name }}</td>
              </tr> -->
              <tr>
                <td class="font-semibold">First Name</td>
                <td v-if="view_data.first_name !== null">{{ view_data.first_name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Last Name</td>
                <td v-if="view_data.last_name !== null">{{ view_data.last_name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Suffix</td>
                <td>{{ view_data.suffix }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Phone 1</td>
                <td>{{ view_data.phone1 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Phone 2</td>
                <td>{{ view_data.phone2 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Date of Birth</td>
                <td>{{ view_data.dob }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Address" class="mb-base">
            <table>
              <tr>
                <td class="font-semibold">Address Line 1</td>
                <td>{{ view_data.address_line_1 }}</td>
              </tr> 
              <tr>
                <td class="font-semibold">Address Line 2</td>
                <td>{{ view_data.address_line_2 }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Province</td>
                <td>{{ view_data.province }}</td>
              </tr>
              <tr>
                <td class="font-semibold">City</td>
                <td>{{ view_data.city }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Country</td>
                <!-- <td v-if="view_data.country_master !== null">{{ view_data.country_master.name }}</td> -->
              </tr>
              <tr>
                <td class="font-semibold">Postcode</td>
                <td>{{ view_data.postcode }}</td>
              </tr>
            </table>
          </vx-card>
        </div> 
      </div>     

      <div>
        <div class="vx-row">
          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Unit Assigned" class="mb-base">
              <UnitUserList></UnitUserList>
            </vx-card>
          </div>
          
          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Property Assigned" class="mb-base">
              <PropertyUserList></PropertyUserList>
            </vx-card>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Role Assigned" class="mb-base">
              <RoleUserList></RoleUserList>
            </vx-card>
          </div>  

          <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="User is Designated To Approve" class="mb-base">
              <UserDesignation></UserDesignation>
            </vx-card>
          </div>         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import UnitUserList from './unit-user/list/List.vue'
import PropertyUserList from './property-user/list/List.vue'
import RoleUserList from './role-user/list/List.vue'
import UserDesignation from './designation-user/list/List.vue'

import EventBus from '@/EventBus'
import ReadAvatar from '../../../components/files/ReadAvatar.vue'
import AssignAccessBtn from '@/views/components/user-org-role/AssignAccessBtn.vue'

export default {
  components: {
    UnitUserList,
    PropertyUserList,
    RoleUserList,
    ReadAvatar,
    AssignAccessBtn,
    UserDesignation
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
      
      //user
      view_data: {
        email: '',
        first_name: '',
        last_name: '',
        is_activated: '',
        password: '',
        profile_json: '',
        phone1: '',
        dob: '',
        middle_name: '',
        phone2: '',
        salutation_id: '',
        suffix: '',
        notes: '',
        avatar_filename: '',
        city: '',
        country_id: '',
        address_line_1: '',
        province: '',
        address_line_2: '',
        postcode: '',
        user_role_id: '',
        user_role: {
          name: ''
        }
      },
      avatar:'',
      data_not_found: 0,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 3,
      defaultImg: '/img/avatar-s-11.4799a585.png'
    }
  },
  computed: {
    accessLevel() {
      const userAllData = JSON.parse(localStorage.userAllData)

      return userAllData.user_role.access_level
    },
    folderPath() {
      return `docs/user/avatar/${this.view_data.id}`
    },
  },
  methods: {    
    confirmRestoreRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirm Restore',
        text: `You are about to restore "${this.view_data.full_name}"`,
        accept: this.activateRecord,
        acceptText: 'Yes'
      })
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
    async activateRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/user/activate/${viewId}`, {
          token: this.token
        })

        this.showActivateSuccess()
        this.$router.push({name:'app-user-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading User Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/user/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-user-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading User Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    showActivateSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Activated',
        text: 'The selected data was successfully activated'
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
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/user/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if (result['data'].length === 0)  {
        this.data_not_found = 2
      } else {  
        this.data_not_found = 1
        this.view_data = result['data'][0]
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('user-list', 'list')
      this.showC = await mainHelper.cansee('user-create', 'create')
      this.showR = await mainHelper.cansee('user-read', 'read')
      this.showU = await mainHelper.cansee('user-update', 'update')
      this.showD = await mainHelper.cansee('user-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      // this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading User Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {   
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log('/users/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log('/users/view/')
      await this.loadData()
    }) 
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

</style>
