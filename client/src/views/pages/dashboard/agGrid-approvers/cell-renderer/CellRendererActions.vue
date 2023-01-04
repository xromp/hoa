<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
      <vs-popup classContent="popup-example" title="Update Approver" :active.sync="showCreateDialog">
        <div class="vx-col">
          <div class="mt-6">
            <label class="vs-input--label">Name: </label>
            <strong><span>{{params.data.user.full_name}}</span></strong>
          </div>

          <div class="mt-6">
            <label class="vs-input--label">Property: </label>
            <strong><span>{{params.data.property.name}}</span></strong>
          </div>

          <div class="mt-6">
            <vs-checkbox v-model="params.data.is_creator">Approver creator</vs-checkbox>
          </div>

          <div class="mt-6" style="float: right; margin-top: 7em !important">
            <vs-button class="mr-2" @click="update" color="primary" type="filled">Update</vs-button>
          </div>
        </div>
      </vs-popup> 
    </div>
</template>

<script>
import axios from '@/axios'
import EventBus from '@/EventBus'

export default {
  name: 'CellRendererActions',
  data() {
    return {
      showCreateDialog: false,
    }
  },
  mounted() {
    console.log(this.params.data)
  },
  computed: {
    token() {
      return localStorage.usertoken;
    }
  },
  methods: {
    async update() {
      try {
        const headers = { 'Authorization': this.token };
        await axios.post(`/approver/update-role`, this.params.data, { headers });
        this.showCreateDialog = false
        this.$vs.notify({
          color: 'success',
          title: 'Saving Approver',
          text: 'The selected data was successfully saved'
        });
        this.$router.go(0);
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Approver',
          text: response.data.errors,
        })
      }
    },
    editRecord () {
      this.showCreateDialog = true;
    },
    async confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.user.full_name}"`,
        accept: await this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async deleteRecord () {
      try {
        const token = localStorage.usertoken;        
        const headers = { 'Authorization': token };
        await axios.delete(`/approver/${this.params.data.id}`, { headers });
        this.showCreateDialog = false
        this.showDeleteSuccess()
        this.$router.go(0);
        EventBus.$emit('load-approver')
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'User Deleted',
          text: response.data.errors
        }) 
      }
      
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'User Deleted',
        text: 'The selected user was successfully deleted'
      })
    }
  }
}
</script>
