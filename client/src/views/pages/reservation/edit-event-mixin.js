import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import axios from '@/axios'

const jwt = require('jsonwebtoken')
const token = localStorage.usertoken
const decoded = jwt.verify(token, 'secret')

export default {
  components: {
    vSelect,
    flatPickr
  },

  data () {
    return {
      asAdmin: [
        'admin', 
        'parent', 
        'super',
        'manager'
      ],

      asTenant: [
        'user'
      ],

      optionAmenity: [],
      optionHour: [],
      optionHoursStart: [],
      selectedAmenity: [],
      optionUnit: [],
      optionUser: [],
      optionHoursEnd: [],
      data_local: {
        amenity_id: null,
        unit_resident_id: null,
        from_time: '',
        to_time: '',
        people: 0,
        comments: '',
        status: '',
        from_dates: null,
        from_date: null,
        to_date: null,
        user_id: null,
        is_seen: 0,
        from_datetime: null,
        to_datetime: null,
        property_id: null,
        unit_id: null,
        rejection_reason: '',
        internal_comments: '',
        createdAt: null,
        updatedAt: null,

        startDate: null,
        endDate: null,
        title: '',
        label: 'approve',
        is_block: 0,
        block_reason: '',
        is_buffer: 0
      },
      optionAction: [
        { id: 1, name: 'Approve', val: 'approve'},
        { id: 3, name: 'Reject', val: 'reject'},
        { id: 4, name: 'Delete', val: 'delete'}
      ],
      configETA: {
        'minDate': new Date(),
        'maxDate': null,
        'enableTime': false,
        'dateFormat': 'M d Y',
        'disable': [
          function (/* date */) {
            // return true to disable
            // return (date.getDay() === 0 || date.getDay() === 6);
          }
        ]
      },

      configFromdateTimePicker: {
        'minDate': new Date(),
        'maxDate': null,
        'disable': [
          function (date) {
            // return true to disable
            return (date.getDay() === 0 || date.getDay() === 6)

          }
        ]
      },
      configTodateTimePicker: {
        'minDate': null,
        'disable': [
          function (date) {
            // return true to disable
            return (date.getDay() === 0 || date.getDay() === 6)

          }
        ]
      },

      activePromptEditEvent: false
    }
  },

  computed: {
    isAdmin() {
      return this.asAdmin.includes(this.roleVal)
    },
    isTenant() {
      return this.asTenant.includes(this.roleVal)
    },
    roleVal() {
      return localStorage.selectedRoleVal
    },
    labelColor () {
      return (label) => {
        if      (label === 'approve') return 'success'
        else if (label === 'pending') return 'warning'
        else if (label === 'deleted') return 'danger'
      }
    }
  },

  methods: {
    async loadUser () {
      const d = await axios.get(`/unit-user/list/${this.data_local.unit_id}`, {
        headers: { 
          'Authorization': localStorage.usertoken,
          'property_ref': localStorage.selectedPropertyRef,
          'unit_id': this.data_local.unit_id
        },
      })

      this.optionUser = d['data'].map(({user})=>user)
      this.data_local.user_id = null
    },
    async loadAmenity () {
      const url = this.isAdmin ? '/amenity/list' : `/amenity/list/${decoded.property_id}`
      const d = await axios.get(url, {
        headers: {
          'Authorization': localStorage.usertoken,
          'property_ref': localStorage.selectedPropertyRef
        }
      })

      this.optionAmenity = d['data']
    },
    async loadUnit () {
      const d = await axios.get('/unit/list', {
        headers: { 
          'Authorization': localStorage.usertoken
        },
        params: {
          'property_ref': localStorage.selectedPropertyRef,
          'parent_org_id': localStorage.selectedParentOrg
        }
      })

      this.optionUnit = d['data']
    },
    async selectAmenity () {
      this.data_local.from_time = null
      this.data_local.to_time = null
      this.optionAmenity.filter((res) => {
        this.amenity_name = this.data_local.amenity_id === res['id'] ? res['name'] : this.amenity_name
        this.selectedAmenity = this.data_local.amenity_id === res['id'] ? res : this.selectedAmenity
      })

      const odj = JSON.parse(this.selectedAmenity.operational_days_json)
      const startDate = new Date(this.data_local.startDate)
      this.optionHoursStart = []

      if (!odj[startDate.getDay()]['is_all_day']) {
        const odjS = odj[startDate.getDay()]['op_start_time_id']
        const odjE = odj[startDate.getDay()]['op_end_time_id']
        // const odjSv = odj[startDate.getDay()]['op_start_time']
        // const odjEv = odj[startDate.getDay()]['op_end_time']

        for (const [key] of Object.entries(odjS)) {
          for (let i = odjS[key]; i <= (odjE[key]); i++) {
            this.optionHoursStart.push({id:this.optionHour[i]['id'], val:this.optionHour[i]['val'] })
          }
        }
      } else {
        this.optionHoursStart = this.optionHour
      }
    },
    async selectAmenity2 () {
      this.data_local.to_time = null
      this.optionAmenity.filter((res) => {
        this.amenity_name = this.data_local.amenity_id === res['id'] ? res['name'] : this.amenity_name
        this.selectedAmenity = this.data_local.amenity_id === res['id'] ? res : this.selectedAmenity
      })

      const odj = JSON.parse(this.selectedAmenity.operational_days_json)
      const startDate = new Date(this.data_local.startDate)

      this.optionHoursEnd = []

      if (!odj[startDate.getDay()]['is_all_day']) {
        const odjS = odj[startDate.getDay()]['op_start_time_id']
        const odjE = odj[startDate.getDay()]['op_end_time_id']
        // const odjSv = odj[startDate.getDay()]['op_start_time']
        // const odjEv = odj[startDate.getDay()]['op_end_time']

        for (const [key] of Object.entries(odjS)) {
          if ((this.data_local.from_time + 1) < (odjE[key] + 1)) {
            for (let i = (this.data_local.from_time + 1); i <= (odjE[key]); i++) {
              const hasHr = this.optionHoursEnd.filter(obj => obj.val === this.optionHour[i]['val'])

              if (!hasHr.length > 0) {
                this.optionHoursEnd.push({id:this.optionHour[i]['id'], val:this.optionHour[i]['val'] })
              }
            }
          }

        }
      } else {
        for (const [key] of Object.entries(this.optionHour)) {
          if ((this.data_local.from_time + 1) < (this.optionHour[key]['id'] + 1)) {
            this.optionHoursEnd.push({id:this.optionHour[key]['id'], val:this.optionHour[key]['val'] })
          }
        }
      }
    },
    loadHour () {
      let id = 0
      let yy = 0
      let tya = 0
      let hh = 0
      let zx = 0
      const bt = 60
      let ii = 0

      for (let i = 0; i <= 23; i++) {
        for (ii; ii < 60; ii = ii + bt) {
          hh = ii === 0 ? '00' : ii
          tya = i >= 12 ? 'PM' : 'AM'
          zx = i > 12 ? i - 12 : i
          yy = `${(`0${  zx}`).slice(-2)}:${hh  }${tya}`
          this.optionHour.push({id, 'val': yy})
          id++
        }

        ii = 0
      }
    },
    onFromTimeChange (selectedTime, timeStr) {
      this.$set(this.configdateToTimePicker, 'minTime', timeStr)
    },
    onFromChange (selectedDates, dateStr) {
      this.$set(this.configTodateTimePicker, 'minDate', dateStr)
      // this.data_local.endDate = this.data_local.is_block === 0 ? this.data_local.startDate : this.data_local.endDate

      this.selectAmenity()
    },
    onToChange (selectedDates, dateStr) {
      this.$set(this.configFromdateTimePicker, 'maxDate', dateStr)
    }
  },
  async created () {
    this.loadUnit()
    this.loadUser()
    this.loadAmenity()
    this.loadHour()
  }
}
