<template>
  <div id="page-user-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-unit-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <div class="vx-row">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="HomeIcon"
            icon-right
            :statistic="view_data.number"
            statisticTitle="Unit/Suite No.">
          </statistics-card-line>
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="Maximize2Icon"
            icon-right
            :statistic="view_data.unit_square_feet+'sqm'"
            statisticTitle="Total Area">
          </statistics-card-line>
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="EditIcon"
            icon-right
            statistic="0%"
            statisticTitle="Votes CPI">
          </statistics-card-line>
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="DollarSignIcon"
            icon-right
            :statistic="'$'+view_data.hoa_fee"
            statisticTitle="Monthly Fee">
          </statistics-card-line>
        </div>
      </div>

      <vx-card title="Unit Details" class="mb-base" v-if="false">
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Number</td>
                <td>{{ view_data.number }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Name</td>
                <td>{{ view_data.property.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">HOA Fee</td>
                <td>{{ view_data.hoa_fee }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Unit Square Feet</td>
                <td>{{ view_data.unit_square_feet }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Parking Number</td>
                <td>{{ view_data.parking_stall_number }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 2 -->
          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-unit-edit', params: { editId: $route.params.viewId }}" 
            :disabled="!showU">Edit <!-- crud -->
            </vs-button> 
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD">Delete <!-- crud -->
            </vs-button>
          </div>
        </div>
      </vx-card>

      <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
        <span>User record with id: {{ $route.params.userId }} not found. </span>
        <span>
          <span>Check </span><router-link :to="{name:'page-user-list'}" class="text-inherit underline">All Users</router-link>
        </span>
      </vs-alert>

      <div class="vx-row">
        <div class="vx-col w-full">
          <vx-card title="Unit Assigned" class="mb-base">
            <UnitUserList></UnitUserList>
          </vx-card>
        </div>
      </div> 
    </div>       
  </div>
</template>

<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import UnitUserList from '../../unit_user/list/List.vue'

import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
    StatisticsCardLine,
    UnitUserList
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

      user_data: null,
      user_not_found: false,
      token: token,
      
      //unit
      view_data: {
        message: '',
        property_id: '',
        title: ''
      },     
      data_not_found: 0,   
    }
  },
  computed: {
    userAddress () {
      let str = ''
      for (const field in this.user_data.location) {
        str += `${field  } `
      }
      return str
    }
  },
  methods: {
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
    async deleteRecord () {
      try {
        const viewId = this.$route.params.viewId
        const result = await axios.post(`/unit/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-unit-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Unit Page',
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
      const {data} = await axios.get(`/unit/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      if (data.length === 0)  {
        this.data_not_found = 2
      } else {  
        this.data_not_found = 1
        this.view_data = data[0]
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('unit-list', 'list')
      this.showC = await mainHelper.cansee('unit-create', 'create')
      this.showR = await mainHelper.cansee('unit-read', 'read')
      this.showU = await mainHelper.cansee('unit-update', 'update')
      this.showD = await mainHelper.cansee('unit-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Unit Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {   
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/units/view/${this.$route.params.viewId}`) return
      console.log('/units/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/units/view/${this.$route.params.viewId}`) return
      console.log('/units/view/')
      await this.loadData()
    }) 
  }
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
