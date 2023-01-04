<template>
  <div class="vx-row" v-if="showApproval">
    <div class="vx-col w-full">
      <div class="flex items-end md:mt-8">
        <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
        <span class="leading-none font-medium" v-if="title">{{ title }}</span>
        <span class="leading-none font-medium" v-else>Approval</span>
      </div>
      <div class="mt-2 d-inline">
        <label class="vs-input--label" v-if="approvals.length == 0">
          No approvers selected
        </label>
        <label class="vs-input--label" v-if="approvals.length != 0">
          {{`${approverType === 'APPROVER_CREATOR' 
            ? 'Choose approver(s)' 
            : 'List of approver(s) for this request'}`}}
        </label><br>
        <div class="dt-available mb-4 vx-row" :key="key" v-for="(dt, key) in approvals">
          <!-- <div class="vx-col w-1/5">
            <label class="vs-input--label">Level {{dt.level}}</label>
            <v-select v-model="dt.level" disabled v-validate="'required'" name="level" />
            <span class="text-danger text-sm"  v-show="errors.has('level')">{{ errors.first('level') }}</span>
          </div> -->
          <div class="vx-col w-3/5">
            <label class="vs-input--label"><strong>Level {{ dt.level }}</strong></label>
            <v-select 
              v-model="dt.user_id" 
              :options="getApproverOptions({ excludeCurrentUser: dt ? dt.user_id : '' })" 
              :reduce="user => user.id" v-validate="'required'" 
              :name="`approver${key+1}`" 
              label="name" 
              :disabled="approverType !== 'APPROVER_CREATOR' || !dt.enable"/>
            <span class="text-danger text-sm"  v-show="errors.has(`approver${key+1}`)">{{ errors.first(`approver${key+1}`) }}</span>
          </div>

          <div v-if="approverType === 'APPROVER_CREATOR'" class="creator-action">
            <feather-icon
              icon="XCircleIcon" 
              svgClasses="h-5 w-5 mr-4 hover:text-danger cursor-pointer"
              class="cursor-pointer" 
              v-show="approvals.length -1 === parseInt(key)"
              @click="deleteApprover(key, dt.id)"
              v-if="editMode"/>
            <feather-icon
              icon="Edit3Icon"
              svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
              @click="edit(dt)"/>
            <feather-icon
              icon="SendIcon" 
              svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
              class="cursor-pointer" 
              @click="sendFollowup({ 
                user_id: dt.user_id, 
                id: dt.id, 
                latest_followup_sent: dt.latest_followup_sent 
                })"/>
          </div>
          
          <div class="vx-col 1/5" v-else-if="approverType === 'APPROVER' && !dt.completed_at && dt.is_self">
            <vs-button 
              icon="done"
              line-origin="left" 
              color="success" 
              type="flat"
              size="small"
              @click="(e) => showApprovalConfirmation({ action: 'approve', id: dt.id})"
              >Approve
              </vs-button>
            <vs-button
              icon="close"
              color="danger" 
              type="flat" 
              @click="(e) => showApprovalConfirmation({ action: 'deny', id: dt.id})"
              size="small"
              >Deny</vs-button>
          </div>
           <div class="vx-col w-full" v-if="approverType === 'APPROVER' && !dt.completed_at && dt.is_self">
            <div class="dt-available mb-4 vx-row">
              <div class="vx-col w-full">
                <vs-alert
                  color="warning"
                  title="Out for Review"
                  active="true">
                  <small>Take action on this pending approval by approving/denying this request.</small>
                </vs-alert>
              </div>
            </div>
          </div>
          
          <div class="vx-col w-full" v-else-if="dt.completed_at">
            <div class="dt-available mb-4 vx-row">
              <div class="vx-col w-3/5">
                <vs-alert
                  :color="dt.status === 'Approved' ? 'success' : 'danger'"
                  :title="dt.status"
                  active="true">
                  <small>{{dt.comment}}</small>
                </vs-alert>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        class="mt-4" 
        :class="{'text-right': !!approvals.length}"
        v-if="approverType === 'APPROVER_CREATOR'">
        <vs-button
          color="primary"
          type="border" 
          class="mr-4" 
          @click="addApprover" 
          :disabled="approvals.length === 5"
          v-if="editMode || !approvals.length">
          Add Approval</vs-button>
        <vs-button 
          color="success"
          type="border"
          class="mr-4" 
          @click="submitApporver()" 
          :disabled="!isFormValid"
          v-if="!!approvals.length && editMode && !hideSubmit">
          Submit</vs-button>
      </div>
    </div>
    <vs-prompt
      :color="confirmApproval.action === 'approve' ? 'success' : 'danger'"
      :title="confirmApproval.action === 'approve' ? 'Approving Request' : 'Denying Request'"
      :accept-text="confirmApproval.action === 'approve' ? 'Approved' : 'Denied'"
      :is-valid="isApprovalValid"
      :active.sync="confirmApproval.show"
      @close="approvalInput = {}"
      @cancel="approvalInput = {}"
      @accept="submitAction({ ...confirmApproval, ...approvalInput })">
      <div class="con-exemple-prompt">
        <div class="mt-4">
          <label class="vs-input--label">Comment ({{confirmApproval.action === 'approve' ? 'optional' : 'required'}})</label>
          <vs-textarea name="people" class="w-full" v-model="approvalInput.comment" type="text"></vs-textarea>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@/axios'
import EventBus from '@/EventBus'
import moment from 'moment'

