import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDkEfSd27Oj3K0tFqaYR-09INwCoLS5GE4",
  authDomain: "msz-games.firebaseapp.com",
  projectId: "msz-games",
  storageBucket: "msz-games.appspot.com",
  messagingSenderId: "165021267502",
  appId: "1:165021267502:web:ec736315acf1907aee91bf",
  measurementId: "G-MK0C7GG75R"
};
firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth;
export const firestore = firebase.firestore();

export const COLLECTION_USERS = 'users';
export const COLLECTION_GAMES = 'games';