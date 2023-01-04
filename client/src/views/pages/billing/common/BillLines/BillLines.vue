<template>
  <div>
    <vs-button 
      color="success" 
      type="border"
      @click="addInvoiceLine">
      {{buttonText}}
    </vs-button>
    <ag-grid-vue
      style="width: 80%"
      ref="agGridTable"
      :key="forceRender"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 my-4"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="optionalChaning(() => items.map((e, i) => ({ ...e, item_no: i+1, index: i })))"
      domLayout="autoHeight"
      rowSelection="multiple"
      colResizeDefault="shift"
      :animateRows="true"
      :floatingFilter="false"
      :suppressPaginationPanel="true"
      :enableRtl="$vs.rtl">
    </ag-grid-vue>
    <vs-table hoverFlat class="w-1/2 ml-auto mt-4">
      <vs-tr>
        <vs-th class="pointer-events-none">TOTAL</vs-th>
        <vs-td>{{ totalAmount }} USD
        </vs-td>
      </vs-tr>
      <template slot="no-data"><div></div></template>
    </vs-table>
    <vs-prompt
      type="confirm"
      title="Create Line Invoice Form"
      color="primary"
      @cancel="invoiceForm.description='',invoiceForm.amount=''"
      @accept="submit"
      :is-valid="isFormValid"
      :active.sync="showCreateInvoiceFormDialog">
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
import Vue from 'vue'
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'

export default {
  props: {
    items: Array,
    buttonText: String,
  },
  components: {
    AgGridVue,
  },
  data() {
    return {
      forceRender: 0,
      invoiceForm: {
        description: '',
        amount: 0,
      },
      showCreateInvoiceFormDialog: false,

      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      columnDefs: [
        {
          headerName: 'No',
          field: 'item_no',
          width: 100,
          filter: true,
        },
        {
          headerName: 'Description',
          field: 'description',
          width: 400,
          filter: true,
        },
        {
          headerName: 'Amount',
          field: 'amount',
          filter: true,
          cellStyle: {textAlign: "right"},
          type: 'numericColumn',
        },
        {
          headerName: 'Action',
          field: 'transactions',
          width: 300,
          type: 'numericColumn',
          cellRendererFramework: Vue.extend(CellRendererActions),
          cellRendererParams: { items: this.items }
        }
      ],
    }
  },
  methods: {
    optionalChaning(fn) {
      try { return fn(); }
      catch (e) {}
    },
    addInvoiceLine() {
      this.showCreateInvoiceFormDialog = true;
    },
    async submit() {
      this.items.push(this.invoiceForm);
      this.invoiceForm = {};
    },
  },
  computed: {
    isFormValid() {
      return !!(!this.errors.any() 
        && this.invoiceForm.description 
        && this.invoiceForm.amount);
    },
    totalAmount() {
      const options = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      };
      const amount = this.items.reduce((acc, obj) => { return parseFloat(acc) + parseFloat(obj.amount) }, 0);
      return Number(amount).toLocaleString('en', options);
    },
  },
}
</script>

<style>
.vs-table--not-data {
  display: none;
}
</style>