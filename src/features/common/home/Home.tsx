import React from 'react'
import { useSelector } from 'react-redux';
import { isConnected } from '../api/apiSlice';
import { isVerified } from '../auth/authSlice';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { AddNewGameDialog } from './AddNewGameDialog'

function Home() {
  
  const connected = useSelector(isConnected)
  const verified = useSelector(isVerified)

  return (
    <div>
      {connected &&
        <AddNewGameDialog/>
      }
      {!verified &&
        <NotVerifiedDialog/>
      }
    </div>
  )
}

function NotVerifiedDialog() {
  return (
    <Dialog open={true}>
      <DialogTitle>
        Verifizierung erforderlich!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Du bist noch nicht verifiziert. Bitte wende dich an einen Administrator.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => window.location.reload()} color="primary">
          Aktualisieren
        </Button>
        <Button href="/signout" color="secondary">
          Abmelden
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Home
