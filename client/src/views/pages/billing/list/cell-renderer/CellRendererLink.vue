<template>
  <div class="flex items-center">
    <!-- <vs-avatar :src="params.data.avatar" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" /> -->
    <router-link :to="url" @click.stop.prevent class="text-inherit font-bold 
    hover:text-primary" v-if="permission.read">{{ invoiceNo  }}</router-link>
    <router-link to="" @click.stop.prevent class="font-normal cursor-auto" v-else>{{ invoiceNo }}</router-link> <!--crud-->
  </div>
</template>

<script>
import mainHelper from '@/mainHelper' //crud

export default {
  name: 'CellRendererLink',
  data () {
    return {
      permission: {},
      token: localStorage.usertoken
    }
  },  
  computed: {
    url () {
      return '/billings/view/'+ this.params.data.id
    },
    invoiceNo() {
      return this.params.value || 'N/A';
    }
  },
  async created () {
    const ledgerType = this.params.type === 'AP' ? 'account-payable' : 'account-receivable';
    this.permission = {
      read: await mainHelper.cansee(`${ledgerType}-read`, 'read'),
    };
  }  
}
</script>
