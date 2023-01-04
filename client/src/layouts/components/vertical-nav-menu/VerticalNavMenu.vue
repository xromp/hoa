<template>
  <div class="parentx">
    <vs-sidebar
      class="v-nav-menu items-no-padding"
      v-model="isVerticalNavMenuActive"
      ref="verticalNavMenu"
      default-index="-1"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      v-hammer:swipe="onMenuSwipe">

      <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">

        <!-- Header -->
        <div class="header-sidebar flex items-end justify-between" slot="header">

          <!-- Logo -->
          <a tag="div" class="vx-logo cursor-pointer flex items-center m-auto" @click="dash">
            <!-- <logo class="w-10 mr-4 fill-current text-primary" /> -->
            <img class="w-10 mr-4 fill-current text-primary" src="@/assets/images/logo/logo-axp.png" alt="vuexy-logo">
            <span class="vx-logo-text text-primary" v-show="isMouseEnter || !reduce" v-if="title">aXessPoint</span>
          </a>
          <!-- /Logo -->

          <!-- Menu Buttons -->
          <div>
            <!-- Close Button -->
            <!-- <template v-if="showCloseButton">
              <feather-icon icon="XIcon" class="m-0 cursor-pointer" @click="$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)" />
            </template> -->

            <!-- Toggle Buttons -->
            <!-- <template v-else-if="!showCloseButton && !verticalNavMenuItemsMin">
              <feather-icon
                id="btnVNavMenuMinToggler"
                class="mr-0 cursor-pointer"
                :icon="reduce ? 'CircleIcon' : 'DiscIcon'"
                svg-classes="stroke-current text-primary"
                @click="toggleReduce(!reduce)" />
            </template> -->
          </div>
          <!-- /Menu Toggle Buttons -->
        </div>
        <!-- /Header -->

        <!-- Header Shadow -->
        <div class="shadow-bottom" v-show="showShadowBottom" />

        <!-- Menu Items -->
        <component :is="scrollbarTag" ref="verticalNavMenuPs" class="scroll-area-v-nav-menu pt-2" :settings="settings" @ps-scroll-y="psSectionScroll" @scroll="psSectionScroll" :key="$vs.rtl">

        <div v-if="!isVendor">
          <div class="mt-4 mr-0 cursor-pointer p-2 " v-if="optionParentOrg.length > 1">
            <v-select :options="optionParentOrg" :reduce="name => name.id" label="name" v-model="selectedParentOrg" name="selectedParentOrg" class="parent-org p-2" @change="changeParentOrg" @input="changeParentOrg()"/>
          </div>
          <div class="mr-0 cursor-not-allowed p-4 pt-2" v-else>
            <div class="p-3 parent-org parent-org-disable">
              <label class="text-lg opacity-100">{{selectedParentName}}</label>
            </div>
          </div>
          <div class="mr-0 cursor-pointer p-2 " v-if="optionProperty.length > 1">
            <v-select :options="optionProperty" :reduce="name => name.ref" label="name" v-model="selectedProperty" name="selectedProperty" class="parent-org p-2" @change="changeProperty" @input="changeProperty()"/>
          </div>
          <div class="mr-0 cursor-not-allowed p-4 pt-2" v-else>
            <div class="p-3 parent-org parent-org-disable">
              <label class="text-lg opacity-100">{{selectedPropertyName}}</label>
            </div>
          </div>
        </div>

          <template v-for="(item, index) in menuItemsUpdated">

            <!-- Group Header -->
            <span v-if="item.header && !verticalNavMenuItemsMin" class="navigation-header truncate" :key="`header-${index}`">
              {{ $t(item.i18n) || item.header }}
            </span>
            <!-- /Group Header -->

            <template v-else-if="!item.header">

              <!-- Nav-Item -->
              <v-nav-menu-item
                v-if="!item.submenu"
                :key="`item-${index}`"
                :index="index"
                :to="item.type !== 'external' ? item.url : null"
                :href="item.type === 'external' ? item.url : null"
                :icon="item.icon" :target="item.target"
                :isDisabled="item.isDisabled"
                :slug="item.slug"
                :userPemData = "userPemData"
                >
                  <span v-show="!verticalNavMenuItemsMin" class="truncate">{{ $t(item.i18n) || item.name }}</span>
                  <vs-chip class="ml-auto" :color="item.tagColor" v-if="item.tag && (isMouseEnter || !reduce)">{{ item.tag }}</vs-chip>
              </v-nav-menu-item>

              <!-- Nav-Group -->
              <template v-else>
                <v-nav-menu-group
                  :key="`group-${index}`"
                  :openHover="openGroupHover"
                  :group="item"
                  :groupIndex="index"
                  :open="isGroupActive(item)"
                  :userPemData = "userPemData"
                />
              </template>
              <!-- /Nav-Group -->
            </template>
          </template>
        </component>
        <!-- /Menu Items -->
      </div>
    </vs-sidebar>

    <!-- Swipe Gesture -->
    <div
      v-if="!isVerticalNavMenuActive"
      class="v-nav-menu-swipe-area"
      v-hammer:swipe="onSwipeAreaSwipe" />
    <!-- /Swipe Gesture -->
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VNavMenuGroup from './VerticalNavMenuGroup.vue'
import VNavMenuItem from './VerticalNavMenuItem.vue'

