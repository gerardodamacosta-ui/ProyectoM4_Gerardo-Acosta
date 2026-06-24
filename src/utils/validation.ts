// src/utils/validation.ts
// Validación de formularios de autenticación. Corre en el cliente ANTES de llamar a Firebase,
// para dar feedback inmediato y no gastar una request si los datos son inválidos.

import type { AuthFormValues } from "../types";

// Un error por campo (opcional: si el campo está bien, no aparece la clave).
export interface ValidationErrors {
  email?: string;
  password?: string;
}

// Regex simple y suficiente para el formato de email: algo@algo.algo
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mínimo que exige Firebase para la contraseña.
const MIN_PASSWORD_LENGTH = 6;

export function validateAuthForm(values: AuthFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = "Ingresá tu email.";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "El email no tiene un formato válido.";
  }

  if (!values.password) {
    errors.password = "Ingresá tu contraseña.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}
