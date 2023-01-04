<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col sm:w-3/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row" v-if="validate!==0">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/graphic-3.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8" style="height:100px;">
                                  <h4 class="mb-4" v-if="validate===1">You're all set!</h4>
                                  <h4 class="mb-4" v-else-if="validate===2">Email verification link has expired</h4>

                                  <p v-if="validate===1">Your email has been verified. Your account is now active.</p>
                                  <p v-else-if="validate===2">This email validation link has expired. Please login and resend the link.</p>
                                  <p v-if="false">Enter the email address associated with your account and we'll send you a link to verify your email</p>
                                </div>

                                <div class="vx-card__title" v-if="false">
                                  <vs-input class="w-full mt-4" label="Email*" v-model="email" v-validate="'email|required'" name="email" type="email"/>
                                  <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>
                                </div>

                                <div class="vx-card__title mb-8">
                                  <vs-button @click="goToLogin" class="w-full md:w-auto mt-8">Go to Dashboard</vs-button>
                                </div>
                            </div>
                            <div class="p-8" v-if="false">
                              <div class="vx-card__title mb-8" style="height:200px">
                                <h4 class="mb-4">Verify your email address</h4>
                                <p>Look for the verification email in your inbox and click the link in that email.</p>
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
      validate: 0,
      is_request_sent: false
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.email !== ''
    }
  },
  methods: {
    goToLogin() {
      window.location.href = "/login"
    },
    async validateRequest () {
      if (!this.validateForm) return
      this.$vs.loading()
      const result = await axios.post(`/user/confirm-email-request`, {email:this.email}, {
        headers: { 
          'Content-Type': 'application/json'
        }
      })

      this.is_request_sent = !this.is_request_sent
      this.$vs.loading.close()
    } 
  },
  async created(){
    try {      
      this.$vs.loading()
      // this.validateRequest()
      const { data } = await axios.post(`/user/confirm-email`, {}, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': this.$route.query.t
        }
      })

      this.validate = !data.error ? 1 : 2
      this.$vs.loading.close()
    } catch (err) {
      this.$vs.loading.close()
      this.validate = 2
    }
  }
}
</script>