import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from '@/router'

// const r = async () => {
//   console.log('router ', router)
//   console.log('router ', await router['apps'][0])
//   return await router['apps']
// }

// r().then(async (res) => {
//   for (const a in res){
//     console.log('a ', a)
//     console.log('res 1a ', res[a])
//     console.log('res 1b ', await res[a].$route)
//     // console.log('res 2 ', res[a])
//   }  
// })

Vue.use(AclInstaller)

let initialRole = 'editor'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
let token = localStorage.getItem('usertoken')
let tokenExp = localStorage.getItem('usertokenexp')
const now = Date.now().valueOf() / 1000 

console.log('localStorage.usertoken !== undefined ', localStorage.usertoken !== undefined)
console.log('localStorage.usertokenexp > now ', localStorage.usertokenexp > now)
console.log('window.location.pathname ', window.location.pathname)

if(localStorage.usertoken !== undefined && localStorage.usertokenexp > now) {
  if (window.location.pathname === '/' || window.location.pathname === '/login') {
    window.location.href = "/dashboard/analytics";
  }
}

if (typeof token !== 'undefined' && tokenExp > now) {
	initialRole = 'admin'
} else {
	initialRole = 'editor'
}

if (userInfo && userInfo.userRole) initialRole = userInfo.userRole

export default new AclCreate({
  initial  : initialRole,
  notfound : '/not-authorized',
  router,
  acceptLocalRules : true,
  globalRules: {
    admin  : new AclRule('admin').generate(),
    editor : new AclRule('editor').or('admin').generate(),
    superamdin : new AclRule('editor').and('admin').generate()
  }
})
