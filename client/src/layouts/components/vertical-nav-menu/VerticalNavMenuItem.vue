<!-- =========================================================================================
    File Name: VerticalNavMenuItem.vue
    Description: Vertical NavMenu item component. Extends vuesax framework's 'vs-sidebar-item' component
    Component Name: VerticalNavMenuItem
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    v-if="canSee"
    class="vs-sidebar--item"
    :class="[
      {'vs-sidebar-item-active'            : activeLink},
      {'disabled-item pointer-events-none' : isDisabled}
    ]" 
    @click="setCurrentMenu">

      <router-link
        tabindex="-1"
        v-if="to"
        exact
        :class="[{'router-link-active': activeLink}]"
        :to="to"
        :slug="slug"
        :target="target" >
          <vs-icon v-if="!featherIcon" :icon-pack="iconPack" :icon="icon" />
          <feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon" />
          <slot />
      </router-link>

      <a v-else :target="target" :href="href" tabindex="-1">
        <vs-icon v-if="!featherIcon" :icon-pack="iconPack" :icon="icon" />
        <feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon" />
        <slot />
      </a>
  </div>
</template>


<script>
import EventBus from '@/EventBus'

export default {
  data () {
    return {
      canSee: null,
      activeLink: null
    }
  },
  name: 'v-nav-menu-item',
  props: {
    icon        : { type: String,                 default: ''               },
    iconSmall   : { type: Boolean,                default: false            },
    iconPack    : { type: String,                 default: 'material-icons' },
    href        : { type: [String, null],         default: '#'              },
    to          : { type: [String, Object, null], default: null             },
    slug        : { type: String,                 default: null             },
    index       : { type: [String, Number],       default: null             },
    featherIcon : { type: Boolean,                default: true             },
    target      : { type: String,                 default: '_self'          },
    isDisabled  : { type: Boolean,                default: false            },
    userPemData: {
      type: Object,
      required: true
    }    
  },
  methods: {
    async acansee() {
      const userD = JSON.parse(this.userPemData['user_role']['permission'])

      const matchingKey = Object.keys(userD).find(key => key+'-list' === this.slug);
      this.canSee = matchingKey !== undefined && userD[matchingKey]['list'] !== undefined ? userD[matchingKey]['list'] : false
    },
    setCurrentMenu() {
      if (["management-list", "portfolio-list"].includes(this.slug)) EventBus.$emit('getCurrentMenuItem', null);
    }
  },
  created() {
    this.acansee()    
  }
}

</script>

