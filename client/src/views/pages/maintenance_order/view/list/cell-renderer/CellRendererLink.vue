<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
    <!-- <router-link :to="url" @click.stop.prevent class="text-inherit font-bold hover:text-primary">{{ params.value }}</router-link> -->

    <a @click="receivedBy" class="cursor-pointer text-inherit font-bold hover:text-primary router-link-exact-active router-link-active hover:text-primary" v-if="showR">{{ params.value }}</a>
    <router-link to="" @click.stop.prevent class="font-normal cursor-auto" v-if="!showR">{{ params.value }}</router-link> <!--crud-->      
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  name: 'CellRendererLink',
  data () {
    return {
      // crud
      showR: false,            
      token: localStorage.usertoken,
      al: null
    }
  },  
  methods: {
    async receivedBy () {
      this.$router.push('/rfp/view/'+ this.params.data.id)
    }
  },
  computed: {
    async url () {
      return '/rfp/view/'+ this.params.data.id
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('maintenance-read', 'read')
    this.al = await mainHelper.loadUserVal()
    console.log('this.al ', this.al)
  }  
}
</script>
