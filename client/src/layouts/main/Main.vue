<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">

    <vx-tour :steps="steps" v-if="!disableThemeTour && (windowWidth >= 1200 && mainLayoutType === 'vertical' && verticalNavMenuWidth == 'default')" />

    <the-customizer
      v-if                    = "!disableCustomizer"
      :footerType             = "footerType"
      :hideScrollToTop        = "hideScrollToTop"
      :navbarType             = "navbarType"
      :navbarColor            = "navbarColor"
      :routerTransition       = "routerTransition"
      @toggleHideScrollToTop  = "toggleHideScrollToTop"
      @updateFooter           = "updateFooter"
      @updateNavbar           = "updateNavbar"
      @updateNavbarColor      = "updateNavbarColor"
      @updateRouterTransition = "updateRouterTransition" />

    <v-nav-menu
      :navMenuItems = "navMenuItems"
      title         = "Vuexy"
      parent        = ".layout--main" />

    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay" />

    <!-- Navbar -->
    <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
      <the-navbar-horizontal
        :navbarType= "navbarType"
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />

      <div style="height: 62px" v-if="navbarType === 'static'"></div>

      <h-nav-menu
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"
        :navMenuItems="navMenuItems" />
    </template>

    <template v-else>
      <the-navbar-vertical
        :navbarColor="navbarColor"
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />
    </template>
    <!-- /Navbar -->

      <div class="content-wrapper">

        <div class="router-view">
          <div class="router-content">

            <vx-card>
              <h3 
                class="router-header flex flex-wrap items-center mb-6"
                v-if="currentMenuItem"> 
                {{ currentMenuItem.name }} 
                </h3>
              <vs-tabs 
                :value="activeTabIndex" 
                :key="forceRender"
                v-if="currentMenuItem">
                <vs-tab
                  v-for="(tab, index) in currentMenuItem.submenu.filter(({ hasAcess }) => hasAcess)" 
                  :key="index"
                  :label="$t(tab.i18n) || tab.name"
                  :disabled="tab.isDisabled"
                  @click="redirect(tab)"/>
              </vs-tabs>
              <transition :name="routerTransition">

                <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="router-header flex flex-wrap items-center mb-6">
                  <div
                    class="content-area__heading"
                    :class="{'pr-4 border-0 md:border-r border-solid border-grey-light' : $route.meta.breadcrumb}">
                    <h5 class="mb-1">{{ routeTitle }}</h5>
                  </div>

                  <!-- BREADCRUMB -->
                  <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route" :isRTL="$vs.rtl" />
                </div>
              </transition>

              <!-- https://app.smartsheet.com/b/publish?EQBCT=a9879d4ef6894bd8a78228975e197e46 -->
              <vs-alert color="warning" title="Unlock the Full Potential of aXesspoint" :active.sync="isActive" class="mt-4 mb-4 text-primary">
                <span>
                  <span>We have sent you an email to verify your account. Click </span>
                  <a @click.prevent="validateRequest" href='#' class="underline text-danger">here</a>
                  to receive a new verification email.
                </span>
              </vs-alert>

              <div class="content-area__content">
                <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500" v-if="!hideScrollToTop">
                  <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
                </back-to-top>

                <transition :name="routerTransition" mode="out-in">
                  <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
                </transition>
              </div>
            </vx-card>
          </div>
        </div>
      </div>
      <the-footer />
    </div>
  </div>
</template>


<script>
import BackToTop           from 'vue-backtotop'
import HNavMenu            from '@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue'
import navMenuItems        from '@/layouts/components/vertical-nav-menu/navMenuItems.js'
import TheCustomizer       from '@/layouts/components/customizer/TheCustomizer.vue'
import TheNavbarHorizontal from '@/layouts/components/navbar/TheNavbarHorizontal.vue'
import TheNavbarVertical   from '@/layouts/components/navbar/TheNavbarVertical.vue'
import TheFooter           from '@/layouts/components/TheFooter.vue'
import themeConfig         from '@/../themeConfig.js'
import VNavMenu            from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue'

const VxTour = () => import('@/components/VxTour.vue')
const jwt = require('jsonwebtoken')
import axios from '@/axios'
import EventBus from '@/EventBus'

