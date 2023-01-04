<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- crud -->
      <feather-icon icon="Edit3Icon" svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" v-if="showU"/>
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed" v-if="!showU"/>
      <feather-icon icon="Trash2Icon" svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" v-if="showD"/>
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 text-gray cursor-not-allowed" v-if="!showD"/>
    </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  data () {
    return {
      // crud
      showU: false,
      showD: false,
      
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    editRecord () {
      this.$router.push("/parentorg/edit/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        this.$vs.loading()
        const result = await axios.post("/portfolio/delete/"+ this.params.data.id, {
          token: this.token
        })

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))

        this.showDeleteSuccess()
        EventBus.$emit('user-org-list', true)
        EventBus.$emit('side-menu-parent', true)
        this.$vs.loading.close()
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Parent Org Page',
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
    }
  },
  async created () {
    // crud
    this.showU = await mainHelper.cansee('portfolio-update', 'update')
    this.showD = await mainHelper.cansee('portfolio-delete', 'delete')
  }
}
</script>
