// src/services/authService.ts
// Capa de servicio: envuelve las llamadas a Firebase Auth.
// Estas funciones no saben nada de React — reciben datos, llaman a Firebase y devuelven una promesa.
// Toda la lógica de autenticación vive acá, nunca dentro de los componentes.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "./firebase";

// Proveedor de Google. Se crea una sola vez y se reutiliza.
const googleProvider = new GoogleAuthProvider();

// Nota sobre persistencia: el SDK web de Firebase usa `browserLocalPersistence` por defecto,
// así que la sesión sobrevive al recargar la página sin configuración extra. El AuthProvider
// la detecta al montar mediante onAuthStateChanged.

export function registerWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle(): Promise<UserCredential> {
  // signInWithPopup abre la ventana de Google y resuelve con las credenciales.
  return signInWithPopup(auth, googleProvider);
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function sendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}
