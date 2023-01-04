
<template>

  <div id="page-data-list">
    <div class="vx-card p-6">
      <vs-tabs class="tab-action-btn-fill-conatiner" :key="forceRender">
        <vs-tab 
          label="Account Receivables" 
          icon-pack="feather" 
          icon="icon-dollar-sign"
          v-if="permission.ar.list">
          <div class="tab-text">
            <account-receivable/>
          </div>
        </vs-tab>

        <vs-tab 
          label="Account Payables" 
          icon-pack="feather" 
          icon="icon-archive"
          v-if="permission.ap.list">
          <div class="tab-text">
            <account-payable/>
          </div>
        </vs-tab>

        <vs-tab 
          label="Transaction" 
          icon-pack="feather" 
          icon="icon-archive">
          <div class="tab-text">
            <transaction/>
          </div>
        </vs-tab>
      </vs-tabs>

    </div>
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'

import AccountPayable from './AccountPayable';
import AccountReceivable from './AccountReceivable';
import Transaction from './Transaction';

import mainHelper from '@/mainHelper' //crud
const jwt = require('jsonwebtoken')

export default {
  components: {
    AgGridVue,
    vSelect,

    AccountPayable,
    AccountReceivable,
    Transaction,
  },
  data() {
    return {
      permission: { 
        ar: {}, 
        ap: {}
      },
      forceRender: 0,
    }
  },
  async created() {
    this.permission = {
      ar: {
        list: await mainHelper.cansee('account-receivable-list', 'list'),
        create: await mainHelper.cansee('account-receivable-create', 'create'),
        read: await mainHelper.cansee('account-receivable-read', 'read'),
        update: await mainHelper.cansee('account-receivable-update', 'update'),
        delete: await mainHelper.cansee('account-receivable-delete', 'delete'),
      },
      ap: {
        list: await mainHelper.cansee('account-payable-list', 'list'),
        create: await mainHelper.cansee('account-payable-create', 'create'),
        read: await mainHelper.cansee('account-payable-read', 'read'),
        update: await mainHelper.cansee('account-payable-update', 'update'),
        delete: await mainHelper.cansee('account-payable-delete', 'delete'),
      }
    };
    this.forceRender +=1;
  }
}

</script>

<style lang="scss">
#page-data-list {
  .data-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}
</style>
