<!-- =========================================================================================
    File Name: ResetPassword.vue
    Description: Reset Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col sm:w-3/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/reset-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                  <h4 class="mb-4" v-if="!is_reset">Reset Password</h4>
                                  <h2 class="mb-4" v-else>You've successfully changed your password</h2>
                                  <p v-if="!is_reset">Please enter your new password.</p>
                                  <p v-else>If you see any suspicious activity on your account, please let us know immediately.</p>
                                </div>

                                <div class="vx-card__title">
                                  <div class="mb-4">
                                    <vs-input
                                      ref="password"
                                      type="password"
                                      data-vv-validate-on="blur"
                                      v-validate="'required|min:6'"
                                      name="password"
                                      label="Password*"          
                                      placeholder="Password"
                                      v-model="password"
                                      class="w-full" 
                                      v-if="!is_reset"
                                      />
                                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>  
                                  </div>

                                  <div class="mb-4">
                                    <vs-input
                                      type="password"
                                      v-validate="'required|min:6|confirmed:password'"
                                      data-vv-validate-on="blur"
                                      data-vv-as="password"
                                      name="confirm_password"
                                      placeholder="Confirm Password"
                                      label="Confirm Password*"
                                      v-model="confirm_password"
                                      class="w-full" 
                                      v-if="!is_reset"
                                      />
                                    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
                                  </div>
                                </div>

                                <div class="vx-card__title mb-8">
                                    <vs-button type="border" to="/login" class="px-4 w-full md:w-auto mt-8">Back To Login</vs-button>
                                    <vs-button class="float-right px-4 w-full md:w-auto mb-8 md:mb-0 mt-8" @click="updatePassword" v-show="!is_reset" :disabled="!validateForm">Reset</vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import axios from '@/axios'
export default {
  data () {
    return {
      password: '',
      confirm_password: '',
      is_reset: false
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.password !== '' && this.confirm_password !== ''
    }
  },
  methods: {
    async updatePassword () {
      try {
        if (!this.validateForm) return
        const data = {
          'password': this.password,
          'confirm_password': this.confirm_password
        }
        const result = await axios.post(`/user/recover-password`, data, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': this.$route.query.t
          }
        })

        if (result.data.error) {
          this.errors.add({
            field: 'confirm_password',
            msg: result.data.error
          })
          return false
        }

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.is_reset = !this.is_reset
        this.$vs.loading.close()
      } catch(err) {
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Data',
          text: err.toString('utf8')
        })
      } 
    },   
  }   
}
</script>
