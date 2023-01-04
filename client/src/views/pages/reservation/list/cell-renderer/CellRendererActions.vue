<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- crud -->
      <feather-icon icon="CheckCircleIcon" svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmApproveReservation" v-if="isAdmin"/>
      <feather-icon icon="CheckCircleIcon" svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed" v-if="!isAdmin"/>
      <feather-icon icon="XCircleIcon" svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" @click="showRejectReasonFormModal = true" v-if="showD"/>
      <feather-icon icon="XCircleIcon" svgClasses="h-5 w-5 text-gray cursor-not-allowed" v-if="!showD"/>

      <vs-prompt
        class="calendar-event-dialog"
        color="danger"
        title="Reject Reservation"
        accept-text= "Submit"
        cancel-text = "Cancel"
        @cancel="rejectReason=''"
        @accept="rejectReservation"
        :is-valid="validReason"
        :active.sync="showRejectReasonFormModal">
        <div class="con-exemple-prompt">
          <vs-textarea label="Reason for rejection" v-model="rejectReason"/>

          <vs-alert :active="!validReason" color="danger" icon="new_releases" >
            Please provide a reason for rejection.
          </vs-alert>
        </div>
      </vs-prompt>
    </div>
</template>

<script>
import common from '@/common'
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  data () {
    return {
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      asTenant: [
        'user'
      ],
      
      // crud
      showU: false,
      showD: false,

      token: localStorage.usertoken,

      rejectReason: '',
      showRejectReasonFormModal: false
    }
  },
  name: 'CellRendererActions',
  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    validReason () {
      return this.rejectReason.length > 0 && this.rejectReason !== null
    }
  },
  methods: {
    approveReservation () {
      const data = this.params.data
      this.updateReservation('approve', data)
    },
    confirmApproveReservation () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: 'Confirm Approve',
        text: `Are you sure you would like to approve "${this.params.data.title}"?`,
        accept: this.approveReservation,
        acceptText: 'Approve'
      })
    },
    rejectReservation () {
      const data = this.params.data
      data.rejection_reason = this.rejectReason
      this.updateReservation('reject', data)
    },
    updateReservation (label, data) {
      new Promise(async ()  => {
        try {
          data.property_ref = localStorage.selectedPropertyRef
          data.updatedAt = common.addHours(new Date(), 0)
          data.label = label

          const res = await axios.post(`/amenity-reservation/save/${data.id}`, {
            data,
            token: this.token
          })

          if (res['data'] !== 'access_denied' && res['data'] !== '') {
            this.$vs.notify({
              color: 'success',
              title: `Reservation ${label === 'approve' ? 'Approved' : 'Rejected'}`,
              text: `The selected reservation was successfully ${label === 'approve' ? 'approved' : 'rejected'}`
            })
            this.params.context.componentParent.loadList()
          }  else {
            throw new TypeError('Something went wrong')
          }
        } catch (err) {
          this.$vs.notify({
            color: 'danger',
            title: 'Data Saving Error',
            text: err.toString('utf8')
          })
        }
      })
    }
  },
  async created () {
    // crud
    this.showU = await mainHelper.cansee('reservation-update', 'update')
    this.showD = await mainHelper.cansee('reservation-delete', 'delete')
  }
}
</script>
