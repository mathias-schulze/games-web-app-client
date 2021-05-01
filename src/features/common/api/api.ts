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
export const HERO_REALMS_PLAY_CHAMPION_ENDPOINT = '/play_champion';
export const HERO_REALMS_MAKE_DECISION_ENDPOINT = '/make_decision';
export const HERO_REALMS_SACRIFICE_CARD_ENDPOINT = '/sacrifice';
export const HERO_REALMS_DISCARD_CARD_ENDPOINT = '/discard';
export const HERO_REALMS_SELECT_PLAYER_FOR_DISCARD_CARD_ENDPOINT = '/select_player_for_discard';
export const HERO_REALMS_PREPARE_CHAMPION_ENDPOINT = '/prepare_champion';
export const HERO_REALMS_STUN_TARGET_CHAMPION_ENDPOINT = '/stun_target_champion';
export const HERO_REALMS_PUT_CARD_TOP_DECK_ENDPOINT = '/put_card_top_deck';
export const HERO_REALMS_ATTACK_ENDPOINT = '/attack';
export const HERO_REALMS_BUY_MARKET_CARD_ENDPOINT = '/buy_market_card';
export const HERO_REALMS_BUY_FIRE_GEM_ENDPOINT = '/buy_fire_gem';
export const HERO_REALMS_CHARACTER_ROUND_ABILITIES_ENDPOINT = '/process_character_round_abilities';
export const HERO_REALMS_CHARACTER_ONE_TIME_ABILITIES_ENDPOINT = '/process_character_one_time_abilities';
export const HERO_REALMS_SELECT_PLAYER_FOR_BLESS_ENDPOINT = '/select_player_for_bless';
export const HERO_REALMS_PUT_CHAMPION_DISCARD_INTO_PLAY_ENDPOINT = '/put_champion_discard_into_play';
export const HERO_REALMS_RANGER_TRACK_DISCARD_ENDPOINT = '/ranger_track_discard';
export const HERO_REALMS_RANGER_TRACK_UP_ENDPOINT = '/ranger_track_up';
export const HERO_REALMS_RANGER_TRACK_DOWN_ENDPOINT = '/ranger_track_down';
export const HERO_REALMS_RANGER_TRACK_END_ENDPOINT = '/ranger_track_end';

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

  const notifications:any[] = resp.data?.notifications;
  if (notifications) {
    notifications.forEach(notification => {
      store.dispatch(addNotification({
        type: notification.type.toLowerCase(),
        message: notification.message,
      }));
    });
  }

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
