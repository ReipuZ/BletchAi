import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaOLbCXg8Bt8393a-6eQEuKdnYnVTyvCY",
  authDomain: "bletchai.firebaseapp.com",
  projectId: "bletchai",
  storageBucket: "bletchai.firebasestorage.app",
  messagingSenderId: "379287158847",
  appId: "1:379287158847:web:3d85f352b1564f2e26b88a",
};

const app = initializeApp(firebaseConfig);

// Export auth
export const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

// Login Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};