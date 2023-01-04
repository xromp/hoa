<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
    <span class="text-inherit hover:text-primary">{{ new Date(params.value) | date(true) }}</span>
  </div>
</template>

<script>
export default {
  name: 'CellRendererDate',
  computed: {
  }
}
</script>
