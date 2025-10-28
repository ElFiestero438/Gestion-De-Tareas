import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGKSsE55jI9lm4r4O8psR9mZ7NFbmP6tU",
  authDomain: "gestion-de-tareas-ad07e.firebaseapp.com",
  projectId: "gestion-de-tareas-ad07e",
  storageBucket: "gestion-de-tareas-ad07e.appspot.com", // ✅ corregido
  messagingSenderId: "1093093846605",
  appId: "1:1093093846605:web:6dc26c433117849ef73604",
  measurementId: "G-LB748TELXJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar proveedor de autenticación de Google
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.log("Error con Google Auth:", error);
    return null;
  }
};

export { app, auth, db };
