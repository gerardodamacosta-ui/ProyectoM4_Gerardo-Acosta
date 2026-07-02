// src/pages/Login.tsx
// Pantalla de inicio de sesión — diseño Variación 02 (Minimal).
// Lógica de auth en authService; validación en utils/validation;
// traducción de errores en utils/firebaseErrors.

import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { validateAuthForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/firebaseErrors";
import styles from "./Login.module.css";

function IconEmail() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a78bfa"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,14 22,4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a78bfa"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c084fc"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c084fc"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className={styles.pageWrapper}>
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.page}>
      <div className={styles.card}>
        {/* Marca */}
        <div className={styles.logoMark} aria-hidden="true">
          {"</>"}
        </div>
        <h1 className={styles.brand}>MateCode</h1>
        <p className={styles.tagline}>Organizá tus tareas y mantenete al día</p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <h2 className={styles.subtitle}>Iniciá sesión</h2>

          {/* Email */}
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <IconEmail />
              </span>
              <input
                id="login-email"
                type="email"
                aria-label="Email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className={styles.fieldError} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <IconLock />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                aria-label="Contraseña"
                placeholder="Contraseña"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((p) => !p)}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.fieldError} role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Olvidé contraseña */}
          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error general de Firebase */}
          {formError && (
            <p className={styles.formError} role="alert">
              {formError}
            </p>
          )}

          {/* Botón principal */}
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? "Ingresando…" : "Ingresar →"}
          </button>

          {/* Separador */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>o continuá con</span>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className={styles.googleBtn}
          >
            <IconGoogle />
            Continuar con Google
          </button>
        </form>

        {/* Registro */}
        <p className={styles.registerRow}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" className={styles.registerLink}>
            Registrate
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
