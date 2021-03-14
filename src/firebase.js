import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCA7tj0oQm890fP-20aU2vGUDyii2Vf1f8",
    authDomain: "products-34eaf.firebaseapp.com",
    projectId: "products-34eaf",
    storageBucket: "products-34eaf.appspot.com",
    messagingSenderId: "1034797279459",
    appId: "1:1034797279459:web:4d5c5b6c2c6ce53db17dd6"
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
