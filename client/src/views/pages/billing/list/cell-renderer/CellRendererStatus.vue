<template>
    <vs-chip class="ag-grid-cell-chip" :color="chipColor">
      <span>{{ chipValue }}</span>
    </vs-chip>
</template>

<script>
export default {
  name: 'CellRendererStatus',
  data() {
    return {
      status: {
        draft: { color: 'default', text: 'Draft'},
        unpaid: { color: 'warning', text: 'Unpaid'},
        paid: { color: 'success', text: 'Paid'},
      }
    }
  },
  computed: {
    invoiceStatus() {
      return this.params.data.status === 'FOR_APPROVAL'
        ? 'draft' 
        : !!this.params.value 
          ? 'paid'
          : 'unpaid';
    },
    chipColor () {
      return this.status[this.invoiceStatus].color;
    },
    chipValue () {
      return this.status[this.invoiceStatus].text;
    }
  }
}
</script>

<style lang="scss" scoped>
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
  &.vs-chip-default {
    background: rgba(var(--vs-primary),.15);
    color: rgba(var(--vs-default),1) !important;
    font-weight: 500;
  }
}
</style>