export default {
  components: {
    BackToTop,
    HNavMenu,
    TheCustomizer,
    TheFooter,
    TheNavbarHorizontal,
    TheNavbarVertical,
    VNavMenu,
    VxTour
  },
  data () {
    return {
      isActive: false,
      token: localStorage.usertoken,
      setupFuzeAccount: false,
      disableCustomizer : themeConfig.disableCustomizer,
      disableThemeTour  : themeConfig.disableThemeTour,
      dynamicWatchers   : {},
      footerType        : themeConfig.footerType  || 'static',
      hideScrollToTop   : themeConfig.hideScrollToTop,
      isNavbarDark      : false,
      navbarColor       : themeConfig.navbarColor || '#fff',
      navbarType        : themeConfig.navbarType  || 'floating',
      navMenuItems,
      routerTransition  : themeConfig.routerTransition || 'none',
      routeTitle        : this.$route.meta.pageTitle,
      steps: [
        {
          target  : '#btnVNavMenuMinToggler',
          content : 'Toggle Collapse Sidebar.'
        },
        {
          target  : '.vx-navbar__starred-pages',
          content : 'Create your own bookmarks. You can also re-arrange them using drag & drop.'
        },
        {
          target  : '.i18n-locale',
          content : 'You can change language from here.'
        },
        {
          target  : '.navbar-fuzzy-search',
          content : 'Try fuzzy search to visit pages in flash.'
        },
        {
          target  : '.customizer-btn',
          content : 'Customize template based on your preference',
          params  : {
            placement: 'left'
          }
        },
        {
          target  : '.vs-button.buy-now',
          content : 'Buy this awesomeness at affordable price!',
          params  : {
            placement: 'top'
          }
        }
      ],
      forceRender: 0,
      currentTabs: [],
      activeTabIndex: 0,
      currentMenuItem: {
        submenu: [
          { name: "Default", url:'properties/view/ref', }
        ]
      },
    }
  },
  watch: {
    '$route' () {
      this.routeTitle = this.$route.meta.pageTitle
      this.loadCurrentTabByURL();
    },
    isThemeDark (val) {
      const color = this.navbarColor === '#fff' && val ? '#10163a' : '#fff'
      this.updateNavbarColor(color)
    },
    '$store.state.mainLayoutType' (val) {
      this.setNavMenuVisibility(val)
      this.disableThemeTour = true
    }
  },
  computed: {
    bodyOverlay () { return this.$store.state.bodyOverlay },
    contentAreaClass () {
      if (this.mainLayoutType === 'vertical') {
        if      (this.verticalNavMenuWidth === 'default') return 'content-area-reduced'
        else if (this.verticalNavMenuWidth === 'reduced') return 'content-area-lg'
        else return 'content-area-full'
      } else return 'content-area-full'
    },
    footerClasses () {
      return {
        'footer-hidden': this.footerType === 'hidden',
        'footer-sticky': this.footerType === 'sticky',
        'footer-static': this.footerType === 'static'
      }
    },
    isAppPage () {
      return this.$route.meta.no_scroll
    },
    isThemeDark ()     { return this.$store.state.theme === 'dark' },
    layoutTypeClass () { return `main-${this.mainLayoutType}`      },
    mainLayoutType ()  { return this.$store.state.mainLayoutType   },
    navbarClasses ()   {
      return {
        'navbar-hidden'   : this.navbarType === 'hidden',
        'navbar-sticky'   : this.navbarType === 'sticky',
        'navbar-static'   : this.navbarType === 'static',
        'navbar-floating' : this.navbarType === 'floating'
      }
    },
    verticalNavMenuWidth () { return this.$store.state.verticalNavMenuWidth },
    windowWidth ()          { return this.$store.state.windowWidth },
    menuItems() {
      const userData = JSON.parse(localStorage.userAllData);
      const permissions = JSON.parse(userData['user_role']['permission']);
      const withPermissions = [];
      for (const key in permissions) {
        if (!!permissions[key]['list']) withPermissions.push(`${key}-list`);
      }

      const menus = [...this.navMenuItems[1].items, this.navMenuItems[0]];
      for (const menu of menus) {
        if (menu.slug && withPermissions.includes(menu.slug)) menu.hasAcess = true
        if (menu.submenu) {
          for (const subItem of menu.submenu) {
            if (subItem && withPermissions.includes(subItem.slug)) subItem.hasAcess = true;
          }
        }
      }
      return menus;
    }
  },
  methods: {    
    async loadUser(){
      var decoded = jwt.verify(this.token, 'secret')  
      const viewId = decoded.id
      const d = await axios.get(`/user/view/${viewId}`, {
        headers: { 'Authorization': this.token },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })       

      const userD = d['data'][0]['user_role']['name']
      const isActivated = d['data'][0]['is_activated']

      if (userD =='Vendor' && isActivated == 0) {
        this.setupFuzeAccount = true
      }
    },
    redirect({ type, target, url }) {
      if (this.$router.currentRoute.path === url) return;
      if (type === 'external') {
        window.open(url, target);
      } else {
        this.$router.push({ path: url }).catch();
      }
    },
    changeRouteTitle (title) {
      this.routeTitle = title
    },
    updateNavbar (val) {
      if (val === 'static') this.updateNavbarColor(this.isThemeDark ? '#10163a' : '#fff')
      this.navbarType = val
    },
    updateNavbarColor (val) {
      this.navbarColor = val
      if (val === '#fff') this.isNavbarDark = false
      else this.isNavbarDark = true
    },
    updateFooter (val) {
      this.footerType = val
    },
    updateRouterTransition (val) {
      this.routerTransition = val
    },
    setNavMenuVisibility (layoutType) {
      if ((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === 'vertical' && this.windowWidth < 1200)) {
        this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
        this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
      } else {
        this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
      }
    },
    toggleHideScrollToTop (val) {
      this.hideScrollToTop = val
    },
    onCurrentMenuItem (value) {
      this.currentMenuItem = value;
      this.forceRender +=1;
      if (this.currentMenuItem) {
        const { url } = this.currentMenuItem.submenu.filter(({ hasAcess }) => hasAcess)[0];
        if (this.$router.currentRoute.path !== url) this.$router.push(url).catch();
      }

    },
    loadCurrentTabByURL () {
      const currentPath = this.$router.currentRoute.path;
      const items = this.menuItems;
      for (const item of items) {
        if (item && item.submenu) {
          const index = item.submenu
            .filter(({ hasAcess }) => hasAcess)
            .findIndex(({ url }) => url === currentPath )
          if (index >= 0) {
            this.currentMenuItem = item;
            this.forceRender +=1;
            this.activeTabIndex = index;
          }
        }
      }
    },
    async validateRequest (email) {
      this.$vs.loading()
      let decoded = jwt.verify(this.token, process.env.VUE_APP_ENV_SECRET_KEY)  
      const result = await axios.post(`/user/confirm-email-request`, {email:decoded.email}, {
        headers: { 
          'Content-Type': 'application/json'
        }
      })

      this.$vs.loading.close()
      this.$vs.notify({
        time: 10000,
        title: 'Verify your email address',
        text: 'Look for the verification email in your inbox and click the link in that email',
        iconPack: 'feather',
        icon: 'icon-mail',
        color: 'success'
      })
    },
    async confirmEmail() {
      let decoded = jwt.verify(this.token, process.env.VUE_APP_ENV_SECRET_KEY)  
      const {data} = await axios.get(`/user/${decoded.id}`, {
        headers: { 'Authorization': this.token }
      })
      this.isActive = data[0]['is_activated'] === 0
    }
  },
  created () {
    this.confirmEmail()
    this.loadCurrentTabByURL();

    const color = this.navbarColor === '#fff' && this.isThemeDark ? '#10163a' : this.navbarColor
    this.updateNavbarColor(color)
    this.setNavMenuVisibility(this.$store.state.mainLayoutType)

    // Dynamic Watchers for tour
    // Reason: Once tour is disabled it is not required to enable it.
    // So, watcher is required for just disabling it.
    this.dynamicWatchers.windowWidth = this.$watch('$store.state.windowWidth', (val) => {
      if (val < 1200) {
        this.disableThemeTour = true
        this.dynamicWatchers.windowWidth()
      }
    })

    this.dynamicWatchers.verticalNavMenuWidth = this.$watch('$store.state.verticalNavMenuWidth', () => {
      this.disableThemeTour = true
      this.dynamicWatchers.verticalNavMenuWidth()
    })

    this.dynamicWatchers.rtl = this.$watch('$vs.rtl', () => {
      this.disableThemeTour = true
      this.dynamicWatchers.rtl()
    })
  },
  mounted() {
    EventBus.$on('getCurrentMenuItem', this.onCurrentMenuItem)
  },
  beforeDestroy () {
    Object.keys(this.dynamicWatchers).map(i => {
      this.dynamicWatchers[i]()
      delete this.dynamicWatchers[i]
    })
  }
}

</script>

