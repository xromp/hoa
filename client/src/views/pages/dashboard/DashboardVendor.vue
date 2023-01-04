<template>
  <div id="dashboard-analytics">

    <vx-card title="" class="mb-base">
      <!-- Item Main Info -->
        <div class="product-details p-6">
          <div class="vx-row mt-6">
            <div class="vx-col md:w-1/5 w-full flex items-center justify-center">
              <div class="product-img-container w-5/5 mx-auto mb-10 md:mb-0">
                <read-avatar 
                  :folderPath="folderPath" 
                  :folderId="folderId" 
                  :defaultImg = "defaultImg"
                  class="vx-col mb-4" />
              </div>
            </div>

            <!-- Item Content -->
            <div class="vx-col md:w-3/5 w-full">
              <div class="pt-8 clearfix">
                <h2>{{ vendorUser.vendor.business_name }}</h2>
              </div>

              <vs-divider />            
              <vs-list class="product-sales-meta-list text-right p-0">
                 <vs-list-item icon-pack="feather" icon="icon-user" title="Contact Details" subtitle="" class="p-4">
                  <p>{{ vendorUser.vendor.business_email }}</p>
                  <p>{{ vendorUser.vendor.business_phone }}</p>                  
                </vs-list-item>

                <vs-list-item icon-pack="feather" icon="icon-home" title="Address" subtitle="" class="p-4">
                  <p>{{ vendorUser.vendor.business_address_line_1 }}</p>
                  <p>{{ vendorUser.vendor.business_city }}</p>
                  <p>{{ vendorUser.vendor.business_state }}</p>
                  <p>{{ vendorUser.vendor.business_zip }}</p>
                  <p>{{ vendorUser.vendor.business_country }}</p>

                  <!-- <p>1234 aXessPoint Way Suite 123</p>
                  <p>HONOLULU, HI, 96800</p>
                  <p>United States</p> -->
                </vs-list-item>              

                <!-- <vs-list-item icon-pack="feather" icon="icon-dollar-sign" title="Bank Details" subtitle="" class="p-4">
                  <p>Banco De Oro Unibank</p>
                  <p>182 998 903</p>
                  <p>United States</p>
                </vs-list-item>  -->
              </vs-list>
              <vs-divider />

            </div>

            <div class="vx-col md:w-1/5 w-full">
              <div class="p-8 clearfix">
                  <div class="mb-8">
                      <h1>
                        <sup class="text-lg">$</sup>
                        <span>{{totalAmount}}</span>
                      </h1>
                      <small>
                        <span class="text-grey">Deposits: </span>
                        <span>$</span>
                        <span>{{paid}}</span>
                      </small>
                  </div>
                  <!-- <p
                    class="mt-2 mb-8 text-xl font-medium"
                    :class="true ? 'text-success' : 'text-danger'"
                    >
                    <span v-if="true">+</span>
                    <span>789%</span>
                    <span class="ml-1">($987)</span>
                  </p> -->
                  <vs-button icon-pack="feather" icon="icon-chevrons-right" icon-after class="shadow-md w-full" to="/billing/list">Invoice Details</vs-button>
              </div>
              <div class="p-8 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                  <div class="mb-4">
                      <small>Paid: ${{paid}}</small>
                      <vs-progress :percent="20" color="success"></vs-progress>
                  </div>
                  <div>
                      <small>Pending: ${{unpaid}}</small>
                      <vs-progress :percent="10" color="warning"></vs-progress>
                  </div>
              </div>
            </div> 

          </div>
        </div>
    </vx-card>

    <div class="vx-row">
      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="PhoneIncomingIcon"
          statisticTitle="Total Job Request"
          :statistic="totalJobRequest"          
        />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="UserXIcon"
          :statistic="newUnassigned === 0 ? 0 :newUnassigned.data.length"
          statisticTitle="New Unassigned"
          color="success" />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="PlusCircleIcon"
          :statistic="assignedNotStarted === 0 ? 0 : assignedNotStarted.data.length"
          statisticTitle="New Not Started"
          color="danger" />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="RotateCwIcon"
          :statistic="workScheduled === 0 ? 0 : workScheduled.data.length"
          statisticTitle="Work Scheduled"
          color="warning" />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="EyeIcon"
          :statistic="underReview === 0 ? 0 : underReview.data.length"
          statisticTitle="Under Review"
          color="dark" />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="CheckCircleIcon"
          :statistic="completed === 0 ? 0 : completed.data.length"
          statisticTitle="Completed"
          color="success" />
      </div>      
    </div>

    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card title="" class="mb-base">          
          <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
            <vs-tab label="Request for Proposal" icon-pack="feather">
              <rfpList :dataType="dataTypeRfpIncomming"></rfpList>    
            </vs-tab>

            <vs-tab label="Submitted Bids" icon-pack="feather">
              <rfpList :dataType="dataTypeRfpSubmitted"></rfpList>
            </vs-tab>

            <vs-tab label="In Progress" icon-pack="feather">
              <workOrderList :dataType="dataTypeWoInProgress"></workOrderList>
            </vs-tab>

            <vs-tab label="Past Jobs" icon-pack="feather">
              <workOrderList :dataType="dataTypePastJobs"></workOrderList>
            </vs-tab>
          </vs-tabs>
        </vx-card>
      </div>
    </div>

  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from '../../ui-elements/card/analyticsData.js'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from '@/components/timeline/VxTimeline'
