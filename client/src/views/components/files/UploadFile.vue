<template>
	<div class="vx-row">
	  <div class="vx-col w-full">
	    <!-- uploading docs -->
	    <label class="text-sm pl-2">Files</label>
	    <div class="flex items-start flex-col sm:flex-row">
	      <div v-if="files.length > 0" v-for="(item, file) in files">
	      <feather-icon icon="XCircleIcon" svgClasses="h-6 w-6" style="top: 12px;left: 82px;color: #ea5455;" class="cursor-pointer" @click="deleteImage(fileKey[file], file)"/>
	      <span class="flex"> 
	        <a v-if="item.type === 'image' ">               
	          <img :src="item.file" class="mt-4 mr-8 rounded h-24 w-24" @click="showMultiple(file)"/>
	        </a>
	        <a :href="item.file" target="_blank" :download="item.name" v-else-if="item.type === 'document'">
	          <img src="@/assets/images/axp/file-icons/docx.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
	        </a>
	        <a :href="item.file" target="_blank" v-else-if="item.type === 'pdf'">
	          <img src="@/assets/images/axp/file-icons/pdf.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
	        </a>
	        <a :href="item.file" target="_blank" :download="item.name" v-else-if="item.type === 'excel'">
	          <img src="@/assets/images/axp/file-icons/xlsx.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
	        </a>
	        <a :href="item.file" target="_blank" :download="item.name" v-else>
	          <img src="@/assets/images/axp/file-icons/file.png"  class="mt-4 mr-8 rounded h-24 w-24"/>
	        </a>
	      </span>
	    </div>
	      <p v-if="files.length ==0" class="text-sm pl-2">No files uploaded</p>
	    </div>

	    <div class="flex items-start flex-col sm:flex-row">
	      <!-- <vs-avatar :src="data_localavatar" size="80px" class="mr-4" /> -->
	      <!-- uploading docs -->
	      <div class="mt-4">            
	        <input type="file" multiple="multiple" id="fileD" class="hidden" ref="update_avatar_input" @change="update_avatar" accept=".xlsx, .xls, image/*, .doc, .docx, .pdf" name='data_files'>                    

	        <vs-button color="success" class="mr-4 loading-container" @click="$refs.update_avatar_input.click()" :disabled="loading">Upload Files</vs-button>
	      </div>
	    </div>

      <span class="text-danger text-sm mt-2 flex"  v-show="errors.has('data_files')">{{ errors.first('data_files') }}</span>	    
	  </div>
	</div>	
</template>

<script>
import axios from '@/axios'
import EventBus from '@/EventBus'

export default {
  data () {
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

      // uploading docs
      files: [],
      lightboxImgs: [],
      fileKey: [],

      tableRead: [],
      rawFiles: [],
      resUp: [],
      filesDel: [], 
      loading: false,

      token: localStorage.usertoken     
		}
	},
	props: {
    loadFile: {
      type: Boolean,
      required: false
    },
    folderPath: {
      type: String,
      required: false
    },
    folderId: {
      type: Number,
      required: false
    },
  },
  watch: { 
    files: function() { 
      this.openLoadingContained()
    }
  },
  methods: {
    openLoadingContained(){
      this.$vs.loading({
        background: 'rgba(255, 255, 255, .8)',
        color: 'black',
        container: ".loading-container",
        scale: 0.45
      })
      this.loading = true
    }, 
    deleteImage(f, k) {     
      this.$delete(this.fileKey, k)
      this.$delete(this.files, k)
      this.filesDel.push(f)

      this.$vs.notify({
        color: 'success',
        title: 'Deleting Data',
        text: 'File deleted'
      })

      let newRawFiles = this.rawFiles.filter(r => this.fileKey.includes(r.original_file_name) )
      this.rawFiles = newRawFiles

      EventBus.$emit('delete-file', this.filesDel)
      EventBus.$emit('create-file', newRawFiles)     
      setTimeout(() => {
        this.$vs.loading.close("button.loading-container div.con-vs-loading")
        this.loading = false
      }, 1000)
    },  	
    //uploading docs
    _arrayBufferToBase64( buffer ) {
      let binary = '';
      let bytes = new Uint8Array( buffer );
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    //uploading docs
    async update_avatar () {
      this.openLoadingContained()
      let formdata = new FormData();
      $.each($('#fileD')[0].files, function(i, file) {
        formdata.append('fileD_'+i, file);
      });
      $('#fileD').val('')
      formdata.append('token', this.token)
      formdata.append('filePath', this.folderPath)

      this.resUp = await axios.post(`/docs/upload`,  
        formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
      )

      if(this.resUp.data.rawD !== null && this.resUp.data.rawD !== undefined) {   
        for (const [key, value] of Object.entries(this.resUp.data.rawD)) {
          let imgB64 = this._arrayBufferToBase64( value.data.data )
          let imgAsc = imgB64.toString('ascii')
          let fileName = value['name'].split(".").slice(0, -1).join(".")

          console.log('fileType ', fileType)

          let fileType = this.fileExt.find(v => ( value['name'].includes(v.ext) ));
          let blobType = null

          // if (fileType === undefined) {
          //   this.errors.add({ field: 'data_files', msg: 'Please upload a valid file type (.pdf, .docx, .xlsx, .jpg, .png).' });
          //   this.$vs.loading.close()
          //   return
          // }
          // this.errors.remove('data_files')

          switch (fileType) {
            case 'pdf':              
              blobType = 'application/pdf;base64'
              break;
            case 'xlsx':
              blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              break;
            case 'docx':
              blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              break;
            case 'jpg':
              blobType = 'data:image/jpg;base64' + imgAsc
              break;
            case 'png':
              blobType = 'data:image/png;base64' + imgAsc
              break;
          }

          let fileBlobArray = new Uint8Array(value.data.data)
          let file = new Blob([fileBlobArray], { type: blobType })
          let fileURL = URL.createObjectURL(file);
          let filePush =  { 'type':fileType === undefined ? 'other' : fileType.type, 
                            'file':fileURL, 
                            'name': fileName
                          }

          this.files.push(filePush)
          this.lightboxImgs.push(fileURL)
          this.fileKey.push(value.name)
        }
      }      

      if (this.resUp.data.uploadedD !== undefined && this.resUp.data.uploadedD.length > 1) {
        for (const [key, value] of Object.entries(this.resUp.data.uploadedD)) {
          this.rawFiles.push(value)
        }
      } else if(this.resUp.data.uploadedD !== undefined) {
        this.rawFiles.push(this.resUp.data.uploadedD)
      }    

      EventBus.$emit('create-file', this.rawFiles)      
      setTimeout(() => {
        this.$vs.loading.close("button.loading-container div.con-vs-loading")
        this.loading = false
      }, 1000)
    },    
    async loadFiles () {
    	if (!this.loadFile) return      
      this.files = []
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
          // let blobType = null

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

      setTimeout(() => {
        this.$vs.loading.close("button.loading-container div.con-vs-loading")
        this.loading = false
      }, 1000)
    }
  },
  async created () {   
  	await this.loadFiles() 
  }
}
</script>