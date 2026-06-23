// src/features/auth/AuthContext.ts
// El objeto Context y su tipo. Va en un archivo aparte (sin JSX) para que el Provider
// y el hook puedan importarlo sin romper la regla de React Fast Refresh
// (que pide que cada archivo .tsx exporte solo componentes).

import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AuthContextValue {
  user: User | null; // el usuario logueado, o null si no hay sesión
  loading: boolean; // true mientras Firebase aún no determinó el estado de sesión
}

// Arranca en `undefined` a propósito: así el hook useAuth puede detectar
// si alguien lo usa por fuera del <AuthProvider> y avisar con un error claro.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
