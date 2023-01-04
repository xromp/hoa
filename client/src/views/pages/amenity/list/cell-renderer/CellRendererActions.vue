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
      this.$router.push("/amenities/edit/"+ this.params.data.id)
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
        await axios.post("/amenity/delete/"+ this.params.data.id, {
          token: this.token
        })

        this.$vs.notify({
          time:10000,
          color: 'success',
          title: 'Data Deleted',
          text: 'The selected data was successfully deleted!'
        })
        EventBus.$emit('amenity-list', true)
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    }
  },
  async created () {
    // crud
    this.showU = await mainHelper.cansee('amenity-update', 'update')
    this.showD = await mainHelper.cansee('amenity-delete', 'delete')
  }  
}
</script>
