<template>
  <div>
    <vs-input
      v-validate="'required|email|min:3'"
      data-vv-validate-on="blur"
      name="email"
      icon-no-border
      icon="icon icon-user"
      icon-pack="feather"
      label-placeholder="Email"
      v-model="email"
      @keyup.enter="loginJWT"
      class="w-full"/>
    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

    <!-- v-validate="'required|min:6|max:6'" -->
    <vs-input
      data-vv-validate-on="blur"        
      type="password"
      name="password"
      icon-no-border
      icon="icon icon-lock"
      icon-pack="feather"
      label-placeholder="Password"
      v-model="password"
      @keyup.enter="loginJWT"
      class="w-full mt-6" />
    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

    <div class="flex flex-wrap justify-between my-5">
      <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox>
      <router-link to="/forgot-password">Forgot Password?</router-link>
    </div>

    <div class="flex flex-wrap justify-between mb-3">
      <div class="dropdown-button-container">
        <vs-button class="" type="filled" href="/register">Register</vs-button>
        <!-- <vs-button class="btnx" type="filled">Register</vs-button>
        <vs-dropdown>
          <vs-button class="btn-drop" type="filled" icon="expand_more"></vs-button>
          <vs-dropdown-menu>

            <vs-dropdown-item @click="registerUser">Service Provider</vs-dropdown-item>
            <vs-dropdown-item disabled>Resident</vs-dropdown-item>
            <vs-dropdown-item disabled>Owner</vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown> -->
      </div>

      <!-- <vs-button  type="border" @click="registerUser">Register</vs-button> -->
      <vs-button :disabled="!validateForm" @click="loginJWT">Login</vs-button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import router from '@/router'
import EventBus from '@/EventBus'