import EventBus from '../EventBus'
import EchartsPieChart from './EchartsPieChart.vue'
import ChartjsLineChart from './ChartjsLineChart.vue'

import agGridAmenities from './agGrid-amenities/agGrid.vue'
import rfpList from '../maintenance_request/list/List.vue'
import workOrderList from '../maintenance_order/list/List.vue'

import axios from '@/axios'
import ReadAvatar from '../../components/files/ReadAvatar.vue'
const jwt = require('jsonwebtoken')
const decoded = jwt.verify(localStorage.usertoken, 'secret')

export default {
  components: {
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    EchartsPieChart,
    ChartjsLineChart,

    agGridAmenities,
    rfpList,
    workOrderList,

    ReadAvatar
  },
  data () {
    return {
      dataTypeWoInProgress: ['work_started', 'assigned'],
      dataTypePastJobs: ['completed', 'decline', 'out_for_rfp_decline', 'closed'],
      dataTypeRfpIncomming: ['out_for_rfp', 'out_for_rfp_review'],
      dataTypeRfpSubmitted: ['out_for_rfp_submitted'],

      //reading docs
      tableRead: [],
      files: [],

      userAllData: JSON.parse(localStorage.userAllData),
      token: localStorage.usertoken,
      checkpointReward: {},
      subscribersGained: {},
      ordersRecevied: {},
      salesBarSession: {},
      supportTracker: {},
      productsOrder: {},
      salesRadar: {},

      timelineData: [
        {
          color: 'primary',
          icon: 'PlusIcon',
          title: 'Client Meeting',
          desc: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          time: '25 mins Ago'
        },
        {
          color: 'warning',
          icon: 'MailIcon',
          title: 'Email Newsletter',
          desc: 'Cupcake gummi bears soufflé caramels candy',
          time: '15 Days Ago'
        },
        {
          color: 'danger',
          icon: 'UsersIcon',
          title: 'Plan Webinar',
          desc: 'Candy ice cream cake. Halvah gummi bears',
          time: '20 days ago'
        },
        {
          color: 'success',
          icon: 'LayoutIcon',
          title: 'Launch Website',
          desc: 'Candy ice cream cake. Halvah gummi bears Cupcake gummi bears soufflé caramels candy.',
          time: '25 days ago'
        },
        {
          color: 'primary',
          icon: 'TvIcon',
          title: 'Marketing',
          desc: 'Candy ice cream cake. Halvah gummi bears Cupcake gummi bears.',
          time: '28 days ago'
        }
      ],

      analyticsData,
      goalOverview: {},
      dispatchedOrders: [],

      totalJobRequest: 0,
      newUnassigned: 0,       //1
      assignedNotStarted: 0,  //5
      workScheduled: 0,       //2
      underReview: 0,         //3
      completed: 0,           //8
      totalJobRequest: 0,

      paid: 0,    //1
      unpaid: 0,   //null
      totalAmount: 0,

      vendorUser: null,

      folderId: 13,
      defaultImg: '/img/default-placeholder.a36832a1.png',
      folderPath: ''
    }
  },
  watch: {
    vendorUser(val) {
      this.folderPath = `docs/service-provider/avatar/${val.vendor_id}`
    },
  },
  methods: {
    //reading docs
    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    async loadData() {
      this.$vs.loading()
      const vendorUser = await axios.get(`/vendor-user/view/${decoded.id}`, {
        headers: { 'Authorization': this.token }
      })
      this.vendorUser = vendorUser.data

      this.newUnassigned = await axios.get(`/maintenance/list/status/1`, {
        headers: { 'Authorization': this.token }
      }) 

      this.assignedNotStarted = await axios.get(`/maintenance/list/status/5`, {
        headers: { 'Authorization': this.token }
      })

      this.workScheduled = await axios.get(`/maintenance/list/status/2`, {
        headers: { 'Authorization': this.token }
      })

      this.underReview = await axios.get(`/maintenance/list/status/3`, {
        headers: { 'Authorization': this.token }
      })

      this.completed = await axios.get(`/maintenance/list/status/8`, {
        headers: { 'Authorization': this.token }
      })

      this.totalJobRequest = this.newUnassigned.data.length+this.assignedNotStarted.data.length+this.workScheduled.data.length+this.underReview.data.length+this.completed.data.length

      this.paid = await axios.get(`/billing/list/status/1`, {
        headers: { 'Authorization': this.token }
      })
      this.paid = this.paid.data.length >= 1 ? this.paid.data[0].total_amount : 0

      this.unpaid = await axios.get(`/billing/list/status/0`, {
        headers: { 'Authorization': this.token }
      })
      this.unpaid = this.unpaid.data.length >= 1 ? this.unpaid.data[0].total_amount : 0

      this.totalAmount = parseFloat(this.paid) + parseFloat(this.unpaid)
      this.totalAmount = (Math.round(this.totalAmount * 100) / 100).toFixed(2) 

      this.$vs.loading.close()
    }
  },
  sockets: {
    connect: function() {
      this.isConnected = true;
      console.log('connected', this.sockets, this.$socket);
      this.emitUserSocket();
    },
    disconnect: function() {
      this.isConnected = false;
      console.log('disconnected');
    },
    'notify-user': function () {
      this.loadData()
    }
  },
  async created () {
    this.loadData()

    // Goal Overview
    this.$http.get('/api/card/card-analytics/goal-overview')
      .then((response) => { this.goalOverview = response.data })
      .catch((error) => { console.log(error) })

    //  User Reward Card
    this.$http.get('/api/user/checkpoint-reward')
      .then((response) => { this.checkpointReward = response.data })
      .catch((error)   => { console.log(error) })

      // Subscribers gained - Statistics
    this.$http.get('/api/card/card-statistics/subscribers')
      .then((response) => { this.subscribersGained = response.data })
      .catch((error)   => { console.log(error) })

      // Orders - Statistics
    this.$http.get('/api/card/card-statistics/orders')
      .then((response) => { this.ordersRecevied = response.data })
      .catch((error)   => { console.log(error) })

      // Sales bar - Analytics
    this.$http.get('/api/card/card-analytics/sales/bar')
      .then((response) => { this.salesBarSession = response.data })
      .catch((error)   => { console.log(error) })

      // Support Tracker
    this.$http.get('/api/card/card-analytics/support-tracker')
      .then((response) => { this.supportTracker = response.data })
      .catch((error)   => { console.log(error) })

      // Products Order
    this.$http.get('/api/card/card-analytics/products-orders')
      .then((response) => { this.productsOrder = response.data })
      .catch((error)   => { console.log(error) })

      // Sales Radar
    this.$http.get('/api/card/card-analytics/sales/radar')
      .then((response) => { this.salesRadar = response.data })
      .catch((error)   => { console.log(error) })

      // Dispatched Orders
    this.$http.get('/api/table/dispatched-orders')
      .then((response) => { this.dispatchedOrders = response.data })
      .catch((error)   => { console.log(error) })

    

    const viewId = this.vendorUser.vendor.id

    //reading docs
    this.tableRead = await axios.post(`/docs/table/read/`, {
      token: this.token,
      path: `docs/service-provider/avatar/${viewId}`,
      document_folder_id: 13
    })

    //reading docs
    for (const [key, value] of Object.entries(this.tableRead.data.uploadedD)) {
      console.log('this.tableRead.data.uploadedD  ', this.tableRead.data.uploadedD)
      console.log('value.data.Body  ', value.data.Body)

      var imgB64 = this._arrayBufferToBase64( value.data.Body.data )
      var imgAsc = imgB64.toString('ascii')
      this.files.push("data:image/png;base64, " + imgAsc)
    } 
  }
}
</script>

<style lang="scss">
/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user{
    position: relative;

    .decore-left{
      position: absolute;
      left:0;
      top: 0;
    }
    .decore-right{
      position: absolute;
      right:0;
      top: 0;
    }
  }

  @media(max-width: 576px) {
    .decore-left, .decore-right{
      width: 140px;
    }
  }
}
/*! rtl:end:ignore */
</style>
