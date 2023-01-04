<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" /> -->
      <feather-icon icon="Trash2Icon" svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" />
    </div>
</template>

<script>
import axios from '@/axios'
import EventBus from '@/EventBus'

export default {
  data () {
    return {
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    editRecord () {
      this.$router.push("/user-orgs/edit/"+ this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete User ${this.params.data.user.full_name} with Parent Org ${this.params.data.pmc.name}`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    async loadRole() {
      const result = await axios.get(`/user-org/get`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      EventBus.$emit('side-menu-role', result.data.optionRoleOrg)
    },
    async deleteRecord () {
      try {
        const result = await axios.post(`/user-org/delete/${this.params.data.id}`, null, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token
          }
        })

        localStorage.setItem('optionParentOrg', JSON.stringify(result.data))

        this.showDeleteSuccess()
        this.loadRole()
        this.$vs.loading()
        EventBus.$emit('user-org-list', true)
        EventBus.$emit('side-menu-parent', true)
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Unit User Page',
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
