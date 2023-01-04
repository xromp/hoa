<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row" style="margin-bottom: 3em;">
      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <label class="vs-input--label">Bill Type</label>
          <v-select :options="optionBillType" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.fee_type_id" name="fee_type_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('fee_type_id')">{{ errors.first('fee_type_id') }}</span>        
        </div>
        
        <div class="mt-4">
          <label class="vs-input--label">Due Date</label>
          <flat-pickr 
            v-model="data_local.due_date" 
            :config="datePickerConfig" 
            class="w-full"
            v-validate="'required'" 
            name="due_date" />
          <span class="text-danger text-sm"  v-show="errors.has('due_date')">{{ errors.first('due_date') }}</span>
        </div>
      </div>
    </div>
    <div class="vx-col md:w-1/2 w-full">
      <div class="mt-4">
        <approval :items="data_local"/>
      </div>
    </div>

    <bill-lines 
      :items="data_local.bill_lines"
      buttonText="Add Payment Line"/>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '../../../../axios'
import approval from '../../../components/approval-widget/approval'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import BillLines from '../common/BillLines/BillLines.vue';

export default {
  components: {
    vSelect,
    approval,
    flatPickr,
    BillLines,
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      token: localStorage.usertoken,
      data_local: JSON.parse(JSON.stringify({ ...this.data, ...this.data.bill_lines[0] })),

      optionBillType: [],
      optionUnit: [],
      optionProperty: [],

      statusOptions: [
        { label: 'Active',  value: 'active' },
        { label: 'Blocked',  value: 'blocked' },
        { label: 'Deactivated',  value: 'deactivated' }
      ],
      roleOptions: [
        { label: 'Admin',  value: 'admin' },
        { label: 'User',  value: 'user' },
        { label: 'Staff',  value: 'staff' }
      ],
      datePickerConfig: {
        minuteIncrement: 1,
        minDate: new Date(),
        maxDate: null, 
        dateFormat: 'Y-m-d',
      },
    }
  },
  computed: {
    status_local: {
      get () {
        return { label: this.capitalize(this.data_local.status),  value: this.data_local.status  }
      },
      set (obj) {
        this.data_local.status = obj.value
      }
    },
    role_local: {
      get () {
        return { label: this.capitalize(this.data_local.role),  value: this.data_local.role  }
      },
      set (obj) {
        this.data_local.role = obj.value
      }
    },
    validateForm () {
      return !this.errors.any()
        && this.data_local.bill_lines.length;
    }
  },
  methods: {
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    checkBillLines() {
      if (!this.data_local.bill_lines.length)
      return this.$vs.notify({
        color: 'danger',
        title: 'No Amount',
        text: 'Please provide amount by adding lines',
      });
    },
    async save_changes () {
      this.checkBillLines();
      if (!this.validateForm) return

      const editId = this.$route.params.editId
      try {    
        await axios.patch(`/billing/update/${editId}`, this.data_local, {
          headers: { 'Authorization': this.token }
        });
        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved' 
          });
        this.$router.push({name:'app-billing-view', params: {viewId: editId }})
      } catch(err) {
        reject(err.toString('utf8'));
      }
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadBillType () {
      try {
        const { data } = await axios.get(`/api/billType/list`, {
          headers: { 'Authorization': this.token }
        });
        this.optionBillType = data;
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    async loadProperty () {
      try {    
        const { data } = await axios.get(`/api/property/list`, {
          headers: { 'Authorization': this.token }
        });
        this.optionProperty = data;
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    async loadUnit () {
      try {
        const { data } = await axios.get(`/unit/list`, {
          headers: { 'Authorization': this.token, 'property_ref': localStorage.selectedPropertyRef }
        });
        this.optionUnit = data.map(unit => ({ ...unit, name: `${unit.number} - ${this.optionalChaning(() => unit.unit_residents[0].user.full_name)}`}))
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    optionalChaning(fn) {
      try { return fn(); }
      catch (e) {}
    }
  },
  created () {
    this.loadBillType();
    this.loadProperty();
    this.loadUnit();
  }
}
</script>
