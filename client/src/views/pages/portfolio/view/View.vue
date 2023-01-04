<template>
  <div id="page-data-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-portfolio-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert> 

    <div v-if="data_not_found===1">
      <vx-card title="Parent Organization Details" class="mb-base">
          <div class="vx-row">
            <!-- Information - Col 1 -->
            <div class="vx-col flex-1" id="account-info-col-1">
              <table>
                <tr>
                  <td class="font-semibold">Name</td>
                  <td>{{ view_data.name }}</td>
                </tr>
                <td class="font-semibold">Classification</td>
                  <td>{{ view_data.classification }}</td>
                <tr>
                  <td class="font-semibold">Notes</td>
                  <td>{{ view_data.notes }}</td>
                </tr>
              </table>
            </div>
            <!-- /Information - Col 1 -->

            <!-- Information - Col 2 -->
            <div class="vx-col flex-1" id="account-info-col-2">
              <table>
                <tr>
                  <td class="font-semibold">Email</td>
                  <td>{{ view_data.email }}</td>
                </tr>
                <tr>                
                  <td class="font-semibold">Phone</td>
                  <td>{{ view_data.phone }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Address</td>
                  <td>{{ view_data.address }}</td>
                </tr>              
              </table>
            </div>
            <!-- /Information - Col 2 -->

            <!-- Information - Col 3 -->
            <div class="vx-col flex-1" id="account-info-col-2">
              <table>
                <tr>
                  <td class="font-semibold">Created</td>
                  <td>{{ view_data.createdAt | formatDate() }}</td>
                </tr>
                <tr>
                  <td class="font-semibold">Updated</td>
                  <td>{{ view_data.updatedAt | formatDate() }}</td>
                </tr>             
              </table>
            </div>
            <!-- Information - Col 3 -->

            <div class="vx-col w-full flex" id="account-manage-buttons">
              <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-portfolio-edit', params: { editId: $route.params.viewId }}" 
              :disabled="!showU">Edit <!-- crud -->
              </vs-button> 
              <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
              :disabled="!showD">Delete <!-- crud -->
              </vs-button>
            </div>
          </div>
      </vx-card>

      <div id="view-data" v-if="view_data">
        <div class="vx-row">
          <!-- <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Super Admin" class="mb-base">
              <agGridPortfolioManagers></agGridPortfolioManagers>
            </vx-card>
          </div> -->

          <div class="vx-col w-full">
            <vx-card title="Property" class="mb-base">
              <listProperty></listProperty>
            </vx-card>
          </div>

          <!-- <div class="vx-col lg:w-1/2 w-full">
            <vx-card title="Property Managers" class="mb-base">
              <agGridPropertyManager></agGridPropertyManager>
            </vx-card>
          </div> -->
        </div>
      </div>
    </div>      
  </div>
</template>

<script>
import agGridPortfolioManagers from './agGrid-portfolioManagers/agGrid.vue'
import agGridPropertyManager from './agGrid-propertyManager/agGrid.vue'
import listProperty from '../../property/list/List.vue'

import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
    agGridPortfolioManagers,
    agGridPropertyManager,
    listProperty
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
      
      //portfolio
      view_data: {
        name: '',
        notes: '',
        address: '',
        phone: ''
      },
      data_not_found: 0
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
        text: `You are about to delete "${this.view_data.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/portfolio/delete/${viewId}`, {
          token: this.token
        })

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))

        this.showDeleteSuccess()
        EventBus.$emit('user-org-list', true)
        EventBus.$emit('side-menu-parent', true)
        this.$router.push({name:'app-portfolio-list'})
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
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    },
    async loadData () {
      const viewId = this.$route.params.viewId
      localStorage.setItem('viewedParentOrg', viewId)
      const {data} = await axios.get(`/user-org/portfolio/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.view_data = data[0]
      if (this.view_data.length === 0) {
        throw new Error('Unable to find Parent Organization')
      }
    }
  },
  mounted () {
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(() => { this.$vs.loading.close() },1000)
    })
  },
  async created () {
    try {
      this.$vs.loading()
      await this.loadData()
      
      //crud
      this.showL = await mainHelper.cansee('portfolio-list', 'list')
      this.showC = await mainHelper.cansee('portfolio-create', 'create')
      this.showR = await mainHelper.cansee('portfolio-read', 'read')
      this.showU = await mainHelper.cansee('portfolio-update', 'update')
      this.showD = await mainHelper.cansee('portfolio-delete', 'delete')

      if (!this.showL) {
        this.data_not_found = 2
        throw new Error('You are not authorized to view this page.')
      }
      
      this.data_not_found = 1
      setTimeout(() => { this.$vs.loading.close() },3000)
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Parent Org Page',
        text: err.toString('utf8')
      })
      setTimeout(() => { this.$vs.loading.close() },3000)
      this.$router.push({name:'app-portfolio-list'})
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
