import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged  // Add this import
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // other config details
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebaseAuth = {
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  logout() {
    return signOut(auth);
  },

  // Add this method
  onAuthStateChanged(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }
};