// src/routes/PublicOnlyRoute.tsx
// Guardia simétrico a ProtectedRoute: envuelve rutas públicas (login, register).
// Si el usuario YA tiene sesión, no tiene sentido mostrarle el login → lo redirige.
// Mantiene las páginas Login/Register enfocadas solo en su formulario (responsabilidad única).

import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Igual que en ProtectedRoute: esperamos a saber el estado real de sesión.
  if (loading) return <p>Cargando…</p>;

  if (user) {
    // Si llegamos acá redirigidos desde una ruta protegida, volvemos a esa ruta original.
    // Si no (entró directo al login ya logueado), vamos a /tasks por defecto.
    const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/tasks";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
