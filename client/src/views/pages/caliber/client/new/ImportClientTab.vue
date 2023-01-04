<template>
  <div id="data-edit-tab-info">

    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <!-- Col Header -->
        <div class="flex items-end">
          <feather-icon icon="InfoIcon" class="mr-2" svgClasses="w-5 h-5" />
          <span class="leading-none font-medium">Provide Client ID</span>
        </div>    
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4">
        <vx-input-group class="mb-base mr-3">
          <vs-input v-model="data_local.client_id" v-validate="'required'" name="is_activated" />
          <template slot="append">
            <div class="append-text btn-addon">
              <vs-button type="border" @click="validate" class="whitespace-no-wrap">Validate</vs-button>
            </div>
          </template>
        </vx-input-group>
      </div>
    </div>

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4" v-if="result.loaded">
        <!-- Col Header -->
        <vs-alert 
          active="true"
          title="Client found"
          color="success" v-if="result.hasData">
          <span>Name: <strong>{{ result.data.client.data[0].ClientName }}</strong></span><br>
          <span>Owners: {{ result.data.owners.total }}</span><br>
          <span>Units: {{ result.data.units.total }}</span><br>
          <span>Invoices: {{ result.data.invoices.total }}</span><br>
        </vs-alert>
        <vs-alert 
          active="true"
          title="Invalid Client ID"
          color="danger" v-else>
          <strong>No result found.</strong><br>
        </vs-alert>

        <!-- Col Header -->
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mt-4" v-if="result.hasData">
        <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
        <span class="leading-none font-medium">Parent Organization User</span>
        <div class="vx-col w-full">
          <vs-input class="w-full mt-4" label="Email" v-model="data_local.email" v-validate="'required|email'" name="email" type="email"/>
          <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

          <vs-input class="w-full mt-4" label="Firstname" v-model="data_local.first_name" v-validate="'required'" name="first_name" />
          <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>

          <vs-input class="w-full mt-4" label="Lastname" v-model="data_local.last_name" v-validate="'required'" name="last_name" />
          <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span> 
        </div>
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit('IMPORT_NEW')" :disabled="!result.hasData">Import</vs-button>
          <!-- <vs-button class="ml-4 mt-2" @click="submit('IMPORT_CLOSE')" :disabled="!validateForm">Import and Close</vs-button> -->
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
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
      result: { loaded: false },
      data_local: {
        client_id:'',
      },
    }
  },
  computed: {
    token() {
      return localStorage.usertoken;
    },
    async isFormValid () {
      const isValid = await this.$validator.validateAll();
      return isValid && !this.errors.any();
    }
  },
  methods: {
    async validate() {
      this.result = {};
      try {
        this.$vs.loading();
        const { client_id } = this.data_local;
        const { data } = await axios.get(`caliber/validate/${client_id}`, 
        { headers: { 'Authorization': this.token } });
        this.result = {
          data,
          hasData: true,
          loaded: true,
        };
        this.$vs.loading.close();
      } catch (error) {
        this.result = {
          data: {},
          hasData: false,
          loaded: true,
        };
        this.$vs.loading.close();
      }
    },
    async submit(type) {
      const isValid = await this.isFormValid;
      if (!isValid) return;

      if (type === 'IMPORT_NEW') {
        try {
        this.$vs.loading();
        const { client_id } = this.data_local;
        // Put on queue
        axios.post(`caliber/create/property/${client_id}`, this.data_local,
          { headers: { 'Authorization': this.token } });

        this.result = {
          data: [],
          hasData: true,
          loaded: true,
        };
        setTimeout(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            color:'success',
            title:'Import Client',
            text: `Your client has been put in queue. It will usually takes 2-5mins to upload necessary data. We'll be sending email to notify you regarding the progress of it.`,
            time: 10000,
          });
          setTimeout(() => this.$router.go(0), 5000);
        }, 2000);
        } catch ({ response }) {
          this.$vs.notify({
            color:'danger',
            title:'Saving Client',
            text: response.data.errors
          });
          this.$vs.loading.close();
        }
      }
    }
  }
}
</script>
