import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnmkHzRk_D6c9GWJDPWD4VCh7n02q79jU",
  authDomain: "norskkmanage.firebaseapp.com",
  projectId: "norskkmanage",
  storageBucket: "norskkmanage.firebasestorage.app",
  messagingSenderId: "837576823025",
  appId: "1:837576823025:web:66fc8ea1dd71ea64f65950",
  measurementId: "G-19XGE2FSM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
