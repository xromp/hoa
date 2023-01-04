<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
<!--     <router-link :to="url" @click.stop.prevent class="text-inherit font-bold hover:text-primary">{{ params.value }}</router-link> -->
    <span v-if="!showR || isParentRole">{{ params.value }}</span> <!--crud-->    
    <router-link :to="url" @click.stop.prevent class="text-inherit font-bold" v-else>{{ params.value }}</router-link>
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
      return '/user-types/view/'+ this.params.data.id
    },
    isParentRole() {
      return this.params.data.parent_id === 0;
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('role-read', 'read')
  }    
}
</script>
