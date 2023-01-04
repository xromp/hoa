<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg" >
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                  <h4 class="mb-4" v-if="isRecover">Recover your password</h4>
                                  <h4 class="mb-4" v-else>Thanks, check your email for instructions to reset your password</h4>
                                  <p v-if="isRecover">Please enter your email address and we'll send you instructions on how to reset your password.</p>
                                  <p v-else>Didn't get the email? Check your spam folder.</p>
                                </div>

                                <div class="vx-card__title">
                                  <vs-input class="w-full mt-4" label="Email*" v-model="email" v-validate="'email'" name="email" type="email" v-show="isRecover"/>
                                  <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>
                                </div>

                                <div class="vx-card__title mb-8">
                                  <vs-button type="border" to="/login" class="px-4 w-full md:w-auto mt-8">Back To Login</vs-button>
                                  <vs-button class="float-right px-4 w-full md:w-auto mb-8 md:mb-0 mt-8" @click="recoverPass" v-show="isRecover" :disabled="!validateForm">Recover Password</vs-button>
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
      email: '',
      isRecover: true
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.email !== ''
    }
  },
  methods: {
    async recoverPass () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        await axios.post('/user/recover', {'email':this.email})    
        this.$vs.notify({
          time:10000,
          title: 'Recover Account',
          text: 'Your request has been successfully submitted',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'success'
        })  
        this.$vs.loading.close()
        this.isRecover = !this.isRecover
      } catch (err) {
        this.$vs.notify({
          title: 'Error',
          text: err.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })  
        this.$vs.loading.close()
      }
    }
  },  
}
</script>
