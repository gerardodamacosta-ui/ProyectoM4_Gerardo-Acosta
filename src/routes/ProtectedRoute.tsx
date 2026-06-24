// src/routes/ProtectedRoute.tsx
// Guardia de rutas protegidas. Envuelve el contenido que requiere sesión.
// Patrón wrapper con prop `children` (el que pide el CLAUDE.md y el material del curso).

import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mientras Firebase resuelve si hay sesión, NO redirigimos: evita el parpadeo
  // de mandar al login un instante antes de saber que en realidad sí hay sesión.
  if (loading) return <p>Cargando…</p>;

  // Sin sesión: al login. Guardamos en `state.from` la ruta que se quería ver,
  // para volver ahí después de loguearse. `replace` evita que la ruta protegida
  // quede en el historial (así "Atrás" no lleva a una página inaccesible).
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
