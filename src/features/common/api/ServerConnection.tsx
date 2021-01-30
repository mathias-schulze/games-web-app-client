import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'
import { Storage } from '@material-ui/icons'
import api, { HEALTH_ENDPOINT } from './api'
import { isConnected, setConnected } from './apiSlice'
import { store } from '../store/store'

function ServerConnection() {

  const connected = useSelector(isConnected);

  useEffect(() => {
    const startHealthCheck = setInterval(() => checkServerHealth(), 10000);
    return () => clearInterval(startHealthCheck);
  }, []);

  return (
    <IconButton edge="end">
      <Storage fontSize="large" color={connected ? "action" : "error"}/>
    </IconButton>
  )
}

const checkServerHealth = async () => {

  const connected = store.getState().api.connected
  const dispatch = store.dispatch;

  try {
    await api.get(HEALTH_ENDPOINT).then(response => {
      const status = response.data.status
      if (connected !== true && status === 'UP') {
        dispatch(setConnected(true))
      } else if (connected === true) {
        dispatch(setConnected(false))
      }
    })
  } catch (error) {
    if (connected === true) {
      dispatch(setConnected(false))
    }
  }
}

export default ServerConnection
