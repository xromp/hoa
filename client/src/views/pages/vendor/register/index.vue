<template>
<div :class="cls" class="flex w-full bg-img vx-row no-gutter items-center justify-center">
  <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0" v-if="true">  
    <vx-card title="Service Provider Registration" class="m-4 mt-5 mb-5" v-if="step!==6">
      <div>
        <form-wizard color="rgba(var(--vs-primary), 1)" errorColor="rgba(var(--vs-danger), 1)" :title="null" :subtitle="null" finishButtonText="Submit">
          <tab-content title="Business Details" class="mb-5" icon="feather icon-briefcase" :before-change="validateStep1">
            <p>Please fill out important fields</p>

            <form data-vv-scope="step-1">
              <div class="vx-row">

                <div class="vx-col w-full">
                  <div class="flex items-start flex-col sm:flex-row mt-4">
                    <img :src="files[0]" class="mr-8 rounded h-24 w-24" />
                    <div>
                      <input type="file" id="fileAvatar" class="hidden" ref="update_avatar_input" @change="update_docs('fileAvatar')" accept="image/*">
                      <vs-button class="mr-4" @click="$refs.update_avatar_input.click()">Add Logo</vs-button>
                    </div>
                  </div>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input
                  :danger="is_dup_business_name===false"
                  danger-text="Business Name exist"
                  val-icon-danger="icon-x"

                  :success="is_dup_business_name"
                  success-text="Business Name is valid"
                  val-icon-success="icon-check"

                  val-icon-pack="feather"
                  class="w-full mt-4" label="Business Name*"
                  v-model="data_local.business_name" 
                  autocomplete="chrome-off"
                  v-validate="'required'" name="business_name" type="text" @blur="checkDuplicate('business_name')"
                  />
                  <span class="text-danger">{{ errors.first('step-1.business_name') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Business Email*"  v-model="data_local.business_email" class="w-full mt-4" name="business_email" v-validate="'required|email'" />
                  <span class="text-danger">{{ errors.first('step-1.business_email') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Business Phone*"  v-model="data_local.business_phone" class="w-full mt-4" name="business_phone" v-validate="'required'" @keypress="isNumber" @blur="validatePhone"/>
                  <span class="text-danger">{{ errors.first('step-1.business_phone') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full mt-4">
                  <label class="vs-input--label">Business Address*</label>
                  <vue-google-autocomplete
                    autocomplete="business_address_line_1"
                    @blur="checkAdress('business_address_line_1')" 
                    id="business_address_line_1"
                    name="business_address_line_1"
                    v-model="data_local.business_address_line_1"
                    aria-describedby="business_address_line_1-feedback"
                    class="vs-inputx vs-input--input normal w-full"
                    style="border: 1px solid rgba(0, 0, 0, 0.2)"
                    placeholder=""
                    types=address
                    ref="business_address_line_1"    
                    v-validate="'required'"
                    v-on:placechanged="getAddressDataLine1"
                  ></vue-google-autocomplete>

                  <span class="text-danger">{{ errors.first('step-1.business_address_line_1') }}</span> 
                </div>                

                <div class="vx-col md:w-1/2 w-full mt-4">
                  <label class="vs-input--label">Category*</label>
                  <v-select multiple :options="optionVendorCategory" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.category_id" name="category_id"/>
                  <span class="text-danger">{{ errors.first('step-1.category_id') }}</span>

                   <!-- <div v-if="data_local.category_id==-1" class="vx-col w-full">
                    <vs-input label="Other Category"  v-model="data_local.category_name" class="w-full mt-4" name="category_name" v-validate="'required'" />
                    <span class="text-danger">{{ errors.first('step-1.category_name') }}</span>
                  </div> -->
                </div>

                <div class="vx-col md:w-1/2 w-full mt-4">
                  <label class="vs-input--label">Radius*</label>
                  <div id="map"></div>
                  <vs-input v-model="data_local.service_radius.center_lat" class="w-full mt-4" name="service_radius" v-validate="'required'" type="hidden"/>
                  <span class="text-danger vx-row ml-0">{{ errors.first('step-1.service_radius') }}</span>
                  <vs-button id="clear-map" color="success" class="mt-2">Clear</vs-button>

                  <input type="hidden" id="coord"/>
                  <input type="hidden" id="center-lat"/>
                  <input type="hidden" id="center-lng"/>
                  <input type="hidden" id="center-radius"/>
                </div>
                <!-- <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Service Radius"  v-model="data_local.service_radius" class="w-full mt-4" name="service_radius" v-validate="'required'" />
                  <span class="text-danger">{{ errors.first('step-1.service_radius') }}</span>
                </div> -->

              </div>

              <vs-divider/>
              <div class="vx-row">
                <div class="vx-col md:w-1/2 w-full">
                  <vs-checkbox v-model="data_local.same_as_business" @change="same_as_business">
                    
                  <p>Tick the box if same as above</p>
                  </vs-checkbox>
                </div>
              </div>

              <div class="vx-row">  
                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Billing Email"  v-model="data_local.billing_email" class="w-full mt-4" name="billing_email" v-validate="'email|required'" />
                  <span class="text-danger">{{ errors.first('step-1.billing_email') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Billing Phone"  v-model="data_local.billing_phone" class="w-full mt-4" name="billing_phone" v-validate="'required'" />
                  <span class="text-danger">{{ errors.first('step-1.billing_phone') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full mt-4">
                  <label class="vs-input--label">Billing Address</label>
                  <vue-google-autocomplete
                    id="billing_address_line_1"
                    name="billing_address_line_1"
                    v-model="data_local.billing_address_line_1"
                    aria-describedby="billing_address_line_1-feedback"
                    class="vs-inputx vs-input--input normal w-full"
                    style="border: 1px solid rgba(0, 0, 0, 0.2)"
                    placeholder=""
                    types=address
                    ref=billing_address_line_1    
                    v-validate="'required'"
                    v-on:placechanged="getAddressDataLine2"
                  ></vue-google-autocomplete>

                  <span class="text-danger">{{ errors.first('step-1.billing_address_line_1') }}</span> 
                </div>                                
                
              </div>
            </form>
          </tab-content>

          <!-- tab 2 content -->
          <tab-content title="Contact Information" class="mb-5" icon="feather icon-user" :before-change="validateStep2">
            <p>Please fill out important fields</p>

            <form data-vv-scope="step-2">
              <div class="vx-row">

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="First Name*"  v-model="data_local.first_name" class="w-full mt-4" name="first_name" v-validate="'required'" />
                  <span class="text-danger">{{ errors.first('step-2.first_name') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Last Name*"  v-model="data_local.last_name" class="w-full mt-4" name="last_name" v-validate="'required'" />
                  <span class="text-danger">{{ errors.first('step-2.last_name') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input
                  :danger="is_dup_email===false"
                  danger-text="Email exist"
                  val-icon-danger="icon-x"

                  :success="is_dup_email"
                  success-text="Email is valid"
                  val-icon-success="icon-check"

                  val-icon-pack="feather"
                  class="w-full mt-4" label="Email*"
                  v-model="data_local.email" 
                  autocomplete="chrome-off"
                  v-validate="'required|email'" name="email" type="text" @blur="checkDuplicate('email')"
                  />
                  <span class="text-danger">{{ errors.first('step-2.email') }}</span>
                </div>


                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Phone*"  v-model="data_local.phone" class="w-full mt-4" name="phone" v-validate="'required'" />
                  <span class="text-danger">{{ errors.first('step-2.phone') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Password*"  v-model="data_local.password" class="w-full mt-4" name="password" ref="password" v-validate="'required|min:6|max:10'" type="password" />
                  <span class="text-danger">{{ errors.first('step-2.password') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Confirm Password*"  v-model="data_local.confirm_password" class="w-full mt-4" name="confirm_password" v-validate="'required|min:6|max:10|confirmed:password'" type="password" />
                  <span class="text-danger">{{ errors.first('step-2.confirm_password') }}</span>
                </div>

              </div>          
            </form>
          </tab-content>

          <!-- tab 3 content -->
          <!-- <tab-content title="Billing Details" class="mb-5" icon="feather icon-dollar-sign">
            <p>Press next if same business details</p>

            <form data-vv-scope="step-3">
              <div class="vx-row">
                
                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Billing Email"  v-model="data_local.billing_email" class="w-full mt-4" name="billing_email" v-validate="'email'" />
                  <span class="text-danger">{{ errors.first('step-3.billing_email') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Billing Phone"  v-model="data_local.billing_phone" class="w-full mt-4" name="billing_phone" v-validate="''" />
                  <span class="text-danger">{{ errors.first('step-3.billing_phone') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full mt-4">
                  <label class="vs-input--label">Billing Address</label>
                  <vue-google-autocomplete
                    id="billing_address_line_1"
                    name="billing_address_line_1"
                    v-model="data_local.billing_address_line_1"
                    aria-describedby="billing_address_line_1-feedback"
                    class="vs-inputx vs-input--input normal w-full"
                    style="border: 1px solid rgba(0, 0, 0, 0.2)"
                    placeholder=""
                    types=address
                    ref=billing_address_line_1    
                    v-validate="'required'"
                    v-on:placechanged="getAddressDataLine2"
                  ></vue-google-autocomplete>

                  <span class="text-danger">{{ errors.first('step-3.billing_address_line_1') }}</span> 
                </div>                                
                
              </div>
            </form>
          </tab-content> -->

          <!-- tab 4 content -->
          <tab-content title="Insurance / Documents" class="mb-5" icon="feather icon-file" :before-change="validateStep4">
            <p>Please fill out important fields</p>

            <form data-vv-scope="step-4">
              <div class="vx-row">
                <div class="vx-col md:w-1/2 w-full">
                  <vs-input 
                  label="Billing License*" 
                  v-model="data_local.business_license" 
                  class="w-full mt-4" 
                  type="file" 
                  id="fileBL" 
                  name="business_license" 
                  v-validate="'required'" 
                  @change="update_docs('fileBL')"
                  />
                  <span class="text-danger">{{ errors.first('step-4.business_license') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Billing License Expiration*" v-model="data_local.business_license_exp" class="w-full mt-4" name="business_license_exp" v-validate="'required'" type="date"/>
                  <span class="text-danger">{{ errors.first('step-4.business_license_exp') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input 
                  label="Insurance License" 
                  v-model="data_local.insurance_license"
                  class="w-full mt-4" 
                  type="file" 
                  id="fileIL" 
                  name="insurance_license" 
                  @change="update_docs('fileIL')"
                  />
                  <span class="text-danger">{{ errors.first('step-4.insurance_license') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Insurance License Expiration" v-model="data_local.insurance_license_exp" class="w-full mt-4" name="insurance_license_exp" type="date"/>
                  <span class="text-danger">{{ errors.first('step-4.insurance_license_exp') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input 
                  multiple 
                  label="Other Documents" 
                  v-model="data_local.bond_docs" 
                  class="w-full mt-4" 
                  type="file" 
                  id="fileOL" 
                  name="bond_docs" 
                  @change="update_docs('fileOL')"
                  />
                  <span class="text-danger">{{ errors.first('step-4.bond_docs') }}</span>
                </div>

                <div class="vx-col md:w-1/2 w-full">
                  <vs-input label="Other Document Expiration" v-model="data_local.bond_docs_exp" class="w-full mt-4" name="bond_docs_exp" type="date"/>
                  <span class="text-danger">{{ errors.first('step-4.bond_docs_exp') }}</span>
                </div>
              </div>

            </form>
          </tab-content>

          <!-- tab 5 content -->
          <tab-content title="Review" class="mb-5" icon="feather icon-eye" :before-change="validateStep5">
            <p>Please review before submitting</p>

            <form data-vv-scope="step-5">
              <vs-list>

                <div class="vx-row mb-5">
                  <div class="vx-col w-full mb-5">
                    <!-- Business Details -->
                    <vs-list-header icon-pack="feather" icon="icon-briefcase" title="BUSINESS DETAILS"></vs-list-header>

                    <vs-list-item title="Business Name" class="pb-5">{{data_local.business_name}}</vs-list-item>
                    <vs-list-item title="Business Email" class="pb-5">{{data_local.business_email}}</vs-list-item>
                    <vs-list-item title="Business Phone" class="pb-5">{{data_local.business_phone}}</vs-list-item>
                    <vs-list-item title="Business Address" class="pb-5">
                    {{data_local.business_address_line_1}}<br>
                    {{data_local.business_city}}<br>
                    {{data_local.business_state}}<br>
                    {{data_local.business_country}}<br>
                    {{data_local.business_zip}}<br>
                    </vs-list-item>
                    <!-- <vs-list-item title="Category" class="pb-5">{{data_local.category_id}}</vs-list-item> -->
                    <!-- <vs-list-item title="Service Radius" class="pb-5">{{data_local.service_radius}}</vs-list-item> -->
                  </div>  

                  <div class="vx-col w-full mb-5">
                    <!-- Billing Details -->
                    <vs-list-header icon-pack="feather" icon="icon-dollar-sign" title="BILLING DETAILS"></vs-list-header>

                    <vs-list-item title="Billing Email" class="pb-5">{{data_local.billing_email}}</vs-list-item>
                    <vs-list-item title="Billing Phone" class="pb-5">{{data_local.billing_phone}}</vs-list-item>
                    <vs-list-item title="Billing Address" class="pb-5">
                    {{data_local.billing_address_line_1}}<br>
                    {{data_local.billing_city}}<br>
                    {{data_local.billing_state}}<br>
                    {{data_local.billing_country}}<br>
                    {{data_local.billing_zip}}<br>
                    </vs-list-item> 
                  </div>

                  <div class="vx-col w-full">
                    <!-- Contact Information -->
                    <vs-list-header icon-pack="feather" icon="icon-users" title="CONTACT INFORMATION"></vs-list-header>

                    <vs-list-item title="First Name" class="pb-5">{{data_local.first_name}}</vs-list-item>
                    <vs-list-item title="Last Name" class="pb-5">{{data_local.last_name}}</vs-list-item>
                    <vs-list-item title="Email" class="pb-5">{{data_local.email}}</vs-list-item>
                    <vs-list-item title="Phone" class="pb-5">{{data_local.phone}}</vs-list-item>
                  </div>
                </div>              

              </vs-list>

            </form>
          </tab-content>

          <button slot="prev" class="wizard-btn" @click="stepBack" :disabled="step===6">Back</button>
          <button slot="next" class="wizard-btn">Next</button>
          <button slot="finish" class="wizard-btn">Finish</button>
        </form-wizard>        
      </div>
    </vx-card>

    <vx-card v-else>
      <div slot="no-body" class="full-page-bg-color">
        <div class="vx-row">
          <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <!-- <img src="@/assets/images/pages/graphic-3.png" alt="login" class="mx-auto">
              <img src="@/assets/images/logo/logo-axp.png" alt="vuexy-logo"> -->

              <!-- <img src="@/assets/images/logo/logo-axp.png" alt="coming-soon" class="mx-auto mb-2" width="150"> -->
              <img src="@/assets/images/pages/login-axp.png" alt="login" class="mx-auto" width="300">
          </div>
          <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
              <div class="p-8">
                  <div class="vx-card__title mb-8" style="height:200px;">
                    <h2 class="mb-4">Welcom to aXessPoint!</h2>
                    <br>

                    <p>Thank you for signing up with aXessPoint. You are closer to getting proposal requests.</p>
                    <br>
                    <p>A validation link has been sent to the email address you provided.</p>
                    <br>
                    <p>Click on the validation link in the email to access your Service Provider portal.</p>
                  </div>

                  <div class="vx-card__title mb-8">
                    <vs-button @click="goToLogin" class="w-full md:w-auto mt-8">Go to Dashboard</vs-button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select'
import axios from '../../../../axios'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import googleMapsDrawing from '@/assets/utils/googlemaps_drawing.js'

// For custom error message
import { Validator } from 'vee-validate'
import CreateFile from '@/views/components/files/UploadFile.vue'
import EventBus from '@/EventBus'

const dict = {
  custom: {
    billing_address_line_1: {
      required: 'Billing Address is required',
      alpha: 'Billing Address Line 1 may only contain alphabetic characters'
    },
    billing_city: {
      required: 'Billing City is required',
      alpha: 'Billing City may only contain alphabetic characters'
    },
    billing_state: {
      required: 'Billing State is required',
      alpha: 'Billing State may only contain alphabetic characters'
    },
    billing_zip: {
      required: 'Billing Zip is required',
      alpha: 'Billing Zip may only contain alphabetic characters'
    },
    billing_email: {
      required: 'Billing Email is required',
      email: 'Please enter valid email'
    },
    billing_phone: {
      required: 'Billing Phone is required',
      alpha: 'Billing Phone may only contain alphabetic characters'
    },
    business_name: {
      required: 'Business Name is required',
      alpha: 'Business Name may only contain alphabetic characters'
    },
    business_address_line_1: {
      required: 'Business Address is required',
      alpha: 'Business Address may only contain alphabetic characters'
    },
    business_city: {
      required: 'Business City is required',
      alpha: 'Business City may only contain alphabetic characters'
    },
    business_state: {
      required: 'Business State is required',
      alpha: 'Business State may only contain alphabetic characters'
    },
    business_zip: {
      required: 'Business Zip is required',
      alpha: 'Business Zip may only contain alphabetic characters'
    },
    business_email: {
      required: 'Business Email is required',
      email: 'Please enter valid email'
    },
    business_phone: {
      required: 'Business Phone is required',
      alpha: 'Business Phone may only contain alphabetic characters'
    },
    business_license: {
      required: 'Business License is required',
      alpha: 'Business License may only contain alphabetic characters'
    },
    business_license_exp: {
      required: 'Business License Exp is required',
      alpha: 'Business License Exp may only contain alphabetic characters'
    },
    insurance_license: {
      required: 'Insurance License is required',
      alpha: 'Insurance License may only contain alphabetic characters'
    },
    insurance_license_exp: {
      required: 'Insurance License Exp is required',
      alpha: 'Insurance License Exp may only contain alphabetic characters'
    },
    bond_docs: {
      required: 'Additional Insurance / Documents is required',
      alpha: 'Additional Insurance / Documents may only contain alphabetic characters'
    },
    bond_docs_exp: {
      required: 'Additional Insurance / Documents Expiration is required',
      alpha: 'Additional Insurance / Documents Expiration may only contain alphabetic characters'
    },
    service_radius: {
      required: 'Service Radius is required',
      alpha: 'Service Radius may only contain alphabetic characters'
    },
    category_id: {
      required: 'Category is required',
      alpha: 'Category may only contain alphabetic characters'
    },
    category_name: {
      required: 'Other category is required',
      alpha: 'Category may only contain alphabetic characters'
    },
  }
}

// register custom messages
Validator.localize('en', dict)

export default {
  components: {
    FormWizard,
    TabContent,
    vSelect,
    VueGoogleAutocomplete,

    vSelect,
    CreateFile
  },
  data () {
    return {
      step: 1,
      is_dup_business_name: null,
      is_dup_email: null,

      //vendor
      cls:'h-full',
      token: this.$route.query.token,
      // token: localStorage.usertoken,

      data_local: {
        billing_address_line_1: '',
        billing_city: '',
        billing_state: '',
        billing_country: '',
        billing_zip: '',
        billing_email: '',
        billing_phone: '',
        business_name: '',
        business_address_line_1: '',
        business_city: '',
        business_state: '',
        business_country: '',
        business_zip: '',
        business_email: '',
        business_phone: '',
        business_license: '',
        business_license_exp: '',
        insurance_license: '',
        insurance_license_exp: '',
        bond_docs: '',
        bond_docs_exp: '',
        service_radius: {
          coord: "",
          center_lat: null,
          center_lng: null,
          center_radius: null, 
        },
        category_id: '',
        category_name: '',
        same_as_business: false,

        first_name:'',
        last_name:'',
        emai:'',
        password:'',
        confirm_password:'',
        phone:'',

        emergency_contact_name: '',
        relation:'',
        emergency_contact_no: ''
      },

      optionUser: [],
      optionProperty: [],
      optionVendorCategory: [],

      firstName: '',
      lastName: '',
      email: '',
      city: 'new-york',
      proposalTitle: '',
      jobTitle: '',
      textarea: '',
      eventName: '',
      eventLocation: 'san-francisco',
      status: 'plannning',
      cityOptions: [
        { text: 'New York', value: 'new-york' },
        { text: 'Chicago', value: 'chicago' },
        { text: 'San Francisco', value: 'san-francisco' },
        { text: 'Boston', value: 'boston' }
      ],
      statusOptions: [
        { text: 'Plannning', value: 'plannning' },
        { text: 'In Progress', value: 'in progress' },
        { text: 'Finished', value: 'finished' }
      ],
      LocationOptions: [
        { text: 'New York', value: 'new-york' },
        { text: 'Chicago', value: 'chicago' },
        { text: 'San Francisco', value: 'san-francisco' },
        { text: 'Boston', value: 'boston' }
      ],

      fileBL: [],
      fileIL: [],
      fileOL: [],
      fileAvatar: [],
      // uploading docs
      files: [],
      rawFiles: [],
      resDataLocal: [],
      resUp: [],

      fileType: null,
    }
  },
  methods: {
    validatePhone(){
      const allowedKey = /[+-.\()]/gi;
      const filtered =  this.data_local.business_phone.replace(allowedKey,'')

      if (isNaN(filtered)) {
        this.errors.add({
          field: 'phone1',
          msg: 'This entry can ONLY contain numbers.'
        });
      }
    },
    isNumber: (evt) => {
      const allowedKey = ['+', '-', '(', ')', '.']
      evt = (evt) ? evt : window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode

      if ( charCode!==32 && !allowedKey.includes(evt.key) && (charCode < 48 || charCode > 57) ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    checkAdress(type) {
      if (!this.$refs[type].$refs.autocomplete.value) {
        this.data_local[type] = null;
        this.$refs[type].$refs.autocomplete.value = null;
      }
    },
    stepBack() {
      let isFull = [2, 3]
      this.step--

      if (isFull.includes(this.step)) {
        this.cls = 'h-screen'
      } else {        
        this.cls = 'h-full'
      }

      console.log('screen number this.step ', this.step)
      console.log('screen number this.cls ', this.cls)
    },
    async checkDuplicate(type) {
      if (
        (this.data_local.business_name === '' && type==='business_name') ||
        (this.data_local.email === '' && type==='email')
      ) return

      const result = await axios.get('/vendor/check-duplicate', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'mode': this.$route.query.mode,
          'business_name': this.data_local.business_name,
          'email': this.data_local.email,
          'type': type
        }
      })

      if (type === 'business_name') {
        this.is_dup_business_name = !result.data.business_name
      } else {
        this.is_dup_email = !result.data.email
      }
    },
    getAddressDataLine1: function (addressData, placeResultData) {
        // $('#center-lat').val(addressData.latitude);
        // $('#center-lng').val(addressData.longitude);

        googleMapsDrawing.initialize(
          this.data_local.service_radius.coord, 
          parseFloat(addressData.latitude), 
          parseFloat(addressData.longitude), 
          parseFloat(0)
        )  

        console.log('getAddressDataLine1 ', addressData)
        const adStreet = typeof(addressData.street_number) === 'undefined' ? '' : addressData.street_number + ', '
        const adRoute = typeof(addressData.route) === 'undefined' ? '' : addressData.route
        const adAdmin1 = typeof(addressData.administrative_area_level_1) === 'undefined' ? '' : addressData.administrative_area_level_1
        const adPostal = typeof(addressData.postal_code) === 'undefined' ? '' : addressData.postal_code
        
        this.data_local.business_address_line_1 = adStreet + adRoute
        this.data_local.business_city = addressData.locality
        this.data_local.business_state = adAdmin1
        this.data_local.business_zip = adPostal
        this.data_local.business_country = addressData.country
    },   
    getAddressDataLine2: function (addressData, placeResultData) {
        console.log('getAddressDataLine2 ', addressData)
        const adStreet = typeof(addressData.street_number) === 'undefined' ? '' : addressData.street_number + ', '
        const adRoute = typeof(addressData.route) === 'undefined' ? '' : addressData.route
        const adAdmin1 = typeof(addressData.administrative_area_level_1) === 'undefined' ? '' : addressData.administrative_area_level_1
        const adPostal = typeof(addressData.postal_code) === 'undefined' ? '' : addressData.postal_code
        
        this.data_local.billing_address_line_1 = adStreet + adRoute
        this.data_local.billing_city = addressData.locality
        this.data_local.billing_state = adAdmin1
        this.data_local.billing_zip = adPostal
        this.data_local.billing_country = addressData.country
    },    
    validateStep1 () {
      return new Promise((resolve, reject) => {
        const coord = $('#coord').val() === "" ? "" :  JSON.parse($('#coord').val())
        this.data_local.service_radius = {
          coord: coord,
          center_lat: $('#center-lat').val(),
          center_lng: $('#center-lng').val(),
          center_radius: $('#center-radius').val(),        
        }

        this.$validator.validateAll('step-1').then(result => { 
          if (this.data_local.category_id != -1) {
            this.data_local.category_name = ''
          }

          if (result && this.is_dup_business_name) {
            this.step++
            console.log('screen number this.step ', this.step)
            this.cls = 'h-screen'

            resolve(true)
          } else {
            reject('correct all values')
          }
        })
      })
    },
    validateStep2 () {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll('step-2').then(result => {
          if (result && this.is_dup_email) {
            this.step++
            console.log('screen number this.step ', this.step)
            this.cls = 'h-screen'

            resolve(true)
          } else {
            reject('correct all values')
          }
        })
      })
    },
    validateStep3 () {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll('step-3').then(result => {
          if (result) {
            this.step++
            console.log('screen number this.step ', this.step)
            this.cls = 'h-screen'

            resolve(true)
          } else {
            reject('correct all values')
          }
        })
      })
    },
    async validateStep4 () {
      if (this.data_local.billing_address_line_1 == '') {
        this.data_local.billing_address_line_1  = this.data_local.business_address_line_1
        this.data_local.billing_city            = this.data_local.business_city
        this.data_local.billing_state           = this.data_local.business_state
        this.data_local.billing_zip             = this.data_local.business_zip
        this.data_local.billing_country         = this.data_local.business_country
      }

      this.data_local.billing_email = this.data_local.billing_email == '' ? this.data_local.business_email : this.data_local.billing_email
      this.data_local.billing_phone = this.data_local.billing_phone == '' ? this.data_local.business_phone : this.data_local.billing_phone

      console.log('this.data_local.billing_email 1 ', this.data_local.billing_email == '')
      console.log('this.data_local.billing_email 2 ', this.data_local.billing_email === '')
      console.log('this.data_local.billing_email 3 ', this.data_local.billing_email === null)
      console.log('this.data_local.billing_email 4 ', typeof(this.data_local.billing_email) === undefined)

      return new Promise((resolve, reject) => {
        this.$validator.validateAll('step-4').then(result => {
          if (result) {
            this.step++
            console.log('screen number this.step ', this.step)
            this.cls = 'h-full'

            resolve(true)
          } else {
            reject('correct all values')
          }
        })
      })
    },
    validateStep5 () {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll('step-5').then(result => {
          if (result) {

            // var formdata = new FormData();
            // $.each($('#fileBL')[0].files, function(i, file) {
            //   formdata.append('fileBL_'+i, file);
            // });

            // $.each($('#fileIL')[0].files, function(i, file) {
            //   formdata.append('fileIL_'+i, file);
            // });

            // formdata.append('token', this.token)
            // formdata.append('data', JSON.stringify(this.data_local))

            const editId = -1
            new Promise(async(resolve, reject)  => {
              try {

                // await axios.post(`/vendor/save/${editId}`,  
                //   formdata, {
                //     headers: {
                //       'Content-Type': 'multipart/form-data'
                //     },
                //   }
                // )

                const saveVendor = await axios.post(`/vendor/save/${editId}`, 
                  { 
                    data: this.data_local,
                    token: this.token
                  }, { 
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': this.token
                    },
                    params: {
                      'mode': this.$route.query.mode
                    }
                })

                console.log('saveVendor ', saveVendor)

                if(saveVendor['data']['message'] == 'access_denied' && saveVendor['data'] == '') {
                  this.$vs.notify({
                    color: 'danger',
                    title: 'Error loading',
                    text: 'Something went wrong'
                  })
                  resolve('Error loading')
                  // this.$router.push({name:'app-vendor-list'})
                } 
                
                if(saveVendor['data']['message'] == 'success') {
                  this.resDataLocal = saveVendor['data']['result']
                  this.$vs.notify({
                    color: 'success',
                    title: 'Saving..',
                    text: 'Successfully saved'
                  })

                  // this.$router.push({name:'page-login'})
                } else if(saveVendor['data'] == 'user_already_exists') {
                  this.$vs.notify({
                    color: 'danger',
                    title: 'Saving Data',
                    text: 'Contact email already exist'
                  })
                } 

                // uploading avatar
                const saveAvatar = await axios.post(`/docs/table/save`, {
                  rawFiles: this.fileAvatar,
                  token: this.token,
                  id: this.resDataLocal.vendor_id,
                  path: `docs/service-provider/avatar/${this.resDataLocal.vendor_id}`,
                  folderId: 13
                })

                // uploading billing license docs
                await axios.post(`/docs/table/save`, {
                  rawFiles: this.fileBL,
                  token: this.token,
                  id: this.resDataLocal.vendor_id,
                  path: `docs/service-provider/bl/${this.resDataLocal.vendor_id}`,
                  folderId: 14
                })

                // uploading insurance license docs
                await axios.post(`/docs/table/save`, {
                  rawFiles: this.fileIL,
                  token: this.token,
                  id: this.resDataLocal.vendor_id,
                  path: `docs/service-provider/il/${this.resDataLocal.vendor_id}`,
                  folderId: 15
                })

                // uploading other license docs
                await axios.post(`/docs/table/save`, {
                  rawFiles: this.fileOL,
                  token: this.token,
                  id: this.resDataLocal.vendor_id,
                  path: `docs/service-provider/ol/${this.resDataLocal.vendor_id}`,
                  folderId: 16
                })

                this.goToWelcome()
                // this.$router.push({name:'page-login'})

              } catch(err) {
                reject(err.toString('utf8'));
              }      

            }) 

            resolve(true)
          } else {
            reject('correct all values')
          }
        })
      })
    },
    same_as_business() {    
      if (this.data_local.same_as_business) {    
        this.$refs.billing_address_line_1.$refs.autocomplete.value = this.$refs.business_address_line_1.$refs.autocomplete.value   
        this.data_local.billing_address_line_1  = this.$refs.business_address_line_1.$refs.autocomplete.value
        this.data_local.billing_city            = this.data_local.business_city
        this.data_local.billing_state           = this.data_local.business_state
        this.data_local.billing_zip             = this.data_local.business_zip
        this.data_local.billing_country         = this.data_local.business_country

        this.data_local.billing_email = this.data_local.billing_email == '' ? this.data_local.business_email : this.data_local.billing_email
        this.data_local.billing_phone = this.data_local.billing_phone == '' ? this.data_local.business_phone : this.data_local.billing_phone
      } else {
        this.data_local.billing_address_line_1  = ''
        this.data_local.billing_city            = ''
        this.data_local.billing_state           = ''
        this.data_local.billing_zip             = ''
        this.data_local.billing_country         = ''
        this.data_local.billing_email = ''
        this.data_local.billing_phone = ''
      }
    },
    // uploading docs
    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    // uploading docs
    async update_docs (id) {
      this.$vs.loading()
      
      var formdata = new FormData();
      console.log('form id ', id)
      $.each($(`#${id}`)[0].files, function(i, file) {
        formdata.append('fileD_'+i, file);
      });
      formdata.append('token', this.token)

      this.resUp = await axios.post(`/docs/upload`,  
        formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
      )

      this.files = []
      for (const [key, value] of Object.entries(this.resUp.data.rawD)) {
        var imgB64 = this._arrayBufferToBase64( value.data.data )
        var imgAsc = imgB64.toString('ascii')
        this.files.push("data:image/png;base64, " + imgAsc)
      }

      if (this.resUp.data.uploadedD.length > 1) {
        for (const [key, value] of Object.entries(this.resUp.data.uploadedD)) {
          if (id=="fileBL") {
            this.fileBL.push(value)
          } else if (id=="fileIL") {
            this.fileIL.push(value)
          } else if (id=="fileOL") {
            this.fileOL.push(value)
          } else {
            this.fileAvatar.push(value)
          }
          this.rawFiles.push(value)
        }
      } else {
        if (id=="fileBL") {
          this.fileBL[0] = this.resUp.data.uploadedD
        } else if (id=="fileIL") {
          this.fileIL[0] = this.resUp.data.uploadedD
        } else if (id=="fileOL") {
          this.fileOL[0] = this.resUp.data.uploadedD
        } else {
          this.fileAvatar[0] = this.resUp.data.uploadedD
        }
        this.rawFiles[0] = this.resUp.data.uploadedD
      }

      setTimeout(() => {
        this.$vs.loading.close()
      }, 2000)
    },  
    async loadVendorCategory () {
      const { data } = await axios.get(`/api/vendorCategoryMaster/list`, {
        headers: { 'Authorization': this.token },
        params: {
          'mode': this.$route.query.mode
        }
      })

      data.push({id: -1,name: 'Other'})
      this.optionVendorCategory = data
      console.log('this.optionVendorCategory ', this.optionVendorCategory)
    },   
    saveImg() {
      return new Promise((resolve, reject) => {
        try {       
          var data = new FormData();
          $.each($('#fileD')[0].files, function(i, file) {
            data.append('file_'+i, file);
            console.log('file ', file)
            console.log('file i ', i)
          });
          data.append('token', this.token)

          axios.post('/vendor/upload/',  
            data, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
            }
          ).then(res => {
            console.log('res imgSave ', res)
          })
          .catch(err => {
            console.log('err imgSave ', err)
          })

        } catch(err) {
          reject(err.toString('utf8'));
        }
      })
    },
    goToLogin() {
      this.$router.push({name:'page-login'})
    },
    goToWelcome() {
      this.step = 6
      this.cls = 'h-screen'
    },
    async loadServiceRadius() {
      googleMapsDrawing.initialize(
        "", 
        parseFloat(21.293968660930332), 
        parseFloat(-157.84886225246842), 
        parseFloat(0)
      )   
    }
  },
  created () {
    this.loadVendorCategory()
  },
  mounted(){
    this.loadServiceRadius()

    setTimeout(() => {
      this.$refs.business_address_line_1.$el.setAttribute('autocomplete', 'disabled')
      this.$refs.billing_address_line_1.$el.setAttribute('autocomplete', 'disabled')
    }, 1000);

    EventBus.$on('create-file', res => {
      this.rawFiles = res
    })
  }
}
</script>

<style>

input[type="file"] {
  border: 0px !important;
}

.vs-list--item {
  align-items: start !important;
}

.vs-list--slot {
  text-align: right !important;
}


#map {

  padding: 0;
  margin: 0;
  height: 400px;
}
#panel {
  font-size:10pt;
  position: absolute;
  top: 0px; width:150px; right:0px; bottom:0px;
  padding: 0;
  margin: 0;
  background-color:white;
  padding-left:5px;
}

.wizard-btn {
  background-color: rgba(var(--vs-primary), 1) !important; 
  border-color: rgba(var(--vs-primary), 1) !important; 
  color: white !important;
}
</style>