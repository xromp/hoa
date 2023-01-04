<template>
  <download-excel
    :fetch = "loadApprovals"
    :fields = "fieldsMapping"
    :before-generate = "$vs.loading=true"
    :before-finish = "$vs.loading=false"
    worksheet="Approvals"
    name="Approval Audit Report"
  >
    <vs-button color="success" type="filled" icon-pack="feather" icon="icon-download">Export Approvals
    </vs-button>
  </download-excel>
</template>

<script>
import axios from '@/axios'
import DownloadExcel from "vue-json-excel";
import moment from 'moment'

export default {
  components: {
    DownloadExcel,
  },
  data() {
    return {
      data: [],
      fieldsMapping: {
      'Status': 'status', 
      'Type': 'approval.type_name', 
      'Reference': 'approval.reference_no', 
      'Date Sent':{
        field: 'createdAt',
        callback: (value) => moment(value).format('L')
      }, 
      'Completed Date': {
        field: 'completed_at',
        callback: (value) => moment(value).isValid() 
          ? moment(value).format('L')
          : 'Open',
        }, 
      'Days': {
        callback: ({ completed_at, completed_days, pending_days }) => moment(completed_at).isValid()
          ? completed_days
          : pending_days,
      },
      'Response Status': {
        callback: ({ completed_at }) => moment(completed_at).isValid()
          ? 'to Complete'
          : 'Outstanding',
      },
      'Created By': 'approval.user.full_name',
      'Created By Role': 'approval.user.user_role.name',
      'Comment': 'comment',
      'Level': 'level',
      'Approver Role': 'user.user_role.name',
      'Approver Name': 'user.full_name',
      'Overall Status': 'approval.status',
      'Overall Completion Date': {
        field: 'approval.completed_at',
        callback: (value) => moment(value).isValid() 
          ? moment(value).format('L')
          : 'Open',
      },
      'Overall Days': {
        field: 'approval',
        callback: ({ completed_at, completed_days, pending_days}) => moment(completed_at).isValid()
          ? completed_days
          : pending_days,
      },
      'Overall Response Status': {
        field: 'approval',
        callback: ({ completed_at }) => moment(completed_at).isValid()
          ? 'to Complete'
          : 'Outstanding',
        },
      },
    }
  },
  methods: {
    async loadApprovals () {
      try {
        const params = {
          property_ref: localStorage.selectedPropertyRef,
        }
        const { data } = await axios.get('/approval/export-approvals', {
          params,
          headers: { 'Authorization': localStorage.usertoken },
        });

        return data;
      } catch({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Fetching approvals',
          text: response.data.errors,
        })
      }             
    },
  },
}
</script>

<style>

</style>