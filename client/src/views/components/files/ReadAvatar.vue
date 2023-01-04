<template>
  <div class="vx-row">
    <div class="vx-col w-full" v-if="files.length > 0">
      <div class="avatar-img mr-8 rounded" >
        <img :src="files[0]['file']" class="mr-8 rounded w-full" /> <!-- @click="showMultiple(0)" -->
      </div>      
    </div>
    <div class="vx-col w-full" v-else>
      <div class="avatar-img" id="read-img-container">
        <img :src="showDefault" class="rounded w-full" />
      </div>
    </div>
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
        { id: 9, ext: 'JPEG', type: 'image'}
      ],

      imgs: '',  // Img Url , string or Array of string
      visible: false,
      index: 0,   // default: 0

      //reading docs
      tableRead: [],
      files: [],
      lightboxImgs: [],
      fileKey: [],
      showDefault:null,

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
    defaultImg: {
      type: String,
      required: true
    },
  },
  watch: { 
    folderPath: function() { 
      this.openLoadingContained()
      setTimeout(() => this.loadData(), 1000);
    }
  },
  methods: {
    openLoadingContained(){
      this.$vs.loading({
        background: 'primary',
        color: '#fff',
        container: "#read-img-container",
        scale: 0.45
      })
    }, 
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
      try {
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
            let blobType = null
            let fileURL = value.data
            let filePush = {'type':fileType === undefined ? 'other' : fileType.type, 'file':fileURL}
            this.files.push(filePush)
            this.lightboxImgs.push(fileURL)
            this.fileKey.push(value.key)
          }
        }  		
        
        setTimeout(() => {
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
  	await this.loadData()
  }
}

</script>

<style>
  .vel-modal[data-v-1f17a952] {
    z-index: 2 !important;
  }

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

  #read-img-container {
    z-index:9;
  } 
</style>