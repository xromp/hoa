<template>
  <div id="data-edit-tab-info">
    <!-- Content Row -->
    <div class="vx-row user-type">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Parent" :disabled="data_local.parent_id == 0" v-if="data_local.parent_id == 0" v-model="data_local.parent_id == 0 ? 'Main Role' : data_local.parent_id" v-validate="'required'" name="parent_id" />
        <span class="text-danger text-sm"  v-show="errors.has('parent_id')">{{ errors.first('parent_id') }}</span>

        <div class="mt-4 edit-role-parent_id" v-if="data_local.parent_id != 0">
          <label class="vs-input--label">Parent Role</label>
          <v-select :options="optionMainRole" :reduce="name => name.id" label="name" v-validate="'required'" v-model="data_local.parent_id" name="parent_id" disabled/>
          <span class="text-danger text-sm"  v-show="errors.has('parent_id')">{{ errors.first('parent_id') }}</span>
        </div>

        <vs-input class="w-full mt-4" label="Role Name" v-model="data_local.name" v-validate="'required'" name="name" />
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span> 

        <vs-input class="w-full mt-4" label="Description" v-model="data_local.description" v-validate="'required'" name="description" />
        <span class="text-danger text-sm"  v-show="errors.has('description')">{{ errors.first('description') }}</span>     
      </div>

    </div>

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
      optionMainRole: [],
      data_local: JSON.parse(JSON.stringify(this.data)),
      confirm_password: '',
      permissions: [{
        users: {
          'read': true,
          'write': false,
          'create': false,
          'delete': false
        },
        posts: {
          'read': true,
          'write': true,
          'create': true,
          'delete': true
        },
        comments: {
          'read': true,
          'write': false,
          'create': true,
          'delete': false
        }
      }],

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
    async save_changes () {
      try {
        if (!this.validateForm) return
        this.$vs.loading()
        const editId = this.$route.params.editId

        await axios.post(`/role/save/${editId}`, {
          data: this.data_local,
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
        text: 'The selected user type was reset'
      })
    },
    async loadMainRole () {
      const result = await axios.get('/role/list/all', {
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
    }    
  },
  async created () {
    try {
      await this.loadMainRole()
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
<style lang="scss">
div.user-type {
  height: 300px;
}

div.user-type .edit-role-parent_id ul.vs__dropdown-menu {
  height: 300px;
}
</style>