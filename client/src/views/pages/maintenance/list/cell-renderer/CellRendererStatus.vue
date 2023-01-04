<template>
    <vs-chip class="ag-grid-cell-chip" :color="chipColor(params.value)">
      <span>{{ params.value }}</span>
    </vs-chip>
</template>

<script>
export default {
  name: 'CellRendererStatus',
  computed: {
    chipColor () {
      return (value) => {
        console.log('status value ', value)
        if (value === 'Completed') return 'success'
        else if (value === 'Completed(Vendor Work Completed)') return 'danger'
        else if (value === 'New Unassigned') return 'danger'
        else if (value === 'Work Scheduled') return 'warning'
        else if (value === 'Under Review') return 'warning'
        else if (value === 'On Hold') return 'warning'
        else if (value === 'Assigned Not Started') return 'warning'
        else if (value === 'Work Started') return 'warning'
        else if (value === 'Late') return 'warning'
        else if (value === 'Closed - No Work Done') return 'warning'
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
