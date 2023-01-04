<template>
  <!-- NOTIFICATIONS -->
  <vs-dropdown vs-custom-content vs-trigger-click @blur="seenNotif" class="cursor-pointer">
    <feather-icon icon="BellIcon" svgClasses="fill-current" class="unread cursor-pointer mt-1 sm:mr-6 mr-2" 
    :badge="unreadNotifCount"
    />

    <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">

      <div class="notification-top text-center p-5 bg-primary text-white">
        <h3 class="text-white">{{ 
          unreadNotifCount 
            ? `${unreadNotifCount} New notifications`
            :  'No new notifications'}}
        </h3>
        <p class="opacity-75">List of received messages</p>
      </div>

      <component :is="scrollbarTag" 
        ref="mainSidebarPs" 
        class="scroll-area--nofications-dropdown p-0 mb-10" 
        :settings="settings" 
        :key="$vs.rtl">
        <ul class="bordered-items">
          <li v-for="ntf in notifications" 
            :key="ntf.id" 
            class="flex justify-between px-4 py-4 notification cursor-pointer"
            :style="{ 'background': ntf.is_seen ? 'white' : '#90daf329'}"
            @click="viewNotification(ntf)"
            >
            <div class="flex items-start">
              <feather-icon icon="MailIcon" :svgClasses="[`text-primary`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>
              <div class="mx-2">
                <span class="font-medium block notification-title" :class="[`text-${ntf.category}`]">{{ ntf.notification_message.title }}</span>
                <small>{{ ntf.notification_message.message }}</small>
              </div>
            </div>
            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.notification_message.createdAt) }}</small>
          </li>
        </ul>
      </component>

      <div class="
        checkout-footer
        fixed
        bottom-0
        rounded-b-lg
        text-primary
        w-full
        p-2
        font-semibold
        text-center
        border
        border-b-0
        border-l-0
        border-r-0
        border-solid
        d-theme-border-grey-light
        cursor-pointer"
        @click="viewAllNotification()"
        >
        <span>View All Notifications</span>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import axios from '@/axios';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    VuePerfectScrollbar
  },
  data () {
    return {
      notifications: [],
      unreadNotifCount: 0,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60
      },
      isConnected: this.$socket.connected,
    }
  },
  computed: {
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
    viewAllNotification() {
      this.$router.push(`/notifications/received`)
    },
    viewNotification({ id, redirect_url }) {
      // this.$router.push({name:'app-notification-received-list', params: {id: ntf_id }})
      let url = `/notifications/received/${id}`;
      if (redirect_url) {
        const { web }= JSON.parse(redirect_url);
        url = web;
      }
      window.location.href = `${window.location.origin}/${url}`;
    },
    elapsedTime (startTime) {
      const x        = new Date(startTime)
      const now      = new Date()
      let timeDiff = now - x
      timeDiff    /= 1000

      const seconds = Math.round(timeDiff)
      timeDiff    = Math.floor(timeDiff / 60)

      const minutes = Math.round(timeDiff % 60)
      timeDiff    = Math.floor(timeDiff / 60)

      const hours   = Math.round(timeDiff % 24)
      timeDiff    = Math.floor(timeDiff / 24)

      const days    = Math.round(timeDiff % 365)
      timeDiff    = Math.floor(timeDiff / 365)

      const years   = timeDiff

      if (years > 0) {
        return `${years + (years > 1 ? ' Years ' : ' Year ')}ago`
      } else if (days > 0) {
        return `${days + (days > 1 ? ' Days ' : ' Day ')}ago`
      } else if (hours > 0) {
        return `${hours + (hours > 1 ? ' Hrs ' : ' Hour ')}ago`
      } else if (minutes > 0) {
        return `${minutes + (minutes > 1 ? ' Mins ' : ' Min ')}ago`
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? ' sec ago' : 'just now')
      }

      return 'Just Now'
    },
    emitUserSocket () {
      const { id: userId } = JSON.parse(localStorage.userAllData)
      this.$socket.client.emit('update-user-socket', { userId, socketId: this.$socket.client.id });
    },
    async loadNotifications() {
      const token = localStorage.usertoken;
      const { data } = await axios.get(`/notification/receive-messages`, {
          headers: { 'Authorization': token }
        });
      this.notifications = data;
      this.unreadNotifCount = this.notifications.filter(({ is_seen }) => !is_seen).length;
    },
    async seenNotif() {
      const hasUnSeen = this.notifications.some(({ is_seen }) => !is_seen );
      const token = localStorage.usertoken;
      if (hasUnSeen) {
        await axios.post(`/notification/seen-current-notif`, {}, { headers: { 'Authorization': token } });
        await this.loadNotifications();
      }
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
    'notify-user': function ({ title, message }) {
      const text = message.replace(/(.{150})..+/, "$1 …");
      this.$vs.notify({
        title,
        text,
        color: 'primary',
        fixed: true,
        icon: 'mail',
        time: 5000,
      });
      this.loadNotifications()
    }
  },
  async created () {
    await this.loadNotifications();
    this.emitUserSocket()
  }
}

</script>
<style>
  .unread span.feather-icon-badge {
    background-color: #ea5455 !important;
  }
</style>
