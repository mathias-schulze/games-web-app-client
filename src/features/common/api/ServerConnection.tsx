import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'
import { Storage } from '@material-ui/icons'
import api, { HEALTH_ENDPOINT } from './api'
import { isConnected, setConnected } from './apiSlice'
import { store } from '../store/store'
import { Dispatch } from '@reduxjs/toolkit'

function ServerConnection() {

  const dispatch = useDispatch();
  const connected = useSelector(isConnected);

  useEffect(() => {
    setInterval(() => checkServerHealth(dispatch), 10000);
  });

  return (
    <IconButton edge="end">
      <Storage fontSize="large" color={connected ? "action" : "error"}/>
    </IconButton>
  )
}

const checkServerHealth = async (dispatch: Dispatch<any>) => {

  const connected = store.getState().api.connected

  try {
    await api.get(HEALTH_ENDPOINT);
    if (connected !== true) {
      dispatch(setConnected(true))
    }
  } catch (error) {
    if (connected === true) {
      dispatch(setConnected(false))
    }
  }
}

export default ServerConnection
