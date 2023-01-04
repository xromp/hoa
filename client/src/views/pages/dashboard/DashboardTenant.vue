<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full lg:w-1/1 mb-base">
        <vx-card slot="no-body" class="text-center greet-user greet-background">
          <!-- <img src="@/assets/images/elements/decore-left.png" class="decore-left" alt="Decore Left" width="200" >
          <img src="@/assets/images/elements/decore-right.png" class="decore-right" alt="Decore Right" width="175"> -->
          <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-8 w-8"></feather-icon>
          <h1 class="mb-6 text-white">Welcome back {{ firstName }}!</h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white">This section is your <b>dashboard</b>. Your most important activity will show up here.</p>
        </vx-card>
      </div>
    </div>

    <div class="vx-row">
      <!-- <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <vx-card class="pb-base h-full">
            <div class="flex justify-between items-center p-6 border border-solid d-theme-border-grey-light border-r-0 border-l-0 border-t-0">
              <div>
                  <p><span class="font-semibold">{{ todoToday.numComletedTasks }} Maintenance request completed</span> out of {{ todoToday.totalTasks }}</p>
                  <vs-progress :percent="0" color="primary"></vs-progress>
              </div>
              <span>{{ todoToday.date }}</span>
            </div>
              <ul class="tasks-today-container">
                <li class="px-6 py-4 tasks-today__task" v-for="todo in todoToday.tasksToday" :key="todo.id">
                  <div class="vx-row">
                    <div class="vx-col w-full sm:w-auto">
                        <p class="font-semibold text-lg">{{ todo.task }}</p>
                        <small>{{ todo.date }}</small>
                    </div>
                  </div>
                </li>
              </ul>
        </vx-card>
      </div> -->

      <!-- CARD 8: Activity Timeline -->
      <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
        <vx-card title="Notifications" class="mb-base">
          <vs-tabs class="tab-action-btn-fill-conatiner">
            <vs-tab label="Messaging" icon-pack="feather" icon="icon-message-square">
              <vx-timeline :data="timelineDataMessage" />
              <p v-if="timelineDataMessage.length==0">Notifications about your activity will show up here.</p>
            </vs-tab>
            <vs-tab label="Alerts" icon-pack="feather" icon="icon-alert-triangle">
              <vx-timeline :data="timelineDataAlert" />
              <p v-if="timelineDataAlert.length==0">Notifications about your activity will show up here.</p>
            </vs-tab>
            <vs-tab label="All" icon-pack="feather" icon="icon-list">
              <vx-timeline :data="timelineDataAll" />
              <p v-if="timelineDataAll.length==0">Notifications about your activity will show up here.</p>
            </vs-tab>
          </vs-tabs>
        </vx-card>
      </div>

       <div class="vx-col w-full md:w-2/3 mb-base">
        <vx-card title="Payments" class="mb-base">
          <Billing></Billing>
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
import VxTimeline from './timeline/VxTimeline'
import EventBus from '../EventBus'
import EchartsPieChart from './EchartsPieChart.vue'
import ChartjsLineChart from './ChartjsLineChart.vue'

import agGridAmenities from './agGrid-amenities/agGrid.vue'
import agGridMaintenance from './agGrid-maintenance-requests/agGrid.vue'

import Billing  from '../billing/list/List.vue'

import axios from '@/axios'
import common from '@/common'
const jwt = require('jsonwebtoken')
var token = localStorage.usertoken
var decoded = jwt.verify(token, 'secret')  

export default {
  components: {
    EventBus,
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    EchartsPieChart,
    ChartjsLineChart,

    agGridAmenities,
    agGridMaintenance,

    Billing
  },
  data () {
    return {
      firstName: decoded.first_name,

      checkpointReward: {},
      subscribersGained: {},
      ordersRecevied: {},
      salesBarSession: {},
      supportTracker: {},
      productsOrder: {},
      salesRadar: {},
      timelineDataMessage: [],
      timelineDataAlert: [],
      timelineDataAll: [],

      // timelineData: [
        // {
        //   color: 'primary',
        //   icon: 'DropletIcon',
        //   title: 'Water Shut Off',
        //   desc: 'Water to be turned off from 9am - 3pm on April 3, 2019',
        //   // time: '25 mins Ago'
        // },
        // {
        //   color: 'warning',
        //   icon: 'ToolIcon',
        //   title: 'Maintenance Request',
        //   desc: 'Your request is being attended.',
        //   time: '15 Days Ago'
        // },
        // {
        //   color: 'success',
        //   icon: 'LayoutIcon',
        //   title: 'Website Update',
        //   desc: 'There is going a system update from 12mn - 1am on February 25, 2019',
        //   time: '25 days ago'
        // },
        // {
        //   color: 'primary',
        //   icon: 'DropletIcon',
        //   title: 'Water Shut Off',
        //   desc: 'Water to be turned off from 9am - 3pm on January 3, 2019',
        //   time: '25 mins Ago'
        // },
      // ],

      browserStatistics: [
        // {
        //   id: 1,
        //   name: 'Aircon not working',
        //   ratio: 73,
        //   time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
        // },
        // {
        //   id: 3,
        //   name: 'Busted bulb',
        //   ratio: 8,
        //   time: 'Mon Jan 10 2018 09:46:05 GMT+0000 (GMT)',
        // }
      ],

      todoToday: {
        date: common.formatDate(new Date()),
        numCompletedTasks: 0,
        totalTasks: 0,
        tasksToday: [
          // {
          //   id: 3,
          //   task: 'Aircon not working',
          //   date: '16 Feb 2019'
          // },
          // {
          //   id: 70,
          //   task: 'Busted bulb',
          //   date: '16 Feb 2019'
          // }
        ]
      },
      analyticsData,
      goalOverview: {},
      dispatchedOrders: []
    }
  },
  methods: {
    async loadNotification() {
      let { data } = await axios.get('/notification/received', {
        headers: { 
          'Authorization': localStorage.usertoken, 
          'property_ref': localStorage.selectedPropertyRef 
        }
      })

      data = data.sort((a, b) => b.id - a.id)


      this.timelineDataMessage = data.filter(e=> !e.is_automated)
      .slice(0, 10)
      .map(({ id, title, message, is_automated }) => ({
        id,
        color: 'primary',
        icon: !is_automated ? 'MessageSquareIcon' : 'AlertTriangleIcon',
        title,
        desc: !message ? '' : message,
        is_automated,
      }));

      this.timelineDataAlert = data.filter(e=> e.is_automated)
      .slice(0, 10)
      .map(({ id, title, message, is_automated }) => ({
        id,
        color: 'primary',
        icon: !is_automated ? 'MessageSquareIcon' : 'AlertTriangleIcon',
        title,
        desc: !message ? '' : message,
        is_automated,
      }));

      this.timelineDataAll = data.slice(0, 10)
      .map(({ title, message, is_automated }) => ({
        color: 'primary',
        icon: !is_automated ? 'MessageSquareIcon' : 'AlertTriangleIcon',
        title,
        desc: message,
        is_automated,
      }));
    }
  },
  async created () {
    await this.loadNotification()

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
  },
  mounted () { 
    EventBus.$on('update-parent-id',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== '/dashboard/analytics') return
      console.log('/dashboard/analytics - tenant')
      this.timelineData = []
      await this.loadNotification()
    })
    EventBus.$on('update-property-ref',async (result) => {
      setTimeout(async () => { this.$vs.loading.close() },1000)
      if (this.$route.path !== '/dashboard/analytics') return
      console.log('/dashboard/analytics  - tenant')
      this.timelineData = []
      await this.loadNotification()
    })
  },
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
