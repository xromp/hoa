<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
    </div>
</template>

<script>
import axios from '../../../../../axios'
export default {
  data () {
    return {
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    editRecord () {
      this.$router.push("/parts/edit/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.device_name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post("/part/delete/"+ this.params.data.id, {
              token: this.token
            })
            .then(res => {
              if(res['data'] == 'access_denied' || res['data'] == '') {
                this.$vs.notify({
                  color: 'danger',
                  title: 'Error loading',
                  text: 'Something went wrong'
                })
              } else {
                this.showDeleteSuccess()
                setTimeout(() => {
                  window.location.href = "/parts/list";
                },500)                
              }
            })
            .catch(err => {              
              reject(err)
            }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

      })
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
