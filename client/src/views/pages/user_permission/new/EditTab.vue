<template>
  <div id="data-edit-tab-info">
    <!-- Permissions -->
    <vx-card class="mt-base" no-shadow card-border>
        <table class="w-full">
          <tr>
            <th class="font-semibold text-base text-left px-3 py-2" v-for="heading in ['Module','List', 'Create', 'Read', 'Update', 'Delete']" :key="heading">{{ heading }}</th>
          </tr>

          <tr v-for="(val, id) in optionUserModule">
            <td class="px-3 py-2">{{ val.name }}</td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.id]['list']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.id]['create']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.id]['read']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.id]['update']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.id]['delete']"></vs-checkbox>
            </td>
          </tr>
        </table>
    </vx-card>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit('a')" :disabled="!validateForm">Save and New</vs-button>
          <vs-button class="ml-4 mt-2" @click="submit('b')" :disabled="!validateForm">Save and Close</vs-button>
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
      token: localStorage.usertoken,

      permissions: [{
        users: {
          'list': true,
          'read': true,
          'write': false,
          'create': false,
          'delete': false
        }
      }],

      optionUserModule: [],

      //permission
      data_local: [],

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
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    submit(loc) {
      this.$validator.validateAll()
      .then(result => {
        if(result) {
          this.save_changes(loc)
        }
      })
    },
    async save_changes(loc) {
      try {
        if (!this.validateForm) return
        const editId = -1
        await axios.post(`/permission/save/${editId}`, {
          data: this.data_local,
          token: this.token
        })
           
        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully saved'
        })
        this.$vs.loading.close()
        this.$router.push({name:'app-permission-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Permission Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },    
    reset_data () {
      //permission
      // this.data_local['user_role_id'] = ''
      // this.data_local['user_module_id'] = ''
      // this.data_local['list'] = ''
      // this.data_local['create'] = ''
      // this.data_local['read'] = ''
      // this.data_local['update'] = ''
      // this.data_local['delete'] = ''

      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadUserModule () {
      const result = await axios.get('/api/userModule/list', {
        headers: { 
          'Authorization': this.token,
        }
      })

      this.optionUserModule = result['data']
      
      for (let data in result['data']) {
        var user_module_val = result['data'][data]['val']

        this.data_local_p[user_module_val] = {
          all: false,
          list: false,
          create: false,
          update: false,
          read: false,
          delete: false,
        }
      }
    },
  },
  async created () {
    try {
      await this.loadUserModule()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Permission Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }
}
</script>
