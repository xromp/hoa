<template>
  <div id="data-edit-tab-info">

    <!-- Content Row -->
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input class="w-full mt-4" label="Folder Name" v-model="inputData.name" v-validate="'required'" name="name" />
        <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span> 
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="submit('SaveAndNew')" :disabled="!validateForm">Save and New</vs-button>
          <vs-button class="ml-4 mt-2" @click="submit('SaveAndClose')" :disabled="!validateForm">Save and Close</vs-button>
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
  data () {
    return {
      token: localStorage.usertoken,
      inputData: {
        name: '',
      }
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    async submit(type) {
      if (!this.validateForm) return;
      
      try {
        const { status } = await axios.post(`/file-manager`, 
          { 
            data: { 
              name: this.inputData.name,
              property_id: localStorage.selectedPropertyRef,
            },
          }, 
          { headers: { 'Content-Type': 'application/json', 'Authorization': this.token }
        })

        if (status  === 200) {
          this.$vs.notify({
            color: 'success',
            title: 'Data Saved',
            text: 'New folder added',
          })

          if (type === 'SaveAndNew') {
            setTimeout(() => {
              window.location.href = "/files/new";
            }, 500);
          } else {
            this.$router.go(-1)
          }
        } else {
          this.$vs.notify({
            color: 'danger',
            title: 'Saving Data',
            text: 'Something went wrong'
          })
        }
      } catch (e) {
        const { data } = e.response;
        this.$vs.notify({
          color: 'danger',
          title: 'Data Saving Error',
          text: `${ data ? data.errors.replace('Error:', '') : e.message }`
        })
      }

    },
    reset_data () {
      this.inputData = {};
      this.$vs.notify({
        color: 'orange',
        title: 'Data Edit',
        text: 'Reset!'
      })
    }
  }
}
</script>