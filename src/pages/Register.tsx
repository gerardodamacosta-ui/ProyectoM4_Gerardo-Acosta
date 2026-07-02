// src/pages/Register.tsx
// Pantalla de registro — diseño Minimal, tema fijo claro.
// Validación inline: no reutiliza validateAuthForm (que sirve al Login con reglas distintas).

import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../services/authService";
import { getAuthErrorMessage } from "../utils/firebaseErrors";
import styles from "./Register.module.css";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

function getPasswordStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  const hasMin = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  if (hasMin && hasUpper && hasNumber) return 3;
  if (hasMin && (hasUpper || hasNumber)) return 2;
  return 1;
}

function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="3" stroke="#7c3aed" strokeWidth="1.4" />
      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconEmail({ error = false }: { error?: boolean }) {
  const color = error ? "#dc2626" : "#7c3aed";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke={color} strokeWidth="1.4" />
      <path d="M1 5.5l7 4.5 7-4.5" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

function IconLock({ stroke = "#7c3aed" }: { stroke?: string }) {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" aria-hidden="true">
      <rect x="1" y="7" width="13" height="9" rx="2.5" stroke={stroke} strokeWidth="1.4" />
      <path d="M3.5 7V5.5a4 4 0 018 0V7" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden="true">
      <path d="M1 6.5C1 6.5 3.5 1 9 1s8 5.5 8 5.5S14.5 12 9 12 1 6.5 1 6.5z" stroke="#c084fc" strokeWidth="1.3" />
      <circle cx="9" cy="6.5" r="2.5" stroke="#c084fc" strokeWidth="1.3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="#7c3aed" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFieldError() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="#dc2626" />
      <path d="M8 5v3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r=".8" fill="white" />
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H2.18v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const nameValid = name.trim().length >= 4;
  const hasErrors = Object.keys(errors).length > 0;

  const strengthSegColor = (["#ddd3fe", "#ffaa00", "#c084fc", "#7c3aed"] as const)[strength];
  const strengthLabelText = ["Fortaleza", "Débil", "Media", "Fuerte"][strength];
  const strengthLabelColor = strength === 0 ? "#a78bfa" : strengthSegColor;

  function clearError(key: keyof FieldErrors) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!name.trim() || name.trim().length < 4) {
      next.name = "El nombre debe tener al menos 4 caracteres.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Ingresá un email válido.";
    }
    if (!password) {
      next.password = "Ingresá tu contraseña.";
    } else if (strength < 3) {
      next.password = "Mínimo 8 caracteres con una mayúscula y un número.";
    }
    if (!confirmPassword) {
      next.confirm = "Confirmá tu contraseña.";
    } else if (confirmPassword !== password) {
      next.confirm = "Las contraseñas no coinciden.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setGoogleError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      // Firebase detecta el cambio de sesión y el AuthProvider redirige automáticamente.
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? (error as { code: string }).code
          : "";
      if (code === "auth/email-already-in-use") {
        setIsEmailDuplicate(true);
        setErrors((prev) => ({ ...prev, email: "DUPLICATE" }));
      } else {
        setErrors((prev) => ({ ...prev, email: getAuthErrorMessage(error) }));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setGoogleError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const passwordWrapperClass = `${styles.inputWrapper}${
    errors.password
      ? ` ${styles.inputError}`
      : password && strength === 1
      ? ` ${styles.inputWarn}`
      : ""
  }`;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoMark} aria-hidden="true">
          {"</>"}
        </div>
        <h1 className={styles.brand}>MateCode</h1>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <h2 className={styles.subtitle}>Creá tu cuenta</h2>

          {/* Nombre */}
          <div className={styles.inputGroup}>
            <div
              className={`${styles.inputWrapper}${
                errors.name
                  ? ` ${styles.inputError}`
                  : nameValid
                  ? ` ${styles.inputValid}`
                  : ""
              }`}
            >
              <span className={styles.inputIcon}>
                <IconPerson />
              </span>
              <input
                id="register-name"
                type="text"
                aria-label="Nombre"
                placeholder="Tu nombre"
                className={styles.input}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) clearError("name");
                }}
                disabled={loading}
                autoComplete="name"
              />
              {nameValid && !errors.name && (
                <span className={styles.inputIconRight}>
                  <IconCheck />
                </span>
              )}
            </div>
            {errors.name && (
              <p className={styles.fieldError} role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <div
              className={`${styles.inputWrapper}${
                errors.email ? ` ${styles.inputError}` : ""
              }`}
            >
              <span className={styles.inputIcon}>
                <IconEmail error={!!errors.email} />
              </span>
              <input
                id="register-email"
                type="email"
                aria-label="Email"
                placeholder="tu@email.com"
                className={styles.input}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailDuplicate(false);
                  if (errors.email) clearError("email");
                }}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <span className={styles.inputIconRight}>
                  <IconFieldError />
                </span>
              )}
            </div>
            {errors.email && (
              <p className={styles.fieldError} role="alert">
                {isEmailDuplicate ? (
                  <>
                    Este email ya está registrado.{" "}
                    <Link to="/login" className={styles.errorLink}>
                      Iniciá sesión
                    </Link>
                  </>
                ) : (
                  errors.email
                )}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className={styles.inputGroup}>
            <div className={passwordWrapperClass}>
              <span className={styles.inputIcon}>
                <IconLock
                  stroke={
                    errors.password
                      ? "#dc2626"
                      : password && strength === 1
                      ? "#ffaa00"
                      : "#7c3aed"
                  }
                />
              </span>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                aria-label="Contraseña"
                placeholder="Contraseña"
                className={styles.input}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) clearError("password");
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((p) => !p)}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <IconEye />
              </button>
            </div>

            {/* Barra de fortaleza */}
            <div className={styles.strengthBar}>
              {[1, 2, 3].map((seg) => (
                <div
                  key={seg}
                  className={styles.strengthSeg}
                  style={{ background: seg <= strength ? strengthSegColor : "#ddd3fe" }}
                />
              ))}
              <span
                className={styles.strengthLabel}
                style={{ color: strengthLabelColor }}
              >
                {strengthLabelText}
              </span>
            </div>

            {errors.password && (
              <p className={styles.fieldError} role="alert">
                {errors.password}
              </p>
            )}
            {!errors.password && password && strength < 3 && (
              <p className={styles.helpText}>
                Mínimo 8 caracteres con una mayúscula y un número.
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className={styles.inputGroup}>
            <div
              className={`${styles.inputWrapper}${
                errors.confirm ? ` ${styles.inputError}` : ""
              }`}
            >
              <span className={styles.inputIcon}>
                <IconLock stroke={errors.confirm ? "#dc2626" : "#7c3aed"} />
              </span>
              <input
                id="register-confirm"
                type="password"
                aria-label="Confirmá tu contraseña"
                placeholder="Confirmá tu contraseña"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirm) clearError("confirm");
                }}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            {errors.confirm && (
              <p className={styles.fieldError} role="alert">
                {errors.confirm}
              </p>
            )}
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            disabled={hasErrors || loading}
            className={styles.primaryBtn}
          >
            {loading ? (
              "Creando cuenta…"
            ) : (
              <>
                Registrarme <span aria-hidden="true">→</span>
              </>
            )}
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
            Registrate con Google
          </button>

          {googleError && (
            <p className={styles.googleError} role="alert">
              {googleError}
            </p>
          )}
        </form>

        <p className={styles.loginRow}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className={styles.loginLink}>
            Iniciá sesión
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