export default {
  data () {
    return {
      optionProperty: [{
        ref: '0',
        name:'No Property Selected'
      }],  
      optionParentOrg: [{
        id: 0,
        name:'No Parent Selected'
      }],

      selectedParentOrg: 0,
      selectedProperty: '0',

      email: '',
      password: '',
      checkbox_remember_me: false
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.email !== '' && this.password !== ''
    }
  },
  methods: {
    async getAccess() {
      const result = await axios.get(`/user-org/get`, {
        headers: { 'Authorization': localStorage.usertoken },
        params: {
          'parent_org_id': localStorage.selectedParentOrg,
          'property_ref': localStorage.selectedPropertyRef,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      localStorage.setItem('selectedParentOrg', result.data.defaultParentOrg.id) 
      localStorage.setItem('selectedRoleId', result.data.defaultRoleOrg.id)
      localStorage.setItem('selectedRoleVal', result.data.defaultRoleOrg.val)
      localStorage.setItem('selectedPropertyRef', result.data.defaultProperty.ref)

      localStorage.setItem('optionParentOrg', JSON.stringify(result.data.optionParentOrg))
      localStorage.setItem('optionRoleOrg', JSON.stringify(result.data.optionRoleOrg))
      localStorage.setItem('optionProperty', JSON.stringify(result.data.optionProperty))

      console.log('result', result)
      console.log('localStorage.selectedParentOrg', localStorage.selectedParentOrg)
      console.log('localStorage.selectedRoleId', localStorage.selectedRoleId)
      console.log('localStorage.selectedRoleVal', localStorage.selectedRoleVal)
      console.log('localStorage.selectedPropertyRef', localStorage.selectedPropertyRef)

      console.log('localStorage.optionParentOrg', JSON.parse(localStorage.optionParentOrg))
      console.log('localStorage.optionRoleOrg', JSON.parse(localStorage.optionRoleOrg))
      console.log('localStorage.optionProperty', JSON.parse(localStorage.optionProperty))

      // console.log('localStorage.userAllData', localStorage.userAllData)
    },
    async setAccess () {
      const result = await axios.get(`/user-org/set`, {
        params: { 
          'limit': 50,
        },
        headers: { 'Authorization': localStorage.usertoken }
      })

      if (result.data.defaultRoleOrg === 'no_user_type_defined') {
        this.$vs.loading.close()
        this.$vs.notify({
          time: 10000,
          title: 'Error Login',
          text: 'No user type defined. Please contact your Property Manager',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
        return false
      } else {        
        localStorage.setItem('optionParentOrg', JSON.stringify(result.data.optionParentOrg))
        localStorage.setItem('optionRoleOrg', JSON.stringify(result.data.optionRoleOrg))
        localStorage.setItem('optionProperty', JSON.stringify(result.data.optionProperty))

        localStorage.setItem('selectedParentOrg', result.data.defaultParentOrg.id) 
        // localStorage.setItem('selectedRoleId', result.data.defaultRoleOrg.id)
        localStorage.setItem('selectedRoleVal', result.data.defaultRoleOrg.val)
        localStorage.setItem('selectedPropertyRef', result.data.defaultProperty.ref)
        await this.refreshToken();
        return true
      }
    },
    async refreshToken() {
      const params = {
        'property_ref': localStorage.selectedPropertyRef,
        'parent_org_id': localStorage.selectedParentOrg,
        'role_id': localStorage.selectedRoleId,
        'role_val': localStorage.selectedRoleVal
      };
      const { data } = await axios.post(`/user/refresh-token`, { current_env: params }, {
        headers: { 'Authorization': localStorage.usertoken }
      });
      localStorage.setItem('usertoken', data.token);
    },
    checkLogin () {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.$vs.notify({
          time: 10000,
          title: 'Login Attempt',
          text: 'You are already logged in!',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning'
        })
        return false
      }
      return true
    },
    async loginJWT () {
      try {
        if (!this.checkLogin()) return
        this.$vs.loading()
        const payload = {
          checkbox_remember_me: this.checkbox_remember_me,
          userDetails: {
            email: this.email,
            password: this.password
          }
        }

        const login = await axios.post('/user/login', payload)
        if (login['data']['error'] === 'not_exist') {  
          this.$vs.loading.close()
          this.$vs.notify({
            time: 10000,
            title: 'Error Login',
            text: 'The email address or password is incorrect. Please try again.',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })  
        } else if (login['data']['error'] === 'no_permission') {
          this.$vs.loading.close()
          this.$vs.notify({
            time: 10000,
            title: 'Error Login',
            text: 'No Permission or User Type defined. Please contact your Property Manager',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })  
          return false
        } else {
          const userAllData = JSON.parse(login.data[0]['userAllData'])         
          localStorage.setItem('accessLevel', userAllData.user_role.access_level)
          localStorage.setItem('userAllData', login.data[0]['userAllData'])
          localStorage.setItem('usertoken', login.data[0]['token'])
          localStorage.setItem('usertokenexp', login.data[0]['exp'])
          localStorage.setItem('usersession', 'active')
          localStorage.setItem('selectedRoleId', login.data[0]['userPermission']['user_role_id'])

          const assign = await this.setAccess()
          if (!assign) return
          // await this.getAccess()
          
          // this.$vs.loading.close()
          setTimeout(() => {
            window.location.href = "/dashboard/analytics";
          },1000)
        }        
      }
      catch({response}) {
        this.$vs.loading.close()
        this.$vs.notify({
          time: 10000,
          title: 'Error',
          text: response.data.errors,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })  

        localStorage.removeItem('usertoken')
        localStorage.removeItem('usertokenexp')   
        localStorage.removeItem('selectedParentOrg')
        localStorage.removeItem('selectedRoleId')
        localStorage.removeItem('selectedRoleVal')
        localStorage.removeItem('selectedPropertyRef')
      }
    },
    registerUser () {
      if (!this.checkLogin()) return
      this.$router.push('/vendor/register').catch(() => {})
    }
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

    const userAllData = JSON.parse(login.data[0]['userAllData'])
    window.userGuiding.identify({
      name: userAllData.full_name,
      email: userAllData.email,
      created_at: new Date().getTime()
    })

    userGuiding.track("_track-login-visited");
    // localStorage.removeItem('usertoken')
    // localStorage.removeItem('usertokenexp')   
  }
}
</script>

<style lang="scss">
.dropdown-button-container {
  display: flex;
  align-items: center;

  .btnx {
    border-radius: 5px 0px 0px 5px;
  }

  .btn-drop {
    border-radius: 0px 5px 5px 0px;
    border-left: 1px solid rgba(255, 255, 255, .2);
  }
}
</style>