export default {
  components: {
    vSelect,
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    reference_id: {
      type: Number,
      required: true
    },
    reference_no: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    hideSubmit: {
      type: Boolean,
    },
    other_data_obj: { 
      type: Object
    },
  },
  data() {
    return {
      token: localStorage.usertoken,
      approvals: this.items,
      editMode: false,
      userOptions: [],
      isApprovalCreator: false,
      approverType: '',
      confirmApproval: {},
      approvalInput: {
        comment: '',
      },
    }
  },
  computed: {
    isApprovalValid() {
      return !(this.confirmApproval.action === 'deny' && !this.approvalInput.comment);
    },
    isFormValid () {
      return !this.errors.any() && this.approvals.every(approver => approver.user_id)
    },
    showApproval() {
      return this.approverType === 'APPROVER_CREATOR' 
        || (this.approverType === 'APPROVER' && this.approvals.length);
    }
  },
  methods: {
    addApprover() {
      const count = this.approvals.length;
      const approver = {
        level: count+1,
        user_id: null,
        enable: true,
      }
      this.approvals.push(approver)
      this.editMode = true;
    },
    async deleteApprover(k, id) {
      this.$delete(this.approvals, k);
      
      await axios.delete(`/approval-item/delete-approver/${id}`, {
        headers: { 'Authorization': this.token },
      });
    },
    getApproverOptions ({ excludeCurrentUser }) {
      const selectedApproval = Array.from(this.approvals);
      const selectedUsers = selectedApproval
        .map(({ user_id }) => user_id)
        .filter( user_id => user_id !== excludeCurrentUser)
      const users = this.userOptions
        .filter(({ id }) => !selectedUsers.includes(id))
        .map(user => ({ ...user, name: `${user.full_name} (${user.user_org_roles[0].user_role.name})`}));
      return users;
    },
    showApprovalConfirmation({ action, id }) {
      this.confirmApproval = {
        show: true,
        action,
        isValid: !(action === 'deny' && !this.approvalInput.comment),
        approval_items_id: id,
      }
    },
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
    edit(dt) {
      this.$set(dt, 'enable', true);
      this.editMode = true;
    },
    reset() {
      this.approvals = JSON.parse(JSON.stringify(this.items));
      this.editMode = false;
    },
    async sendFollowup ({ id, user_id, latest_followup_sent }) {
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
            reference_no: this.reference_no,
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
    },
    async submitAction({ approval_items_id, action, comment }) {
      try {
        const mapApprovalAction = {
          'approve': 'Approved',
          'deny': 'Denied',
        }
        const token = localStorage.usertoken;
        const data = {
          approval_items_id, 
          action: mapApprovalAction[action], 
          comment,
        };
        await axios.post(`/approval/submit-approver-action`, data, {
          headers: { 'Authorization': token }
        });
        this.$vs.notify({
          color:'success',
          title:'Submit Request Approval',
          text:`The approval request has been ${action} successfully.`
        })
        this.$router.go(0)
        // EventBus.$emit('load-approval', { data })
      } catch({ response }) {
        this.$vs.notify({
          color:'danger',
          title:'Submit Request Approval',
          text: response.data.errors
        })
      }  
    },
    async submitApporver () {
      if (!this.isFormValid) return;
      this.$vs.loading();
      try {    
        const token = localStorage.usertoken;
        const data = { 
            ...this.$props,
            property_ref: localStorage.selectedPropertyRef,
            approval_item: this.approvals,
            other_data_obj: JSON.stringify(this.$props.other_data_obj),
          };
        const { data: approvals } = await axios.post(`/approval/save-approvers`, data, {
          headers: { 'Authorization': token }
        });
        this.$vs.notify({
          color:'success',
          title:'Assigning Approvers',
          text: 'Submitted successfully'
        })
        this.approvals = approvals;
        this.editMode = false;
        this.$vs.loading.close();
      } catch({ response }) {
        this.$vs.notify({
          color:'danger',
          title:'Submit Approvers',
          text: response.data.errors
        });
        this.$vs.loading.close();
      }
    },
    async loadApprovers() {
      try {
        this.$vs.loading();
        const token = localStorage.usertoken;
        const params = {
          is_creator: false,
        }
        const { data } = await axios.get(`/approver/get-approvers`, {
          params,
          headers: { 'Authorization': token }
        });
        this.userOptions = data
        .filter(({ user }) => !!user)
        .map(({ user }) => user );
        console.log(this.userOptions)
        this.$vs.loading.close();
      } catch({ response }) {
        this.$vs.notify({
          color:'danger',
          title:'Submit Approvers',
          text: response.data.errors
        });
        this.$vs.loading.close();
      }  
    },
    async getCurrentUserApprover() {
      try {
        const token = localStorage.usertoken;
        const { data } = await axios.get(`/approver/current-user`, {
          headers: { 'Authorization': token }
        });
        return data;
      } catch({ response }) {
        this.$vs.notify({
          color:'danger',
          title:'Submit Approvers',
          text: response.data.errors
        });
      }  
    },
  },
  async created() {
    setTimeout(() => this.reset(), 500);
    const approver = await this.getCurrentUserApprover();
    this.isApprovalCreator = approver && approver.is_creator;
    this.approverType = approver && approver.is_creator 
      ? "APPROVER_CREATOR"
      : approver && !approver.is_creator
        ? "APPROVER"
        : "";
    await this.loadApprovers();
  },
  watch: {
    approvals : function(val) {
      this.$emit('update:approval', val);
    }
  }
}
</script>

<style scoped>
  .creator-action {
    padding-top: 25px;
  }
</style>
