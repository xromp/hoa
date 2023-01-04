<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">

    <feather-icon 
      icon="Edit3Icon" 
      svgClasses="text-warning h-5 w-5 mr-4 hover:text-primary cursor-pointer" 
      @click="editLine"/>
    <feather-icon 
      icon="Trash2Icon" 
      svgClasses="text-danger h-5 w-5 hover:text-primary cursor-pointer" 
      @click="deleteLine"/>
        
      <vs-prompt
        type="confirm"
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
                name="description" />
              <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>
            </div>

            <div class="mt-4">
              <vs-input 
                class="w-full mt-4" 
                label="Amount" 
                v-model="invoiceForm.amount" 
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
import mainHelper from '@/mainHelper' //crud

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
      if (this.submitType === 'Create') {
        this.params.items.push(this.invoiceForm);
      } else if (this.submitType === 'Update') {
        const { items, data } = this.params;
        this.$set(items, data.index, this.invoiceForm)
      }
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
      const { items, data } = this.params;
      this.$delete(items, data.index);
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
