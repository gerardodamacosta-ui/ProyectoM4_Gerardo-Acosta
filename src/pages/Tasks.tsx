// src/pages/Tasks.tsx
// Página protegida. Por ahora es un placeholder: el CRUD real llega en el Hito 6.
// Sirve para verificar el flujo de rutas protegidas y el logout.

import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";

export function Tasks() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión iniciada como {user?.email}</p>
      <p>Acá va a ir el CRUD de tareas (Hito 6).</p>

      {/* Al cerrar sesión, el AuthProvider detecta el cambio y ProtectedRoute
          rebota automáticamente a /login. No hace falta navegar a mano. */}
      <button type="button" onClick={() => logout()}>
        Cerrar sesión
      </button>
    </div>
  );
}
