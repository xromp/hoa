<template>
  <div class="flex items-center">
    <span class="text-inherit hover:text-primary">{{ formatDate }}</span>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CellRendererDateTime',
  computed: {
    formatDate() {
      return this.params.value === null ? '--' : moment(new Date(this.params.value)).format('MMM DD YYYY hh:mma')
    },
  }
}
</script>
