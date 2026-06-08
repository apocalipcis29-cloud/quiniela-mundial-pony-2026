// ─────────────────────────────────────────────────────────────────────────────
// PASO 1: Reemplaza estos valores con los de TU proyecto Firebase
// Los encuentras en: Firebase Console → ⚙️ Configuración → Tu app web
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyCmfADCVcLN9lgkZq7gde8XYgvgyRvniKU",
  authDomain:        "quiniela-mundial-ponys-2026.firebaseapp.com",
  projectId:         "quiniela-mundial-ponys-2026",
  storageBucket:     "quiniela-mundial-ponys-2026.firebasestorage.app",
  messagingSenderId: "236153271615",
  appId:             "1:236153271615:web:f38d761acb902a97394f8a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
