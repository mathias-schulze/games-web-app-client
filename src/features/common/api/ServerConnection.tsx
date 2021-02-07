import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Badge, IconButton } from '@material-ui/core'
import { Storage } from '@material-ui/icons'
import api, { HEALTH_ENDPOINT } from './api'
import { isConnected, setConnected } from './apiSlice'
import { store } from '../store/store'
import { addNotification, NotificationType } from '../home/appSlice'

function ServerConnection() {

  const connected = useSelector(isConnected);

  useEffect(() => {
    checkServerHealth(true);
    const startHealthCheck = setInterval(() => checkServerHealth(false), 10000);
    return () => clearInterval(startHealthCheck);
  }, []);

  return (
    <IconButton edge="end">
      <Badge variant="dot" overlap="circle" color={connected ? "default" : "error"}>
        <Storage fontSize="large"/>
      </Badge>
    </IconButton>
  )
}

const checkServerHealth = async (first: boolean) => {

  const connected = store.getState().api.connected;
  const dispatch = store.dispatch;
  
  let sendNotification = false;
  try {
    await api.get(HEALTH_ENDPOINT).then(response => {
      const status = response.data.status
      if (connected !== true && status === 'UP') {
        dispatch(setConnected(true))
        sendNotification = true;
      } else if (connected === true && status !== 'UP') {
        dispatch(setConnected(false))
        sendNotification = true;
      }
    })
  } catch (error) {
    if (connected === true) {
      dispatch(setConnected(false))
      sendNotification = true;
    }
  }

  if (first === true || sendNotification === true) {
    sendServerConnectionNotification();
  }
}

const sendServerConnectionNotification = () => {

  const connected = store.getState().api.connected;
  const dispatch = store.dispatch;

  dispatch(addNotification(
    (connected === true) ? {
      type: NotificationType.SUCCESS,
      message: "Verbindung zum Server hergestellt.",
    } : {
      type: NotificationType.ERROR,
      message: "Verbindung zum Server konnte nicht hergestellt werden!",
    }
  ));
}

export default ServerConnection
