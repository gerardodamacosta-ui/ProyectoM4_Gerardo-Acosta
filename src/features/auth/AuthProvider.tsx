// src/features/auth/AuthProvider.tsx
// Provider que mantiene el estado de sesión para toda la app.
// Hace UNA sola suscripción a onAuthStateChanged (patrón Observer) y comparte
// { user, loading } vía Context. Cualquier componente lo lee con useAuth().

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Empieza en true: todavía no sabemos si hay sesión. Esto evita redirecciones
  // prematuras al login mientras Firebase resuelve (clave para el Hito 4).
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Patrón Observer: nos suscribimos una vez. Firebase dispara este callback
    // al montar (restaurando la sesión persistida) y en cada login/logout.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // ya tenemos una respuesta definitiva: hay sesión o no
    });

    // Limpieza al desmontar: cancelamos la suscripción para no dejar listeners colgados.
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
