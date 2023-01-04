<!-- =========================================================================================
File Name: RegisterJWT.vue
Description: Register Page for JWT
----------------------------------------------------------------------------------------
Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="clearfix container">
    <div class="mt-4">
      <label class="vs-input--label">Property Code</label>
      <div class="flex w-full">
        <vs-input 
          name="propertyCode"
          v-model="code"
          class="w-full"/>
        <vs-button 
          color="primary" 
          type="border" 
          icon="search"
          :disabled="!code"
          @click="handlePropertySearch(code)"/>
      </div>
      <span class="text-danger text-sm" v-show="propertyResult.hasError && !errors.first('propertyCode')">{{ propertyResult.message }}</span>
      <p class="text-success text-sm text-center" v-show="propertyResult.hasProperty">{{propertyResult.message}}</p>
    </div>

    <div class="mt-4">
      <label class="vs-input--label">Role<span class="text-danger">*</span></label>
      <v-select 
        :options="propertyResult.roleOptions" 
        v-validate="'required'"
        label="name"
        name="role"
        class=" w-full"
        :disabled="!propertyResult.hasProperty"
        v-model="registerData.role"/>
      <span class="text-danger text-sm">{{ errors.first('role') }}</span>
    </div>

    <div class="mt-4">
      <label class="vs-input--label">Unit<span class="text-danger">*</span></label>
      <v-select
        :options="propertyResult.unitOptions" 
        v-validate="'required'"
        label="number"
        name="number"
        class="w-full"
        :disabled="!propertyResult.hasProperty"
        v-model="registerData.unit"/>
      <span class="text-danger text-sm"  v-show="errors.has('number')">{{ errors.first('number') }}</span>
    </div>

    <div class="mt-4">
      <label class="vs-input--label">Email<span class="text-danger">*</span></label>
      <vs-input
        v-validate="'required|email'"
        name="email"
        type="email"
        v-model="registerData.email"
        @blur="checkEmail(registerData.email)"
        class="w-full" />
    <span class="text-danger text-sm">{{ errors.first('email') }}</span>
    </div>

    <div v-if="!hideUserInfoForm">
      <vs-collapse type="shadow" class="w-full">
      <vs-collapse-item 
        ref="collapseUserInfo"
        :disabled="!propertyResult.hasProperty">
        <div slot="header" class="text-sm w-full"> Enter contact information </div>

        <div class="mt-4">
          <label class="vs-input--label">Salutation<span class="text-danger">*</span></label>
          <v-select
            :options="propertyResult.salutationOptions"
            :reduce="name => name.id"
            v-validate="'required'"
            label="name"
            name="salutation"
            class="w-full"
            :disabled="!propertyResult.hasProperty"
            v-model="registerData.salutation_id"/>
          <span class="text-danger text-sm">{{ errors.first('salutation') }}</span>
        </div>

        <div class="mt-4">
          <label class="vs-input--label">Firstname<span class="text-danger">*</span></label>
          <vs-input
            v-validate="'required'"
            data-vv-validate-on="blur"
            name="firstname"
            v-model="registerData.first_name"
            class="w-full" />
          <span class="text-danger text-sm">{{ errors.first('firstname') }}</span>
        </div>

        <div class="mt-4">
          <label class="vs-input--label">Middlename</label>
          <vs-input
          name="middlename"
          v-model="registerData.middle_name"
          class="w-full" />
        </div>
        
        <div class="mt-4">
          <label class="vs-input--label">Lastname<span class="text-danger">*</span></label>
          <vs-input
            v-validate="'required'"
            name="lastname"
            v-model="registerData.last_name"
            class="w-full" />
        <span class="text-danger text-sm">{{ errors.first('lastname') }}</span>
        </div>
        
        <div class="mt-4">
          <label class="vs-input--label">Suffix</label>
          <vs-input
            name="suffix"
            v-model="registerData.suffix"
            class="w-full" />
        <span class="text-danger text-sm">{{ errors.first('suffix') }}</span>
        </div>
        
        <vs-input
          name="dob"
          label="DOB"
          class="w-full mt-6" />
        <span class="text-danger text-sm">{{ errors.first('dob') }}</span>
        
        <div class="mt-4">
          <label class="vs-input--label">Phone Number<span class="text-danger">*</span></label>
          <vs-input
            v-validate="'required'"
            name="phoneNumber"
            v-model="registerData.phone1"
            class="w-full" />
          <span class="text-danger text-sm">{{ errors.first('phoneNumber') }}</span>
        </div>
        

        <vs-input
          name="phoneNumber2"
          label="2nd Phone Number"
          v-model="registerData.phone2"
          class="w-full mt-6" />

        <div class="mt-4" style="height: 14rem !important">
          <label class="vs-input--label">Are you the primary or secondary point of contact for this unit?</label>
          <v-select
            :options="pointOfContactOptions"
            :reduce="option => option.value"
            v-validate="'required'"
            name="pointOfContact"
            label="name"
            v-model="registerData.pointOfContact"
            class="autocomplete-select w-full"/>
        </div>

      </vs-collapse-item>
      </vs-collapse>
      
      <div class="mt-4">
        <label class="vs-input--label">Password<span class="text-danger">*</span></label>
        <vs-input
          ref="password"
          type="password"
          v-validate="'required|min:6|max:10'"
          name="password"
          placeholder="Password"
          v-model="registerData.password"
          :disabled="!propertyResult.hasProperty"
          class="w-full" />
        <span class="text-danger text-sm">{{ errors.first('password') }}</span>
      </div>

      <div class="mt-4">
        <label class="vs-input--label">Confirm Password<span class="text-danger">*</span></label>
        <vs-input
          type="password"
          v-validate="'min:6|max:10|confirmed:password'"
          data-vv-as="password"
          name="confirm_password"
          placeholder="Confirm Password"
          v-model="registerData.confirm_password"
          :disabled="!propertyResult.hasProperty"
          class="w-full" />
        <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
      </div>
    </div>
    <div v-else>
      <p class="text-primary text-sm">
        Email found. Please input your password to confirm/proceed with your request.
      </p>
      <!-- <vs-input
        ref="login-password"
        type="password"
        data-vv-validate-on="blur"
        v-validate="'required|min:6|max:10'"
        name="login-password"
        label-placeholder="Password"
        placeholder="Password"
        v-model="registerData.login_password"
        :disabled="!propertyResult.hasProperty"
        class="w-full mt-6" /> -->
      <span class="text-danger text-sm">{{ errors.first('login-password') }}</span>
    </div>

    <vs-checkbox v-model="registerData.isTermsConditionAccepted" class="mt-6">I accept the terms & conditions.</vs-checkbox>
    <vs-button  type="border" to="/login" class="mt-6">Login</vs-button>
    <vs-button 
      class="float-right mt-6" 
      @click="register" 
      :disabled="!isFormValid">
      Register
    </vs-button>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'

