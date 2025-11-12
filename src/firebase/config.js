// src/firebase/config.js (CONFIGURACIÓN CORRECTA)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ ESTA ES TU CONFIGURACIÓN REAL - ÚSALA ASÍ
const firebaseConfig = {
  apiKey: "AIzaSyAWH5Ex4XjleIZdptlxHH7BU53qPzd8U1A",
  authDomain: "cum-factibilidadpro.firebaseapp.com",
  projectId: "cum-factibilidadpro",
  storageBucket: "cum-factibilidadpro.firebasestorage.app",
  messagingSenderId: "279112351872",
  appId: "1:279112351872:web:05a7a87990889470106665",
  measurementId: "G-4RV4MYP5TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;