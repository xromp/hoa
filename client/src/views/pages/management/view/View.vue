<template>
  <div id="page-data-view">
    <div id="view-data" v-if="data_not_found===1">
      <div class="vx-row">
        <div class="vx-col w-full md:w-1/2 mb-base" v-if="false">
          <vx-card title="Scope of Access" class="mb-base">
            <AssignAccess></AssignAccess>
          </vx-card>
        </div>

        <div class="vx-col w-full mb-base">
          <vx-card title="Approver" class="mb-base">
            <agGridApprover></agGridApprover>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agGridPortfolioManagers from '@/views/pages/dashboard/agGrid-portfolioManagers/agGrid.vue'
import agGridPortfolioManagersAdmin from '@/views/pages/dashboard/agGrid-portfolioManagersAdmin/agGrid.vue'
import agGridApprover from '@/views/pages/dashboard/agGrid-approvers/agGrid.vue'
import AssignAccess from '@/views/components/user-org-role/AssignAccess.vue'

import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'
const jwt = require('jsonwebtoken')
const decoded = jwt.verify(localStorage.usertoken, 'secret') 

export default {
  components: {
    agGridPortfolioManagers,
    agGridPortfolioManagersAdmin,
    agGridApprover,
    AssignAccess
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
        const result = await axios.post(`/portfolio/delete/${viewId}`, {
          token: this.token
        })

        this.showDeleteSuccess()
        this.$router.push({name:'app-portfolio-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Management Page',
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
    async loadData() {
      const viewId = this.$route.params.viewId
      const result = await axios.get(`/portfolio/view/${viewId}`, {
        headers: { 
          'Authorization': this.token
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg
        }
      })

      if(result['data'] === 'access_denied') {
        this.loading = false
        return false
      } else {
        this.listData = result['data']
        this.loading = false
      }
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('management-list', 'list')
      this.showC = await mainHelper.cansee('management-create', 'create')
      this.showR = await mainHelper.cansee('management-read', 'read')
      this.showU = await mainHelper.cansee('management-update', 'update')
      this.showD = await mainHelper.cansee('management-delete', 'delete')

      if (!this.showL) {
        this.data_not_found = 2
        throw new Error('You are not authorized to view this page. ')
      }

      this.data_not_found = 1
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Management Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted() {
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
