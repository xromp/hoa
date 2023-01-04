/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
import Lightbox from 'vue-easy-lightbox'
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import Flutterwave from  'flutterwave-vue-v3'
import Analytics from 'analytics'
import googleTagManager from '@analytics/google-tag-manager'

Vue.use(Flutterwave, { publicKey: 'FLWPUBK_TEST-f49143007f229d5fbfbe0f01adadfcfc-X' } );
Vue.use(Vuesax)
Vue.use(Vuetify)
Vue.use(Lightbox)
Vue.use(Analytics)

// googleTagManager
const analytics = Analytics({
  app: 'axp-app',
  plugins: [
    googleTagManager({
      containerId: 'GTM-W663V4S'
    })
  ]
})

analytics.page()

// axios
import axios from './axios.js'
Vue.prototype.$http = axios

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// import core styles
// require('@core/scss/core.scss')

// API Calls
import './http/requests'

// mock
import './fake-db/index.js'

// Theme Configurations
import '../themeConfig.js'


// Firebase
import '@/firebase/firebaseConfig'


// Auth0 Plugin
import AuthPlugin from './plugins/auth'
Vue.use(AuthPlugin)


// ACL
import acl from './acl/acl'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// i18n
import i18n from './i18n/i18n'


// Vuexy Admin Filters
import './filters/filters'


// Clipboard
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


// Tour
import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')


// VeeValidate
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)


// Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    // Add your API key here
    key: 'YOUR_KEY',
    libraries: 'places' // This is required if you use the Auto complete plug-in
  }
})

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// Socket IO
const socket = io(process.env.VUE_APP_ENV_BASE_URL+':'+process.env.VUE_APP_ENV_PORT);
Vue.use(VueSocketIOExt, socket);


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')


// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  acl,
  render: h => h(App)
}).$mount('#app')
