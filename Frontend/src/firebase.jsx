import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVSmOgpMHvTpyXy8XeIg72-BFBakNP40I",
  authDomain: "meet-flow-aec79.firebaseapp.com",
  projectId: "meet-flow-aec79",
  storageBucket: "meet-flow-aec79.firebasestorage.app",
  messagingSenderId: "342711838956",
  appId: "1:342711838956:web:a154bcff516d9e33841dc9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider =
  new GoogleAuthProvider();