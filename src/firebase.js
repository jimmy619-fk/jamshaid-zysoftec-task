// for installing firebase
// npm config set strict-ssl false
// npm install -g firebase-tools

// import these to resolve errors
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwCEFRRhC-fQqur-O0nHA93JufGeQXYyU",
  authDomain: "insta-by-bjimmy.firebaseapp.com",
  projectId: "insta-by-bjimmy",
  storageBucket: "insta-by-bjimmy.appspot.com",
  messagingSenderId: "840413694510",
  appId: "1:840413694510:web:3e4d323a9cf6d70e2c2dbf",
  measurementId: "G-WC2GQQ07M1",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
// services from firebase i.e. firestore,auth,storage

// to access database
const db = firebaseApp.firestore();
// to access authentication
const auth = firebase.auth();

// for storing videos or images
const storage = firebase.storage();

export { db, auth, storage };
export default db;
