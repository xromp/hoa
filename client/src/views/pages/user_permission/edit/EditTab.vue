<template>
  <div id="data-edit-tab-info">
    <!-- Permissions -->
    <div class="vx-row w-full mt-4">
      <div class="w-full vx-col">
        <!-- <vs-table pagination :max-items="100"  stripe :data="optionUserModule" :class="{'hours-of-operation':hopErr}"> -->
        <vs-table max-items="15" pagination search :data="optionUserModule">
          <template slot="thead">
            <vs-th class="font-semibold text-center px-3 py-2 permission-matrix" v-for="heading in ['Module', 'All', 'Menu', 'Approval', 'Execute', 'Create', 'Read', 'Update', 'Delete']" :key="heading">{{ heading }}</vs-th>
          </template>

          <template slot-scope="{data}">
            <!-- <vs-tr :key="indextr" v-for="(tr, indextr) in data"> -->

            <vs-tr :key="id" v-for="(val, id) in data" v-if="data_local[val.val] === undefined ? checkM(val.val) : true">
              <vs-td class="px-3 py-2">{{ val.name }}</vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['all']" @change="checkAll(val.val)"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['list']" :class="{'checkTrue': isCheck}"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['approval']" :class="{'checkTrue': isCheck}"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['execute']" :class="{'checkTrue': isCheck}"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['create']"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['read']"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['update']"></vs-checkbox>
              </vs-td>
              <vs-td class="px-3 py-2">
                <vs-checkbox v-model="data_local[val.val]['delete']"></vs-checkbox>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>        
      </div>      
    </div>

    <vx-card class="mt-base" no-shadow card-border v-if="false">
        <table class="w-full user-role-list">
          <tr>
            <th class="font-semibold text-center px-3 py-2" v-for="heading in ['Module', 'All', 'Menu', 'Approval', 'Execute', 'Create', 'Read', 'Update', 'Delete']" :key="heading">{{ heading }}</th>
          </tr>

          <tr v-for="(val, id) in optionUserModule" v-if="data_local[val.val] === undefined ? checkM(val.val) : true">
            <td class="px-3 py-2">{{ val.name }}</td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['all']" @change="checkAll(val.val)"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['list']" :class="{'checkTrue': isCheck}"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['approval']" :class="{'checkTrue': isCheck}"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['execute']" :class="{'checkTrue': isCheck}"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['create']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['read']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['update']"></vs-checkbox>
            </td>
            <td class="px-3 py-2">
              <vs-checkbox v-model="data_local[val.val]['delete']"></vs-checkbox>
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
    checkM(data) {
      return new Promise((resolve, reject) => {
        try {
          this.data_local[data]  = {
            all: false,
            list: false,
            approval: false,
            execute: false,
            create: false,
            update: false,
            read: false,
            delete: false,
          }

          resolve(this.edit_data)
        } catch(err) {
          reject(err.toString('utf8'));
        }
      })
    },
    capitalize (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
    },
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        const editId = this.$route.params.editId
        // await axios.post(`/permission/save/${editId}`, {
        //   user_role_id: editId,
        //   data: JSON.stringify(this.data_local),
        //   token: this.token
        // })
        const permission = JSON.stringify(this.data_local)
        await axios.post(`/role/save/${editId}`, {
          data: {permission},
          token: this.token
        })

        this.$vs.notify({
          color: 'success',
          title: 'Saved',
          text: 'The selected permission was successfully updated'
        })
        this.$vs.loading.close()
        this.$router.go(-1)
      } catch (err) {
        this.data_not_found = true      
        this.$vs.notify({
          color: 'danger',
          title: 'Saving Error',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    reset_data () {
      this.data_local = JSON.parse(JSON.stringify(this.data))
      this.$vs.notify({
        color: 'orange',
        title: 'Edit',
        text: 'The selected permission was reset'
      })
    },
    async loadUserModule () {
      const result = await axios.get('/api/userModule/list', {
        headers: { 
          'Authorization': this.token,
        }
      })

      this.optionUserModule = result['data']
    },
    checkAll(id) {
      this.data_local[id]['list'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['approval'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['execute'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['create'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['read'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['update'] = this.data_local[id]['all'] == true ? true : false
      this.data_local[id]['delete'] = this.data_local[id]['all'] == true ? true : false
      this.isCheck = !this.isCheck
    }
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

<style>
table.user-role-list .con-vs-checkbox, table.user-role-list .con-vs-radio {
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

th.permission-matrix .vs-table-text {
  display: block;
  padding: 10px 0px 10px 0px;
}
</style>