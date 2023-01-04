<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">

    <div v-if="params.data.paid">
      <feather-icon 
        icon="PlusIcon" 
        svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed"/>
      <feather-icon 
        icon="Edit3Icon" 
        svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed"/>
      <feather-icon 
        icon="Trash2Icon" 
        svgClasses="h-5 w-5 mr-4 text-gray cursor-not-allowed"/>
    </div>
    <div v-else>
      <feather-icon 
        icon="PlusIcon" 
        svgClasses="text-success h-5 w-5 mr-4 hover:text-primary cursor-pointer" 
        @click="addLine"/>
      <feather-icon 
        icon="Edit3Icon" 
        svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" 
        @click="editLine"/>
      <feather-icon 
        icon="Trash2Icon" 
        svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" 
        @click="deleteLine"/>
    </div>
        
      <vs-prompt
        :title="title"
        color="primary"
        @cancel="invoiceForm.description='',invoiceForm.amount=''"
        @accept="submit"
        :is-valid="isFormValid"
        :active.sync="showInvoiceFormDialog">
        <div class="con-exemple-prompt">
          <div class="vx-col w-full">
            <div class="mt-4">
              <vs-input 
                class="w-full mt-4" 
                label="Description" 
                v-model="invoiceForm.description" 
                v-validate="'required'"
                name="description" />
              <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
            </div>

            <div class="mt-4">
              <vs-input 
                class="w-full mt-4" 
                label="Amount" 
                v-model="invoiceForm.amount" 
                v-validate="'required'"
                type="number"
                name="amount" />
              <span class="text-danger text-sm"  v-show="errors.has('amount')">{{ errors.first('amount') }}</span>
            </div>
          </div>
        </div>
      </vs-prompt>
    </div>
</template>

<script>
import axios from '@/axios'
import mainHelper from '@/mainHelper' //crud
import EventBus from '@/EventBus'

export default {
  name: 'CellRendererActions',
  data () {
    return {
      token: localStorage.usertoken,
      invoiceForm: {},
      submitType: '',
      showInvoiceFormDialog: false,
      // crud
      showC: false,
      showU: false,
      showD: false,

      token: localStorage.usertoken,
    }
  },
  
  methods: {
    async submit() {
      const { bill_id, fee_type_id, id } = this.params.data;
      const data = {
        ...this.invoiceForm,
        amount: parseFloat(this.invoiceForm.amount),
        bill_id,
        fee_type_id,
      }
      try {
        if (this.submitType === 'Create') {
          await axios.post(`/billing-line/save`, 
            data,
          { headers: { 'Authorization': this.token } });
          EventBus.$emit('loadBill');
        } else if (this.submitType === 'Update') { 
          await axios.patch(`/billing-line/update/${id}`, 
            data,
          { headers: { 'Authorization': this.token } });
          EventBus.$emit('loadBill');
        }
        
      } catch({ response }) {
        this.$vs.notify({
          color: 'danger',
          title: 'Data Saving Error',
          text: response.data.errors,
        })
      }
    },
    addLine() {
      this.showInvoiceFormDialog = true;
      this.submitType = 'Create';
    },
    editLine () {
      this.showInvoiceFormDialog = true;
      this.submitType = 'Update';
      this.invoiceForm = { ...this.params.data };
    },
    confirmationDialog({type, color, title, text, acceptText}) {
      return new Promise(resolve => {
        this.$vs.dialog({
          type,
          color,
          title,
          text,
          accept: () => resolve(true),
          acceptText,
        });
      })
    },
    async deleteLine () {
      const confirm = await this.confirmationDialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.description}".`,
        acceptText: 'Delete'
      });
      if (!confirm) return;

      await axios.delete(`/billing-line/delete/${this.params.data.id}`,
        { 
          headers: { 'Authorization': this.token },
          data: this.params.data
        });
      EventBus.$emit('loadBill');
      this.$vs.notify({
        color: 'success',
        title: 'Delete Billing Line',
        text: 'Line Deleted.',
      });
    },
  },
  computed: {
    isFormValid() {
      return !!(!this.errors.any() 
        && this.invoiceForm.description 
        && this.invoiceForm.amount);
    },
    title() {
      return `${this.submitType} Line Invoice Form`;
    }
  },
  async created () {
    this.showC = await mainHelper.cansee('billing-create', 'update')
    this.showU = await mainHelper.cansee('billing-update', 'update')
    this.showD = await mainHelper.cansee('billing-delete', 'delete')
  }  
}
</script>
