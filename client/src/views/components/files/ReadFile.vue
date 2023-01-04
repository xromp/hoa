<template>
    <!-- Avatar -->
    <div class="vx-row">
      <!-- Information - Col 1 -->
      <!-- reading docs -->
      <div class="vx-col flex-1">
        <div class="flex items-start flex-col sm:flex-row">
          <div v-if="files.length > 0" v-for="(item, file) in files">
            <span class="flex"> 
              <a v-if="item.type === 'image' " class="cursor-pointer">               
                <img :src="item.file" class="mt-4 mr-8 rounded h-24 w-24" @click="showMultiple(file)"/>
              </a>
              <a :href="item.file" target="_blank" download="Document" v-else-if="item.type === 'document'">
                <img src="@/assets/images/axp/file-icons/docx.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
              </a>
              <a :href="item.file" target="_blank" v-else-if="item.type === 'pdf'">
                <img src="@/assets/images/axp/file-icons/pdf.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
              </a>
              <a :href="item.file" target="_blank" download="Book" v-else-if="item.type === 'excel'">
                <img src="@/assets/images/axp/file-icons/xlsx.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
              </a>	
              <a :href="item.file" download="File" v-else>
			          <img src="@/assets/images/axp/file-icons/file.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
			        </a>
            </span>
          </div>
          <p v-if="files.length == 0">No files uploaded</p>
        </div>
      </div>
      <!-- /Information - Col 1 -->

		  <vue-easy-lightbox
		    :visible="visible"
		    :imgs="lightboxImgs"
		    :index="index"
		    @hide="handleHide"
		  ></vue-easy-lightbox>	
  </div>
</template>

<script>
import EventBus from '@/EventBus'
import axios from '@/axios'

export default {
  components: {
  },

  data () {
    const token = localStorage.usertoken
    return {
      fileExt: [
        { id: 0, ext: 'jpg', type: 'image'},
        { id: 1, ext: 'JPG', type: 'image'},
        { id: 2, ext: 'png', type: 'image'},
        { id: 3, ext: 'PNG', type: 'image'},        
        { id: 4, ext: 'img', type: 'image'},
        { id: 5, ext: 'bmp', type: 'image'},
        { id: 6, ext: 'gif', type: 'image'},
        { id: 7, ext: 'GIF', type: 'image'},
        { id: 8, ext: 'jpeg', type: 'image'},
        { id: 9, ext: 'JPEG', type: 'image'},
        { id: 10, ext: 'xlsx', type: 'excel'},
        { id: 11, ext: 'xls', type: 'excel'},
        { id: 12, ext: 'csv', type: 'excel'},
        { id: 13, ext: 'docx', type: 'document'},
        { id: 14, ext: 'doc', type: 'document'},
        { id: 15, ext: 'pdf', type: 'pdf'},
        { id: 16, ext: 'jpeg', type: 'image'},
      ],

      imgs: '',  // Img Url , string or Array of string
      visible: false,
      index: 0,   // default: 0

      //reading docs
      tableRead: [],
      files: [],
      lightboxImgs: [],
      fileKey: [],

      token: localStorage.usertoken   	
    }
  },
  props: {
    folderPath: {
      type: String,
      required: true
    },
    folderId: {
      type: Number,
      required: true
    },
  },
  watch: { 
    folderPath: function() { 
      this.tableRead = []
      this.files = []
      this.lightboxImgs = []
      this.fileKey = []
      this.loadData()
    }
  },
  methods: {
    //reading docs
    _arrayBufferToBase64( buffer ) {
      let binary = '';
      let bytes = new Uint8Array( buffer );
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },  	
    showMultiple(k) {
      this.index = k  // index of imgList
      this.show()
    },
    show() {
      this.visible = true
    },  
    handleHide() {
      this.visible = false
    },    	
  	async loadData() {
      //reading docs
      this.tableRead = await axios.post(`/docs/table/read/`, {
        token: this.token,
        path: this.folderPath,
        document_folder_id: this.folderId
      })

      //reading docs
      if(this.tableRead.data.uploadedD !== null) {   
        for (const [key, value] of Object.entries(this.tableRead.data.uploadedD)) {
          // let imgB64 = this._arrayBufferToBase64( value.data.Body.data )
          // let imgAsc = imgB64.toString('ascii')

          let fileType = this.fileExt.find(v => ( value['key'].includes(v.ext) ));
          let blobType = null

          // switch (fileType) {
          //   case 'pdf':              
          //     blobType = 'application/pdf;base64'
          //     break;
          //   case 'xlsx':
          //     blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          //     break;
          //   case 'docx':
          //     blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          //     break;
          //   case 'jpg':
          //     blobType = 'data:image/jpg;base64' + imgAsc
          //     break;
          //   case 'png':
          //     blobType = 'data:image/png;base64' + imgAsc
          //     break;
          // }

          // let fileBlobArray = new Uint8Array(value.data.Body.data)
          // let file = new Blob([fileBlobArray], { type: blobType })
          // let fileURL = URL.createObjectURL(file);
          let fileURL = value.data
          let filePush = {'type':fileType === undefined ? 'other' : fileType.type, 'file':fileURL}
          this.files.push(filePush)
          this.lightboxImgs.push(fileURL)
          this.fileKey.push(value.key)
        }
      }  		
  	}
  },
  async created () {
  	await this.loadData()
  }
}

</script>
<style>
  .vel-modal[data-v-1f17a952] {
    z-index: 2 !important;
  }
</style>