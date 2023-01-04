<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <!-- <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" /> -->
      <feather-icon 
        icon="SendIcon" 
        svgClasses="h-5 w-5 hover:text-primary cursor-pointer" 
        @click="sendFollowup(params.data)"/>
    </div>
</template>

<script>
import axios from '@/axios'
import moment from 'moment';
export default {
  data () {
    return {
      token: localStorage.usertoken
    }
  },
  name: 'CellRendererActions',
  methods: {
    confirmationDialog({type, color, title, text, acceptText}) {
      return new Promise(resolve => {
        this.$vs.dialog({
          type,
          color,
          title,
          text,
          accept: () => resolve(true),
          acceptText,
        });
      })
    },
    async sendFollowup ({ id, user_id, latest_followup_sent, approval }) {
      try {
        const text = latest_followup_sent 
        ? `The latest follow up was sent ${moment(latest_followup_sent).fromNow()}. Do you still want to proceed?`
        : `You are about to send a follow up email.`;
        const confirm = await this.confirmationDialog({
          type: 'confirm',
          color: 'primary',
          title: `Send Follow up Email`,
          text,
          acceptText: 'Send follow up'
        });

        if (!confirm) return;

        const token = localStorage.usertoken;
        const data = { 
            origin_url: window.location.href,
            user_id,
            id,
            reference_no: approval.reference_no,
          };
        await axios.post(`/approval-item/send-followup`, data, {
          headers: { 'Authorization': token }
        });
        this.$vs.notify({
          color:'success',
          title:'Sending follow up email',
          text: 'Follow up email sent'
        })
      } catch({ response }) {
        this.$vs.notify({
          color:'danger',
          title:'Sending follow up email',
          text: response.data.errors
        })
      }
    }
  }
}
</script>
