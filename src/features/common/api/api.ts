import axios from 'axios'

export const HEALTH_ENDPOINT = `actuator/health`;

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json"
});
