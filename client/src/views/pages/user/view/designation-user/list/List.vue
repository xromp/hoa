<template>
  <div id="page-data-list">
    <vx-card class="vx-card" style="height:650px">
      <div class="flex flex-wrap items-center justify-end">
      <!-- ADD NEW -->
        <div class="btn-add-new p-3 mr-4 rounded-lg cursor-pointer flex items-right justify-right text-lg font-medium text-base text-primary mt-4">
            <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span> -->
            <vs-button @click="assignDesignationPop=true" color="primary" type="border">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" class="mr-2 ml-0 pl-0"/>
            Add New</vs-button>
        </div>
      </div>

      <div class="vx-row w-full ">
        <div class="w-full vx-col">
          <vs-table max-items="15" pagination :data="listData" id="user-designation-list">
            <template slot="thead">
              <vs-th class="font-semibold text-center px-3 py-2 user-designation-list" v-for="heading in ['Property Name', 'Maintenance', 'Reservation', 'Bulletin']" :key="heading">{{ heading }}</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :key="id" v-for="(val, id) in data">
                <vs-td class="px-4 py-4 text-left">{{listData[id]['property']['name']}}</vs-td>
                <vs-td class="px-4 py-4">
                  <vs-checkbox v-model="listData[id]['d_maintenance']" @change="updateDesignation(listData[id])"></vs-checkbox>
                </vs-td>
                <vs-td class="px-4 py-4">
                  <vs-checkbox v-model="listData[id]['d_reservation']" @change="updateDesignation(listData[id])"></vs-checkbox>
                </vs-td>
                <vs-td class="px-4 py-4">
                  <vs-checkbox v-model="listData[id]['d_bulletin']" disabled></vs-checkbox>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table> 
        </div>      
      </div>
    </vx-card>

    <vs-popup classContent="assign-designation" title="Assign Designation" :active.sync="assignDesignationPop">
      <div class="vx-col w-full h-full assign-designation">
        <div class="assign-designation pop-up-body"> 
          <div>
            <label class="vs-input--label">Property</label>
            <v-select :options="optionProperty" label="name" :reduce="name => name.id" v-validate="'required'" v-model="data_local.property_id" name="property_id" class="inputx"/>
            <span class="text-danger text-sm"  v-show="errors.has('property_id')">{{ errors.first('property_id') }}</span>
          </div>       
          <div class="mt-4 pt-4">
            <label class="vs-input--label">Modules</label>
            <br>
            <ul class="demo-alignment inline-block">
              <li>
                <vs-checkbox v-model="data_local.d_maintenance" color="success">Maintenance requests</vs-checkbox>
              </li>
              <li>
                <vs-checkbox v-model="data_local.d_reservation" color="success">Reservations</vs-checkbox>
              </li>
              <li>
                <vs-checkbox color="danger" disabled>Bulletin board posts</vs-checkbox>
              </li>
            </ul>
          </div>          
        </div>

        <div class="mt-6 flex-right">            
          <vs-button class="mr-2" @click="saveChanges" color="primary" type="filled" :disabled="!validatePop">Add</vs-button>
        </div>
      </div>

    </vs-popup>         
  </div>
</template>

<script>
import vSelect from 'vue-select'

import axios from '@/axios'
import EventBus from '@/EventBus'
import mainHelper from '@/mainHelper' //crud
const jwt = require('jsonwebtoken')
var decoded = jwt.verify(localStorage.usertoken, 'secret') 

