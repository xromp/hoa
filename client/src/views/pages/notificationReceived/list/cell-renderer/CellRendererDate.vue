<template>
  <div class="flex items-center">
    <span class="text-inherit hover:text-primary">{{ formatDate }}</span>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CellRendererDate',
  computed: {
    formatDate() {
      return moment(String(this.params.value)).format('DD MMM YYYY hh:mm')
    },
  }
}
</script>
