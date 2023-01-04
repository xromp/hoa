<!-- =========================================================================================
    File Name: Error404.vue
    Description: 404 Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img">
    <div class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
      <img src="@/assets/images/pages/404.png" alt="graphic-404" class="mx-auto mb-4 max-w-full">
      <h1 class="sm:mx-0 mx-4 sm:mb-12 mb-8 text-5xl d-theme-heading-color text-white">404 - Page Not Found!</h1>
      <p class="sm:mx-0 mx-4 sm:mb-12 mb-8 d-theme-text-inverse">aXessPoint makes community living and working easy.</p>
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