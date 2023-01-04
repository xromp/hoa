<template>
  <dashboard-admin class="mt-4" v-if="isAdmin"/>
  <dashboard-vendor class="mt-4" v-else-if="roleVal == 'vendor'"/>
  <dashboard-tenant class="mt-4" v-else-if="isTenant"/>
</template>

<script>
import DashboardAdmin  from './DashboardAdmin.vue'
import DashboardVendor  from './DashboardVendor.vue'
import DashboardTenant  from './DashboardTenant.vue'
import axios from '@/axios'
import EventBus from '@/EventBus'
const jwt = require('jsonwebtoken')
import Analytics from 'analytics'
import googleTagManager from '@analytics/google-tag-manager'

export default {
  components: {
    DashboardAdmin,
    DashboardVendor,
    DashboardTenant
  },
  data () {
    return {
      token: localStorage.usertoken,
      roleVal: localStorage.selectedRoleVal,
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager',
        'staff'
      ],
      // asAdmin: [
      //   'admin', 
      // ],
      asTenant: ['user'],
    }
  },
  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
    },
    isTenant() {
      return this.asTenant.includes(this.roleVal)
    }
  },
  methods: {
  },
  created () {
  },
  mounted () { 
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

    const userAllData = JSON.parse(localStorage.userAllData);
    window.userGuiding.identify({
      name: userAllData.full_name,
      email: userAllData.email,
      created_at: new Date().getTime()
    })

    userGuiding.track("_track-dashboard-visited");

    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== '/dashboard/analytics') return
      console.log('/dashboard/analytics')
      this.roleVal = localStorage.selectedRoleVal
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== '/dashboard/analytics') return
      console.log('/dashboard/analytics')
      this.roleVal = localStorage.selectedRoleVal
    })
  },  
}
</script>