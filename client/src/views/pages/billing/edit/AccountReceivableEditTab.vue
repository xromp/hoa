<template>
  <div id="data-edit-tab-info">
    <vs-popup classContent="popup-example" title="Add New Bill Type" :active.sync="popupAddBillType">
      <div class="vx-col w-full h-full">
        <div class="vx-col w-full">
          <vs-input class="w-full mt-4" label="Name" v-model="data_local.name" type="text" v-validate="'required'" name="name" @change="generateCode(data_local.name)"/>
          <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>

          <vs-input class="w-full mt-4" label="Code" v-model="data_local.code" type="text" v-validate="'required'" name="code" />
          <span class="text-danger text-sm"  v-show="errors.has('code')">{{ errors.first('code') }}</span>
        </div>

        <div class="mt-6 flex justify-end">            
          <vs-button class="mr-2" @click="saveBillType" color="primary" type="filled" :disabled="!validateFormPopUp">Save</vs-button>
        </div>
      </div>
    </vs-popup>
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <label class="vs-input--label">Unit</label>
          <v-select 
            :options="optionUnit" 
            :reduce="number => number.id" 
            label="name" 
            v-validate="'required'" 
            v-model="data_local.unit_id" 
            name="unit_id"/>
          <span class="text-danger text-sm"  v-show="errors.has('unit_id')">{{ errors.first('unit_id') }}</span>  
        </div>
      </div>
      
      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4 select-bill-type">
          <label class="vs-input--label">Bill Type</label>
            <v-select :options="optionBillType" label="name" v-validate="'required'" v-model="fee_type" name="fee_type" @click="addBillType(fee_type)" @input="addBillType(fee_type)">
              <template v-slot:option="option">
                <div :class="{'list-add-bill':option.id===0}">
                  <span>{{ option.name }}</span>
                </div>
              </template>
            </v-select> 
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
    buttonText="Add Invoice Line"/>

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
      fee_type: [],
      popupAddBillType: false,

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
    validateFormPopUp () {
      return this.data_local.name!=='';
    },
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
    async saveBillType () {
      try {
        this.$vs.loading()
        if (!this.validateFormPopUp) return
        this.popupAddBillType=false
        const editId = -1
        const result = await axios.post(`/bill-type/save/${editId}`, 
          { 
            data: this.data_local 
          }, { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': this.token
            }
        })

        if (result['data']['error_message']) {
          this.$vs.notify({
            color: 'danger',
            title: 'Data Saved',
            text: result['data']['error_message']
          })
          this.$vs.loading.close()
          return false
        }
        
        this.data_local.fee_type_id = result.data.result.id
        this.fee_type = result.data.result

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.loadBillType()
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Error loading',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    addBillType(data){
      this.data_local.fee_type_id = data.id

      if (data.id===0) {        
        this.popupAddBillType=true
        this.fee_type = []
      }
    },
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
        const { data } = await axios.get(`/bill-type/list`, {
          headers: { 'Authorization': this.token }
        });
        this.optionBillType = [...data, {id: 0,name:'Add New'}];
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    async loadProperty () {
      try {
        const { data } = await axios.get(`/property/all/${localStorage.selectedParentOrg}`, {
          // params: {
          //   'property_ref': localStorage.selectedPropertyRef,
          //   'parent_org_id': localStorage.selectedParentOrgId,
          //   'role_id': localStorage.selectedRoleId,
          //   'role_val': localStorage.selectedRoleVal,
          // },
          headers: { 'Authorization': this.token },
        });
        this.optionProperty = data;
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    async loadUnit () {
      try {    
        const { data } = await axios.get(`/unit/list`, {
          params: { 
            'property_ref': localStorage.selectedPropertyRef,
            'parent_org_id': localStorage.selectedParentOrg,
          },
          headers: { 'Authorization': this.token },

        });
        this.optionUnit = data.map(unit => ({ ...unit, name: `${unit.number} - ${this.optionalChaning(() => unit.unit_users[0].user.full_name) || `(No resident assgined yet)`}`}))
      } catch(err) {
        console.error(err.toString('utf8'));
      }
    },
    optionalChaning(fn) {
      try { return fn(); }
      catch (e) {}
    },
    generateCode(name) {
      this.$set(this.data_local, 'code', name.toUpperCase());
    }
  },
  created () {
    this.loadBillType()
    this.loadProperty()
    this.loadUnit()
  }
}
</script>
<style>
  div.select-bill-type .list-add-bill  {
    background-color: #28c76f !important;
    color: white !important;
    border-radius: 50px;
    padding: 5px !important;
  }

  div.select-bill-type li.vs__dropdown-option {
    padding: 5px 0px 5px 0px !important;
    margin: 0px !important;
    text-indent: 20px !important;
  }

  div.select-bill-type li.vs__dropdown-option:nth-last-child(2) {
    border-bottom: 1px solid #80808085;    
  }

  div.select-bill-type li.vs__dropdown-option:last-child {    
    background: #28c76f;
    border-radius: 15px;
    box-shadow: 5px 5px 5px #0000001f;
    width:25% !important;
    margin: 10px 5px 5px auto !important;
    text-align: center;
    padding-right: 10px !important;
  }
</style>
