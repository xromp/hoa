<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- crud -->
      <feather-icon icon="DownloadIcon" svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="downloadFile" v-if="showDownload"/>
      <feather-icon icon="DownloadIcon" svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed" v-if="!showDownload"/>
      <feather-icon icon="Trash2Icon" svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" v-if="showDelete"/>
      <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 text-gray cursor-not-allowed" v-if="!showDelete"/>
    </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud

export default {
  data () {
    const folderId = this.$route.params.id;
    return {
      // crud
      showDownload: false,
      showDelete: false,

      token: localStorage.usertoken,
      folderId,
    }
  },
  name: 'CellRendererActions',
  methods: {
    async downloadFile () {
      this.$vs.loading();
      const headers = { 'Authorization': this.token },
        params = { path: this.params.data.file_name },
        { data } = await axios.get(`/file-manager/file`, { headers, params }),
        { Body } = data,
        fileBlobArray = new Uint8Array(Body.data),
        file = new Blob([fileBlobArray], { type: 'application/pdf;base64' }),
        fileURL = URL.createObjectURL(file);
      this.$vs.loading.close();
      const anchor = document.createElement('a');
      anchor.href = fileURL;
      anchor.download = this.params.value;
      document.body.appendChild(anchor);
      return anchor.click();
    },
    confirmDeleteRecord () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.value}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord () {
      new Promise(async(resolve, reject)  => {
        try {
          const headers = { 'Authorization': this.token };
          const { data } = await axios.delete(`/file-manager/file/${this.params.data.id}`, { headers })
          if (data == 'access_denied' || data == '') {
            this.$vs.notify({
              color: 'danger',
              title: 'Error loading',
              text: 'Something went wrong'
            })
          } else {
            this.showDeleteSuccess()
            setTimeout(() => {
              window.location.href = `/files/${this.folderId}`
            }, 500)
          }
        } catch(err) {
          reject(err.toString('utf8'));
        }      

      })
    },
    showDeleteSuccess () {
      this.$vs.notify({
        color: 'success',
        title: 'Data Deleted',
        text: 'The selected data was successfully deleted'
      })
    }
  },
  async created () {
    // crud
    this.showDownload = await mainHelper.cansee('file-manager-read', 'read')
    this.showDelete = await mainHelper.cansee('file-manager-delete', 'delete')
  }  
}
</script>
