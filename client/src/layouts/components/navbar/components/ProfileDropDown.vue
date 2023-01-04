<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ fullName }}</p>
      <small v-if="selectedRole !== null">{{selectedRole[0]['name']}}</small>
    </div>

    <vs-prompt 
      color="warning"
      title="Select User Type" 
      acceptText="Ok"
      :active.sync="viewRolePop"
      @cancel="viewRolePop=false"
      @accept="changeRole()"
      @close="viewRolePop=false"
    >
      <div class="cursor-pointer p-4">
        <v-select :options="optionRoleOrg" :reduce="name => name.id" label="name" v-model="selectedRoleId" name="selectedRoleId" class="p-2"/>
      </div>
    </vs-prompt>  

    <vs-dropdown class="cursor-pointer">
      <div id="profile" class="con-img ml-3">
        <read-profile 
        :folderPath="folderPath" 
        :folderId="folderId" 
        :defaultImg = "defaultImg"
        />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li 
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" 
            @click="viewRolePop=true"
            v-if="optionRoleOrg.length>1"
          >
            <feather-icon icon="EyeIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">View As</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="profile">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <!-- <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/email').catch(() => {})">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li> -->

          <!-- <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/todo').catch(() => {})">
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li> -->

          <!-- <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/chat').catch(() => {})">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li> -->

          <!-- <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/eCommerce/wish-list').catch(() => {})">
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li> -->

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import axios from '@/axios'
import EventBus from '@/EventBus'
import ReadProfile from '@/views/components/files/ReadProfile.vue'
import vSelect from 'vue-select'

const jwt = require('jsonwebtoken')
var token = localStorage.usertoken
var decoded = jwt.verify(token, 'secret')  

export default {
  components: {
    vSelect,
    ReadProfile
  },
  data () {
    return {
      optionRoleOrg: [],
      selectedRole: null,
      selectedRoleId: parseInt(localStorage.selectedRoleId),
      selectedRoleVal: localStorage.selectedRoleVal,

      viewRolePop: false,
      token: token,
      userId: decoded.id,
      fullName: decoded.first_name + ' ' + decoded.last_name,

      //reading docs
      tableRead: [],
      files: [],
      fileKey: [],
      folderId: 3,
      defaultImg: '/img/avatar-s-11.4799a585.png'
    }
  },
  computed: {
    activeUserInfo () {
      return this.$store.state.AppActiveUser
    },
    folderPath() {
      return `docs/user/avatar/${this.userId}`
    },
  },
  methods: {
    async loadRole() {
      const result = await axios.get('/role/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionRoleOrg = result['data']
      this.selectedRoleId = parseInt(localStorage.selectedRoleId)
      this.selectedRoleVal = localStorage.selectedRoleVal
      this.selectedRole = this.optionRoleOrg.filter(result => this.selectedRoleId === result.id) 

      if (this.selectedRole.length === 0) {
        this.$vs.loading()
        localStorage.removeItem('selectedRoleId')
        localStorage.removeItem('selectedRoleVal')
        localStorage.setItem('selectedRoleId', this.optionRoleOrg[0]['id'])
        localStorage.setItem('selectedRoleVal', this.optionRoleOrg[0]['val'])
        
        await this.loadPermissionOrg() 
      }

      // setTimeout(() => { this.$vs.loading.close() },1000)
    },
    async loadPermissionOrg() {
      const result = await axios.get('/user-org/permission/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      const userPemData = JSON.parse(localStorage.userAllData)
      const userModule = userPemData['user_role']['module']
      const permission = JSON.parse(result['data'][0]['permission'])

      for (const [key, value] of Object.entries(permission)) {
        if (!userModule.includes(key)) {
          delete permission[key]
        }
      }

      userPemData['user_role']['permission'] = JSON.stringify(permission)
      localStorage.removeItem('userAllData')
      localStorage.setItem('userAllData', JSON.stringify(userPemData))

      await this.loadRole()
      setTimeout(() => {
        window.location.href = "/dashboard/analytics";
      },1000)
    },   
    async refreshToken() {
      const params = {
        'property_ref': localStorage.selectedPropertyRef,
        'parent_org_id': localStorage.selectedParentOrg,
        'role_id': localStorage.selectedRoleId,
        'role_val': localStorage.selectedRoleVal
      };
      const { data } = await axios.post(`/user/refresh-token`, { current_env: params }, {
        headers: { 'Authorization': this.token }
      });
      localStorage.setItem('usertoken', data.token);
    }, 
    async changeRole() {
      this.$vs.loading()

      const newRole = this.optionRoleOrg.filter(result => this.selectedRoleId === result.id)
      console.log('newRole  ', newRole)
      console.log('this.selectedRoleId  ', this.selectedRoleId)
      localStorage.removeItem('selectedRoleId')
      localStorage.removeItem('selectedRoleVal')
      localStorage.setItem('selectedRoleId', newRole[0]['id'])
      localStorage.setItem('selectedRoleVal', newRole[0]['val'])

      await this.loadPermissionOrg() 
      await this.refreshToken();
      // this.selectedRoleId = parseInt(localStorage.selectedRoleId)
      // this.selectedRole = newRole.filter(result => this.selectedRoleId === result.id)
      // EventBus.$emit('side-menu-parent', true)
      // EventBus.$emit('side-menu-property', true)      
      // EventBus.$emit('user-org-list', true) 
    },
    profile() {
      this.$router.push(`/user-profile/edit/${this.userId}`).catch((err) => { 
        console.log('err prfile', err)
      })
    },
    logout () {
      console.log('out')
      localStorage.removeItem('usertoken')
      localStorage.removeItem('usertokenexp')   
      localStorage.removeItem('selectedParentOrg')
      localStorage.removeItem('selectedRoleId')
      localStorage.removeItem('selectedRoleVal')
      localStorage.removeItem('selectedPropertyRef')
      setTimeout(() => {
        // this.$router.push('/pages/login').catch(() => {})
        window.location.href = "/login";
      },1000)  
    }
  },
  async created () {
    try {
      this.$vs.loading()
      this.loadRole()
      setTimeout(() => { this.$vs.loading.close() },1000)
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading Profile Dropdown Component',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  },
  mounted () { 
    EventBus.$on('update-parent-id',async (result) => {
      await this.loadRole()      
    })  
  }, 
}
</script>
<style>
div#profile .avatar-img {
  width: 50px;
  overflow: hidden;
  padding-top: 50px;
  border-radius: 50% !important;
}

div#profile .avatar-img img {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
}
</style>