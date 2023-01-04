
<template>
  <div id="page-data-edit">
    
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Folder Details" icon-pack="feather" icon="icon-user">
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
  async created () {
    // crud
    this.showL = await mainHelper.cansee('file-manager-list', 'list')
    this.showC = await mainHelper.cansee('file-manager-create', 'create')
    this.showR = await mainHelper.cansee('file-manager-read', 'read')
    this.showU = await mainHelper.cansee('file-manager-update', 'update')
    this.showD = await mainHelper.cansee('file-manager-delete', 'delete')

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
