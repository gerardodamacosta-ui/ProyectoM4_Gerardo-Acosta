// src/App.tsx
// ⚠️ PROVISIONAL — Hito 3. Sirve para probar el flujo de auth sin router todavía.
// En el Hito 4 esto se reemplaza por el sistema de rutas (ProtectedRoute, etc.).

import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { logout } from "./services/authService";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Mientras Firebase resuelve si hay sesión, no mostramos nada definitivo.
  if (loading) return <p>Cargando…</p>;

  // Sin sesión: alternamos entre Login y Register.
  if (!user) {
    return (
      <div>
        {showRegister ? <Register /> : <Login />}
        <button type="button" onClick={() => setShowRegister((prev) => !prev)}>
          {showRegister
            ? "¿Ya tenés cuenta? Iniciá sesión"
            : "¿No tenés cuenta? Registrate"}
        </button>
      </div>
    );
  }

  // Con sesión: confirmación simple + logout, para verificar persistencia y cierre.
  return (
    <div>
      <p>Sesión iniciada como {user.email}</p>
      <button type="button" onClick={() => logout()}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default App;
