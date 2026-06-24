// src/pages/Login.tsx
// Pantalla de inicio de sesión: email/password + botón de Google.
// La página solo orquesta UI y estado local; la lógica de auth vive en authService,
// la validación en utils/validation y la traducción de errores en utils/firebaseErrors.

import { useState } from "react";
import type { FormEvent } from "react";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { validateAuthForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({}); // errores de validación por campo
  const [formError, setFormError] = useState(""); // error general (viene de Firebase)
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    // 1) Validamos antes de enviar. Si hay errores, no llamamos a Firebase.
    const validationErrors = validateAuthForm({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // 2) Llamamos al servicio. Al loguear, el AuthProvider detecta el cambio solo.
    setLoading(true);
    try {
      await loginWithEmail(email, password);
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
      <h1>Iniciar sesión</h1>

      <div>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
        {errors.email && <p role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
        {errors.password && <p role="alert">{errors.password}</p>}
      </div>

      {formError && <p role="alert">{formError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </button>

      <button type="button" onClick={handleGoogle} disabled={loading}>
        Continuar con Google
      </button>
    </form>
  );
}