export default {
  components: {
    vSelect
  },
  data () {
    const token = localStorage.usertoken
    return {
      //unit-user
      data_local: {
        property_id: null,
        user_id: null,
      },

      optionProperty: [],
      assignDesignationPop: false,

      token: token,
      listData: [],
    }
  },
  watch: {
  },
  computed: {
    validatePop () {
      return !this.errors.any() && this.data_local.property_id !== null
    },
  },
  methods: {
    async updateDesignation(v){
      this.$vs.loading()
      const {data} = await axios.post(`/user-designation/save/${v.id}`,
        { data: v },
        { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
      )

      if (data.message ==='success') {
        this.$vs.notify({
          color: 'success',
          title: 'User Designation',
          text: 'The selected data was successfully Saved'
        })         
      }

      setTimeout(async () => { this.$vs.loading.close() },1000)
    },
    async saveChanges() {
      try {
        if (!this.validatePop) return
        this.$vs.loading()
        this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
        this.data_local.user_id = parseInt(this.$route.params.viewId)
        const {data} = await axios.post(`/user-designation/save/-1`,
          { data: this.data_local },
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }}
        )

        this.$vs.notify({
          color: 'success',
          title: 'Data Saved',
          text: 'The selected data was successfully Saved'
        })     

        this.assignDesignationPop = false
        this.data_local.user_id = 0        
        this.loadData()      
        this.$vs.loading.close()
      } catch (err) {
        this.$vs.notify({
          time:10000,
          color: 'danger',
          title: 'Loading Unit User Page',
          text: err.toString('utf8')
        })
        this.$vs.loading.close()
      }
    },
    async loadProperty () {
      const result = await axios.get('/user-org/property/list', {
        headers: { 
          'Authorization': this.token, 
        },
        params: { 
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': parseInt(localStorage.selectedParentOrg),
          'pmc_id': parseInt(localStorage.selectedParentOrg),
          'role_id': parseInt(localStorage.selectedRoleId),
          'role_val': localStorage.selectedRoleVal          
        }
      })

      this.optionProperty = result['data']
    },
    async loadData() {
      this.$vs.loading()
      const result = await axios.get(`/user-designation/list/${this.$route.params.viewId}`, {
        headers: { 
          'Authorization': this.token, 
        }
      })

      if(result['data'] === 'access_denied') {
        this.$vs.loading.close()
        this.loading = false
        // this.$router.push({name:'page-not-authorized'})
        return false
      } else {
        this.listData = result['data']
        this.loading = false
      }
      setTimeout(async () => { this.$vs.loading.close() },1000)
    }
  },
  mounted () {
    EventBus.$on('update-parent-id',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log(`/users/view/${this.$route.params.viewId}`)    
      await this.loadData()
      this.data_local.parent_id = parseInt(localStorage.selectedParentOrg)
    })
    EventBus.$on('update-property-ref',async (result) => {
      if (this.$route.path !== `/users/view/${this.$route.params.viewId}`) return
      console.log(`/users/view/${this.$route.params.viewId}`)
      await this.loadData()
    })
  },
  async created () {
    try {
      this.$vs.loading()
      //crud
      this.showL = await mainHelper.cansee('user-list', 'list')
      this.showC = await mainHelper.cansee('user-create', 'create')
      this.showR = await mainHelper.cansee('user-read', 'read')
      this.showU = await mainHelper.cansee('user-update', 'update')
      this.showD = await mainHelper.cansee('user-delete', 'delete')

      if (!this.showL) {
        throw new Error('You are not authorized to view this page.')
      }

      await this.loadData()
      await this.loadProperty()
      this.$vs.loading.close()
    } catch(err) {
      this.$vs.notify({
        time: 10000,
        color: 'danger',
        title: 'Loading User Designation List Page',
        text: err.toString('utf8')
      })
      this.$vs.loading.close()
      // this.$router.push({name:'dashboard-analytics'})
    }
  }  
}
</script>

<style lang="scss">
  #page-data-list {
    .data-list-filters {
      .vs__actions {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-58%);
      }
    }
  }

  div.assign-designation ul.vs__dropdown-menu {
    height: 200px;
  }

  .user-designation-list div.vs-table-text {
    display: block !important;
    padding: 10px 0px 10px 0px;
  }

  div.assign-designation.pop-up-style {
    height: 100px;
  }

  div.assign-designation.pop-up-body {
    height: 280px;
  }

  div.assign-designation-role ul.vs__dropdown-menu {
    height: 120px;
  }

  div.assign-designation .con-vs-alert {
    height: 60px !important;
  }

  #user-designation-list .vs-table-text {
    display: block !important;
  }
</style>
