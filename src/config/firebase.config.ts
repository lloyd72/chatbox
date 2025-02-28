import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTQhXIMgTqjAJ3PgUdjZtXQD5DMGtW07A",
  authDomain: "voting-5fd03.firebaseapp.com",
  projectId: "voting-5fd03",
  storageBucket: "voting-5fd03.firebasestorage.app",
  messagingSenderId: "379922357627",
  appId: "1:379922357627:web:e057a8b189b09e1cc6b1de"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 