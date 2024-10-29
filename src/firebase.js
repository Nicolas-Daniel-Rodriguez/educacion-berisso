import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJcOvbsF29JFCy9wYyQRC5rmOwpdZhmK8",
  authDomain: "educacion-berisso-fb.firebaseapp.com",
  projectId: "educacion-berisso-fb",
  storageBucket: "educacion-berisso-fb.appspot.com",
  messagingSenderId: "399774790314",
  appId: "1:399774790314:web:3dfeee5986f717088296d3",
  measurementId: "G-BRKXXLS1YL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
