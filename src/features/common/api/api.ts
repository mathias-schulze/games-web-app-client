import axios from 'axios'
import { store } from '../store/store'
import { addNotification, NotificationType } from '../home/appSlice'

export const HEALTH_ENDPOINT = 'actuator/health';
export const GAMES_ENDPOINT = 'games';
export const GAMES_LIST_ENDPOINT = GAMES_ENDPOINT + '/list';
export const GAMES_PARAM_ENDPOINT = GAMES_ENDPOINT + '/parameter';
export const GAMES_ACTIVE_ENDPOINT = GAMES_ENDPOINT + '/active';
export const GAMES_JOIN_ENDPOINT = '/join';
export const GAMES_START_ENDPOINT = '/start';
export const HERO_REALMS_ENDPOINT = '/hero_realms';
export const HERO_REALMS_END_TURN_ENDPOINT = '/end_turn';
export const HERO_REALMS_PLAY_CARD_ENDPOINT = '/play_card';
export const HERO_REALMS_BUY_MARKET_CARD_ENDPOINT = '/buy_market_card';
export const HERO_REALMS_BUY_FIRE_GEM_ENDPOINT = '/buy_fire_gem';
export const PLAYERS_ENDPOINT = 'players';

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
