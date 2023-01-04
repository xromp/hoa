
<template>
  <div id="page-data-edit">

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-billing-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vx-card>

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Billing Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <account-receivable-edit-tab
                class="mt-4"
                :data="edit_data"
                v-if="type === 'ar'"/>
              <account-payable-edit-tab
                class="mt-4"
                :data="edit_data"
                v-if="type === 'ap'"/>
            </div>
          </vs-tab>          
        </vs-tabs>

      </div>

    </vx-card>
  </div>
</template>

<script>
import AccountReceivableEditTab from './AccountReceivableEditTab.vue';
import AccountPayableEditTab from './AccountPayableEditTab.vue';
import axios from '@/axios';
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    AccountReceivableEditTab,
    AccountPayableEditTab,
  },
  data () {
    return {
      // crud
      showL: false,
      showC: false,
      showR: false,
      showU: false,
      showD: false,
            
      edit_data: null,
      data_not_found: false,

      activeTab: 0
    }
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
  },
  watch: {
    activeTab () {
      
    }
  },
  methods: {

  },
  async created () {
    // crud
    this.showL = await mainHelper.cansee('billing-list', 'list')
    this.showC = await mainHelper.cansee('billing-create', 'create')
    this.showR = await mainHelper.cansee('billing-read', 'read')
    this.showU = await mainHelper.cansee('billing-update', 'update')
    this.showD = await mainHelper.cansee('billing-delete', 'delete')

    if (!this.showC) {
      this.$vs.notify({
        color: 'danger',
        title: 'Loading Page',
        text: 'You are not authorized to view this page.'
      })
      this.$router.push('/dashboard/analytics')
    }
  }
}

</script>
