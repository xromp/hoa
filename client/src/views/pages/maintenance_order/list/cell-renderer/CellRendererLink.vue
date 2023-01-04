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
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager',
        'staff'
      ],

      // crud
      showR: false,            
      token: localStorage.usertoken,
      al: null
    }
  },  
  methods: {
    async receivedBy () {
      if (this.isAdmin && this.params.data.request_to === null) {  
        this.params.data.property_ref = localStorage.selectedPropertyRef      
        await axios.post(`/order/received-by/${this.params.data.id}`, {
          token: this.token,
          data: this.params.data
        })
      }

      this.$router.push('/orders/view/'+ this.params.data.id)
    }
  },
  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.al)
    },
    async url () {
      return '/orders/view/'+ this.params.data.id
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('order-read', 'read')
    this.al = await mainHelper.loadUserVal()
    console.log('this.al ', this.al)
  }  
}
</script>
