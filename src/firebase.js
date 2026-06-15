import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaOLbCXg8Bt8393a-6eQEuKdnYnVTyvCY",
  authDomain: "bletchai.firebaseapp.com",
  projectId: "bletchai",
  storageBucket: "bletchai.firebasestorage.app",
  messagingSenderId: "379287158847",
  appId: "1:379287158847:web:3d85f352b1564f2e26b88a"
};

// init app
const app = initializeApp(firebaseConfig);

// auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// export login google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};