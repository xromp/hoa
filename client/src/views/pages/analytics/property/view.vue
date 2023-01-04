<template>
  <div class="vx-row">
    <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2">
      <maintenance-jobs-time-resolution/>
    </div>
    <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2">
      <maintenance-job-by-status/>
    </div>
    <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2">
      <payment-pey-day/>
    </div>
    <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2">
      <payment-by-status/>
    </div>
  </div>
</template>

<script>
import PaymentPeyDay from './payment-per-day.vue';
import PaymentByStatus from './payment-by-status.vue';
import MaintenanceJobByStatus from './maintenance-jobs-by-status.vue';
import MaintenanceJobsTimeResolution from './maintenance-jobs-time-to-resolution.vue';

export default {
  components: {
    PaymentPeyDay,
    PaymentByStatus,
    MaintenanceJobByStatus,
    MaintenanceJobsTimeResolution
  }
}
</script>

<style>

</style>