<!-- =========================================================================================
    File Name: Maintenance.vue
    Description: Maintenance Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
            <img src="@/assets/images/pages/maintenance-2.png" alt="graphic-maintenance" class="mx-auto mb-4">
            <h1 class="sm:mx-0 mx-4 mb-6 text-5xl d-theme-heading-color text-white">We're Renovating!</h1>
            <p class="sm:mx-0 mx-4 mb-6 d-theme-text-inverse">We are doing some virtual landscaping in this page in order to provide you with an even better experience.</p>
            <vs-button size="large" color="white" class="text-primary" @click="home">Back to Home</vs-button>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    home() {
      this.$vs.loading()
      setTimeout(() => {
        // window.location.href = "/";
        this.$router.push({name:'dashboard-analytics'})
      },500) 
    }
  }
}
</script>
