<template>
	<div class="vx-row">
    <div class="vx-col w-full" v-if="files.length > 0">
      <div class="avatar-img mr-8 rounded" >
        <img :src="files[0]['file']" class="mr-8 rounded w-full"/>
      </div>      
    </div>
    <div class="vx-col w-full" v-else>
      <div class="avatar-img" id="img-container">
        <img :src="showDefault" class="rounded w-full" />
      </div>
    </div>

    <div class="vx-col w-full mt-4">
      <input type="file" id="fileD" class="hidden" ref="update_avatar_input" @change="update_avatar" accept="image/*">
      <vs-button color="success" class="mr-4" @click="$refs.update_avatar_input.click()">Update Image</vs-button>

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
        { id: 9, ext: 'JPEG', type: 'image'}
      ],

      // uploading docs
      files: [],
      lightboxImgs: [],
      fileKey: [],

      tableRead: [],
      rawFiles: [],
      resUp: [],
      filesDel: [], 
      showDefault: null,

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
    defaultImg: {
      type: String,
      required: false
    },
  },
  mounted() {
    this.openLoadingContained()
  },
  methods: {
    openLoadingContained(){
      this.$vs.loading({
        background: 'primary',
        color: '#fff',
        container: "#img-container",
        scale: 0.45
      })
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
      this.$vs.loading()
      let formdata = new FormData();
      $.each($('#fileD')[0].files, function(i, file) {
        formdata.append('fileD_'+i, file);
      });
      formdata.append('token', this.token)

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
          let fileType = this.fileExt.find(v => ( value['name'].includes(v.ext) ));
          let blobType = null

          if (fileType === undefined) {
            this.errors.add({ field: 'data_files', msg: 'Please upload a valid image type.' });
            this.$vs.loading.close()
            return
          }
          this.errors.remove('data_files')
          this.files = []

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
      this.$vs.loading.close()
    },    
    async loadFiles () {
      try {
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
            let fileType = this.fileExt.find(v => ( value['key'].includes(v.ext) ));
            let fileURL = value.data
            let filePush = {'type':fileType === undefined ? 'other' : fileType.type, 'file':fileURL}
            this.files.push(filePush)
            this.lightboxImgs.push(fileURL)
            this.fileKey.push(value.key)
          }
        }

        setTimeout(() => {
          this.$vs.loading.close('div#img-container > .con-vs-loading')
          this.$vs.loading.close('.con-vs-loading')
          this.showDefault = this.defaultImg
        }, 2000);
      } catch (err) {
        this.$vs.loading.close()
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
      }
    }
  },
  async created () {   
  	await this.loadFiles() 
  }
}
</script>
<style>
  .avatar-img {
    position: relative;
    width: 148px;
    overflow: hidden;
    padding-top: 148px;
  }

  .avatar-img img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
  }
</style>