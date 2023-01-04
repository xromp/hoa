<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
    <router-link :to="url" @click.stop.prevent class="text-inherit font-bold 
    hover:text-primary" v-if="showR">{{ params.value }}</router-link>
    <router-link to="" @click.stop.prevent class="font-normal cursor-auto" v-if="!showR">{{ params.value }}</router-link> <!--crud-->
  </div>
</template>

<script>
import mainHelper from '@/mainHelper' //crud

export default {
  name: 'CellRendererLink',
  data() {
    return {
      showR: false,
    }
  },
  computed: {
    url () {
      return '/notification-templates/view/'+ this.params.data.id
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('notification-template-read', 'read')
  } 
}
</script>