import Logo from '../Logo.vue'
import vSelect from 'vue-select'
import axios from '@/axios'
const jwt = require('jsonwebtoken')
import EventBus from '@/EventBus'

export default {
  name: 'v-nav-menu',
  components: {
    VNavMenuGroup,
    VNavMenuItem,
    VuePerfectScrollbar,
    Logo,

    vSelect
  },
  props: {
    logo:             { type: String },
    openGroupHover:   { type: Boolean, default: false },
    parent:           { type: String },
    reduceNotRebound: { type: Boolean, default: true },
    navMenuItems:     { type: Array,   required: true },
    title:            { type: String }
  },
  data: () => ({
    clickNotClose       : false, // disable close navMenu on outside click
    isMouseEnter        : false,
    reduce              : false, // determines if navMenu is reduce - component property
    showCloseButton     : false, // show close button in smaller devices
    settings            : {      // perfectScrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed        : 1,
      swipeEasing       : true
    },
    showShadowBottom    : false,
    userPemData         : JSON.parse(localStorage.userAllData),

    optionProperty: [{
      ref: '0',
      name:'No Property Selected'
    }],  
    optionParentOrg: [{
      id: 0,
      name:'No Parent Selected'
    }],
    optionRoleOrg: [],
    selectedProperty: localStorage.selectedPropertyRef === undefined ? '0' : localStorage.selectedPropertyRef,
    selectedParentOrg: localStorage.selectedParentOrg === undefined ? 0 : parseInt(localStorage.selectedParentOrg),
    selectedPropertyName: null
  }),
  computed: {
    isVendor() {
      console.log('localStorage.selectedRoleVal ', localStorage.selectedRoleVal)
      return localStorage.selectedRoleVal === 'vendor'
    },
    token() {
      return localStorage.usertoken;
    },
    isGroupActive () {
      return (item) => {
        const path        = this.$route.fullPath
        const routeParent = this.$route.meta ? this.$route.meta.parent : undefined
        let open          = false

        const func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((item) => {
              if (item.url && (path === item.url || routeParent === item.slug)) { open = true } else if (item.submenu) { func(item) }
            })
          }
        }
        func(item)
        return open
      }
    },
    menuItemsUpdated () {
      const clone = this.navMenuItems.slice()

      for (const [index, item] of this.navMenuItems.entries()) {
        if (item.header && item.items.length && (index || 1)) {
          const i = clone.findIndex(ix => ix.header === item.header)
          for (const [subIndex, subItem] of item.items.entries()) {
            clone.splice(i + 1 + subIndex, 0, subItem)
          }
        }
      }

      return clone
    },
    isVerticalNavMenuActive: {
      get ()    { return this.$store.state.isVerticalNavMenuActive },
      set (val) { this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', val) }
    },
    layoutType () { return this.$store.state.mainLayoutType },
    reduceButton: {
      get ()    { return this.$store.state.reduceButton },
      set (val) { this.$store.commit('TOGGLE_REDUCE_BUTTON', val) }
    },
    isVerticalNavMenuReduced () { return Boolean(this.reduce && this.reduceButton) },
    verticalNavMenuItemsMin ()  { return this.$store.state.verticalNavMenuItemsMin },
    scrollbarTag ()             { return this.$store.getters.scrollbarTag          },
    windowWidth ()              { return this.$store.state.windowWidth             }
  },
  watch: {    
    optionParentOrg(n) {
      return false
      localStorage.removeItem('selectedParentOrg')
      localStorage.setItem('selectedParentOrg', n[0]['id'])
      this.selectedParentOrg = n[0]['id']    
    },
    optionRoleOrg(n){      
      return false
      console.log('verticalNav optionRoleOrg 1 ', localStorage.selectedRoleId)
      console.log('verticalNav optionRoleOrg 1 ', localStorage.selectedRoleVal)

      console.log('verticalNav optionRoleOrg 2 ', n[0]['id'])
      console.log('verticalNav optionRoleOrg 2 ', n[0]['val'])

      localStorage.removeItem('selectedRoleId')
      localStorage.removeItem('selectedRoleVal')
      localStorage.setItem('selectedRoleId', n[0]['id'])
      localStorage.setItem('selectedRoleVal', n[0]['val'])

      this.$vs.loading()
      EventBus.$emit('side-menu-role', n)
    },
    optionProperty(n){
      return false
      // this.$vs.loading()
      localStorage.removeItem('selectedPropertyRef')
      localStorage.setItem('selectedPropertyRef', n[0]['ref'])
      this.selectedProperty = n[0]['ref']
    },
    '$route' () {
      if (this.isVerticalNavMenuActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
    },
    reduce (val) {
      const verticalNavMenuWidth = val ? 'reduced' : this.$store.state.windowWidth < 1200 ? 'no-nav-menu' : 'default'
      this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    },
    layoutType ()   { this.setVerticalNavMenuWidth() },
    reduceButton () { this.setVerticalNavMenuWidth() },
    windowWidth ()  { this.setVerticalNavMenuWidth() }
  },
  methods: {
    dash() {
      window.location.href = "/dashboard/analytics";
    },
    onMenuSwipe (event) {
      if (event.direction === 4 && this.$vs.rtl) {

        // Swipe Right
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false

      } else if (event.direction === 2 && !this.$vs.rtl) {

        // Swipe Left
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false
      }
    },
    onSwipeAreaSwipe (event) {
      if (event.direction === 4 && !this.$vs.rtl) {
        // Swipe Right
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
      } else if (event.direction === 2 && this.$vs.rtl) {
        // Swipe Left
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
      }
    },
    psSectionScroll () {
      const scroll_el = this.$refs.verticalNavMenuPs.$el || this.$refs.verticalNavMenuPs
      this.showShadowBottom = scroll_el.scrollTop > 0
    },
    mouseEnter () {
      if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)
      this.isMouseEnter = true
    },
    mouseLeave () {
      if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', true)
      this.isMouseEnter = false
    },
    setVerticalNavMenuWidth () {

      if (this.windowWidth > 1200) {
        if (this.layoutType === 'vertical') {

          // Set reduce
          this.reduce = !!this.reduceButton

          // Open NavMenu
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

          // Set Menu Items Only Icon Mode
          const verticalNavMenuItemsMin = !!(this.reduceButton && !this.isMouseEnter)
          this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

          // Menu Action buttons
          this.clickNotClose   = true
          this.showCloseButton = false

          const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? 'reduced' : 'default'
          this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

          return
        }
      }

      // Close NavMenu
      this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      // Reduce button
      if (this.reduceButton) this.reduce = false

      // Menu Action buttons
      this.showCloseButton = true
      this.clickNotClose   = false

      // Update NavMenu Width
      this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      // Remove Only Icon in Menu
      this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)


      // if(this.layoutType === 'vertical' || (this.layoutType === 'horizontal' && this.windowWidth < 1200))
      // if (this.windowWidth < 1200) {

      //   // Close NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      //   // Reduce button
      //   if (this.reduceButton) this.reduce = false

      //   // Menu Action buttons
      //   this.showCloseButton = true
      //   this.clickNotClose   = false

      //   // Update NavMenu Width
      //   this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      //   // Remove Only Icon in Menu
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)

      // } else {

      //   // Set reduce
      //   this.reduce = this.reduceButton ? true : false

      //   // Open NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

      //   // Set Menu Items Only Icon Mode
      //   const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

      //   // Menu Action buttons
      //   this.clickNotClose   = true
      //   this.showCloseButton = false

      //   const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
      //   this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)
      // }
    },
    toggleReduce (val) {
      this.reduceButton = val
      this.setVerticalNavMenuWidth()
    },
    async refreshToken() {
      const current_env = {
        'property_ref': localStorage.selectedPropertyRef,
        'parent_org_id': localStorage.selectedParentOrg,
        'role_id': localStorage.selectedRoleId,
        'role_val': localStorage.selectedRoleVal
      };
      const { data } = await axios.post(`/user/refresh-token`, { current_env }, {
        headers: { 'Authorization': this.token }
      });
      localStorage.setItem('usertoken', data.token);
    },
    async changeParentOrg() {
      // this.$vs.loading()
      localStorage.removeItem('selectedParentOrg')
      localStorage.setItem('selectedParentOrg', this.selectedParentOrg)
      await this.refreshToken();
      await this.loadPropertyOrg()
      setTimeout(() => { this.$vs.loading.close() },1000)
      EventBus.$emit('update-parent-id', true)
    },
    async changeProperty() {      
      localStorage.removeItem('selectedPropertyRef')
      localStorage.setItem('selectedPropertyRef', this.selectedProperty)
      await this.refreshToken();

      this.$vs.loading()
      EventBus.$emit('update-property-ref', true)
    },
    async getAccess() {
      const result = await axios.get(`/user-org/get`, {
        headers: { 'Authorization': this.token },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionParentOrg = result.data.optionParentOrg
      this.optionProperty = result.data.optionProperty
    },
    async loadAccess() {
      this.optionParentOrg = JSON.parse(localStorage.optionParentOrg)
      this.optionProperty = JSON.parse(localStorage.optionProperty)
      this.selectedParentName = this.optionParentOrg[0]['name'] 
      this.selectedPropertyName = this.optionProperty[0]['name'] 
    },
    async loadPropertyOrg(property_ref, property_name) {
      const params = {
        'property_ref': localStorage.selectedPropertyRef,
        'parent_org_id': localStorage.selectedParentOrg,
        'role_id': localStorage.selectedRoleId,
        'role_val': localStorage.selectedRoleVal,
        'type': 'overflow'
      };
     
      const result = await axios.get('/user-org/property/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params
      })

      this.optionProperty = result.data      
      property_ref = property_ref === undefined ? this.optionProperty[0]['ref'] : property_ref
      property_name = property_name === undefined ? this.optionProperty[0]['name'] : property_name

      localStorage.removeItem('selectedPropertyRef')
      localStorage.setItem('selectedPropertyRef', property_ref)
      localStorage.removeItem('optionProperty')
      localStorage.setItem('optionProperty', JSON.stringify(this.optionProperty))

      this.selectedProperty = property_ref 
      this.selectedPropertyName = property_name

      await this.refreshToken();
    },
    async loadPortfolioOrg() {
      const result = await axios.get('/user-org/portfolio/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal,
          'type': 'overflow'
        }
      })

      this.optionParentOrg = result.data
    },
  },
  mounted () { 
    EventBus.$on('side-menu-parent',async (result) => {
      await this.loadAccess()
      const isParentMatch = this.optionParentOrg.filter(({id}) => id === this.selectedParentOrg)
      if (isParentMatch.length === 0) {
        localStorage.setItem('selectedParentOrg', this.optionParentOrg[0]['id'])
        this.selectedParentOrg = this.optionParentOrg[0]['id'] 
        this.changeParentOrg()
      }
      // await this.loadPortfolioOrg()
      setTimeout(() => { this.$vs.loading.close() },1000)
    })
    EventBus.$on('side-menu-property',async (result) => {
      const isPropertyMatch = this.selectedProperty === result.ref

      if (result.actionType === 'add') {
        await this.loadPropertyOrg(result.ref, result.name)  
      } else if (isPropertyMatch && result.actionType === 'delete') {
        localStorage.setItem('selectedPropertyRef', this.optionProperty[0]['ref'])
        this.selectedProperty = this.optionProperty[0]['ref'] 
      }

      this.optionProperty = JSON.parse(localStorage.optionProperty)
      setTimeout(() => { this.$vs.loading.close() },1000)
    })
    this.setVerticalNavMenuWidth()    
  },
  async created () {
    try {
      this.$vs.loading()
      await this.loadAccess()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Side Menu',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
    }
  }
}
</script>

<style lang="scss">

.parent-org{
  background: linear-gradient(118deg, rgba(var(--vs-primary), 1), rgba(var(--vs-primary), 0.7));
  box-shadow: 0px 0px 10px 1px rgba(var(--vs-primary), 0.7);
  border-radius: 10px;
}

.parent-org div.vs__dropdown-toggle {
  border: 0px;
}

.parent-org button.vs__clear, .parent-org input.vs__search {
  display: none;
}

.parent-org span.vs__selected, .parent-org span.feather-icon {
  color: white !important;
}

div.parent-org.parent-org-disable {
    background: linear-gradient(16deg, rgba(var(--vs-primary), .05), rgba(var(--vs-primary), 0.5));
}

div.parent-org .vs__selected-options .vs__selected {
  white-space: nowrap;
}

@import "@/assets/scss/vuexy/components/verticalNavMenu.scss"
</style>
