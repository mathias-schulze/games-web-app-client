import axios from 'axios'
import { store } from '../store/store'

export const HEALTH_ENDPOINT = `actuator/health`;
export const GAMES_ENDPOINT = `games`;
export const GAMES_LIST_ENDPOINT = GAMES_ENDPOINT + `/list`;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json",
});

instance.interceptors.request.use(req => {
  req.headers.Authorization = 'Bearer ' + store.getState().auth.auth?.token;
  return req;
});

export default instance;
