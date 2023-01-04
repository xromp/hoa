
<template>
  <div id="page-data-edit">

    <vs-alert color="danger" title="Data Not Found" :active.sync="data_not_found">
      <span>Data record with id: {{ $route.params.editId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'app-user-list'}" class="text-inherit underline">All Data</router-link>
      </span>
    </vs-alert>

    <vx-card>

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="User Details" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <edit-tab-account class="mt-4" :data="edit_data" />
            </div>
          </vs-tab>          
        </vs-tabs>

      </div>

    </vx-card>
  </div>
</template>

<script>
import EditTabAccount     from './EditTabAccount.vue'
import axios from '../../../../axios'

export default {
  components: {
    EditTabAccount
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
  created () {
    
  }
}

</script>
