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
  data () {
    return {
      // crud
      showR: false,
      token: localStorage.usertoken
    }
  },   
  computed: {
    url () {
      return '/users/view/'+ this.params.data.id
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('user-read', 'read')
  }    
}
</script>
