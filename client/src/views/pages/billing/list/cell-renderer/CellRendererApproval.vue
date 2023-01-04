<template>
    <vs-chip class="ag-grid-cell-chip" :color="chipColor" v-if="params.value">
      <span>{{ chipValue }}</span>
    </vs-chip>
</template>

<script>
export default {
  name: 'CellRendererApproval',
  data() {
    return {
      status: {
        approved: { color: 'success', text: 'Approved'},
        pending: { color: 'warning', text: 'Pending'},
        denied: { color: 'danger', text: 'Denied'},
      }
    }
  },
  computed: {
    approvalStatus() {
      switch (this.params.value.status) {
        case 'Approved':
          return 'approved';
        case 'Denied':
          return 'denied';
        case 'Open':
          return 'pending';
        default:
          return '';
      }
    },
    chipColor () {
      return this.status[this.approvalStatus].color;
    },
    chipValue () {
      return this.status[this.approvalStatus].text;
    }
  }
}
</script>

<style lang="scss" scpoped>
.ag-grid-cell-chip {
  &.vs-chip-success {
    background: rgba(var(--vs-success),.15);
    color: rgba(var(--vs-success),1) !important;
    font-weight: 500;
  }
  &.vs-chip-warning {
    background: rgba(var(--vs-warning),.15);
    color: rgba(var(--vs-warning),1) !important;
    font-weight: 500;
  }
  &.vs-chip-danger {
    background: rgba(var(--vs-danger),.15);
    color: rgba(var(--vs-danger),1) !important;
    font-weight: 500;
  }
}
</style>
