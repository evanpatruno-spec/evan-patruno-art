// src/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase lue depuis les variables d'environnement Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Correction automatique en cas de coquille dans les variables d'environnement Vercel
if (firebaseConfig.projectId === "van-patruno-art") {
  firebaseConfig.projectId = "evan-patruno-art";
  if (firebaseConfig.authDomain) {
    firebaseConfig.authDomain = firebaseConfig.authDomain.replace("van-patruno-art", "evan-patruno-art");
  }
  if (firebaseConfig.storageBucket) {
    firebaseConfig.storageBucket = firebaseConfig.storageBucket.replace("van-patruno-art", "evan-patruno-art");
  }
}

// Vérifie si la configuration minimale est présente (API Key et Project ID)
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    // Évite la double initialisation
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    console.log("Firebase Firestore initialisé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase :", error);
  }
} else {
  console.warn(
    "Configuration Firebase absente. Le site fonctionne en mode local avec les données par défaut (Mock)."
  );
}

export { db };
