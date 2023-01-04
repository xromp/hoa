<template>
  <div>
    <div class="promoPoster showOnMobile">
        <div class="banner" style="background-image:url(/images/registration-banner.jpg);"></div>
        <div class="container">
          <div id="printBtn" class="ar">
            <button onclick="window.print();" class="btn btn-green btn-sm mb20px" style="border: 2px solid #fff;"><i class="fa fa-print"></i> Print</button>
          </div>
          <div class="regTop d-flex justify-content-between">
            <div class="img" style="width: 20%;"><img src="@/assets/images/pages/poster/aXesspoint-Logo.png" alt=""></div>
            <div class="txt ac" style="flex:1;">
              <h2>{{view_data.name}}</h2>
              <h4>"Stay informed of all emergencies impacting your community"</h4>
            </div>
          </div>
          <div class="content">
            <div class="d-flex justify-content-between">
              <div class="right">
                <h2 class="mb20px mt30px">HOW TO GET THE APP</h2>
                <h4 class="mb20px"><u>CURRENT USERS</u></h4>
                <p><strong><u>If you have received an email from {{view_data.name}}</u></strong>, please open it on your phone and follow the instructions.</p>
                <p>Install <strong>"aXessPoint"</strong> app and open. Use the temporary password provided to login. Once you have logged in, please go to your profile on the top right by tapping on profile icon and change your password for aXessPoint.</p>
                <p><strong><u>If you do not receive an email from your {{view_data.name}}, please follow the steps below:</u></strong></p>
                <h4 class="mb20px"><u>NEW USERS</u></h4>

                <p><strong>STEP 1</strong><br>Go to the App Store on Iphone or Google Play Store on Android.</p>
                <p><strong>STEP 2</strong><br>Search for <strong>“aXessPoint”</strong>, select it and install.</p>
                <p>
                  <strong>STEP 3</strong><br>
                  Tap on the "aXessPoint 2.0" icon to launch the app<br>
                  Select "Sign Up" and the “Cick here to scan your property” and hover phone on the QR Code box that you see on your left to scan the image<br>
                  <strong>OR</strong><br>
                  Select "Property Code" and manually input the Property Code that you see on your left (case sensitive). Proceed to register.
                </p>
                <p><strong>STEP 4</strong><br>Select "sign up" and fill in the fields, submit and wait for your manager’s approval message. Once approved, you may log in.</p>
              </div>
              <div class="left ac">
                <div class="device">
                  <img src="@/assets/images/pages/poster/poster-phone-top.png" alt="" style="width:285px;">
                  <read-avatar 
                  :folderPath="folderPath" 
                  :folderId="folderId" 
                  :defaultImg = "defaultImg"
                  class="property-profile m-auto"/>
                  <img src="@/assets/images/pages/poster/poster-phone-bottom.png" alt="" style="width:285px;">
                </div>
                <div class="appStored d-flex justify-content-between">
                    <a href="https://axp.axesspoint.app/admin/properties/13pa2vj547j1w/poster#" class="dib w49"><img src="@/assets/images/pages/poster/apple-app-store.png" alt=""></a>
                    <a href="https://axp.axesspoint.app/admin/properties/13pa2vj547j1w/poster#" class="dib w49"><img src="@/assets/images/pages/poster/google-play-store.png" alt=""></a>
                </div>
                <div class="accessCode">
                  <h4>ACCESS CODE:</h4>
                  <p>{{view_data.code}}</p>
                </div>
                <div class="accessCode">
                  <h4>REGISTRATION LINK:</h4>
                  <p>{{register_link}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <div class="w-full vx-row m-0 p-0 h-25 hideOnMobile">
      <div id="poster-copy" class="vx-col w-full m-0 p-0 h-25">
        <div class="h-full flex w-full bg-img vx-row no-gutter justify-center">
          <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4 pt-6 pb-6 vx-card-section-box">
            <vx-card class="vx-card-section-body">
              <div class="vx-row justify-end">
                <vs-button 
                class="mb-base mr-3 print-copy" 
                icon-pack="feather" 
                icon="icon icon-file" 
                @click="print">
                Print</vs-button>
              </div>

              <div class="vx-row pt-6 pb-6">                
                <div class="vx-col sm:w-1/4 md:w-1/4 lg:w-1/5 pt-6 pb-6 axp-logo">
                  <img src="@/assets/images/logo/logo-axp.png" alt="axp-logo" class="mx-auto mb-2" width="150">
                </div>
                <div class="vx-col sm:w-3/4 md:w-3/4 lg:w-4/5 m-auto vx-card__title mb-6 pt-6 pb-6 vx-card-section-head mt-8">
                  <h1 class="text-center text-title">{{view_data.name}}</h1>
                  <h4 class="text-center">"Stay informed of all emergencies impacting your community"</h4>
                </div>  
              </div>
            </vx-card>
          </div>
        </div>        
      </div>
    </div>    

    <div class="h-full flex w-full bg-img vx-row no-gutter justify-center items-top ht-8 pt-8 hideOnMobile">
      <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4 pb-6 vx-card-section-box ht-8 pt-8">
        <vx-card class="vx-card-section-body">
          <div class="vx-row pt-6 pb-6">                
            <div class="vx-col sm:w-full md:w-2/5 lg:w-2/5 pt-6 pb-6 mr-auto ml-auto">
              <div class="device text-center">
                <img class="m-auto" src="@/assets/images/pages/poster/poster-phone-top.png" alt="" width="285">
                <read-avatar 
                  :folderPath="folderPath" 
                  :folderId="folderId" 
                  :defaultImg = "defaultImg"
                  class="property-profile m-auto" />
                <img class="m-auto" src="@/assets/images/pages/poster/poster-phone-bottom.png" alt="" width="285">
              </div>
              <div class="device-app-store flex mt-4">
                <img src="@/assets/images/pages/poster/apple-app-store.png" class="text-center m-auto mr-2" width="150">
                <img src="@/assets/images/pages/poster/google-play-store.png" class="text-center m-auto" width="150">
              </div>
              <div class="device-code">
                <div class="text-center m-auto mt-4 w-1/2">                  
                  <vue-qrcode :value="getPropertyCode" />
                </div>
                <h2 class="text-center text-title mt-6"><b>ACCESS CODE:</b></h2>
                <p class="text-center text-title mt-0 h2">{{view_data.code}}</p>
              </div>
              <div class="register-link">
                <h2 class="text-center text-title mt-6"><b>REGISTRATION LINK:</b></h2>
                <p class="text-center text-title mt-0 h2">{{register_link}}</p>
              </div>
            </div>
            <div class="vx-col sm:w-full md:w-3/5 lg:w-3/5 m-auto vx-card__title mb-6 pt-6 pb-6 vx-card-content mt-8">
              <h1 class="text-left text-title">HOW TO GET THE APP</h1>
              <h2 class="text-left text-title mt-4"><b><u>CURRENT USERS</u></b></h2>              
              <h4 class="text-left mt-4"><b><u>If you have received an email from {{view_data.name}}</u></b>, please open it on your phone and follow the instructions.</h4>
              
              <h4 class="text-left mt-4">Install <b><u>"aXessPoint"</u></b> app and open. Use the temporary password provided to login. Once you have logged in, please go to your profile on the top right by tapping on profile icon and change your password for aXessPoint.</h4>

              <h4 class="text-left mt-4"><b><u>If you do not receive an email from your {{view_data.name}}, please follow the steps below:</u></b></h4>

              <h2 class="text-left text-title mt-8"><b><u>NEW USERS</u></b></h2>

              <h3 class="text-left text-title mt-4"><b>STEP 1</u></b></h3>
              <h4 class="text-left mt-4">Go to the App Store on Iphone or Google Play Store on Android.</h4>

              <h3 class="text-left text-title mt-4"><b>STEP 2</u></b></h3>
              <h4 class="text-left mt-4">Search for <b><u>“aXessPoint”</u></b>, select it and install.</h4>

              <h3 class="text-left text-title mt-4"><b>STEP 3</u></b></h3>
              <h4 class="text-left mt-4">Tap on the "aXessPoint" icon to launch the app. <br>Select "Sign Up" and the “Cick here to scan your property” and hover phone on the QR Code box that you see on your left to scan the image. </h4>

              <h3 class="text-center text-title mt-4"><b>OR</u></b></h3>
              <h4 class="text-left mt-4">Select "Property Code" and manually input the Property Code that you see on your left (case sensitive). Proceed to register.</h4>

              <h3 class="text-left text-title mt-4"><b>STEP 4</u></b></h3>
              <h4 class="text-left mt-4">Select "sign up" and fill in the fields, submit and wait for your manager’s approval message. Once approved, you may log in.</h4>
            </div>  
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import ReadAvatar from '@/views/components/files/ReadAvatar.vue'
import VueQrcode from 'vue-qrcode'
import {BitlyClient, isBitlyErrResponse} from 'bitly';

import "@/assets/poster/bootstrap.min.css"
import "@/assets/poster/style.css"


export default {
  components: {
    ReadAvatar,
    VueQrcode
  },  
  data () {
    return {
      register_link: null,
      view_data:null,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 26,
      defaultImg: '/img/default-placeholder.a36832a1.png'
    }
  },
  computed: {
    folderPath() {
      return `docs/property/avatar/${this.$route.params.viewId}`
    },    
    getPropertyCode() {
      const registration = `${process.env.BASE_URL}/register?code=${this.view_data.code}`;
      return registration;
    }
  },
  methods: {
    print () {
      window.print()
    },
    async shorten_link () {
      const { BitlyClient } = require('bitly')
      const bitly = new BitlyClient(process.env.VUE_APP_ENV_BITLY_API_KEY, {})
      let result = await bitly.shorten(this.getPropertyCode)

      this.register_link = result.link
    },
    async loadData () {
      this.$vs.loading()
      let url = `/property/view/${this.$route.params.viewId}`
      const result = await axios.get(`${url}`, {
        headers: { 
          'Authorization': localStorage.usertoken,
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      if (result['data']['pmc_id'] !== parseInt(localStorage.selectedParentOrg)) {
        this.data_not_found = 2
      } else {
        this.data_not_found = 1
        this.view_data = result['data']
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('property-list', 'list')
      this.showC = await mainHelper.cansee('property-create', 'create')
      this.showR = await mainHelper.cansee('property-read', 'read')
      this.showU = await mainHelper.cansee('property-update', 'update')
      this.showD = await mainHelper.cansee('property-delete', 'delete')

      this.showAmenityRead = await mainHelper.cansee('amenity-read', 'read');
      if (!this.showR) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()    
      await this.shorten_link()  
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Property Poster Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },

}
</script>
<style lang="scss">
h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
  font-family: "Montserrat", Helvetica, Arial, sans-serif !important;
  font-weight: 500 !important;
  line-height: 1.2 !important;
  color: #2c2c2c !important;
}

.vs-button {
    -webkit-transition: all .2s ease !important;
    transition: all .2s ease !important;
    padding: 10px !important;
    border: 0 !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    position: relative !important;
    overflow: hidden !important;
    color: #fff !important;
    -webkit-box-sizing: border-box !important;
    box-sizing: border-box !important;
}
body{background: #3d85c6;}
.promoPoster .banner{background-size: cover; background-position: center center; width: 100%; height:434px; position: absolute; left: 0; top: 0;}
.promoPoster .container{position: relative; z-index: 1; color: #100e0d; padding-top: 30px;}
.promoPoster .regTop{background: rgba(255,255,255,.8); border: 3px solid #ff9400; padding: 30px; border-radius: 10px; font-size: 24px;}
.promoPoster .regTop h2{font-size: 70px;}
.promoPoster .regTop h4{font-size: 26px;}

.promoPoster .content{background: rgba(255,255,255,.9); border: 3px solid #ff9400; padding: 30px; border-radius: 0; font-size: 16px; margin: 150px 0 30px;}
.promoPoster .content .right{order: 2; flex: 1; padding-left: 60px;}
.promoPoster .content .left{order: 1; width: 300px;}
.promoPoster .device{position: relative;margin-top: -130px;margin-bottom: 40px;}
.promoPoster .qrCode img{border:3px solid #395e89; margin: 20px 0;}
.promoPoster .accessCode {color: #395e89;font-size: 30px;font-weight: bold;line-height: 1;}
.promoPoster p {margin-bottom: 15px;}
.promoPoster .accessCode p {font-size:25px;}
.promoPoster .accessCode h4 {font-size:28px;}

@media print{
    #printBtn{display: none;}
}

div.device .avatar-img {
  width: 100% !important;
}

.device .property-profile {
  width:285px; 
  border:3px solid #000;
}



div.bg-img {
  background-image: none !important;
}
div#poster-copy {
  height: 400px;  
  background: linear-gradient(to bottom, rgba(255,255,255,0) 70%, rgba(255,255,255,1)), url(../../../../assets/images/pages/poster/registration-banner.jpg);
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

.layout--full-page {  
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,1) 30%, rgba(172,241,255,1) 40%, rgba(0,212,255,1) 80%);

}

.vx-card-section-head h1 {
  font-size: 55px !important;
}

.vx-card-content h1 {
  font-size: 35px !important;
}

.vx-card-section-box {
  min-width: 900px
}

.vx-card-section-body  {
  background: #ffffffe0;
}

.device {
  margin-top: -120px;
}

.device-code img {
  border: 4px solid #2c2c2c;
  margin: auto;
  width: 150px;
  margin-top: 20px;
}

.device .property-profile {
  width:285px; 
  border:3px solid #000;
}

#read-img-container {
  width: 100%;
}

div.device .avatar-img {
  width: 100% !important;
}

.property-profile .vx-col {
  padding: 0px !important;
}

@media only screen and (max-width: 991px) {
  div#poster-copy .vx-card-section-head h1 {
    font-size: 45px !important;
  }
  .vx-card-section-box {
    min-width: 800px
  }  
}

@media only screen and (max-width: 768px) {
  .vx-card-section-box {
    min-width: 650px
  }  

  div#poster-copy .vx-card-section-head h1 {
    font-size: 35px !important;
  }  
}

@media only screen and (max-width: 667px) {
  .vx-card-section-box {
    min-width: 550px
  }  
}

@media only screen and (max-width: 575px) {
  .vx-card-section-box {
    min-width: 450px
  } 

  .vx-card-section-head, .axp-logo {
    width: 100%;
    margin: 0px !important;
    padding: 0px !important;
  }
}

@media only screen and (max-width: 414px) {
  .vx-card-section-box {
    min-width: 350px
  } 

  .vx-card-section-head, .axp-logo {
    width: 100%;
    margin: 0px !important;
    padding: 0px !important;
  }
}

.showOnMobile {
  display: none;
}
.hideOnMobile {
 display: block; 
}

body{background: #3d85c6;}
.promoPoster .banner{background-size: cover; background-position: center center; width: 100%; height:434px; position: absolute; left: 0; top: 0;}
.promoPoster .container{position: relative; z-index: 1; color: #100e0d; padding-top: 30px;}
.promoPoster .regTop{background: rgba(255,255,255,.8); border: 3px solid #ff9400; padding: 30px; border-radius: 10px; font-size: 24px;}
.promoPoster .regTop h2{font-size: 70px;}
.promoPoster .regTop h4{font-size: 26px;}

.promoPoster .content{background: rgba(255,255,255,.9); border: 3px solid #ff9400; padding: 30px; border-radius: 0; font-size: 16px; margin: 150px 0 30px;}
.promoPoster .content .right{order: 2; flex: 1; padding-left: 60px;}
.promoPoster .content .left{order: 1; width: 300px;}
.promoPoster .device{position: relative;margin-top: -130px;margin-bottom: 40px;}
.promoPoster .qrCode img{border:3px solid #395e89; margin: 20px 0;}
.promoPoster .accessCode {margin-top:30px; color: #395e89;font-size: 30px;font-weight: bold;line-height: 1;}
.promoPoster p {margin-bottom: 15px;}

@media print{
    #printBtn{display: none;}
}

@media print {
  .showOnMobile {
    display: block;
  }
  .hideOnMobile {
   display: none !important; 
  }
}

</style>