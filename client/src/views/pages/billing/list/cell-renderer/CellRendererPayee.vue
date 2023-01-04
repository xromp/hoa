<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
    <router-link to="" @click.stop.prevent class="font-normal cursor-auto">{{ payee }}</router-link> <!--crud-->
  </div>
</template>

<script>
import mainHelper from '@/mainHelper' //crud

export default {
  name: 'CellRendererPayee',
  data () {
    return {
      permission: {},
      token: localStorage.usertoken
    }
  },  
  computed: {
    payee() {
      return mainHelper.optionalChaning(() => this.params.value.unit_users[0].user.full_name);
    }
  },
}
</script>
