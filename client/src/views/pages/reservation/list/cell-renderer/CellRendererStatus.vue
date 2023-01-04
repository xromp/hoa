<template>
    <!-- <vs-chip class="ag-grid-cell-chip" :style="[{ 'background': params.value}, {'width':'80px'}]"> -->
    <vs-chip class="ag-grid-cell-chip" :color="chipColor(params.value)">
      <span>{{ params.value }}</span>
      <span style="width='20px;'"></span>
    </vs-chip>
</template>

<script>
export default {
  name: 'CellRendererStatus',
  computed: {
    chipColor () {
      return (value) => {
        if (value === 'approve') return 'success'
        else if (value === 'reject') return 'danger'
        else if (value === 'pending') return 'warning'
        else return 'primary'
      }
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
