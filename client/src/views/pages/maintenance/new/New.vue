
<template>
  <div id="page-data-edit">

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-maintenance-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vx-card>

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner h-screen">
          <vs-tab label="Maintenance Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text h-screen">
              <edit-tab class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>          
        </vs-tabs>

      </div>

    </vx-card>
  </div>
</template>

<script>
import EditTab     from './EditTab.vue'
import axios from '../../../../axios'
import mainHelper from '@/mainHelper'

export default {
  components: {
    EditTab
  },
  data () {
    return {
      edit_data: null,
      data_not_found: false,

      /*
        This property is created for fetching latest data from API when tab is changed

        Please check it's watcher
      */
      activeTab: 0
    }
  },
  watch: {
    activeTab () {
      
    }
  },
  methods: {

  },
  async created () {
    var showP = await mainHelper.cansee(this.$route.meta.slug, 'create')
    if (!showP) {
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
