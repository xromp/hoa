<template>
  <div id="page-user-view">    
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-portfolio-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <vx-card title="Preferences" class="mb-base">
        <div class="vx-row" style="margin-bottom: 3em;">
          <div class="vx-col">
            <read-avatar 
              :folderPath="folderPath" 
              :folderId="folderId" 
              :defaultImg = "defaultImg"
              class="vx-col mb-4" />
          </div>
          <div class="vx-col">
            <vue-qrcode :value="getPropertyCode" />
            <label color="sucess">Property Code: <strong>{{view_data.code}}</strong></label>
          </div>
        </div>
        
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Name</td>
                <td>{{ view_data.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Address</td>
                <td>{{ view_data.address_line_1 }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Type</td>
                <td>{{ view_data.property_type }}</td>
              </tr>
              <!-- <tr>
                <td class="font-semibold">Radius</td>
                <td>{{ view_data.radius }}</td>
              </tr> -->
            </table>
          </div>
          <!-- /Information - Col 2 -->
           <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button type="border" color="primary" class="mr-4" icon-pack="feather" icon="icon-plus" :to="{name:'app-property-new'}" :disabled="!showC">Add New </vs-button> 

            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-property-edit', params: { editId: view_data.id }}" 
            :disabled="!showU">Edit <!-- crud -->
            </vs-button> 
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD" v-if="false">Delete <!-- crud -->
            </vs-button>
            <vs-button color="success" icon-pack="feather" icon="icon-eye" @click="viewPoster" :disabled="!showR">Poster <!-- crud -->
            </vs-button>
          </div>
        </div>
      </vx-card>

      <div class="vx-row" v-if="showAmenityRead">
        <div class="vx-col w-full">
          <vx-card title="Amenity List" class="mb-base">
            <AmenityList></AmenityList>
          </vx-card>
        </div>

        <!-- <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Property Assigned" class="mb-base">
            <AssignAccess></AssignAccess>
          </vx-card>
        </div> -->
      </div>
    </div>   
  </div>

<!-- <div class="vx-row">
  <div class="vx-col lg:w-1/2 w-full">
    <vx-card title="Property Manager Assigned" class="mb-base">
      <PropertyManagerList></PropertyManagerList>
    </vx-card>
  </div>

  <div class="vx-col lg:w-1/2 w-full">
    <vx-card title="Property User Assigned" class="mb-base">
      <PropertyUserList></PropertyUserList>
    </vx-card>
  </div>
</div> -->

</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import AmenityList from '../../amenity/list/List.vue'
import PropertyManagerList from './property-manager/list/List.vue'
import PropertyUserList from './property-user/list/List.vue'
import EventBus from '@/EventBus'
import ReadAvatar from '../../../components/files/ReadAvatar.vue'
import AssignAccess from '@/views/components/user-org-role/AssignAccess.vue'

import VueQrcode from 'vue-qrcode'

export default {
  components: {
    AmenityList,
    PropertyManagerList,
    PropertyUserList,
    ReadAvatar,
    AssignAccess,
    VueQrcode,
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
      showAmenityRead: false,

      token: token,
      view_data: {
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        postal_code: '',
        state: '',
        country_id: 0,
        radius: '',
        code: '',
        is_deleted: 0,
        created_by_manager_id: 0,
        manager_id: 0,
        property_type: '',
        permissions1_json: '',
        permissions2_json: '',
        domain: '',
        pmc_id: 0,
        photo_filename: '',
        ref: '',
        settings_json: '',
        email_signature: '',
        caliber_client_id: 0,
        BillingAddress1: '',
        BillingAddress2: '',
        BillingAddress3: '',
        BillingCity: '',
        BillingCountry: '',
        BillingFax: '',
        BillingPhoneArea: '',
        BillingPhone: '',
        BillingPhoneType: '',
        BillingState: '',
        BillingZip: '',
      },

      user_data: null,
      user_not_found: false,
      data_not_found: 0,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 26,
      defaultImg: '/img/default-placeholder.a36832a1.png'
    }
  },
  computed: {
    folderPath() {
      return `docs/property/avatar/${this.view_data.id}`
    },
    userAddress () {
      let str = ''
      for (const field in this.user_data.location) {
        str += `${field  } `
      }
      return str
    },
    getPropertyCode() {
      const registration = `${window.location.origin}/register?code=${this.view_data.code}`;
      return registration;
    }
  },
  methods: {
    viewPoster () {
      window.open(`/properties/poster/${this.view_data.id}`, '_blank')
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.user_data.username}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      this.$router.push({name:'app-user-list'})
      this.showDeleteSuccess()
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'User Deleted',
        text: 'The selected user was successfully deleted'
      })
    },
    async loadData () {
      this.$vs.loading()
      let property_ref_url = `/property/view/property_ref/${localStorage.selectedPropertyRef}`
      let property_ref_id = `/property/view/${this.$route.params.viewId}`
      const url = this.$route.path === '/properties/view/ref' ? property_ref_url : property_ref_id
      const result = await axios.get(`${url}`, {
        headers: { 
          'Authorization': this.token,
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      if (result['data']['pmc_id'] !== parseInt(localStorage.selectedParentOrg)) {
        this.data_not_found = 2
      } else {
        this.data_not_found = 1
        this.view_data = result['data']
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('property-list', 'list')
      this.showC = await mainHelper.cansee('property-create', 'create')
      this.showR = await mainHelper.cansee('property-read', 'read')
      this.showU = await mainHelper.cansee('property-update', 'update')
      this.showD = await mainHelper.cansee('property-delete', 'delete')

      this.showAmenityRead = await mainHelper.cansee('amenity-read', 'read');
      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Property Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (
        this.$route.path !== '/properties/view/ref' && 
        this.$route.path !== `/properties/view/${this.$route.params.viewId}`
      ) return
      console.log('/properties/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (
        this.$route.path !== '/properties/view/ref' && 
        this.$route.path !== `/properties/view/${this.$route.params.viewId}`
      ) return
      console.log('/properties/view/')
      await this.loadData()
    })   
  },
}

</script>

<style lang="scss">
#avatar-col {
  width: 10rem;
}

#page-user-view {
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
