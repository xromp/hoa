<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <label class="vs-input--label">Parent Role</label>
          <v-select :options="optionMainRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.parent_id" name="parent_id" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('parent_id')">{{ errors.first('parent_id') }}</span>
        </div>

        <vs-input class="w-full mt-4" label="Name" v-model="data_local.name" v-validate="'required'" name="name" />
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>   

        <vs-input class="w-full mt-4" label="Description" v-model="data_local.description" v-validate="'required'" name="description" />
        <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span> 
      </div>
    </div>

    <!-- Permissions -->
    <vx-card class="mt-base" no-shadow card-border v-if="false">
      <table class="w-full">
        <tr>
          <th class="font-semibold text-base text-left px-3 py-2" v-for="heading in ['Module','All', 'Menu', 'Create', 'Read', 'Update', 'Delete']" :key="heading">{{ heading }}</th>
        </tr>

        <tr v-for="(val, id) in optionUserModule">
          <td class="px-3 py-2">{{ val.name }}</td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['all']" @change="checkAll(val.val)"></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['list']" :class="{'checkTrue': isCheck}"></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['create']"></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['read']"></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['update']"></vs-checkbox>
          </td>
          <td class="px-3 py-2">
            <vs-checkbox v-model="data_local_p[val.val]['delete']"></vs-checkbox>
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

      optionMainRole: [],
      optionUserModule: [],

      data_local_p: {},
      isCheck: false,

      //role
      data_local: {
        parent_id: parseInt(this.$route.params.viewId),
        property_id: '',
        name: ''
      },

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
          this.$vs.loading()
          const editId = -1
          const viewId = this.$route.params.viewId
          this.data_local.property_ref = localStorage.selectedPropertyRef
          this.data_local.parent_org_id = parseInt(localStorage.selectedParentOrg)
          this.data_local.permission = JSON.stringify(this.data_local_p)
          this.data_local.type = 'sub'
          const sv = await axios.post(`/role/save/${editId}`, {
            data: this.data_local,
            mainRoleId: viewId,
            token: this.token
          })

          // const sp = await axios.post(`/permission/save/${editId}`, {
          //   data: JSON.stringify(this.data_local_p),
          //   user_role_id: sv['data']['id'],
          //   token: this.token
          // })

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully saved'
        })
        this.$vs.loading.close()
        this.$router.push({name:'app-role-list'})
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Role Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      //role
      this.data_local['parent_id'] = ''
      this.data_local['property_id'] = ''
      this.data_local['name'] = ''

      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'The selected Data data was reset'
      })
    },
    async loadMainRole () {
      const result = await axios.get('/role/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg,
          'role_id': localStorage.selectedRoleId,
          'role_val': localStorage.selectedRoleVal
        }
      })

      this.optionMainRole = result['data']
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
    checkAll(id) {
      this.data_local_p[id]['list'] = this.data_local_p[id]['all'] == true ? true : false
      this.data_local_p[id]['create'] = this.data_local_p[id]['all'] == true ? true : false
      this.data_local_p[id]['read'] = this.data_local_p[id]['all'] == true ? true : false
      this.data_local_p[id]['update'] = this.data_local_p[id]['all'] == true ? true : false
      this.data_local_p[id]['delete'] = this.data_local_p[id]['all'] == true ? true : false
      this.isCheck = !this.isCheck
    }
  },
  async created () {
    try {
      await this.loadMainRole()
      await this.loadUserModule()
    } catch (err) {
      this.$vs.notify({
        time:10000,
        color: 'danger',
        title: 'Loading Role Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      this.$router.push({name:'dashboard-analytics'})
    }
  }  
}
</script>
