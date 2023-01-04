import axios from '@/axios'
const jwt = require('jsonwebtoken')
const decoded = jwt.verify(localStorage.usertoken, 'secret')  
const viewId = decoded.id
const token = localStorage.usertoken

export default {
  cansee(slug, type) {
		return new Promise(async (resolve, reject) => {
			try {    	
	      const userPemData = JSON.parse(localStorage.userAllData)
	      const userD = JSON.parse(userPemData['user_role']['permission'])
	      const matchingKey = Object.keys(userD).find(key => key+'-'+type === slug);
	      const showP = matchingKey !== undefined && userD[matchingKey][type] ? true : false

	      // axios.get('/api/insight/auth', {
	      // 	headers: { 'Authorization': localStorage.usertoken }
	      // }).then((result) => {
	      // 	localStorage.removeItem('Insight_URL')
	      //   localStorage.setItem('Insight_URL', result.data.Insight_URL)
	      //   return result.data.Insight_URL
	      // })

	    	resolve(showP)
			} catch(err) {
				window.location.href = "/not-authorized"
				reject(err.toString('utf8'));
			}
		})
  },

  async auth(token) {
  	try {  		
			const d = await axios.get(`/api/auth`, {
	      headers: { 'Authorization': token }
	    })
	    
			if (d['data'] == 'access_denied') {
	      window.location.href = "/not-authorized"
	    }
  	} catch(err) {
  		console.log(err)
  	}
  },

  async loadUserVal() {
    return localStorage.selectedRoleVal
  },

  async loadUserAccessLevel() {
    return localStorage.accessLevel
  },
  
  optionalChaning(fn) {
    try { return fn(); }
    catch (e) {}
  },
  async isPageAvailable(page) {
    const {data} = await axios.get('/user-module/list/all', {
      headers: { 
        'Authorization': token
      }
    })

    const result = data.filter((r) => r.val === page)
    return result[0]['is_maintenance']
    // if (result[0]['is_maintenance']) { this.$router.push({name:'page-maintenance'}) }
    // if (result[0]['is_maintenance']) { this.$router.push({name:'page-coming-soon'}) }
  },
  async refreshToken() {
    const current_env = {
      'property_ref': localStorage.selectedPropertyRef,
      'parent_org_id': localStorage.selectedParentOrg,
      'role_id': localStorage.selectedRoleId,
      'role_val': localStorage.selectedRoleVal
    };
    const { data } = await axios.post(`/user/refresh-token`, { current_env }, {
      headers: { 'Authorization': token }
    });
    localStorage.setItem('usertoken', data.token);
  },
}