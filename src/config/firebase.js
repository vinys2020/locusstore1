import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDjk4YVWbpNshggW2s-pybUnLgBEHF9Kls",
  authDomain: "locusstore-1.firebaseapp.com",
  projectId: "locusstore-1",
  storageBucket: "locusstore-1.firebasestorage.app",
  messagingSenderId: "773699747010",
  appId: "1:773699747010:web:4e7a1e0572b5c771a74f5b",
  measurementId: "G-9E4TW38E2P"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios que vamos a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Provider de Google para autenticación
export const provider = new GoogleAuthProvider();