<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
    </div>
</template>

<script>
import axios from '@/axios'
export default {
  data () {
    return {
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    editRecord () {
      this.$router.push("/user-types/edit/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.email}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const result = await axios.post("/role/delete/"+ this.params.data.id, {
          token: this.token
        })

        this.showDeleteSuccess()
        setTimeout(() => {
          window.location.href = "/user-types/list";
        },500) 
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Property Page',
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
  }
}
</script>
