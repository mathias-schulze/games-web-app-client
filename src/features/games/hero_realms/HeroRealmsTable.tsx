import React from 'react'
import { useSelector } from 'react-redux';
import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import { getAuth } from '../../common/auth/authSlice'

interface HeroRealmsTableProps {
    id: string;
}

function HeroRealmsTable(props: HeroRealmsTableProps) {

  const userId = useSelector(getAuth)?.uid;
  const [value] = useDocument(
    firestore.collection(COLLECTION_GAMES).doc(props.id).collection(COLLECTION_TABLE).doc(userId?userId:"x")
  );

  return (
    <div>
      {value && <pre>{JSON.stringify(value.data(), null, 2)}</pre>}
    </div>
  )
}

export default HeroRealmsTable
