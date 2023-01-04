<template>
  <div class="flex items-center">
    <router-link :to="url" @click.stop.prevent class="text-inherit font-bold hover:text-primary">{{ params.value }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'CellRendererLink',
  data() {
    return {
      data: {},
      urlMapping: {},
    }
  },
  computed: {
    url () {
      return this.urlMapping[this.params.data.type];
    },
    orderId() {
      const otherDataObj = JSON.parse(this.params.data.other_data_obj);
      return otherDataObj ? otherDataObj.order_id : '';
    }
  },
  mounted() {
    this.urlMapping = {
      bill: `/billings/view/${this.params.data.reference_id}`,
      mo: `/orders/edit/${this.params.data.reference_id}?t=0`,
      wo: `/orders/edit/${this.params.data.reference_id}?t=1`,
      rfp: `/orders/view/${this.orderId}`,
    }
  }
}
</script>
