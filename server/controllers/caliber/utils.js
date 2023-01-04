import axios from 'axios';
import moment from 'moment';

const CALIBER_URL = 'https://frontsteps.cloud/CAPI2_FINITE';
const API_CODE = "axp2019";
const USERNAME = "aXessPoint";
const PASSWORD = "aX3ssP01nt2019";

const TOKEN = `basic ${Buffer.from(`${API_CODE}:${USERNAME}:${PASSWORD}`).toString('base64')}`

const getResponseByEndpoint = async (api, { method = 'GET', data } = {}) => {
  try {
    const options = {
      url: `${CALIBER_URL}/${api}`,
      method,
      headers: { 'Authorization': TOKEN },
      data,
    };
    const { data:response } = await axios(options);
    return response;
  } catch ({ message }) {
    throw new Error(message);
  }
};

const optionalChaning = (obj) => {
  try { return obj(); }
  catch (e) { return ''}
}

const isDateEqual = (date1, date2) => {
  return false;
}

export {
  getResponseByEndpoint,
  optionalChaning,
}