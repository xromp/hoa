<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" /> -->
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
    </div>
</template>

<script>
import axios from '@/axios'
import EventBus from '@/EventBus'
const jwt = require('jsonwebtoken')
var decoded = jwt.verify(localStorage.usertoken, 'secret') 

export default {
  data () {
    return {
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    editRecord () {
      this.$router.push("/property-manager/save/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      console.log('this.params.data ', this.params.data)
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.unit.property.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const result = await axios.post(`/unit-user/delete/${this.params.data.id}`, null, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token
          }
        })

        this.showDeleteSuccess()
        EventBus.$emit('unit-user-list', true)
        EventBus.$emit('update-scope', true)
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
    showDeleteSuccess () {      
      this.$vs.notify({
        time:10000,
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted!'
      })
    }
  }
}
</script>
