// src/pages/Register.tsx
// Pantalla de registro: crea una cuenta con email/password, o entra con Google.
// Estructura espejo de Login (misma validación y manejo de errores); se mantienen
// separadas por claridad. Si la duplicación crece, conviene extraer un <AuthForm> compartido.

import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../services/authService";
import { validateAuthForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateAuthForm({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      // Tras registrarse, Firebase deja la sesión iniciada y el AuthProvider lo detecta.
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setFormError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Crear cuenta</h1>

      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
        {errors.email && <p role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
        />
        {errors.password && <p role="alert">{errors.password}</p>}
      </div>

      {formError && <p role="alert">{formError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creando cuenta…" : "Registrarme"}
      </button>

      <button type="button" onClick={handleGoogle} disabled={loading}>
        Continuar con Google
      </button>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </form>
  );
}
