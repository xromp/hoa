<template>
    <div class="flex items-center">
      <a
        v-if="showR"
        @click="openFile"
        class="text-inherit font-bold hover:text-primary cursor-pointer">
        <i class="far fa-file-pdf" 
          v-if="this.params.data.mime_type === 'application/pdf'"
          style="font-size:24px"
          ></i>
        <feather-icon
            icon="FileIcon"
            size="12"
            v-else
          />
        <span class="ml-2">{{ ` ${params.value}`}}</span>
      </a>
      <a
        v-if="!showR"
        class="text-inherit font-bold hover:text-primary">
        <i class="far fa-file-pdf" 
          v-if="this.params.data.mime_type === 'application/pdf'"
          style="font-size:24px"
          ></i>
        <feather-icon
            icon="FileIcon"
            size="12"
            v-else
          />
        <span>{{ ` ${params.value}`}}</span>
      </a><!--crud-->   
      
    </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import { BTooltip } from 'bootstrap-vue'

export default {
  data () {
    return {
      // crud
      showR: false,            
      token: localStorage.usertoken,
      al: null,
      pdfFileB64: '',
    }
  },  
  name: 'CellRendererFolder',
  methods: {
    async openFile() {
      this.$vs.loading();
      const headers = { 'Authorization': this.token },
        params = { path: this.params.data.file_name },
        { data } = await axios.get(`/file-manager/file`, { headers, params }),
        { Body } = data,
        fileBlobArray = new Uint8Array(Body.data),
        file = new Blob([fileBlobArray], { type: 'application/pdf;base64' }),
        fileURL = URL.createObjectURL(file);
      this.$vs.loading.close();
      return window.open(`${fileURL}`);
    },
  },
  computed: {
    url () {
      return this.params.data.s3Link;
    }
  },
  async created() {
    // crud
    this.showR = await mainHelper.cansee('file-manager-read', 'read')
    this.al = await mainHelper.loadUserVal()
  },
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
