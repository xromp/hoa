<template lang="html">
  <div class="centerx">
    <vs-popup class="holamundo"  title="Payment Confirmation" :active.sync="showPayment">
        <vs-table hoverFlat class="w-1/1 ml-auto mt-4 mb-6">
          <vs-tr>
              <vs-th class="pointer-events-none">TOTAL INVOICE</vs-th>
              <vs-td>{{ numberFormat(payment.total_amount) }} USD</vs-td>
          </vs-tr>
          <vs-tr>
              <vx-tooltip
                color="confirmation-transaction-fee"
                position="left">
                <vs-th>
                  TRANSACTION FEE                   
                  <vs-avatar color="warning" text="?" class="cursor-pointer"/>
                  <small>({{ numberFormat(transaction[payment.method].rate, { style: 'percent' }) }} + {{ numberFormat(transaction[payment.method].additional) }} USD)</small>
                </vs-th>
              </vx-tooltip>
              <vs-td>{{ numberFormat(fee) }} USD</vs-td>
          </vs-tr>
          <vs-tr>
              <vs-th class="pointer-events-none">TOTAL PAYMENT</vs-th>
              <vs-td><strong>{{ numberFormat(amountWithFee) }} USD</strong></vs-td>
          </vs-tr>
        </vs-table>
        <vs-button class="w-full" @click="confirm">Confirm</vs-button>
    </vs-popup>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  props: { payment: Object },
  data(){
    return {
      token: localStorage.usertoken,
      showPayment: false,
      transaction: {
        cc: { rate: 0.0295, additional: 2.00 },
        ach: { rate: 0.015, additional: 2.00 }
      },
    }
  },
  methods: {
    numberFormat(amount, options) {
      const option = {
        ...options,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      const formatter = new Intl.NumberFormat("en-US", option);
      return formatter.format(amount);
    },
    show() {
      this.showPayment = true;
      console.log(this.payment)
    },
    async confirm() {
      try {
        this.$vs.loading();
        await axios.post(`/payment/process-existing-payment`, this.payment, {
          headers: { 'Authorization': this.token }
        })
        this.$vs.notify({
          color: 'success',
          title: 'Process Payment',
          text: 'Payment processed successfully.',
        })
        this.$router.go(0);
        this.$vs.loading.close();
      } catch ({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Process Payment',
          text: response.data.errors,
        });
        this.$vs.loading.close();
      }
    }
  },
  computed: {
    amountWithFee() {
      const { total_amount, method } = this.payment;
      return parseFloat(total_amount) 
      + (parseFloat(total_amount) * this.transaction[method].rate) 
      + this.transaction[method].additional;
    },
    fee() {
      const { total_amount, method } = this.payment;
      return (parseFloat(total_amount) * this.transaction[method].rate)
      + this.transaction[method].additional;
    },
  },
}
</script>

<style>
  .vs-tooltip-confirmation-transaction-fee {
    background-image: url('../../../../assets/images/axp/billing/transaction-fee.png');
    width: 350px !important;
    height: 250px;
    background-size: 340px 240px;
    background-repeat: no-repeat;
    background-color: white;
    max-width: unset;
    z-index: 2147483647 !important;
  }
  .vs-tooltip {
    z-index: 2147483647;
  }
</style>