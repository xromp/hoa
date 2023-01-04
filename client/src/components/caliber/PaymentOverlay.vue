<template>
  <q-inner-loading :showing="show">
    <q-spinner-gears size="50px" color="primary" />
        Processing Payment.. Please don't leave this page.
  </q-inner-loading>
</template>

<script>
export default {
  name: 'PaymentOverlay',
  props:["show"],
  computed: {},
   data() {
    return {
       
    }
   }
}
</script>
