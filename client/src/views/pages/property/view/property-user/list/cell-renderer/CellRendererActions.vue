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
      this.$router.push("/property-user/save/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      console.log('this.params.data ', this.params.data)
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.property.name}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      new Promise(async(resolve, reject)  => {
        try {    
          await axios.post("/property-user/delete/"+ this.params.data.id, {
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
                this.loadListData()
                // setTimeout(() => {
                //   window.location.href = "/dashboard/analytics";
                // },500)                
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
    },
    loadListData() {
      const viewId = decoded.pmc_id
      var d = new Promise(async(resolve, reject)  => {
        try {    
            await axios.get(`/property-user/user/list/${this.$route.params.viewId}`, {
                headers: { 
                  'Authorization': this.token,
                  'property_ref': localStorage.selectedPropertyRef
                }
              })
              .then(res => { 
                if(res['data'] != 'access_denied') {
                  resolve(res['data'])  
                } else {
                  this.$router.push({name:'page-not-authorized'})
                }
                this.$vs.loading.close()
                this.value1 = parseInt(this.$route.params.viewId)
                this.value2 = []
              })
              .catch(err => {
                this.$vs.loading.close()
                console.log(err)
              }) 
        } catch(err) {
          reject(err.toString('utf8'));
        }      

        d.then((res) => {
          EventBus.$emit('property-user-list', res)
        })
      })      
    }
  }
}
</script>
