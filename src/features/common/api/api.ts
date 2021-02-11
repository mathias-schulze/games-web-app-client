import axios from 'axios'
import { store } from '../store/store'
import { addNotification, NotificationType } from '../home/appSlice'

export const HEALTH_ENDPOINT = `actuator/health`;
export const GAMES_ENDPOINT = `games`;
export const GAMES_LIST_ENDPOINT = GAMES_ENDPOINT + `/list`;
export const GAMES_ACTIVE_ENDPOINT = GAMES_ENDPOINT + `/active`;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json",
});

instance.interceptors.request.use(req => {
  req.headers.Authorization = 'Bearer ' + store.getState().auth.auth?.token;
  return req;
});

instance.interceptors.response.use(resp => {
  return resp;
}, error => {
  const connected = store.getState().api.connected;
  const verified = store.getState().auth.verified;
  if (connected === true && verified === true) {
    store.dispatch(addNotification({
      type: NotificationType.ERROR,
      message: error.message,
    }));
  }
  return Promise.reject(error);
});

export default instance;
