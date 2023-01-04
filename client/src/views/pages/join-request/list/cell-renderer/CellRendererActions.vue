<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <div v-if="params.value === 'Pending'">
        <feather-icon icon="CheckCircleIcon" svgClasses="h-5 w-5 mr-4 hover:text-success cursor-pointer" @click="confirmApprove" />
        <feather-icon icon="XCircleIcon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeny" />
      </div>
      <div v-else>
        <vs-chip class="ag-grid-cell-chip" :color="chipColor(params.value)">
          <span>{{ params.value }}</span>
        </vs-chip>
      </div>
      <vs-prompt
        color="danger"
        @cancel="comment=''"
        @accept="deny"
        @close="close"
        :is-valid="!!comment"
        :active.sync="showDenyPrompt">
      <div class="con-exemple-prompt">
        Comment*
        <vs-textarea placeholder="Comment" v-model="comment"/>
        <vs-alert :active="!comment" color="danger" icon="new_releases" >
          Fields can not be empty
        </vs-alert>
      </div>
     </vs-prompt>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'CellRendererActions',
  data() {
    return {
      comment: '',
      showDenyPrompt: false,
    }
  },
  methods: {
    confirmApprove() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: 'Confirm Approve',
        text: `You are about to approve "${this.params.data.fullname}" request.`,
        accept: this.approve,
        acceptText: 'Approve'
      })
    },
    confirmDeny() {
      this.showDenyPrompt = true
    },
    async approve(){
      try {
        const { data } = await axios.post('/user-pending-request/approve', 
          { ...this.params.data, action: "APPROVE" },
          { headers: {'Authorization': this.token }});
        this.$vs.notify({
          title: 'Approving Request',
          text: 'Successfully approved.',
          color: 'success'
        });
        this.$router.go(0);
      } catch ({ response }) {
        this.$vs.notify({
          title: 'Approving Request',
          text: response.data.errors,
          color: 'danger'
        }); 
      }
    },
    async deny(){
      try {
        const { data } = await axios.post('/user-pending-request/deny', 
          { ...this.params.data, comment: this.comment, action: "DENY" },
          { headers: {'Authorization': this.token }});
        this.$vs.notify({
          title: 'Denying Request',
          text: 'Successfully denied.',
          color: 'success'
        });
        this.$router.go(0);
      } catch ({ response }) {
        this.$vs.notify({
          title: 'Denying Request',
          text: response.data.errors,
          color: 'danger'
        }); 
      }
    }
  },
  computed: {
    token() {
      return localStorage.usertoken;
    },
    chipColor () {
      return (value) => {
        if (value === 'Approved') return 'success'
        if (value === 'Denied') return 'danger'
        else return 'default'
      }
    }
  }
}
</script>
<style lang="scss" scpoped>
.ag-grid-cell-chip {
  &.vs-chip-success {
    background: rgba(var(--vs-success),.15);
    color: rgba(var(--vs-success),1) !important;
    font-weight: 500;
    margin-top: 20px;
  }
  &.vs-chip-warning {
    background: rgba(var(--vs-warning),.15);
    color: rgba(var(--vs-warning),1) !important;
    font-weight: 500;
    margin-top: 20px;
  }
  &.vs-chip-danger {
    background: rgba(var(--vs-danger),.15);
    color: rgba(var(--vs-danger),1) !important;
    font-weight: 500;
    margin-top: 20px;
  }
  &.vs-chip-default {
    // background: rgba(var(--vs-danger),.15);
    // color: rgba(var(--vs-danger),1) !important;
    font-weight: 500;
    margin-top: 20px;
  }
}
</style>