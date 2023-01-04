// axios
import axios from 'axios'
// 
const baseURL = process.env.VUE_APP_ENV_BASE_URL+':'+process.env.VUE_APP_ENV_PORT

export default axios.create({
  baseURL
  // You can add your headers here
})