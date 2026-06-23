// src/hooks/useAuth.ts
// Hook consumidor: la forma en que el resto de la app lee el estado de sesión.
// No crea suscripciones — solo lee el Context que mantiene el AuthProvider.

import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  // Si es undefined, significa que el componente está fuera del <AuthProvider>.
  // Fallar acá con un mensaje claro es mejor que un bug silencioso más adelante.
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }

  return context;
}
