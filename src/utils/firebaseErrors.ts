// src/utils/firebaseErrors.ts
// Traduce los códigos de error de Firebase Auth a mensajes legibles para el usuario.
// Nunca mostramos el código interno (ej. "auth/invalid-credential") en la UI.

import { FirebaseError } from "firebase/app";

// Mapeo código de Firebase → mensaje en español.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Ese email ya está registrado.",
  "auth/invalid-email": "El email no es válido.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/missing-password": "Ingresá una contraseña.",
  "auth/user-not-found": "No existe una cuenta con ese email.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  // Las versiones nuevas del SDK devuelven este código genérico para email/contraseña inválidos.
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/user-disabled": "Esta cuenta fue deshabilitada.",
  "auth/too-many-requests": "Demasiados intentos. Probá de nuevo en unos minutos.",
  "auth/operation-not-allowed": "Este método de inicio de sesión no está habilitado.",
  "auth/popup-closed-by-user": "Cerraste la ventana antes de completar el inicio de sesión.",
  "auth/cancelled-popup-request": "Se canceló la solicitud de inicio de sesión.",
  "auth/popup-blocked": "El navegador bloqueó la ventana emergente. Habilitala e intentá de nuevo.",
  "auth/account-exists-with-different-credential":
    "Ya existe una cuenta con ese email usando otro método de inicio de sesión.",
  "auth/network-request-failed": "Error de conexión. Revisá tu internet e intentá de nuevo.",
};

const FALLBACK_MESSAGE = "Ocurrió un error inesperado. Intentá de nuevo.";

export function getAuthErrorMessage(error: unknown): string {
  // FirebaseError trae un `code` tipado; cualquier otra cosa cae al mensaje genérico.
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
