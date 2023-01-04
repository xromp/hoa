<template>
  <div id="data-edit-tab-info">
    <vx-card title="PACE" class="mb-base">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-1/2">
        <!-- Col Header -->
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="ArchiveIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Account Keys</span>
          </div>
          
          <!-- Content Row -->
          <div class="vx-row" v-if="!data_local.Fuze_Account_ID">
            <div class="vx-col w-full">
              <div class="mt-4">
                <vs-alert :active="!data_local.Fuze_Account_ID" color="danger" icon="new_releases" >
                  <span>No Fuze account found. Please register your account <strong><a :href="fuzeRegisterationLink" target="_blank">here</a></strong> and enter the necessary fields below.</span>
                </vs-alert>
              </div>
            </div>
          </div>

          <div class="vx-row">
            <div class="vx-col w-full"> 
              <div class="mt-4">
                <vs-input class="w-full mt-4" label="Fuze Account ID*" v-model="data_local.Fuze_Account_ID" v-validate="'required'" name="Fuze_Account_ID" />
                <span class="text-danger text-sm"  v-show="errors.has('Fuze_Account_ID')">{{ errors.first('Fuze_Account_ID') }}</span>
              </div>

              <div class="mt-4">
                <vs-input class="w-full mt-4" label="Fuze PUBLIC API Key*" v-model="data_local.Fuze_PUBLIC_API_Key" v-validate="'required'" name="Fuze_PUBLIC_API_Key" />
                <span class="text-danger text-sm"  v-show="errors.has('Fuze_PUBLIC_API_Key')">{{ errors.first('Fuze_PUBLIC_API_Key') }}</span>
              </div>

              <div class="mt-4">
                <vs-input class="w-full mt-4" label="Fuze PUBLIC API Key*" v-model="data_local.Fuze_PRIVATE_API_Key" v-validate="'required'" name="Fuze_PRIVATE_API_Key" />
                <span class="text-danger text-sm"  v-show="errors.has('Fuze_PRIVATE_API_Key')">{{ errors.first('Fuze_PRIVATE_API_Key') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="vx-col md:w-1/2 w-1/2">
          <div class="flex items-end md:mt-0 mt-base">
            <feather-icon icon="ArchiveIcon" class="mr-2" svgClasses="w-5 h-5" />
            <span class="leading-none font-medium">Insight Tags</span>
          </div>
          <insight-tag-creation
            :billTypes.sync="data_local.billTypes" 
            :pmc_id="pmcId"
          />
        </div>
      </div>
      
      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="submit" :disabled="!isFormValid">Save Changes</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
    <vx-card title="Flutterwave" class="mb-base">
      <div class="vx-col md:w-1/2 w-full">
      <!-- Col Header -->
        <div class="flex items-end md:mt-0 mt-base">
          <feather-icon icon="ArchiveIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Account Keys</span>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col">
          <div class="mt-4">
            <small>Coming soon...</small>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import EventBus from '@/EventBus'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import InsightTagCreation from './InsightTagCreation.vue';

export default {
  components: {
    vSelect,
    VueGoogleAutocomplete,
    InsightTagCreation
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      data_local: this.data,
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any();
    },
    token() {
      return localStorage.usertoken;
    },
    fuzeRegisterationLink() {
      return 'https://app.smartsheet.com/b/publish?EQBCT=a9879d4ef6894bd8a78228975e197e46';
    },
    pmcId() {
      return this.$route.params.editId;
    }
  },
  methods: {
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
    async submit () {
      try {
        if (!this.isFormValid) return;
        this.$vs.loading();
        const pmcId = this.$route.params.editId;
        const headers = {headers: { 'Content-Type': 'application/json', 'Authorization': this.token }};
        await axios.patch(`/portfolio/setting/${pmcId}`, this.data_local, headers);
        this.$vs.loading.close();
        this.$vs.notify({
          time: 10000,
          color: 'success',
          title: 'Loading Parent Org Page',
          text: 'PACE config updated sucessfully.'
        });
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Parent Org Page',
          text: err.toString('utf8')
        });
        this.$vs.loading.close();
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
    async loadBillTypes() {
      const headers = {headers: { 'Content-Type': 'application/json', 'Authorization': this.token }};
      const { data } = await axios.get(`/bill-type/getTypes/${this.pmcId}`, headers);
      this.$set(this.data_local, 'billTypes', data);
    }
  },
  async mounted() {
    await this.loadBillTypes();
  }
}
</script>
