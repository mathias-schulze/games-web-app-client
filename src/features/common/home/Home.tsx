import React from 'react'
import { useSelector } from 'react-redux';
import { isVerified } from '../auth/authSlice';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { NewGame } from './NewGame'

function Home() {
  
  const verified = useSelector(isVerified)

  return (
    <div>
      <NewGame/>
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
