<template>
  <div id="page-user-view">
    <vs-alert color="danger" title="Data Not Found" v-if="data_not_found===2">
      <span>Data record with id: {{ $route.params.viewId }} not found on the selected Parent Org and Property. </span>
      <span>
        <span>Go back to the </span><router-link :to="{name:'app-billing-types-list'}" class="text-inherit underline">List</router-link>
      </span>
    </vs-alert>

    <div v-if="data_not_found===1">
      <vx-card title="Bill Type Details" class="mb-base">
        <div class="vx-row">
          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Name</td>
                <td>{{ view_data.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Code</td>
                <td>{{ view_data.code }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <div class="vx-col w-full flex mt-8">
            <vs-button icon-pack="feather" icon="icon-edit" class="mr-4" :to="{name: 'app-billing-types-edit', params: { editId: $route.params.viewId }}" 
            :disabled="!showU">Edit <!-- crud -->
            </vs-button> 
            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="confirmDeleteRecord" 
            :disabled="!showD">Delete <!-- crud -->
            </vs-button>
          </div>
        </div>
      </vx-card>
    </div>       
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  components: {
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
      
      //bill-type
      view_data: {
        name: '',
        code: ''
      },     
      data_not_found: 0,   
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
        const result = await axios.post(`/bill-type/delete/${viewId}`, null, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token
          }
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-billing-types-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Billing Type Page',
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
      const {data} = await axios.get(`/bill-type/view/${viewId}`, {
        headers: { 'Authorization': this.token }
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
      this.showL = await mainHelper.cansee('bill-type-list', 'list')
      this.showC = await mainHelper.cansee('bill-type-create', 'create')
      this.showR = await mainHelper.cansee('bill-type-read', 'read')
      this.showU = await mainHelper.cansee('bill-type-update', 'update')
      this.showD = await mainHelper.cansee('bill-type-delete', 'delete')

      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Bill Type Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () {   
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/billing-types/view/${this.$route.params.viewId}`) return
      console.log('/billing-types/view/')
      await this.loadData()
    })   
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/billing-types/view/${this.$route.params.viewId}`) return
      console.log('/billing-types/view/')
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
