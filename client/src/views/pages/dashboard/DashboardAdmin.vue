<template>
  <div id="dashboard-analytics">
    <!-- RADIAL CHART -->
    <div class="vx-row">
      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="HomeIcon"
          statisticTitle="Properties"
          :statistic="totalProperties"
        />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="UsersIcon"
          :statistic="totalRenters"
          statisticTitle="Renters"
          color="warning" />      
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="FlagIcon"
          :statistic="totalOwners"
          statisticTitle="Owners"
          color="danger" />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="MessageSquareIcon"
          :statistic="totalJoinRequest"
          statisticTitle="Join Requests"
          color="success" />
      </div>
    </div>

    <div class="vx-row">

      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full mb-base">
        <vx-card slot="no-body" class="text-center greet-user greet-background">
          <!-- <img src="@/assets/images/elements/decore-left.png" class="decore-left" alt="Decore Left" width="200" >
          <img src="@/assets/images/elements/decore-right.png" class="decore-right" alt="Decore Right" width="175"> -->
          <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-8 w-8"></feather-icon>
          <h1 class="mb-6 text-white">Welcome back {{ firstName }}!</h1>
          <!-- <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white"> -->
          <p class="w-full mx-auto text-white">
            This section is your <b>dashboard</b>.<br> Your most important activity will show up here.</p>
        </vx-card>
      </div>

      <!-- CARD 2: SUBSCRIBERS GAINED -->
      <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line icon="UsersIcon" statistic="92.6k" statisticTitle="Subscribers Gained" :chartData="subscribersGained.series" type="area"></statistics-card-line>
      </div> -->

      <!-- CARD 3: ORDER RECIEVED -->
      <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line icon="ShoppingBagIcon" statistic="97.5K" statisticTitle="Orders Received" :chartData="ordersRecevied.series" color="warning" type="area"></statistics-card-line>
      </div> -->
    </div>

    <!-- <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mb-base">
        <vx-card title="Admin" class="mb-base">
          <agGridPortfolioManagersAdmin></agGridPortfolioManagersAdmin>
        </vx-card>
      </div>

      <div class="vx-col w-full md:w-1/2 mb-base">
        <vx-card title="Super Admin" class="mb-base">
          <agGridPortfolioManagers></agGridPortfolioManagers>
        </vx-card>
      </div>
    </div> -->   

<!--     <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mb-base">
        <vx-card title="Amenities List" class="mb-base">
          <AmenityList></AmenityList>
        </vx-card>
      </div>
    </div>  -->

    <div class="vx-row">
      <div class="vx-col w-full md:w-1/3 mb-base">
          <vx-card title="Maintenance Overview">
              <template slot="actions">
                  <feather-icon icon="HelpCircleIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
              </template>

              <!-- CHART -->
              <template slot="no-body">
                  <div class="mt-10">
                      <vue-apex-charts
                        type="radialBar"
                        height="240"
                        :options="analyticsData.goalOverviewRadialBar.chartOptions"
                        :series="goalOverview.series" />
                  </div>
              </template>

              <!-- DATA -->
              <div                
                class="flex justify-between text-center mt-4"
                slot="no-body-bottom">

                  <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                      <p class="mt-4">Completed</p>
                      <p class="mb-4 text-3xl font-semibold">{{ maintenanceCompleted }}</p>
                  </div>
                  <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0">
                      <p class="mt-4">In Progress</p>
                      <p class="mb-4 text-3xl font-semibold">{{ maintenanceProgress }}</p>
                  </div>
              </div>
          </vx-card>
      </div>

      <div class="vx-col w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-2/3 mb-base">
          <echarts-pie-chart></echarts-pie-chart>
      </div>
    </div>

    <!-- <div class="vx-row">
      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Pending Amenity Reservations" class="mb-base">
          <agGridAmenities></agGridAmenities>
        </vx-card>
      </div>

      <div class="vx-col lg:w-1/2 w-full">
        <vx-card title="Pending Maintenance Requests" class="mb-base">
          <agGridMaintenance></agGridMaintenance>
        </vx-card>
      </div>
    </div> -->

    <div class="vx-row">
      <div class="vx-col w-full">
        <chartjs-line-chart></chartjs-line-chart>
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
import agGridPortfolioManagers from './agGrid-portfolioManagers/agGrid.vue'
import agGridPortfolioManagersAdmin from './agGrid-portfolioManagersAdmin/agGrid.vue'

import agGridAmenities from './agGrid-amenities/agGrid.vue'
import agGridMaintenance from './agGrid-maintenance-requests/agGrid.vue'

import AmenityList from '../amenity/list/List.vue'


import axios from '@/axios'
const jwt = require('jsonwebtoken')
var token = localStorage.usertoken
var decoded = jwt.verify(token, 'secret')  

export default {
  components: {
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    EchartsPieChart,
    ChartjsLineChart,
    agGridPortfolioManagers,
    agGridPortfolioManagersAdmin,

    agGridAmenities,
    agGridMaintenance,

    AmenityList
  },
  data () {
    return {
      token: token,
      pmcId: decoded.pmc_id,
      firstName: decoded.first_name,

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
      goalOverview: [{
        'series': 0
      }],
      dispatchedOrders: [],

      totalProperties: 0,
      totalRenters: 0,
      totalOwners: 0,
      totalJoinRequest: 0,

      maintenanceCompleted: 0,
      maintenanceProgress: 0
    }
  },
  methods: {
    async loadData() {
      try {    
        var resPropertiesAll = await axios.get(`/api/property/list/all`, {
          headers: { 'Authorization': this.token }
        })

        var resPropertyUsers = await axios.get(`/api/property/users`, {
          headers: { 'Authorization': this.token, 'property_ref': localStorage.selectedPropertyRef  }
        })

        this.totalProperties = resPropertiesAll['data']['count']
        this.totalOwners = resPropertyUsers['data']['count']
      } catch(err) {
        reject(err.toString('utf8'));
      }  
    },
  },
  created () {
    this.loadData()

    // Goal Overview
    this.$http.get('/api/card/card-analytics/goal-overview')
      .then((response) => { 
        this.goalOverview = response.data
        this.goalOverview['series'][0] = 0
        console.log('this.goalOverview ', this.goalOverview['series'])
      })
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
  }
}
</script>

<style lang="scss">
.greet-background {
  background-image: url('../../../assets/images/elements/web_bg_banner.jpg');
  background-size: cover;
}

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
