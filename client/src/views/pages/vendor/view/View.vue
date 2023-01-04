
<template>
  <div id="page-data-view">
    <vx-card title="Business Details" class="mb-base">
      <!-- Avatar -->
      <div class="vx-row">
        <!-- Avatar Col -->
        <div class="vx-col">
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
              <td class="font-semibold">Name</td>
              <td>{{ view_data.business_name }}</td>
            </tr>  
            <tr>
              <td class="font-semibold">Email</td>
              <td>{{ view_data.business_email }}</td>
            </tr>          
            <tr>
              <td class="font-semibold">Phone</td>
              <td>{{ view_data.business_phone }}</td>
            </tr> 
            <!-- <tr>
              <td class="font-semibold">Service Radius</td>
              <td>{{ view_data.service_radius }}</td>
            </tr> -->
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>
            <tr>
              <td class="font-semibold">Category</td>
              <td v-if="view_data.vendor_category_master !== null">{{ view_data.vendor_category_master.name }}</td>
            </tr>  
            <tr>
              <td class="font-semibold">Address</td>
              <td>{{ view_data.business_address_line_1 }}</td>
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.business_city }}</td>              
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.business_state }}</td>
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.business_zip }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <div class="vx-col w-full flex" id="account-manage-buttons">
          <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-vendor-edit', params: { editId: $route.params.viewId }}">Edit</vs-button>
          <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord">Delete</vs-button>
        </div>
      </div>
    </vx-card>

    <div class="vx-row">
      <!-- <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Contact Information" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">First Name</td>
              <td v-if="view_data.user !== null">{{ view_data.user.first_name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Last Name</td>
              <td v-if="view_data.user !== null">{{ view_data.user.last_name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Email</td>
              <td v-if="view_data.user !== null">{{ view_data.user.email }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Phone</td>
              <td v-if="view_data.user !== null">{{ view_data.user.phone1 }}</td>
            </tr>
            
          </table>
        </vx-card>
      </div>  -->

      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Billing Information" class="mb-base">
          <table>
            <tr>
              <td class="font-semibold">Email</td>
              <td>{{ view_data.billing_email }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Phone</td>
              <td>{{ view_data.billing_phone }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Address</td>
              <td>{{ view_data.billing_address_line_1 }}</td>
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.billing_city }}</td>              
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.billing_state }}</td>
            </tr>
            <tr>
              <td></td>
              <td>{{ view_data.billing_zip }}</td>
            </tr>                        
          </table>
        </vx-card>
      </div> 
    </div>

    <vx-card title="Documents" class="mb-base" v-if="false">
      <!-- Avatar -->
      <div class="vx-row">

        <!-- Information - Col 1 -->
        <div class="vx-col flex-1" id="account-info-col-1">
          <table>
            <tr>
              <td class="font-semibold">Business License</td>
              <td>{{ view_data.business_license }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Expiration</td>
              <td>{{ view_data.business_license_exp }}</td>
            </tr>           
          </table>
        </div>
        <!-- /Information - Col 1 -->

        <!-- Information - Col 2 -->
        <div class="vx-col flex-1" id="account-info-col-2">
          <table>
            <tr>
              <td class="font-semibold">Insurance License</td>
              <td>{{ view_data.insurance_license }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Expiration</td>
              <td>{{ view_data.insurance_license_exp }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 2 -->

        <!-- Information - Col 3 -->
        <div class="vx-col flex-1" id="account-info-col-3">
          <table>
            <tr>
              <td class="font-semibold">Insurance License</td>
              <td>{{ view_data.bond_docs }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Expiration</td>
              <td>{{ view_data.bond_docs_exp }}</td>
            </tr>
          </table>
        </div>
        <!-- /Information - Col 3 -->

      </div>
    </vx-card>






    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.viewId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-vendor-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>
  </div>
</template>

<script>
import axios from '@/axios'
import ReadAvatar from '../../../components/files/ReadAvatar.vue'

export default {
  components: {
    ReadAvatar
  },
  data () {
    const token = localStorage.usertoken
    return {
      token: token,
      
      //vendor
      view_data: {
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        user_id: '',
        available_units: '',
        available_building: '',
        property_id: '',
        category_id: ''
      },

      avatar:'',
      data_not_found: false,

      //reading docs
      tableRead: [],
      files: [],

      folderId: 13,
      defaultImg: '/img/default-placeholder.a36832a1.png'
    }
  },
  computed: {
    folderPath() {
      return `docs/service-provider/avatar/${this.$route.params.viewId }`
    },
  },
  methods: {
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.view_data.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      const viewId = this.$route.params.viewId
      var d = new Promise(async(resolve, reject)  => {
        try {    
          await axios.post(`/vendor/delete/${viewId}`, {
              token: this.token
            })
            .then(res => {        
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
              } else {
                this.$router.push({name:'app-vendor-list'})
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
      try {
        this.$vs.loading()
        const viewId = this.$route.params.viewId 
        const {data} = await axios.get(`/vendor/view/${viewId}`, {
          headers: { 'Authorization': this.token }
        })

        this.view_data = await data

      } catch ({response}) {
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: response.data.errors,
        })
        // this.$router.push({name:'app-vendor-list'})
      }

      this.$vs.loading.close()
    },
  },
  async created () {
    await this.loadData()
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
