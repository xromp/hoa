<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- crud -->
      <feather-icon icon="Edit3Icon" svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" v-if="showU"/>
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed" v-if="!showU"/>
      <feather-icon icon="Trash2Icon" svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" v-if="showD && params.data.is_deleted===0"/>
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 text-gray cursor-not-allowed" v-if="!showD && params.data.is_deleted===0"/>

      <feather-icon icon="UserCheckIcon" svgClasses="text-success h-5 w-5 hover:text-primary cursor-pointer" @click="confirmActivateRecord" v-if="showU && params.data.is_deleted===1"/>
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
      this.$router.push("/users/edit/"+ this.params.data.id)
    },
    confirmActivateRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirm Activate',
        text: `You are about to activate "${this.params.data.full_name}"`,
        accept: this.activateRecord,
        acceptText: 'Activate'
      })
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to archive "${this.params.data.email}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async activateRecord () {
      try {
        await axios.post("/user/activate/"+ this.params.data.id, {
          token: this.token
        })

        this.$vs.notify({
          time:10000,
          color: 'success',
          title: 'Data Activated',
          text: 'The selected data was successfully activated'
        })
        EventBus.$emit('refetch-user');
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async deleteRecord () {
      try {
        await axios.post("/user/delete/"+ this.params.data.id, {
          token: this.token
        })

        this.$vs.notify({
          time:10000,
          color: 'success',
          title: 'Data Deleted',
          text: 'The selected data was successfully deleted!'
        })
        EventBus.$emit('refetch-user');
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
    this.showU = await mainHelper.cansee('user-update', 'update')
    this.showD = await mainHelper.cansee('user-delete', 'delete')
  }  
}
</script>
