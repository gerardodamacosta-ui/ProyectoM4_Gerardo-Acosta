// src/services/firebase.ts
// Punto único de inicialización de Firebase para toda la app.
// Cualquier otro módulo importa `auth` o `db` desde acá, nunca vuelve a llamar a initializeApp.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Leemos las credenciales desde las variables de entorno (prefijo VITE_).
// Nunca van hardcodeadas: así el .env queda fuera del repo y cada entorno usa las suyas.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validación fail-fast: si falta alguna variable, cortamos al arranque con un mensaje claro.
// Sin esto, Firebase fallaría más tarde con un error críptico difícil de rastrear.
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `Faltan variables de entorno de Firebase: ${missingKeys.join(", ")}. ` +
      `Revisá tu archivo .env (deben tener el prefijo VITE_).`
  );
}

// Instancia base de la app de Firebase.
export const app = initializeApp(firebaseConfig);

// Authentication — se usa en el Hito 3 (registro, login, logout, sesión).
export const auth = getAuth(app);

// Firestore (base de datos) — se usa en los Hitos 5 y 6 (modelo de datos + CRUD de tareas).
export const db = getFirestore(app);
