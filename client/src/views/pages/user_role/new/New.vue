<template>
  <div id="page-data-edit">
    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-role-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="User Role Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>          
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import EditTab from './EditTab.vue'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  components: {
    EditTab
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
  watch: {
  },
  methods: {
  },
  async created () {
    try {
      this.$vs.loading()
      // crud
      this.showL = await mainHelper.cansee('role-list', 'list')
      this.showC = await mainHelper.cansee('role-create', 'create')
      this.showR = await mainHelper.cansee('role-read', 'read')
      this.showU = await mainHelper.cansee('role-update', 'update')
      this.showD = await mainHelper.cansee('role-delete', 'delete')

      if (!this.showC) {
        throw new Error('You are not authorized to view this page.')
      }

      this.$vs.loading.close()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Role Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}

</script>
