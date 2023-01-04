<template>
  <div id="data-edit-tab-info">
    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" disabled>
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-white">Add New</span>
          </vs-button>          
        </div>
      </div>
    </div>

    <vx-card class="mt-base" no-shadow card-border>
        <table class="w-full user-module-list">
          <tr>
            <th class="font-semibold text-base text-center px-3 py-2" v-for="heading in ['Module Name', 'Active', 'Maintenance / Coming Soon']" :key="heading">{{ heading }}</th>
          </tr>

          <tr v-for="(val, id) in data_local">
            <td class="px-3 py-2">{{ val.name }}</td>

            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[id]['is_active']" :class="{'checkTrue': isCheck}" @change="selectBox(val)"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[id]['is_maintenance']" :class="{'checkTrue': isCheck}" @change="selectBox(val)"></vs-checkbox>
            </td>

          </tr>
        </table>
    </vx-card>

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
import axios from '@/axios'

export default {
  components: {
    vSelect
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
      confirm_password: '',

      
      //permission
      data_local: this.data,
      new_data: [],
      optionUserModule: [],

      isCheck: false,

      statusOptions: [
        { label: 'Active',  value: 'active' },
        { label: 'Blocked',  value: 'blocked' },
        { label: 'Deactivated',  value: 'deactivated' }
      ],
      roleOptions: [
        { label: 'Admin',  value: 'admin' },
        { label: 'User',  value: 'user' },
        { label: 'Staff',  value: 'staff' }
      ]
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
    }
  },
  methods: {
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    selectBox(val) {
      let is_exist = Object.keys(this.new_data).find(key => this.new_data[key]['id'] === val.id)
      if (is_exist !== undefined) {
        this.$delete(this.new_data, is_exist)
        this.new_data.push(val)
      } else {
        this.new_data.push(val)
      }
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        await axios.post(`/user-module/save/0`, {
          data: this.new_data,
          token: this.token
        })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Data Saving Error',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    }
  },
  async created () {
    try {
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Modules Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}
</script>

<style>
table.user-module-list .con-vs-checkbox, table.user-module-list .con-vs-radio {
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}
</style>