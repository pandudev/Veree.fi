import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyA_4DF_w-KBUxptTnCw08mtV9CAh0oH4kQ",
    authDomain: "vereefi.firebaseapp.com",
    projectId: "vereefi",
    storageBucket: "vereefi.appspot.com",
    messagingSenderId: "276972952627",
    appId: "1:276972952627:web:ebffe7d3cf903892b8d746",
    measurementId: "G-P6EYE7BH74"
};

firebase.initializeApp(firebaseConfig);

export default firebase;