export default {
  components: {
    vSelect
  },
  data () {
    return {
      code: '',
      registerData: {},
      propertyResult: {},
      pointOfContactOptions: [
        { value: 'PRIMARY_POC', name: 'Primary Point of Contact'},
        { value: 'SECONDARY_POC', name: 'Secondary Point of Contact'},
        { value: 'NO', name: 'No'},
        { value: 'NEVER_CONTACT', name: 'Never Contact'},
      ],
      searchName: '',
      hideUserInfoForm: false,
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any() 
        && !this.propertyResult.hasError
        && this.propertyResult.hasProperty
        && this.registerData.role
        && this.registerData.unit
        && this.registerData.email
        && this.registerData.first_name
        && this.registerData.last_name
        && this.registerData.phone1
        && this.registerData.password
        && this.registerData.confirm_password
        && this.registerData.isTermsConditionAccepted
    }
  },
  methods: {
    async checkEmail(email) {
      const { data: isEmailExist } = await axios.get(`/auth/is-email-exist/${email}`);
      this.hideUserInfoForm = !!isEmailExist;
    },
    async handlePropertySearch(code) {
      const { data: response } = await axios.get(`/auth/get-property`, { params: { code } });
      const { status, data, message } = response
      if (status === 'success') {
        const { id, name, user_roles, units, salutation, user_org_roles } = data;

        const userOptions = user_org_roles
          .map(({ user }) => user);
        this.propertyResult = { 
          hasProperty: true, 
          message: `Your propert is ${name}.`,
          roleOptions: user_roles.filter(({ parent_id }) => parent_id !== 0),
          unitOptions: units,
          salutationOptions: salutation,
          userOptions,
        }
        this.registerData['property_id'] = id
      } else {
        this.propertyResult = { hasError: true, message }
        this.registerData = {}
      }
      console.log(this.propertyResult)

    },
    async register () {
      if (!this.isFormValid) return;
      const result = await axios.post(`/auth/register`, this.registerData);
      this.$vs.notify({
        color: 'success',
        title: 'Registration',
        text: 'Your user account request has been submitted. Waiting for approval'
      });
      this.$router.push('/login');
    }
  },
  async mounted() {
    const { code } = this.$route.query;
    this.code = code;
    await this.handlePropertySearch(code);
  },
  watch: {
    async searchName(userId) {
      const searchNameSelectEl = this.$refs.collapseUserInfo.$el;
      searchNameSelectEl.classList.add('open-item');
      searchNameSelectEl.children[1].style.maxHeight = "900px"
      searchNameSelectEl.children[1].style['overflow-y'] = "scroll"

      const {
        email,
        salutation,
        first_name,
        last_name,
        middle_name,
        suffix,
        dob,
        phone1,
        phone2,
      } = this.propertyResult.userOptions.find(({ id }) => id === userId) || {}

      this.registerData = { 
        ...this.registerData, 
        email,
        salutation_id: salutation.id,
        first_name,
        last_name,
        middle_name,
        suffix,
        dob,
        phone1,
        phone2
      }
    }

  }
}
</script>
<style lang="css" scoped>
.vs__dropdown-menu {
  z-index: 99999 !important;
}
.flex {
    display: flex;
}
.autocomplete-select {
  margin-top: 10px;
}
.container {
  height: 400px;   
  overflow-y : scroll;
}

.con-select-example {
  display: flex;
  align-items: center;
  justify-content: center;
}
.con-select .vs-select {
  width: 100%
}
@media (max-width: 550px) {
  .con-select {
    flex-direction: column;
  }
  .con-select .vs-select {
    width: 100%
  }
}
</style>