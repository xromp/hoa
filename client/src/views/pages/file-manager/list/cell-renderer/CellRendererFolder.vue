<template>
    <div class="flex items-center">
      <router-link
        :to="url" 
        @click.stop.prevent 
        class="text-inherit font-bold hover:text-primary flex"
        v-if="showR"
        >
        <feather-icon icon="FolderIcon" svgClasses="h-6 w-6" />
        <span class="ml-2">{{ ` ${params.value}` }}</span>
      </router-link>
      <router-link to="" @click.stop.prevent class="font-normal cursor-auto" v-if="!showR">{{ params.value }}</router-link> <!--crud-->  
    </div>
</template>

<script>
import mainHelper from '@/mainHelper' //crud
export default {
  name: 'CellRendererFolder',
  data () {
    return {
      // crud
      showR: false,            
      token: localStorage.usertoken,
      al: null
    }
  },  
  computed: {
    url () {
      return `/files/${this.params.data.id}`;
    }
  },
  async created () {
    // crud
    this.showR = await mainHelper.cansee('file-manager-read', 'read')
    this.al = await mainHelper.loadUserVal()
    console.log('this.al ', this.al)
  }  
}
</script>

<style lang="scss" scpoped>
.ag-grid-cell-chip {
  &.vs-chip-success {
    background: rgba(var(--vs-success),.15);
    color: rgba(var(--vs-success),1) !important;
    font-weight: 500;
  }
  &.vs-chip-warning {
    background: rgba(var(--vs-warning),.15);
    color: rgba(var(--vs-warning),1) !important;
    font-weight: 500;
  }
  &.vs-chip-danger {
    background: rgba(var(--vs-danger),.15);
    color: rgba(var(--vs-danger),1) !important;
    font-weight: 500;
  }
}
</style>
