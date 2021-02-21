import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Grid, Button, makeStyles, Avatar } from '@material-ui/core';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import { getAuth } from '../../common/auth/authSlice'
import { HeroRealmsTableView } from './HeroRealmsTypes'

interface HeroRealmsTableProps {
    id: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  image: {
    width: "200px",
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    right: "30px",
    top: "30px",
  },
}));

function HeroRealmsTable(props: HeroRealmsTableProps) {

  const classes = useStyles();
  const userId = useSelector(getAuth)?.uid;
  const [userTableView] = useDocument(
    firestore.collection(COLLECTION_GAMES).doc(props.id).collection(COLLECTION_TABLE).doc(userId?userId:"x")
  );
  const [ table, setTable ] = useState<HeroRealmsTableView>();
  
  useEffect(() => {
    if (userTableView) {
      setTable(userTableView.data());
    }
  }, [userTableView])

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item container xs={12}>
          {table?.otherPlayerAreas.map(area => {
            return (
              <Grid item container xs>
                
              </Grid>
            )})
          }
        </Grid>
        <Grid item container xs={12} wrap="nowrap">
          <Grid item xs>
            <Button onClick={() => {}} key="fireGemDeckButton">
              <img src={"..//"+table?.fireGemsDeck.cards[0].image} alt="fire_gem" className={classes.image}/>
            </Button>
          </Grid>

          {table?.market.map(marketCard => {
            return (
              <Grid item xs>
                <Button onClick={() => {}} key={"marketButton"+table?.market.indexOf(marketCard)}>
                  <img src={"..//"+marketCard.image} alt={marketCard.name} 
                    key={"MarketCard"+table?.market.indexOf(marketCard)} 
                    className={classes.image}/>
                </Button>
              </Grid>
            )})
          }

          <Grid item>
            <Button onClick={() => {}} key="marketDeckButton" disabled>
              <Avatar className={classes.avatar}>{table?.marketDeck.size}</Avatar>
              <img src={"..//"+table?.cardBack} alt="card_back" className={classes.image}/>
            </Button>
          </Grid>
        </Grid>
        <Grid item container xs={12}>
          
        </Grid>
      </Grid>

      {userTableView && <pre>{JSON.stringify(userTableView.data(), null, 2)}</pre>}
    </div>
  )
}

export default HeroRealmsTable
